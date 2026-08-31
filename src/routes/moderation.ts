import { Router } from 'express';
import { requireAuth, requireModerator } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { evidenceItems, discussions, discussionReplies, moderationLogs, users } from '../db/schema.js';
import { desc, eq, inArray, isNull } from 'drizzle-orm';
import { verifyEvidence } from '../db/evidence.js';
import { updateDiscussionStatus, updateReplyStatus } from '../db/discussions.js';
import { v4 as uuidv4 } from 'uuid';

export const moderationRouter = Router();

// GET /api/moderation/logs
moderationRouter.get('/logs', async (req, res) => {
  try {
    const logs = await db.select({
      id: moderationLogs.id,
      actorId: moderationLogs.actorId,
      action: moderationLogs.action,
      targetType: moderationLogs.targetType,
      targetId: moderationLogs.targetId,
      reason: moderationLogs.reason,
      previousStatus: moderationLogs.previousStatus,
      newStatus: moderationLogs.newStatus,
      createdAt: moderationLogs.createdAt,
      actorUsername: users.username,
      actorDisplayName: users.displayName
    })
    .from(moderationLogs)
    .leftJoin(users, eq(moderationLogs.actorId, users.uid))
    .orderBy(desc(moderationLogs.createdAt))
    .limit(100);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching moderation logs:', error);
    res.status(500).json({ error: 'Failed to fetch moderation logs' });
  }
});


moderationRouter.use(requireAuth, requireModerator);

