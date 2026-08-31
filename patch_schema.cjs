const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!content.includes('index,')) {
    content = content.replace('primaryKey,', 'primaryKey, index,');
}

const addIndexToTable = (tableName, indexDefinitions) => {
    // Find the export const tableName = pgTable(
    const startStr = `export const ${tableName} = pgTable(`;
    const startIdx = content.indexOf(startStr);
    if (startIdx === -1) return;

    // We need to find the matching `});` that ends this table definition.
    // It's the first `});` after startIdx
    const nextClosingIdx = content.indexOf('});', startIdx);
    if (nextClosingIdx !== -1) {
        // If there's already an index or unique constraint, we don't want to blindly replace `});`
        // Wait, if it has `}, (t) => [` we shouldn't match `});` at all!
        // Check if there is already a constraint
        const slice = content.substring(startIdx, nextClosingIdx + 3);
        if (!slice.includes('unique(') && !slice.includes('index(') && !slice.includes('primaryKey(')) {
             const replaced = slice.replace('});', `}, (t) => [\n  ${indexDefinitions.join(',\n  ')}\n]);`);
             content = content.substring(0, startIdx) + replaced + content.substring(nextClosingIdx + 3);
        }
    }
}

addIndexToTable('caseFiles', [
  "index('case_status_idx').on(t.status)",
  "index('case_created_at_idx').on(t.createdAt)"
]);

addIndexToTable('evidenceItems', [
  "index('evidence_case_id_idx').on(t.caseId)",
  "index('evidence_status_idx').on(t.status)",
  "index('evidence_created_at_idx').on(t.createdAt)"
]);

addIndexToTable('people', [
  "index('people_case_id_idx').on(t.caseId)",
  "index('people_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('organisations', [
  "index('org_case_id_idx').on(t.caseId)",
  "index('org_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('locations', [
  "index('loc_case_id_idx').on(t.caseId)",
  "index('loc_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('events', [
  "index('events_case_id_idx').on(t.caseId)",
  "index('events_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('entityRelationships', [
  "index('rel_source_idx').on(t.sourceType, t.sourceId)",
  "index('rel_target_idx').on(t.targetType, t.targetId)"
]);

addIndexToTable('discussions', [
  "index('disc_target_idx').on(t.caseFileId)", // assuming caseFileId is target? Wait, the schema has caseFileId not targetType
  "index('disc_created_at_idx').on(t.createdAt)"
]);

addIndexToTable('discussionReplies', [
  "index('reply_discussion_id_idx').on(t.discussionId)",
  "index('reply_created_at_idx').on(t.createdAt)"
]);

addIndexToTable('notifications', [
  "index('notif_user_idx').on(t.userId)",
  "index('notif_is_read_idx').on(t.isRead)",
  "index('notif_created_at_idx').on(t.createdAt)"
]);

fs.writeFileSync('src/db/schema.ts', content);
