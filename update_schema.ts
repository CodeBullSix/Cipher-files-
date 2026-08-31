import fs from 'fs';

const schemaPath = 'src/db/schema.ts';
let schemaStr = fs.readFileSync(schemaPath, 'utf8');

if (!schemaStr.includes('communitySubmissions')) {
  const enumDef = `
export const submissionTypeEnum = pgEnum('submission_type', ['CASE', 'EVIDENCE', 'ENTITY', 'RELATIONSHIP', 'EVENT', 'OTHER']);
export const submissionStatusEnum = pgEnum('submission_status', ['DRAFT', 'PENDING_REVIEW', 'IN_REVIEW', 'RETURNED', 'APPROVED', 'REJECTED']);

export const communitySubmissions = pgTable('community_submissions', {
  id: text('id').primaryKey(),
  type: submissionTypeEnum('type').notNull(),
  status: submissionStatusEnum('status').default('PENDING_REVIEW').notNull(),
  title: text('title').notNull(),
  summary: text('summary'),
  content: jsonb('content').notNull(),
  
  submittedById: text('submitted_by_id').references(() => users.uid).notNull(),
  reviewerId: text('reviewer_id').references(() => users.uid),
  
  reviewDecision: text('review_decision'),
  reviewNotes: text('review_notes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const communitySubmissionsRelations = relations(communitySubmissions, ({ one }) => ({
  submittedBy: one(users, {
    fields: [communitySubmissions.submittedById],
    references: [users.uid]
  }),
  reviewer: one(users, {
    fields: [communitySubmissions.reviewerId],
    references: [users.uid]
  })
}));
`;
  schemaStr += enumDef;
  fs.writeFileSync(schemaPath, schemaStr);
  console.log("Schema updated with communitySubmissions.");
} else {
  console.log("communitySubmissions already exists.");
}