// GET /api/moderation/queue
moderationRouter.get('/queue', async (req, res) => {
  try {
    // 1. Fetch pending Reports
    const { reports, users } = await import('../db/schema.js');
    const { eq, and, or, inArray, isNull, desc } = await import('drizzle-orm');
    
    // Type aliasing for the left joins to assignee and submitter
    const assigneeUsers = users;
    
    // Fetch reports
    const pendingReports = await db.select({
      id: reports.id,
      targetType: reports.targetType,
      targetId: reports.targetId,
      reason: reports.reason,
      status: reports.status,
      createdAt: reports.createdAt,
      assigneeId: reports.assigneeId,
      assigneeName: assigneeUsers.displayName,
      submittedById: reports.reporterId,
      submittedByName: users.displayName
    })
    .from(reports)
    .leftJoin(users, eq(reports.reporterId, users.uid))
    .leftJoin(assigneeUsers, eq(reports.assigneeId, assigneeUsers.uid))
    .where(inArray(reports.status, ['OPEN', 'UNDER_REVIEW']))
    .orderBy(desc(reports.createdAt))
    .limit(100);

    // 2. Fetch pending Evidence
    const pendingEvidenceItems = await db.select({
      id: evidenceItems.id,
      title: evidenceItems.title,
      type: evidenceItems.type,
      status: evidenceItems.status,
      createdAt: evidenceItems.createdAt,
      assigneeId: evidenceItems.assigneeId,
      assigneeName: assigneeUsers.displayName,
      submittedById: evidenceItems.submittedById,
      submittedByName: users.displayName
    })
    .from(evidenceItems)
    .leftJoin(users, eq(evidenceItems.submittedById, users.uid))
    .leftJoin(assigneeUsers, eq(evidenceItems.assigneeId, assigneeUsers.uid))
    .where(inArray(evidenceItems.status, ['UNVERIFIED', 'UNDER_REVIEW']))
    .orderBy(desc(evidenceItems.createdAt))
    .limit(100);

    // Structure the results into a unified queue
    const queue = [];

    for (const r of pendingReports) {
      let priority = 'NORMAL';
      if (r.reason === 'HARASSMENT' || r.reason === 'MISINFORMATION') priority = 'CRITICAL';
      else if (r.reason === 'SPAM' || r.reason === 'INAPPROPRIATE') priority = 'HIGH';
      
      const ageInDays = (new Date().getTime() - r.createdAt.getTime()) / (1000 * 3600 * 24);
      if (ageInDays > 7 && priority === 'NORMAL') priority = 'HIGH';
      
      queue.push({
        id: r.id,
        itemType: 'REPORT',
        targetType: r.targetType,
        targetId: r.targetId,
        priority,
        priorityScore: priority === 'CRITICAL' ? 4 : priority === 'HIGH' ? 3 : priority === 'NORMAL' ? 2 : 1,
        status: r.status,
        title: `Report: ${r.targetType} (${r.reason})`,
        description: `Reported for ${r.reason}`,
        submittedBy: r.submittedById,
        submittedByName: r.submittedByName,
        createdAt: r.createdAt,
        assigneeId: r.assigneeId,
        assigneeName: r.assigneeName
      });
    }

    for (const e of pendingEvidenceItems) {
      let priority = 'LOW';
      if (e.type === 'DOCUMENT' || e.type === 'VIDEO') priority = 'NORMAL';
      
      const ageInDays = (new Date().getTime() - e.createdAt.getTime()) / (1000 * 3600 * 24);
      if (ageInDays > 14) priority = 'HIGH';

      queue.push({
        id: e.id,
        itemType: 'EVIDENCE',
        targetType: 'EVIDENCE',
        targetId: e.id,
        priority,
        priorityScore: priority === 'CRITICAL' ? 4 : priority === 'HIGH' ? 3 : priority === 'NORMAL' ? 2 : 1,
        status: e.status === 'UNVERIFIED' ? 'PENDING' : 'IN_REVIEW',
        title: `Evidence: ${e.title}`,
        description: `Type: ${e.type}`,
        submittedBy: e.submittedById,
        submittedByName: e.submittedByName,
        createdAt: e.createdAt,
        assigneeId: e.assigneeId,
        assigneeName: e.assigneeName
      });
    }

    // Sort by priorityScore desc, then createdAt asc (oldest first)
    queue.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    res.json(queue);
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

    } else if (targetType === 'USER') {
      
      const [u] = await db.select().from(users).where(eq(users.uid, targetId));
      if (!u) return res.status(404).json({ error: 'User not found' });
      previousStatus = u.deletedAt ? 'BANNED' : 'ACTIVE';
      let updates: any = {};
      if (action === 'BAN') updates.deletedAt = new Date();
      if (action === 'UNBAN') updates.deletedAt = null;
      await db.update(users).set(updates).where(eq(users.uid, targetId));
      finalStatus = updates.deletedAt ? 'BANNED' : 'ACTIVE';
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

// POST /api/moderation/assign
moderationRouter.post('/assign', async (req, res) => {
  const { itemType, targetId, assign } = req.body;
  const actorId = (req as any).user.uid;
  
  if (!itemType || !targetId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { reports, evidenceItems, moderationLogs } = await import('../db/schema.js');
    const { eq } = await import('drizzle-orm');
    
    let previousStatus = null;
    let newStatus = null;
    let success = false;
    
    const assigneeId = assign ? actorId : null;

    if (itemType === 'REPORT') {
      const [r] = await db.select().from(reports).where(eq(reports.id, targetId));
      if (!r) return res.status(404).json({ error: 'Report not found' });
      await db.update(reports).set({ assigneeId }).where(eq(reports.id, targetId));
      previousStatus = r.status;
      newStatus = r.status;
      success = true;
    } else if (itemType === 'EVIDENCE') {
      const [e] = await db.select().from(evidenceItems).where(eq(evidenceItems.id, targetId));
      if (!e) return res.status(404).json({ error: 'Evidence not found' });
      await db.update(evidenceItems).set({ assigneeId }).where(eq(evidenceItems.id, targetId));
      previousStatus = e.status;
      newStatus = e.status;
      success = true;
    } else {
      return res.status(400).json({ error: 'Unsupported item type' });
    }

    if (success) {
      await db.insert(moderationLogs).values({
        id: uuidv4(),
        actorId,
        action: assign ? 'ASSIGN' : 'UNASSIGN',
        targetType: itemType,
        targetId,
        reason: assign ? 'Assigned for review' : 'Unassigned review',
        previousStatus,
        newStatus
      });
      res.json({ success: true, assigneeId });
    }
  } catch (error) {
    console.error('Error assigning item:', error);
    res.status(500).json({ error: 'Failed to assign item' });
  }
});
