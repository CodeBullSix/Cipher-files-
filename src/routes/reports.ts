import { Router } from 'express';
import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import { db } from '../db/index.js';
import { createNotification } from '../db/notifications.js';
import { reports, evidenceItems, moderationLogs, discussions, discussionReplies, users } from '../db/schema.js';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const reportsRouter = Router();

// Submit a new report
reportsRouter.post('/', requireAuth, strictLimiter, async (req: AuthRequest, res) => {
  const { targetType, targetId, reason, description } = req.body;
  const reporterId = req.user!.uid;

  if (!targetType || !targetId || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Target Validation & Target Author ID extraction
    let targetAuthorId = null;

    if (targetType === 'DISCUSSION') {
      const [disc] = await db.select().from(discussions).where(eq(discussions.id, targetId));
      if (!disc) return res.status(404).json({ error: 'Target discussion not found' });
      targetAuthorId = disc.authorId;
    } else if (targetType === 'REPLY') {
      const [reply] = await db.select().from(discussionReplies).where(eq(discussionReplies.id, targetId));
      if (!reply) return res.status(404).json({ error: 'Target reply not found' });
      targetAuthorId = reply.authorId;
    } else if (targetType === 'EVIDENCE') {
      const [ev] = await db.select().from(evidenceItems).where(eq(evidenceItems.id, targetId));
      if (!ev) return res.status(404).json({ error: 'Target evidence not found' });
      targetAuthorId = ev.submittedById;
    } else if (targetType === 'USER') {
      const [user] = await db.select().from(users).where(eq(users.uid, targetId));
      if (!user) return res.status(404).json({ error: 'Target user not found' });
      targetAuthorId = user.uid;
    } else {
      return res.status(400).json({ error: 'Unsupported target type' });
    }

    // 2. Prevent self-reporting
    if (targetAuthorId === reporterId) {
      return res.status(400).json({ error: 'You cannot report your own content' });
    }

    // 3. Prevent duplicate active reports
    const [existing] = await db.select().from(reports)
      .where(and(eq(reports.reporterId, reporterId), eq(reports.targetId, targetId)));
    
    if (existing && existing.status !== 'DISMISSED' && existing.status !== 'RESOLVED') {
       return res.status(400).json({ error: 'You have already reported this item and it is currently active' });
    }

    if (existing) {
       // if we want we could update the existing one, but we have a unique constraint on (reporterId, targetId). 
       // so if it exists we can't create a new one. We can either update the status back to OPEN or reject.
       // Let's just reject for simplicity, they already reported it once.
       return res.status(400).json({ error: 'You have already reported this item in the past' });
    }


    // 3.5 Prevent Duplicate Active Reports
    const [existingReport] = await db.select().from(reports).where(and(
      eq(reports.reporterId, reporterId),
      eq(reports.targetId, targetId)
    ));
    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this content.' });
    }

    // 4. Create report

    const newReport = await db.insert(reports).values({
      id: uuidv4(),
      reporterId,
      targetType,
      targetId,
      targetAuthorId,
      reason,
      description: description || null
    }).returning();
    
    // Audit Log
    await db.insert(moderationLogs).values({
      id: uuidv4(),
      actorId: reporterId,
      action: 'REPORT',
      targetType: 'REPORT',
      targetId: newReport[0].id,
      reason: reason,
      newStatus: 'OPEN'
    }).catch(console.error);

    res.json(newReport[0]);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// GET all reports (MODERATOR ONLY)
reportsRouter.get('/', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const allReports = await db.select({
       id: reports.id,
       targetType: reports.targetType,
       targetId: reports.targetId,
       reason: reports.reason,
       description: reports.description,
       status: reports.status,
       createdAt: reports.createdAt,
       reporterId: reports.reporterId,
       targetAuthorId: reports.targetAuthorId,
       reporterUsername: users.username,
       reporterDisplayName: users.displayName
    })
    .from(reports)
    .leftJoin(users, eq(reports.reporterId, users.uid))
    .orderBy(desc(reports.createdAt))
    .limit(100);

    res.json(allReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update report status (MODERATOR ONLY)
reportsRouter.put('/:id/status', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  const { status } = req.body;
  
  if (!['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [existingReport] = await db.select().from(reports).where(eq(reports.id, req.params.id));
    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const previousStatus = existingReport.status;

    const [updated] = await db.update(reports)
      .set({ 
        status, 
        resolvedAt: ['RESOLVED', 'DISMISSED'].includes(status) ? new Date() : null,
        resolvedById: ['RESOLVED', 'DISMISSED'].includes(status) ? req.user!.uid : null
      })
      .where(eq(reports.id, req.params.id))
      .returning();

    if (updated && ['RESOLVED', 'DISMISSED'].includes(status) && updated.reporterId) {
      await createNotification(
        updated.reporterId,
        'SYSTEM',
        `Your report regarding a ${updated.targetType.toLowerCase()} has been ${status.toLowerCase()}.`,
        updated.id
      ).catch(console.error);
    }
    
    // Audit Log
    if (updated && previousStatus !== status) {
      await db.insert(moderationLogs).values({
        id: uuidv4(),
        actorId: req.user!.uid,
        action: status === 'RESOLVED' ? 'RESOLVE' : (status === 'DISMISSED' ? 'DISMISS' : 'APPROVE'), // fallback
        targetType: 'REPORT',
        targetId: updated.id,
        reason: `Report ${status.toLowerCase()}`,
        previousStatus: previousStatus,
        newStatus: status
      }).catch(console.error);
    }

    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

