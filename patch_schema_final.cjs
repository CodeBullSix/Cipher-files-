const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!content.includes('index,')) {
    content = content.replace('primaryKey,', 'primaryKey, index,');
}

const addIndexToTable = (tableName, indexDefinitions) => {
    const startStr = `export const ${tableName} = pgTable(`;
    const startIdx = content.indexOf(startStr);
    if (startIdx === -1) {
        console.log(`Table ${tableName} not found!`);
        return;
    }

    const nextClosingIdx = content.indexOf('});', startIdx);
    if (nextClosingIdx !== -1) {
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
  "index('evidence_status_idx').on(t.status)",
  "index('evidence_created_at_idx').on(t.createdAt)"
]);

addIndexToTable('people', [
  "index('people_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('organisations', [
  "index('org_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('locations', [
  "index('loc_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('events', [
  "index('events_status_idx').on(t.verificationStatus)"
]);

addIndexToTable('entityRelationships', [
  "index('rel_source_idx').on(t.sourceType, t.sourceId)",
  "index('rel_target_idx').on(t.targetType, t.targetId)"
]);

addIndexToTable('discussions', [
  "index('disc_case_id_idx').on(t.caseFileId)",
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

// Join tables
addIndexToTable('casePeople', ["index('case_people_case_id_idx').on(t.caseFileId)"]);
addIndexToTable('caseOrganisations', ["index('case_orgs_case_id_idx').on(t.caseFileId)"]);
addIndexToTable('caseLocations', ["index('case_locs_case_id_idx').on(t.caseFileId)"]);
addIndexToTable('evidenceCaseFiles', ["index('ev_cases_case_id_idx').on(t.caseFileId)", "index('ev_cases_ev_id_idx').on(t.evidenceId)"]);
addIndexToTable('eventCaseFiles', ["index('evt_cases_case_id_idx').on(t.caseFileId)"]);
addIndexToTable('eventRelationships', ["index('evt_rels_evt_id_idx').on(t.eventId)"]);
addIndexToTable('eventEvidence', ["index('evt_ev_evt_id_idx').on(t.eventId)"]);

fs.writeFileSync('src/db/schema.ts', content);
