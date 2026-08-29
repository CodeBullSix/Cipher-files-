const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { moderationRouter }')) {
  content = content.replace(
    "import { followsRouter } from \"./src/routes/follows.js\";",
    "import { followsRouter } from \"./src/routes/follows.js\";\nimport { moderationRouter } from \"./src/routes/moderation.js\";"
  );
  
  content = content.replace(
    "app.use('/api/workspaces', workspacesRoutes);",
    "app.use('/api/workspaces', workspacesRoutes);\napp.use('/api/moderation', moderationRouter);"
  );
  
  fs.writeFileSync(file, content);
}
