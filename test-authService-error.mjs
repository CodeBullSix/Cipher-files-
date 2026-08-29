import fs from 'fs';
let content = fs.readFileSync('src/services/authService.ts', 'utf8');
content = content.replace(
  "avatarUrl: user.photoURL || undefined,",
  "avatarUrl: user.photoURL || null,"
);
fs.writeFileSync('src/services/authService.ts', content);
