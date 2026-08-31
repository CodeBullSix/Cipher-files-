import fs from 'fs';
const schemaPath = 'src/db/schema.ts';
let content = fs.readFileSync(schemaPath, 'utf8');

if (!content.includes("featuredOrder:")) {
  content = content.replace(
    /featured: boolean\('featured'\)\.default\(false\)\.notNull\(\),/,
    `featured: boolean('featured').default(false).notNull(),
  featuredOrder: integer('featured_order'),
  editorialCollection: text('editorial_collection'),
  editorialDescription: text('editorial_description'),`
  );
  fs.writeFileSync(schemaPath, content);
  console.log("Updated schema.ts with editorial fields");
} else {
  console.log("schema.ts already updated.");
}
