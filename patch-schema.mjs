import fs from 'fs';
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!content.includes('workspace_entity_type')) {
  content += `

export const workspaceEntityTypeEnum = pgEnum('workspace_entity_type', ['CASE', 'PERSON', 'ORGANISATION', 'LOCATION', 'EVIDENCE', 'EVENT']);

export const investigationWorkspaces = pgTable('investigation_workspaces', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  owner: text('owner').references(() => users.uid).notNull(),
  caseId: text('case_id').references(() => caseFiles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaceNotes = pgTable('workspace_notes', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => investigationWorkspaces.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaceReferences = pgTable('workspace_references', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => investigationWorkspaces.id, { onDelete: 'cascade' }).notNull(),
  entityType: workspaceEntityTypeEnum('entity_type').notNull(),
  entityId: text('entity_id').notNull(), // No foreign key constraint because the entity could be deleted
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceConnections = pgTable('workspace_connections', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => investigationWorkspaces.id, { onDelete: 'cascade' }).notNull(),
  sourceRefId: text('source_ref_id').references(() => workspaceReferences.id, { onDelete: 'cascade' }).notNull(),
  targetRefId: text('target_ref_id').references(() => workspaceReferences.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(), // User-defined relationship label
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const investigationWorkspacesRelations = relations(investigationWorkspaces, ({ one, many }) => ({
  owner: one(users, { fields: [investigationWorkspaces.owner], references: [users.uid] }),
  caseFile: one(caseFiles, { fields: [investigationWorkspaces.caseId], references: [caseFiles.id] }),
  notes: many(workspaceNotes),
  references: many(workspaceReferences),
  connections: many(workspaceConnections),
}));

export const workspaceNotesRelations = relations(workspaceNotes, ({ one }) => ({
  workspace: one(investigationWorkspaces, { fields: [workspaceNotes.workspaceId], references: [investigationWorkspaces.id] }),
}));

export const workspaceReferencesRelations = relations(workspaceReferences, ({ one, many }) => ({
  workspace: one(investigationWorkspaces, { fields: [workspaceReferences.workspaceId], references: [investigationWorkspaces.id] }),
}));

export const workspaceConnectionsRelations = relations(workspaceConnections, ({ one }) => ({
  workspace: one(investigationWorkspaces, { fields: [workspaceConnections.workspaceId], references: [investigationWorkspaces.id] }),
  sourceRef: one(workspaceReferences, { fields: [workspaceConnections.sourceRefId], references: [workspaceReferences.id] }),
  targetRef: one(workspaceReferences, { fields: [workspaceConnections.targetRefId], references: [workspaceReferences.id] }),
}));
`;
  fs.writeFileSync('src/db/schema.ts', content);
}
