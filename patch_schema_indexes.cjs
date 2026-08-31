const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!content.includes('index,')) {
    content = content.replace('primaryKey,', 'primaryKey, index,');
}

// Add indexes to cases
content = content.replace(
  "});\n\nexport const caseFilesRelations",
  `}, (t) => [
  index('case_status_idx').on(t.status),
  index('case_created_at_idx').on(t.createdAt),
]);

export const caseFilesRelations`
);

// Add indexes to evidence
content = content.replace(
  "});\n\nexport const evidenceItemsRelations",
  `}, (t) => [
  index('evidence_case_id_idx').on(t.caseId),
  index('evidence_status_idx').on(t.status),
  index('evidence_created_at_idx').on(t.createdAt),
]);

export const evidenceItemsRelations`
);

// Add indexes to people
content = content.replace(
  "});\n\nexport const peopleRelations",
  `}, (t) => [
  index('people_case_id_idx').on(t.caseId),
  index('people_status_idx').on(t.verificationStatus),
]);

export const peopleRelations`
);

// Add indexes to organisations
content = content.replace(
  "});\n\nexport const organisationsRelations",
  `}, (t) => [
  index('org_case_id_idx').on(t.caseId),
  index('org_status_idx').on(t.verificationStatus),
]);

export const organisationsRelations`
);

// Add indexes to locations
content = content.replace(
  "});\n\nexport const locationsRelations",
  `}, (t) => [
  index('loc_case_id_idx').on(t.caseId),
  index('loc_status_idx').on(t.verificationStatus),
]);

export const locationsRelations`
);

// Add indexes to events
content = content.replace(
  "});\n\nexport const eventsRelations",
  `}, (t) => [
  index('events_case_id_idx').on(t.caseId),
  index('events_status_idx').on(t.verificationStatus),
]);

export const eventsRelations`
);

// Add indexes to entity relationships
content = content.replace(
  "});\n\nexport const entityRelationshipsRelations",
  `}, (t) => [
  index('rel_source_idx').on(t.sourceType, t.sourceId),
  index('rel_target_idx').on(t.targetType, t.targetId),
]);

export const entityRelationshipsRelations`
);

// Add indexes to discussions
content = content.replace(
  "});\n\nexport const discussionsRelations",
  `}, (t) => [
  index('disc_target_idx').on(t.targetType, t.targetId),
  index('disc_status_idx').on(t.status),
  index('disc_created_at_idx').on(t.createdAt),
]);

export const discussionsRelations`
);

// Add indexes to discussionReplies
content = content.replace(
  "});\n\nexport const discussionRepliesRelations",
  `}, (t) => [
  index('reply_discussion_id_idx').on(t.discussionId),
  index('reply_status_idx').on(t.status),
  index('reply_created_at_idx').on(t.createdAt),
]);

export const discussionRepliesRelations`
);

// Add indexes to notifications
content = content.replace(
  "});\n\nexport const notificationsRelations",
  `}, (t) => [
  index('notif_user_idx').on(t.userId),
  index('notif_is_read_idx').on(t.isRead),
  index('notif_created_at_idx').on(t.createdAt),
]);

export const notificationsRelations`
);

fs.writeFileSync('src/db/schema.ts', content);
