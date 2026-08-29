const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('export const userFollows')) {
  // Update enum
  content = content.replace(
    "['DISCUSSION_REPLY', 'ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'REPUTATION_MILESTONE', 'CONTRIBUTION_STATUS', 'SYSTEM']",
    "['DISCUSSION_REPLY', 'ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'REPUTATION_MILESTONE', 'CONTRIBUTION_STATUS', 'SYSTEM', 'NEW_FOLLOWER']"
  );
  
  // Add table
  const newTable = `
export const userFollows = pgTable('user_follows', {
  followerId: text('follower_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  followingId: text('following_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.followerId, t.followingId] }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.uid],
    relationName: 'userFollowsFollower',
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.uid],
    relationName: 'userFollowsFollowing',
  }),
}));
`;

  content += newTable;
  fs.writeFileSync(file, content);
}
