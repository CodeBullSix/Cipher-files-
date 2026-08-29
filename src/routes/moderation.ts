import { Router } from 'express';
import { requireAuth, requireModerator } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { evidenceItems, discussions, discussionReplies, moderationLogs } from '../db/schema.js';
import { desc, eq, inArray, isNull } from 'drizzle-orm';
import { verifyEvidence } from '../db/evidence.js';
import { updateDiscussionStatus, updateReplyStatus } from '../db/discussions.js';
import { v4 as uuidv4 } from 'uuid';

export const moderationRouter = Router();

moderationRouter.use(requireAuth, requireModerator);

// GET /api/moderation/queue
moderationRouter.get('/queue', async (req, res) => {
  try {
    const pendingEvidence = await db.select()
      .from(evidenceItems)
      .where(inArray(evidenceItems.status, ['UNVERIFIED', 'UNDER_REVIEW']))
      .orderBy(desc(evidenceItems.createdAt))
      .limit(50);

    const recentDiscussions = await db.select()
      .from(discussions)
      .where(isNull(discussions.deletedAt))
      .orderBy(desc(discussions.createdAt))
      .limit(50);

    const recentReplies = await db.select()
      .from(discussionReplies)
      .where(isNull(discussionReplies.deletedAt))
      .orderBy(desc(discussionReplies.createdAt))
      .limit(50);

    res.json({
      evidence: pendingEvidence,
      discussions: recentDiscussions,
      replies: recentReplies
    });
  } catch (error) {
    console.error('Error fetching moderation queue:', error);
    res.status(500).json({ error: 'Failed to fetch moderation queue' });
  }
});

// POST /api/moderation/action
moderationRouter.post('/action', async (req, res) => {
  const { targetType, targetId, action, reason, newStatus } = req.body;
  const actorId = (req as any).user.uid;

  if (!targetType || !targetId || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let previousStatus = null;
    let finalStatus = newStatus;

    if (targetType === 'EVIDENCE') {
      const [ev] = await db.select().from(evidenceItems).where(eq(evidenceItems.id, targetId));
      if (!ev) return res.status(404).json({ error: 'Evidence not found' });
      previousStatus = ev.status;
      
      let evidenceStatus = 'VERIFIED';
      if (action === 'REJECT' || action === 'REMOVE') evidenceStatus = 'REJECTED';
      if (action === 'DISPUTE') evidenceStatus = 'DISPUTED';
      if (action === 'RESTORE') evidenceStatus = 'UNVERIFIED';

      await verifyEvidence(targetId, evidenceStatus, reason || 'Moderator action', actorId);
      finalStatus = evidenceStatus;
    } 
    else if (targetType === 'DISCUSSION') {
      const [disc] = await db.select().from(discussions).where(eq(discussions.id, targetId));
      if (!disc) return res.status(404).json({ error: 'Discussion not found' });
      previousStatus = disc.locked ? 'LOCKED' : (disc.deletedAt ? 'DELETED' : 'ACTIVE');

      let updates: any = {};
      if (action === 'LOCK') updates.locked = true;
      if (action === 'UNLOCK') updates.locked = false;
      if (action === 'REMOVE') updates.deletedAt = new Date();
      if (action === 'RESTORE') updates.deletedAt = null;

      await updateDiscussionStatus(targetId, updates);
      finalStatus = updates.deletedAt ? 'DELETED' : (updates.locked ? 'LOCKED' : 'ACTIVE');
    }
    else if (targetType === 'REPLY') {
      const [rep] = await db.select().from(discussionReplies).where(eq(discussionReplies.id, targetId));
      if (!rep) return res.status(404).json({ error: 'Reply not found' });
      previousStatus = rep.deletedAt ? 'DELETED' : 'ACTIVE';

      let updates: any = {};
      if (action === 'REMOVE') updates.deletedAt = new Date();
      if (action === 'RESTORE') updates.deletedAt = null;

      await updateReplyStatus(targetId, updates);
      finalStatus = updates.deletedAt ? 'DELETED' : 'ACTIVE';
    } else {
      return res.status(400).json({ error: 'Unsupported target type' });
    }

    // Log the moderation action
    await db.insert(moderationLogs).values({
      id: uuidv4(),
      actorId,
      action,
      targetType,
      targetId,
      reason: reason || 'No reason provided',
      previousStatus,
      newStatus: finalStatus
    });

    res.json({ success: true, newStatus: finalStatus });
  } catch (error) {
    console.error('Error performing moderation action:', error);
    res.status(500).json({ error: 'Failed to perform moderation action' });
  }
});
