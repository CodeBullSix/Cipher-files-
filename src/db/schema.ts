import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, integer, boolean, pgEnum, unique } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['USER', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN']);
export const caseStatusEnum = pgEnum('case_status', ['CONFIRMED', 'DOCUMENTED', 'DISPUTED', 'UNVERIFIED', 'DEBUNKED', 'UNKNOWN']);
export const repEventTypeEnum = pgEnum('rep_event_type', ['CREATED_DISCUSSION', 'CREATED_CASE', 'CONTRIBUTED_EVIDENCE', 'FACT_CHECKED', 'RECEIVED_UPVOTE']);

export const users = pgTable('users', {
  uid: text('uid').primaryKey(), // Firebase Auth UID
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  role: userRoleEnum('role').default('USER').notNull(),
  reputation: integer('reputation').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const caseFiles = pgTable('case_files', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  status: caseStatusEnum('status').notNull(),
  featured: boolean('featured').default(false).notNull(),
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const discussions = pgTable('discussions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').references(() => users.uid).notNull(),
  caseFileId: text('case_file_id').references(() => caseFiles.id),
  locked: boolean('locked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const discussionReplies = pgTable('discussion_replies', {
  id: text('id').primaryKey(),
  discussionId: text('discussion_id').references(() => discussions.id).notNull(),
  authorId: text('author_id').references(() => users.uid).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const discussionVotes = pgTable('discussion_votes', {
  id: text('id').primaryKey(),
  discussionId: text('discussion_id').references(() => discussions.id).notNull(),
  authorId: text('author_id').references(() => users.uid).notNull(),
  value: integer('value').notNull(), // 1 or -1
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  unique('unique_vote').on(t.discussionId, t.authorId)
]);

export const reputationEvents = pgTable('reputation_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  type: repEventTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  caseFiles: many(caseFiles),
  discussions: many(discussions),
  replies: many(discussionReplies),
  votes: many(discussionVotes),
  reputationEvents: many(reputationEvents),
}));

export const caseFilesRelations = relations(caseFiles, ({ one, many }) => ({
  author: one(users, { fields: [caseFiles.createdBy], references: [users.uid] }),
  discussions: many(discussions),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  author: one(users, { fields: [discussions.authorId], references: [users.uid] }),
  caseFile: one(caseFiles, { fields: [discussions.caseFileId], references: [caseFiles.id] }),
  replies: many(discussionReplies),
  votes: many(discussionVotes),
}));

export const repliesRelations = relations(discussionReplies, ({ one }) => ({
  discussion: one(discussions, { fields: [discussionReplies.discussionId], references: [discussions.id] }),
  author: one(users, { fields: [discussionReplies.authorId], references: [users.uid] }),
}));
