const fs = require('fs');
const file = 'src/routes/moderation.ts';
let content = fs.readFileSync(file, 'utf8');

const getLogsRoute = `
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
`;

content = content.replace("export const moderationRouter = Router();", "export const moderationRouter = Router();\n" + getLogsRoute);

fs.writeFileSync(file, content);
