const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

// The original imports in schema.ts probably look like:
// import { pgTable, text, timestamp, boolean, pgEnum, jsonb, integer, primaryKey } from 'drizzle-orm/pg-core';
// Let's just blindly add 'uuid' to it, or just use text('id') instead of uuid('id') for everything else if that's what it uses, but let's check what it uses.

if (content.includes("import { pgTable, text, timestamp, boolean, pgEnum, jsonb, integer")) {
  content = content.replace("import { pgTable, text, timestamp, boolean, pgEnum, jsonb, integer", "import { pgTable, text, timestamp, boolean, pgEnum, jsonb, integer, uuid");
} else if (content.includes("import { pgTable,")) {
  content = content.replace("import { pgTable,", "import { pgTable, uuid,");
}

fs.writeFileSync(file, content);
