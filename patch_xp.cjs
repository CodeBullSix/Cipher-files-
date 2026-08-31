const fs = require('fs');
let content = fs.readFileSync('src/services/storage.ts', 'utf8');

const regex = /public static addXp.*?\n.*?return.*?;\n  \}/s;
content = content.replace(regex, "");

// also remove anything related to xp
content = content.replace("xpAmount", "repAmount");

fs.writeFileSync('src/services/storage.ts', content);
