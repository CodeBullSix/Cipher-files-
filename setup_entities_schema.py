import re

with open('src/db/schema.ts', 'r') as f:
    content = f.read()

# Add enums if needed
enums = """
export const entityVerificationStatusEnum = pgEnum('entity_verification_status', ['UNVERIFIED', 'VERIFIED', 'DISPUTED']);
"""
content = content.replace("export const caseFiles = pgTable(", enums + "\nexport const caseFiles = pgTable(")

entities_schema = """
export const people = pgTable('people', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  aliases: text('aliases'), // comma-separated or JSON
  description: text('description'),
  imageUrl: text('image_url'),
  verificationStatus: entityVerificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const organisations = pgTable('organisations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  aliases: text('aliases'),
  description: text('description'),
  type: text('type'),
  verificationStatus: entityVerificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const locations = pgTable('locations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  locationType: text('location_type'),
  description: text('description'),
  country: text('country'),
  coordinates: text('coordinates'), // e.g. "lat,lng" or JSON
  verificationStatus: entityVerificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const casePeople = pgTable('case_people', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
}, (t) => [
  unique('unique_case_person').on(t.caseFileId, t.personId)
]);

export const caseOrganisations = pgTable('case_organisations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
}, (t) => [
  unique('unique_case_organisation').on(t.caseFileId, t.organisationId)
]);

export const caseLocations = pgTable('case_locations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
}, (t) => [
  unique('unique_case_location').on(t.caseFileId, t.locationId)
]);

export const peopleRelations = relations(people, ({ one, many }) => ({
  creator: one(users, { fields: [people.createdBy], references: [users.uid] }),
  caseFiles: many(casePeople),
}));

export const organisationsRelations = relations(organisations, ({ one, many }) => ({
  creator: one(users, { fields: [organisations.createdBy], references: [users.uid] }),
  caseFiles: many(caseOrganisations),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  creator: one(users, { fields: [locations.createdBy], references: [users.uid] }),
  caseFiles: many(caseLocations),
}));

export const casePeopleRelations = relations(casePeople, ({ one }) => ({
  caseFile: one(caseFiles, { fields: [casePeople.caseFileId], references: [caseFiles.id] }),
  person: one(people, { fields: [casePeople.personId], references: [people.id] }),
}));

export const caseOrganisationsRelations = relations(caseOrganisations, ({ one }) => ({
  caseFile: one(caseFiles, { fields: [caseOrganisations.caseFileId], references: [caseFiles.id] }),
  organisation: one(organisations, { fields: [caseOrganisations.organisationId], references: [organisations.id] }),
}));

export const caseLocationsRelations = relations(caseLocations, ({ one }) => ({
  caseFile: one(caseFiles, { fields: [caseLocations.caseFileId], references: [caseFiles.id] }),
  location: one(locations, { fields: [caseLocations.locationId], references: [locations.id] }),
}));
"""

content = content + "\n" + entities_schema

# We also need to add relations to caseFilesRelations
old_caseFilesRelations = """export const caseFilesRelations = relations(caseFiles, ({ one, many }) => ({
  author: one(users, { fields: [caseFiles.createdBy], references: [users.uid] }),
  discussions: many(discussions),
}));"""

new_caseFilesRelations = """export const caseFilesRelations = relations(caseFiles, ({ one, many }) => ({
  author: one(users, { fields: [caseFiles.createdBy], references: [users.uid] }),
  discussions: many(discussions),
  people: many(casePeople),
  organisations: many(caseOrganisations),
  locations: many(caseLocations),
}));"""

content = content.replace(old_caseFilesRelations, new_caseFilesRelations)

with open('src/db/schema.ts', 'w') as f:
    f.write(content)
