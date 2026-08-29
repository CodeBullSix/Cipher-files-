const fs = require('fs');
const file = 'src/db/follows.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/photoURL/g, "avatar");

fs.writeFileSync(file, content);
