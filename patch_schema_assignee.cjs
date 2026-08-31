const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

// Add assigneeId to reports
content = content.replace(
  "  status: reportStatusEnum('status').default('OPEN').notNull(),",
  "  status: reportStatusEnum('status').default('OPEN').notNull(),\n  assigneeId: text('assignee_id').references(() => users.uid, { onDelete: 'set null' }),"
);

// Add assigneeId to evidenceItems
content = content.replace(
  "  status: evidenceStatusEnum('status').default('UNVERIFIED').notNull(),",
  "  status: evidenceStatusEnum('status').default('UNVERIFIED').notNull(),\n  assigneeId: text('assignee_id').references(() => users.uid, { onDelete: 'set null' }),"
);

fs.writeFileSync(file, content);
