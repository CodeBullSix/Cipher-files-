const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('primaryKey,')) {
  content = content.replace("import { pgTable,", "import { pgTable, primaryKey,");
  fs.writeFileSync(file, content);
}
