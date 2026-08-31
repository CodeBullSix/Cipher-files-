import { Router } from 'express';
import { db } from '../db/index.js';
import { appeals, evidenceItems, discussions, discussionReplies, moderationLogs, users, notifications } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireAuthAllowSuspended, requireModerator } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { mutationLimiter, strictLimiter } from '../middleware/rateLimiter.js';

export const appealsRouter = Router();

// Submit an appeal
appealsRouter.post('/', requireAuthAllowSuspended, strictLimiter, async (req: AuthRequest, res) => {
  const { targetType, targetId, reason } = req.body;
  const appellantId = req.user!.uid;

  if (!targetType || !targetId || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Verify ownership and valid negative decision
    let originalModeratorId = null;
    let validTarget = false;

    if (targetType === 'EVIDENCE') {
      const [ev] = await db.select().from(evidenceItems).where(eq(evidenceItems.id, targetId));
      if (!ev) return res.status(404).json({ error: 'Evidence not found' });
      if (ev.submittedById !== appellantId) return res.status(403).json({ error: 'Not authorized to appeal this content' });
      if (ev.status !== 'REJECTED' && ev.status !== 'DISPUTED') {
        return res.status(400).json({ error: 'Can only appeal rejected or disputed evidence' });
      }
      validTarget = true;
      
      // Attempt to find original moderator from moderation logs
      const [lastLog] = await db.select()
        .from(moderationLogs)
        .where(and(eq(moderationLogs.targetId, targetId), eq(moderationLogs.targetType, 'EVIDENCE')))
        .orderBy(desc(moderationLogs.createdAt))
        .limit(1);
      
      if (lastLog) originalModeratorId = lastLog.actorId;
      
    } else if (targetType === 'DISCUSSION') {
      const [disc] = await db.select().from(discussions).where(eq(discussions.id, targetId));
      if (!disc) return res.status(404).json({ error: 'Discussion not found' });
      if (disc.authorId !== appellantId) return res.status(403).json({ error: 'Not authorized to appeal this content' });
      if (!disc.deletedAt && !disc.locked) return res.status(400).json({ error: 'Can only appeal removed or locked discussions' });
      validTarget = true;
      
      const [lastLog] = await db.select()
        .from(moderationLogs)
        .where(and(eq(moderationLogs.targetId, targetId), eq(moderationLogs.targetType, 'DISCUSSION')))
        .orderBy(desc(moderationLogs.createdAt))
        .limit(1);
        
      if (lastLog) originalModeratorId = lastLog.actorId;
      
    } else if (targetType === 'REPLY') {
      const [reply] = await db.select().from(discussionReplies).where(eq(discussionReplies.id, targetId));
      if (!reply) return res.status(404).json({ error: 'Reply not found' });
      if (reply.authorId !== appellantId) return res.status(403).json({ error: 'Not authorized to appeal this content' });
      if (!reply.deletedAt) return res.status(400).json({ error: 'Can only appeal removed replies' });
      validTarget = true;
      
      const [lastLog] = await db.select()
        .from(moderationLogs)
        .where(and(eq(moderationLogs.targetId, targetId), eq(moderationLogs.targetType, 'REPLY')))
        .orderBy(desc(moderationLogs.createdAt))
        .limit(1);
        
      if (lastLog) originalModeratorId = lastLog.actorId;
    
    } else if (targetType === 'USER') {
      const [userRec] = await db.select().from(users).where(eq(users.uid, targetId));
      if (!userRec) return res.status(404).json({ error: 'User not found' });
      if (userRec.uid !== appellantId) return res.status(403).json({ error: 'Not authorized to appeal this account' });
      if (!userRec.deletedAt) return res.status(400).json({ error: 'Account is not suspended' });
      validTarget = true;
      
      const [lastLog] = await db.select()
        .from(moderationLogs)
        .where(and(eq(moderationLogs.targetId, targetId), eq(moderationLogs.targetType, 'USER')))
        .orderBy(desc(moderationLogs.createdAt))
        .limit(1);
        
      if (lastLog) originalModeratorId = lastLog.actorId;
    } else {
      return res.status(400).json({ error: 'Unsupported target type' });
    }

    // 2. Prevent duplicates
    const [existingAppeal] = await db.select()
      .from(appeals)
      .where(and(
        eq(appeals.appellantId, appellantId),
        eq(appeals.targetType, targetType),
        eq(appeals.targetId, targetId)
      ));

    if (existingAppeal) {
      return res.status(400).json({ error: 'You have already appealed this decision' });
    }

    // 3. Create the appeal
    const appealId = uuidv4();
    await db.insert(appeals).values({
      id: appealId,
      appellantId,
      targetType,
      targetId,
      originalModeratorId,
      reason,
      status: 'SUBMITTED'
    });

    // 4. Create an audit log
    await db.insert(moderationLogs).values({
      id: uuidv4(),
      actorId: appellantId,
      action: 'APPEAL',
      targetType: targetType,
      targetId: targetId,
      reason: 'Appeal submitted',
      previousStatus: 'N/A',
      newStatus: 'APPEAL_SUBMITTED'
    });

    res.json({ success: true, appealId });
  } catch (error) {
    console.error('Error submitting appeal:', error);
    res.status(500).json({ error: 'Failed to submit appeal' });
  }
});

