import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('/api/workspaces')) {
  content = content.replace(
    "import searchRoutes from \"./src/routes/search.js\";",
    "import searchRoutes from \"./src/routes/search.js\";\nimport workspacesRoutes from \"./src/routes/workspaces.js\";"
  );
  content = content.replace(
    "app.use(\"/api/search\", searchRoutes);",
    "app.use(\"/api/search\", searchRoutes);\napp.use('/api/workspaces', workspacesRoutes);"
  );
  fs.writeFileSync('server.ts', content);
}
