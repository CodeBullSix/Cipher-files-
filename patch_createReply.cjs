const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

// Ensure createNotification is imported
if (!content.includes('import { createNotification }')) {
  content = content.replace(
    "import { getUserContributions } from './src/db/contributions.js';",
    "import { getUserContributions } from './src/db/contributions.js';\nimport { createNotification } from './src/db/notifications.js';"
  );
}

// add notification after createReply
const newReplyBlock = `
    const reply = await createReply({ 
      id: \`reply-\${Date.now()}\`,
      discussionId: req.params.id, 
      content: req.body.content,
      authorId: req.user!.uid 
    });
    
    // Notify discussion author if it's not their own reply
    if (disc.authorId !== req.user!.uid) {
      await createNotification(
        disc.authorId,
        'DISCUSSION_REPLY',
        'New Reply to your Discussion',
        \`\${req.dbUser.username || 'An investigator'} replied: "\${req.body.content.substring(0, 30)}..."\`,
        disc.id,
        'DISCUSSION'
      );
    }
`;

content = content.replace(
  `const reply = await createReply({ \n      id: \`reply-\${Date.now()}\`,\n      discussionId: req.params.id, \n      content: req.body.content,\n      authorId: req.user!.uid \n    });`,
  newReplyBlock
);

fs.writeFileSync(file, content);
