const fs = require('fs');
const file = 'src/routes/moderation.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("finalStatus = updates.deletedAt ? 'DELETED' : 'ACTIVE';\n    \n    else if", "finalStatus = updates.deletedAt ? 'DELETED' : 'ACTIVE';\n    }\n    else if");

fs.writeFileSync(file, content);
