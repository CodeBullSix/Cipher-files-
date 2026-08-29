import fs from 'fs';
let content = fs.readFileSync('src/db/workspaces.ts', 'utf8');

content = content.replace(
  "for (const ref of ws.references) {",
  "for (const ref of ws.references as any[]) {"
);

fs.writeFileSync('src/db/workspaces.ts', content);
