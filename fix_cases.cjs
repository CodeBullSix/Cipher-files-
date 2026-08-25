const fs = require('fs');

let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!schema.includes("evidence: many(evidenceCaseFiles)")) {
  schema = schema.replace(
    "events: many(eventCaseFiles),",
    "events: many(eventCaseFiles),\n  evidence: many(evidenceCaseFiles),"
  );
  fs.writeFileSync('src/db/schema.ts', schema);
}
