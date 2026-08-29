const fs = require('fs');
const file = 'src/db/evidence.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { createNotification }')) {
  content = content.replace(
    "import { v4 as uuidv4 } from 'uuid';",
    "import { v4 as uuidv4 } from 'uuid';\nimport { createNotification } from './notifications.js';"
  );
}
fs.writeFileSync(file, content);
