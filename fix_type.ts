import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(/isFeatured\?: boolean;/, 'featured?: boolean;');
fs.writeFileSync('src/types.ts', content);
