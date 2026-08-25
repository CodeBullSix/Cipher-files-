import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  "import { eventsRouter } from './src/routes/events.js';",
  "import { eventsRouter } from './src/routes/events.js';\nimport { graphRouter } from './src/routes/graph.js';"
);
content = content.replace(
  "app.use('/api/events', eventsRouter);",
  "app.use('/api/events', eventsRouter);\napp.use('/api/graph', graphRouter);"
);
fs.writeFileSync('server.ts', content);
