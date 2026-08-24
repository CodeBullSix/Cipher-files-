import re

with open('src/db/schema.ts', 'r') as f:
    content = f.read()

# Add to the end of the file
new_tables = """
export const entityRelationships = pgTable('entity_relationships', {
  id: text('id').primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceId: text('source_id').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  relationshipType: text('relationship_type').notNull(),
  description: text('description'),
  verificationStatus: entityVerificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  unique('unique_entity_relationship').on(t.sourceType, t.sourceId, t.targetType, t.targetId, t.relationshipType)
]);

export const caseRelationships = pgTable('case_relationships', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  relationshipId: text('relationship_id').references(() => entityRelationships.id).notNull(),
}, (t) => [
  unique('unique_case_relationship').on(t.caseFileId, t.relationshipId)
]);

export const entityRelationshipsRelations = relations(entityRelationships, ({ one, many }) => ({
  creator: one(users, { fields: [entityRelationships.createdBy], references: [users.uid] }),
  caseFiles: many(caseRelationships),
}));

export const caseRelationshipsRelations = relations(caseRelationships, ({ one }) => ({
  caseFile: one(caseFiles, { fields: [caseRelationships.caseFileId], references: [caseFiles.id] }),
  relationship: one(entityRelationships, { fields: [caseRelationships.relationshipId], references: [entityRelationships.id] }),
}));
"""

# Append
with open('src/db/schema.ts', 'a') as f:
    f.write(new_tables)

# We also need to add caseRelationships to caseFilesRelations
old_caseFilesRelations = """export const caseFilesRelations = relations(caseFiles, ({ one, many }) => ({
  author: one(users, { fields: [caseFiles.createdBy], references: [users.uid] }),
  discussions: many(discussions),
  people: many(casePeople),
  organisations: many(caseOrganisations),
  locations: many(caseLocations),
}));"""

new_caseFilesRelations = """export const caseFilesRelations = relations(caseFiles, ({ one, many }) => ({
  author: one(users, { fields: [caseFiles.createdBy], references: [users.uid] }),
  discussions: many(discussions),
  people: many(casePeople),
  organisations: many(caseOrganisations),
  locations: many(caseLocations),
  relationships: many(caseRelationships),
}));"""

content = content.replace(old_caseFilesRelations, new_caseFilesRelations)
# Need to rewrite since we used append above. Let's do it cleanly
with open('src/db/schema.ts', 'r') as f:
    content2 = f.read()

content2 = content2.replace(old_caseFilesRelations, new_caseFilesRelations)
with open('src/db/schema.ts', 'w') as f:
    f.write(content2)
