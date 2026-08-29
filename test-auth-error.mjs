import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  "showToast('Login attempt failed.');",
  "showToast(`Login failed: ${e?.message || 'Unknown error'}`);"
);
fs.writeFileSync('src/App.tsx', content);
