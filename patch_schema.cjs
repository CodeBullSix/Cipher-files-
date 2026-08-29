const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('export const notifications')) {
  // We need to add notificationTypeEnum and notifications table
  const newSchema = `
export const notificationTypeEnum = pgEnum('notification_type', ['DISCUSSION_REPLY', 'ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'REPUTATION_MILESTONE', 'CONTRIBUTION_STATUS', 'SYSTEM']);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  relatedRecordId: uuid('related_record_id'),
  relatedRecordType: text('related_record_type'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.uid],
  }),
}));
`;

  // Find a good place to insert it. E.g. at the end of the file.
  content = content + newSchema;
  fs.writeFileSync(file, content);
}
