const fs = require('fs');
const file = 'src/routes/moderation.ts';
let content = fs.readFileSync(file, 'utf8');

const oldQueue = `// GET /api/moderation/queue
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
});`;

const newQueue = `// GET /api/moderation/queue
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
        title: \`Report: \${r.targetType} (\${r.reason})\`,
        description: \`Reported for \${r.reason}\`,
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
        title: \`Evidence: \${e.title}\`,
        description: \`Type: \${e.type}\`,
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
});`;

content = content.replace(oldQueue, newQueue);
fs.writeFileSync(file, content);
