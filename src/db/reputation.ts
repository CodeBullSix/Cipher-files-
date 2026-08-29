import { checkAndAwardAchievements } from './achievements.js';
import { db } from './index.js';
import { users, reputationEvents } from './schema.js';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { calculateLevel } from '../lib/levels.js';
import { createNotification } from './notifications.js';

export async function awardReputation(
  userId: string,
  type: typeof reputationEvents.$inferInsert.type,
  points: number,
  relatedRecordId?: string,
  reason?: string
) {
  if (points === 0) return { success: false, reason: 'Zero points' };

  const result = await db.transaction(async (tx) => {
    try {
      const eventId = uuidv4();
      
      const insertValues: any = {
        id: eventId,
        userId,
        type,
        points,
      };
      
      if (relatedRecordId) insertValues.relatedRecordId = relatedRecordId;
      if (reason) insertValues.reason = reason;

      // Try to insert the reputation event
      // If it violates unique constraint (same user, type, relatedRecordId), it will fail
      await tx.insert(reputationEvents).values(insertValues);

      // Fetch current user to get their new reputation
      const currentUserData = await tx.select({ reputation: users.reputation, level: users.level }).from(users).where(eq(users.uid, userId));
      const currentRep = currentUserData.length > 0 ? currentUserData[0].reputation : 0;
      
      const newRep = currentRep + points;
      const newLevelInfo = calculateLevel(newRep);
      
      
      // Increment user's reputation and update level
      await tx.update(users)
        .set({
          reputation: newRep,
          level: newLevelInfo.level,
          updatedAt: new Date()
        })
        .where(eq(users.uid, userId));

      const oldLevel = currentUserData.length > 0 ? (currentUserData[0].level || 1) : 1;
      let leveledUp = false;
      let newLevelTitle = '';
      if (newLevelInfo.level > oldLevel) {
        leveledUp = true;
        newLevelTitle = newLevelInfo.title;
      }

      return { success: true, eventId, points, leveledUp, newLevelTitle, newLevel: newLevelInfo.level };

    } catch (error: any) {
      // Check if it's a unique constraint violation (code 23505 in postgres)
      if (error.code === '23505') {
        return { success: false, reason: 'Already rewarded for this contribution' };
      }
      console.error('Error awarding reputation:', error);
      tx.rollback();
      return { success: false, reason: 'Internal error' };
    }
  });


  if (result.success) {
    if (result.leveledUp) {
      createNotification(
        userId,
        'LEVEL_UP',
        'Security Clearance Elevated',
        `Congratulations, Investigator. You have been promoted to ${result.newLevelTitle} (Level ${result.newLevel}).`,
        result.newLevel.toString(),
        'PROFILE'
      ).catch(console.error);
    }
    
    // Fire and forget achievement check so it doesn't block

    checkAndAwardAchievements(userId).catch(e => console.error('Achievement check failed:', e));
  }

  return result;
}

import { getUserAchievements } from './achievements.js';
export async function getUserReputationData(userId: string) {
  const userResult = await db.select({ reputation: users.reputation }).from(users).where(eq(users.uid, userId));
  const totalReputation = userResult.length > 0 ? userResult[0].reputation : 0;
  
  const events = await db.query.reputationEvents.findMany({
    where: eq(reputationEvents.userId, userId),
    orderBy: (repEvents, { desc }) => [desc(repEvents.createdAt)],
    limit: 50
  });
  
  const achievements = await getUserAchievements(userId);
  return { events, totalReputation, achievements };
}