// Get user's own appeals
appealsRouter.get('/me', requireAuthAllowSuspended, async (req: AuthRequest, res) => {
  try {
    const userAppeals = await db.select()
      .from(appeals)
      .where(eq(appeals.appellantId, req.user!.uid))
      .orderBy(desc(appeals.createdAt));
      
    res.json(userAppeals);
  } catch (error) {
    console.error('Error fetching user appeals:', error);
    res.status(500).json({ error: 'Failed to fetch appeals' });
  }
});


// Get appeals queue (MODERATOR ONLY)
appealsRouter.get('/queue', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const queue = await db.select({
      id: appeals.id,
      targetType: appeals.targetType,
      targetId: appeals.targetId,
      reason: appeals.reason,
      status: appeals.status,
      createdAt: appeals.createdAt,
      appellantId: appeals.appellantId,
      appellantName: users.displayName,
      originalModeratorId: appeals.originalModeratorId,
    })
    .from(appeals)
    .leftJoin(users, eq(appeals.appellantId, users.uid))
    .orderBy(desc(appeals.createdAt));

    res.json(queue);
  } catch (error) {
    console.error('Error fetching appeals queue:', error);
    res.status(500).json({ error: 'Failed to fetch appeals queue' });
  }
});

// Update appeal status (MODERATOR ONLY)
appealsRouter.put('/:id/status', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, resolutionReason } = req.body;
  const actorId = req.user!.uid;

  if (!['UNDER_REVIEW', 'UPHELD', 'OVERTURNED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [existingAppeal] = await db.select().from(appeals).where(eq(appeals.id, id));
    if (!existingAppeal) return res.status(404).json({ error: 'Appeal not found' });
    
    // Check Conflict of Interest (soft restriction, if original moderator, cannot resolve)
    // We allow UNDER_REVIEW by original mod, but maybe not final resolution?
    // Actually, block it outright if they were the original moderator unless they are the ONLY moderator.
    // For now, simply document the restriction by returning a 403.
    if (existingAppeal.originalModeratorId === actorId && (status === 'UPHELD' || status === 'OVERTURNED')) {
      return res.status(403).json({ error: 'Conflict of Interest: You cannot review an appeal against your own moderation decision.' });
    }

    const previousStatus = existingAppeal.status;

    const [updated] = await db.update(appeals)
      .set({ 
        status,
        resolutionReason: resolutionReason || existingAppeal.resolutionReason,
        resolvedAt: ['UPHELD', 'OVERTURNED'].includes(status) ? new Date() : null,
        resolvedById: ['UPHELD', 'OVERTURNED'].includes(status) ? actorId : null
      })
      .where(eq(appeals.id, id))
      .returning();

    // If Overturned, we actually have to restore the content in the database.
    if (status === 'OVERTURNED' && previousStatus !== 'OVERTURNED') {
       if (existingAppeal.targetType === 'EVIDENCE') {
          await db.update(evidenceItems).set({ status: 'UNVERIFIED', verifiedById: null, verificationNotes: null }).where(eq(evidenceItems.id, existingAppeal.targetId));
       } else if (existingAppeal.targetType === 'DISCUSSION') {
          await db.update(discussions).set({ deletedAt: null, locked: false }).where(eq(discussions.id, existingAppeal.targetId));
       } else if (existingAppeal.targetType === 'REPLY') {
          await db.update(discussionReplies).set({ deletedAt: null }).where(eq(discussionReplies.id, existingAppeal.targetId));

       } else if (existingAppeal.targetType === 'USER') {
          await db.update(users).set({ deletedAt: null }).where(eq(users.uid, existingAppeal.targetId));
       }
    }

    // If previously Overturned but now Upheld (in rare cases), re-apply the moderation.
    if (status === 'UPHELD' && previousStatus === 'OVERTURNED') {
       if (existingAppeal.targetType === 'EVIDENCE') {
          await db.update(evidenceItems).set({ status: 'REJECTED' }).where(eq(evidenceItems.id, existingAppeal.targetId));
       } else if (existingAppeal.targetType === 'DISCUSSION') {
          await db.update(discussions).set({ deletedAt: new Date() }).where(eq(discussions.id, existingAppeal.targetId));
       } else if (existingAppeal.targetType === 'REPLY') {
          await db.update(discussionReplies).set({ deletedAt: new Date() }).where(eq(discussionReplies.id, existingAppeal.targetId));

       } else if (existingAppeal.targetType === 'USER') {
          await db.update(users).set({ deletedAt: new Date() }).where(eq(users.uid, existingAppeal.targetId));
       }
    }

    // Send notification to appellant
    if (['UPHELD', 'OVERTURNED'].includes(status)) {
      await db.insert(notifications).values({
        id: uuidv4(),
        userId: existingAppeal.appellantId,
        type: 'SYSTEM',
        title: `Appeal ${status}`,
        message: `Your appeal regarding a ${existingAppeal.targetType.toLowerCase()} has been ${status.toLowerCase()}. ${resolutionReason || ''}`,
        relatedRecordId: existingAppeal.targetId,
        relatedRecordType: existingAppeal.targetType,
        isRead: false
      });
    }

    // Audit Log
    if (previousStatus !== status) {
      await db.insert(moderationLogs).values({
        id: uuidv4(),
        actorId,
        action: status === 'UPHELD' ? 'UPHOLD' : (status === 'OVERTURNED' ? 'OVERTURN' : 'ASSIGN'),
        targetType: existingAppeal.targetType,
        targetId: existingAppeal.targetId,
        reason: resolutionReason || `Appeal ${status.toLowerCase()}`,
        previousStatus: existingAppeal.status,
        newStatus: status
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating appeal:', error);
    res.status(500).json({ error: 'Failed to update appeal' });
  }
});

