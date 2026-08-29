import { db } from './index.js';
import { userAchievements, reputationEvents, users } from './schema.js';
import { eq, count, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { ACHIEVEMENTS } from '../lib/achievements.js';
import { createNotification } from './notifications.js';

export async function checkAndAwardAchievements(userId: string) {
  // Fetch user stats to evaluate achievements
  const userStats = await db.select().from(users).where(eq(users.uid, userId));
  const user = userStats[0];
  if (!user) return;

  const repEvents = await db.select().from(reputationEvents).where(eq(reputationEvents.userId, userId));
  
  const earnedIds = new Set((await db.select().from(userAchievements).where(eq(userAchievements.userId, userId))).map(a => a.achievementId));

  const toAward: string[] = [];

  // Rules:
  // FIRST_CONTRIBUTION: > 0 events
  if (repEvents.length > 0 && !earnedIds.has('FIRST_CONTRIBUTION')) {
    toAward.push('FIRST_CONTRIBUTION');
  }

  // EVIDENCE_CONTRIBUTOR: has EVIDENCE_VERIFIED event
  if (repEvents.some(e => e.type === 'EVIDENCE_VERIFIED') && !earnedIds.has('EVIDENCE_CONTRIBUTOR')) {
    toAward.push('EVIDENCE_CONTRIBUTOR');
  }

  // COMMUNITY_PARTICIPANT: has CREATED_DISCUSSION or DISCUSSION_REPLY
  if (repEvents.some(e => e.type === 'CREATED_DISCUSSION' || e.type === 'DISCUSSION_REPLY') && !earnedIds.has('COMMUNITY_PARTICIPANT')) {
    toAward.push('COMMUNITY_PARTICIPANT');
  }

  // RESEARCHER: reputation >= 50
  if (user.reputation >= 50 && !earnedIds.has('RESEARCHER')) {
    toAward.push('RESEARCHER');
  }

  // Award the newly earned achievements
  for (const achId of toAward) {
    try {
      await db.insert(userAchievements).values({
        id: uuidv4(),
        userId,
        achievementId: achId
      }).onConflictDoNothing();
    } catch (e) {
      console.error('Error awarding achievement', e);
    }
  }
}

export async function getUserAchievements(userId: string) {
  const records = await db.query.userAchievements.findMany({
    where: eq(userAchievements.userId, userId),
    orderBy: (ua, { desc }) => [desc(ua.earnedAt)]
  });
  
  return records.map(record => ({
    ...record,
    definition: ACHIEVEMENTS[record.achievementId]
  })).filter(a => a.definition); // filter out any that no longer exist in code
}
