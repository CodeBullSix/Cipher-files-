const fs = require('fs');
const file = 'src/db/achievements.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { createNotification }')) {
  content = content.replace(
    "import { ACHIEVEMENTS } from '../lib/achievements.js';",
    "import { ACHIEVEMENTS } from '../lib/achievements.js';\nimport { createNotification } from './notifications.js';"
  );
}

const notifyLoop = `
  for (const id of toAward) {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (ach) {
      await db.insert(userAchievements).values({
        id: uuidv4(),
        userId,
        achievementId: id,
      });
      // Notify
      await createNotification(
        userId,
        'ACHIEVEMENT_UNLOCKED',
        'Achievement Unlocked',
        \`You earned the "\${ach.title}" achievement: \${ach.description}\`,
        id,
        'ACHIEVEMENT'
      );
    }
  }
`;

content = content.replace(
  /for \(const id of toAward\) \{[\s\S]*?\}/,
  notifyLoop
);

fs.writeFileSync(file, content);
