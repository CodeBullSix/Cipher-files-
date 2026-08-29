const fs = require('fs');
const file = 'src/db/reputation.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { createNotification }')) {
  content = content.replace(
    "import { calculateLevel } from '../lib/levels.js';",
    "import { calculateLevel } from '../lib/levels.js';\nimport { createNotification } from './notifications.js';"
  );
}

content = content.replace(
  "const currentUserData = await tx.select({ reputation: users.reputation }).from(users).where(eq(users.uid, userId));",
  "const currentUserData = await tx.select({ reputation: users.reputation, level: users.level }).from(users).where(eq(users.uid, userId));"
);

const levelUpBlock = `
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
`;

content = content.replace(
  /\/\/ Increment user's reputation and update level[\s\S]*?return { success: true, eventId, points };/,
  levelUpBlock
);

// After the transaction, if leveledUp is true, create a notification
const notifyBlock = `
  if (result.success) {
    if (result.leveledUp) {
      createNotification(
        userId,
        'LEVEL_UP',
        'Security Clearance Elevated',
        \`Congratulations, Investigator. You have been promoted to \${result.newLevelTitle} (Level \${result.newLevel}).\`,
        result.newLevel.toString(),
        'PROFILE'
      ).catch(console.error);
    }
    
    // Fire and forget achievement check so it doesn't block
`;

content = content.replace(
  `  if (result.success) {\n    // Fire and forget achievement check so it doesn't block`,
  notifyBlock
);

fs.writeFileSync(file, content);
