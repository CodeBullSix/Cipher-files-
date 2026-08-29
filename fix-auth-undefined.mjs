import fs from 'fs';
let content = fs.readFileSync('src/services/authService.ts', 'utf8');
content = content.replace(/user\.photoURL \|\| undefined/g, 'user.photoURL || null');
fs.writeFileSync('src/services/authService.ts', content);
