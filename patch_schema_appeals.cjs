const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

// Update moderationActionEnum
content = content.replace(
  "export const moderationActionEnum = pgEnum('moderation_action', ['APPROVE', 'REJECT', 'REMOVE', 'DISPUTE', 'RESTORE', 'LOCK', 'UNLOCK', 'BAN', 'UNBAN', 'RESOLVE', 'DISMISS', 'REPORT', 'ASSIGN', 'UNASSIGN']);",
  "export const moderationActionEnum = pgEnum('moderation_action', ['APPROVE', 'REJECT', 'REMOVE', 'DISPUTE', 'RESTORE', 'LOCK', 'UNLOCK', 'BAN', 'UNBAN', 'RESOLVE', 'DISMISS', 'REPORT', 'ASSIGN', 'UNASSIGN', 'APPEAL', 'UPHOLD', 'OVERTURN']);"
);

// Add appealStatusEnum
if (!content.includes("appealStatusEnum")) {
  content = content.replace(
    "export const reportStatusEnum = pgEnum('report_status', ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']);",
    "export const reportStatusEnum = pgEnum('report_status', ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']);\nexport const appealStatusEnum = pgEnum('appeal_status', ['SUBMITTED', 'UNDER_REVIEW', 'UPHELD', 'OVERTURNED']);"
  );
}

// Add appeals table
if (!content.includes("export const appeals = pgTable")) {
  const tableCode = `
export const appeals = pgTable('appeals', {
  id: text('id').primaryKey(),
  appellantId: text('appellant_id').references(() => users.uid, { onDelete: 'cascade' }).notNull(),
  targetType: text('target_type').notNull(), // 'EVIDENCE', 'DISCUSSION', 'REPLY'
  targetId: text('target_id').notNull(),
  originalModeratorId: text('original_moderator_id').references(() => users.uid, { onDelete: 'set null' }),
  reason: text('reason').notNull(),
  status: appealStatusEnum('status').default('SUBMITTED').notNull(),
  resolutionReason: text('resolution_reason'),
  resolvedById: text('resolved_by_id').references(() => users.uid, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
}, (t) => ({
  uniqueAppeal: unique('unique_active_appeal').on(t.appellantId, t.targetType, t.targetId)
}));
`;
  content += tableCode;
}

fs.writeFileSync(file, content);
