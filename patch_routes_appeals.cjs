const fs = require('fs');
const file = 'src/routes/appeals.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { requireAuth, requireModerator } from '../middleware/auth.js';",
  "import { requireAuth, requireAuthAllowSuspended, requireModerator } from '../middleware/auth.js';"
);

content = content.replace(
  "appealsRouter.post('/', requireAuth, async (req: AuthRequest, res) => {",
  "appealsRouter.post('/', requireAuthAllowSuspended, async (req: AuthRequest, res) => {"
);

content = content.replace(
  "appealsRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {",
  "appealsRouter.get('/me', requireAuthAllowSuspended, async (req: AuthRequest, res) => {"
);

// We need to also add support for targetType === 'USER' (account bans)
const targetTypeUserCode = `
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
`;

content = content.replace(
  "} else {\n      return res.status(400).json({ error: 'Unsupported target type' });\n    }",
  targetTypeUserCode + "      return res.status(400).json({ error: 'Unsupported target type' });\n    }"
);

// And we need to support Overturn for 'USER'
const overturnUserCode = `
       } else if (existingAppeal.targetType === 'USER') {
          await db.update(users).set({ deletedAt: null }).where(eq(users.uid, existingAppeal.targetId));
       }
`;

content = content.replace(
  "} else if (existingAppeal.targetType === 'REPLY') {\n          await db.update(discussionReplies).set({ deletedAt: null }).where(eq(discussionReplies.id, existingAppeal.targetId));\n       }",
  "} else if (existingAppeal.targetType === 'REPLY') {\n          await db.update(discussionReplies).set({ deletedAt: null }).where(eq(discussionReplies.id, existingAppeal.targetId));\n" + overturnUserCode + "    }"
);

// And Uphold for 'USER'
const upholdUserCode = `
       } else if (existingAppeal.targetType === 'USER') {
          await db.update(users).set({ deletedAt: new Date() }).where(eq(users.uid, existingAppeal.targetId));
       }
`;

content = content.replace(
  "} else if (existingAppeal.targetType === 'REPLY') {\n          await db.update(discussionReplies).set({ deletedAt: new Date() }).where(eq(discussionReplies.id, existingAppeal.targetId));\n       }",
  "} else if (existingAppeal.targetType === 'REPLY') {\n          await db.update(discussionReplies).set({ deletedAt: new Date() }).where(eq(discussionReplies.id, existingAppeal.targetId));\n" + upholdUserCode + "    }"
);

fs.writeFileSync(file, content);
