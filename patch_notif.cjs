const fs = require('fs');
const file = 'src/db/notifications.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "type: 'DISCUSSION_REPLY' | 'ACHIEVEMENT_UNLOCKED' | 'LEVEL_UP' | 'REPUTATION_MILESTONE' | 'CONTRIBUTION_STATUS' | 'SYSTEM',",
  "type: 'DISCUSSION_REPLY' | 'ACHIEVEMENT_UNLOCKED' | 'LEVEL_UP' | 'REPUTATION_MILESTONE' | 'CONTRIBUTION_STATUS' | 'SYSTEM' | 'NEW_FOLLOWER',"
);

fs.writeFileSync(file, content);
