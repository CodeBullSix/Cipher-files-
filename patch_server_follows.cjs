const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { followsRouter }')) {
  content = content.replace(
    "import { notificationsRouter } from \"./src/routes/notifications.js\";",
    "import { notificationsRouter } from \"./src/routes/notifications.js\";\nimport { followsRouter } from \"./src/routes/follows.js\";"
  );
  
  content = content.replace(
    "app.use('/api/notifications', notificationsRouter);",
    "app.use('/api/notifications', notificationsRouter);\napp.use('/api/users', followsRouter);"
  );
  
  fs.writeFileSync(file, content);
}
