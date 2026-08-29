const fs = require('fs');
const file = 'src/routes/relationships.ts';
let content = fs.readFileSync(file, 'utf8');

content = "import { awardReputation } from '../db/reputation.js';\n" + content;

fs.writeFileSync(file, content);
