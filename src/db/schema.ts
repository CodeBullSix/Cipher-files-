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

export const evidenceTypeEnum = pgEnum('evidence_type', ['DOCUMENT', 'PHOTOGRAPH', 'VIDEO', 'AUDIO', 'TESTIMONY', 'OFFICIAL_RECORD', 'NEWS_REPORT', 'INTERVIEW', 'DATASET', 'ARCHIVED_WEBPAGE', 'OTHER']);
export const evidenceStanceEnum = pgEnum('evidence_stance', ['SUPPORTING', 'CONTRADICTING', 'CONTEXTUAL', 'UNDETERMINED']);
export const evidenceStatusEnum = pgEnum('evidence_status', ['UNVERIFIED', 'UNDER_REVIEW', 'VERIFIED', 'DISPUTED', 'REJECTED']);
export const sourceTypeEnum = pgEnum('source_type', ['PRIMARY', 'SECONDARY', 'TERTIARY', 'ARCHIVAL', 'OFFICIAL', 'JOURNALISTIC', 'ACADEMIC', 'WITNESS', 'USER_SUBMITTED', 'OTHER']);
export const sourceReliabilityEnum = pgEnum('source_reliability', ['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']);
export const auditActionEnum = pgEnum('audit_action', ['SUBMITTED', 'EDITED', 'REVIEW_STARTED', 'VERIFIED', 'DISPUTED', 'REJECTED', 'RESTORED', 'DELETED']);

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  sourceType: sourceTypeEnum('source_type').notNull(),
  url: text('url'),
  publisher: text('publisher'),
  author: text('author'),
  publicationDate: timestamp('publication_date'),
  accessedAt: timestamp('accessed_at'),
  reliability: sourceReliabilityEnum('reliability').default('UNKNOWN').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  storageKey: text('storage_key').notNull(),
  checksum: text('checksum'),
  pageCount: integer('page_count'),
  uploadedById: text('uploaded_by_id').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const evidenceItems = pgTable('evidence_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: evidenceTypeEnum('type').notNull(),
  stance: evidenceStanceEnum('stance').notNull(),
  status: evidenceStatusEnum('status').default('UNVERIFIED').notNull(),
  sourceId: text('source_id').references(() => sources.id),
  documentId: text('document_id').references(() => documents.id),
  submittedById: text('submitted_by_id').references(() => users.uid).notNull(),
  verifiedById: text('verified_by_id').references(() => users.uid),
  verificationNotes: text('verification_notes'),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const evidenceCaseFiles = pgTable('evidence_case_files', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
}, (t) => [
  unique('unique_evidence_case').on(t.evidenceId, t.caseFileId)
]);

export const evidenceDiscussions = pgTable('evidence_discussions', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  discussionId: text('discussion_id').references(() => discussions.id).notNull(),
}, (t) => [
  unique('unique_evidence_discussion').on(t.evidenceId, t.discussionId)
]);

export const evidenceAuditLogs = pgTable('evidence_audit_logs', {
  id: text('id').primaryKey(),
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  userId: text('user_id').references(() => users.uid).notNull(),
  action: auditActionEnum('action').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sourcesRelations = relations(sources, ({ many }) => ({
  evidenceItems: many(evidenceItems),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  uploadedBy: one(users, { fields: [documents.uploadedById], references: [users.uid] }),
  evidenceItems: many(evidenceItems),
}));

export const evidenceItemsRelations = relations(evidenceItems, ({ one, many }) => ({
  source: one(sources, { fields: [evidenceItems.sourceId], references: [sources.id] }),
  document: one(documents, { fields: [evidenceItems.documentId], references: [documents.id] }),
  submittedBy: one(users, { fields: [evidenceItems.submittedById], references: [users.uid] }),
  verifiedBy: one(users, { fields: [evidenceItems.verifiedById], references: [users.uid] }),
  caseFiles: many(evidenceCaseFiles),
  discussions: many(evidenceDiscussions),
  auditLogs: many(evidenceAuditLogs),
}));

export const evidenceCaseFilesRelations = relations(evidenceCaseFiles, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceCaseFiles.evidenceId], references: [evidenceItems.id] }),
  caseFile: one(caseFiles, { fields: [evidenceCaseFiles.caseFileId], references: [caseFiles.id] }),
}));

export const evidenceDiscussionsRelations = relations(evidenceDiscussions, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceDiscussions.evidenceId], references: [evidenceItems.id] }),
  discussion: one(discussions, { fields: [evidenceDiscussions.discussionId], references: [discussions.id] }),
}));

export const evidenceAuditLogsRelations = relations(evidenceAuditLogs, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceAuditLogs.evidenceId], references: [evidenceItems.id] }),
  user: one(users, { fields: [evidenceAuditLogs.userId], references: [users.uid] }),
}));
