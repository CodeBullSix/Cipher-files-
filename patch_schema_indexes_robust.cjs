const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

function addIndexes(tableName, relationsName, indexes) {
  const target = `});\n\nexport const ${relationsName}`;
  const replacement = `}, (t) => [\n${indexes.map(i => `  ${i},`).join('\n')}\n]);\n\nexport const ${relationsName}`;
  if (content.includes(target)) {
    content = content.replace(target, replacement);
  }
}

addIndexes('caseFiles', 'caseFilesRelations', [
  "index('case_status_idx').on(t.status)",
  "index('case_created_at_idx').on(t.createdAt)"
]);

addIndexes('evidenceItems', 'evidenceItemsRelations', [
  "index('evidence_case_id_idx').on(t.caseId)",
  "index('evidence_status_idx').on(t.status)",
  "index('evidence_created_at_idx').on(t.createdAt)"
]);

addIndexes('organisations', 'organisationsRelations', [
  "index('org_case_id_idx').on(t.caseId)",
  "index('org_status_idx').on(t.verificationStatus)"
]);

addIndexes('locations', 'locationsRelations', [
  "index('loc_case_id_idx').on(t.caseId)",
  "index('loc_status_idx').on(t.verificationStatus)"
]);

addIndexes('events', 'eventsRelations', [
  "index('events_case_id_idx').on(t.caseId)",
  "index('events_status_idx').on(t.verificationStatus)"
]);

addIndexes('entityRelationships', 'entityRelationshipsRelations', [
  "index('rel_source_idx').on(t.sourceType, t.sourceId)",
  "index('rel_target_idx').on(t.targetType, t.targetId)"
]);

addIndexes('discussions', 'discussionsRelations', [
  "index('disc_target_idx').on(t.targetType, t.targetId)",
  "index('disc_status_idx').on(t.status)",
  "index('disc_created_at_idx').on(t.createdAt)"
]);

addIndexes('discussionReplies', 'discussionRepliesRelations', [
  "index('reply_discussion_id_idx').on(t.discussionId)",
  "index('reply_status_idx').on(t.status)",
  "index('reply_created_at_idx').on(t.createdAt)"
]);

fs.writeFileSync('src/db/schema.ts', content);
