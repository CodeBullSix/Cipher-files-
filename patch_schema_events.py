import re

with open('src/db/schema.ts', 'r') as f:
    content = f.read()

events_schema = """
export const eventPrecisionEnum = pgEnum('event_precision', ['EXACT', 'DAY', 'MONTH', 'YEAR', 'APPROXIMATE', 'RANGE', 'UNKNOWN']);
export const eventTypeEnum = pgEnum('event_type', ['MEETING', 'PUBLICATION', 'EMPLOYMENT', 'FOUNDING', 'INVESTIGATION', 'INCIDENT', 'MOVEMENT', 'COMMUNICATION', 'LEGAL', 'POLITICAL', 'OTHER']);

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: eventTypeEnum('type').notNull(),
  
  // Date information
  dateString: text('date_string'), // For display: "March 1963", "1963-1965", "Unknown"
  startDate: timestamp('start_date'), // For sorting/filtering
  endDate: timestamp('end_date'),
  datePrecision: eventPrecisionEnum('date_precision').notNull().default('EXACT'),
  
  location: text('location'),
  verificationStatus: entityVerificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  
  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventPeople = pgTable('event_people', {
  eventId: text('event_id').references(() => events.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
}, (t) => [
  unique('unique_event_person').on(t.eventId, t.personId)
]);

export const eventOrganisations = pgTable('event_organisations', {
  eventId: text('event_id').references(() => events.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
}, (t) => [
  unique('unique_event_organisation').on(t.eventId, t.organisationId)
]);

export const eventLocations = pgTable('event_locations', {
  eventId: text('event_id').references(() => events.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
}, (t) => [
  unique('unique_event_location').on(t.eventId, t.locationId)
]);

export const eventCaseFiles = pgTable('event_case_files', {
  eventId: text('event_id').references(() => events.id).notNull(),
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
}, (t) => [
  unique('unique_event_case_file').on(t.eventId, t.caseFileId)
]);

export const eventRelationships = pgTable('event_relationships', {
  eventId: text('event_id').references(() => events.id).notNull(),
  relationshipId: text('relationship_id').references(() => entityRelationships.id).notNull(),
}, (t) => [
  unique('unique_event_relationship').on(t.eventId, t.relationshipId)
]);

export const eventEvidence = pgTable('event_evidence', {
  eventId: text('event_id').references(() => events.id).notNull(),
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
}, (t) => [
  unique('unique_event_evidence').on(t.eventId, t.evidenceId)
]);

// RELATIONS
export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, { fields: [events.createdBy], references: [users.uid] }),
  people: many(eventPeople),
  organisations: many(eventOrganisations),
  locations: many(eventLocations),
  caseFiles: many(eventCaseFiles),
  relationships: many(eventRelationships),
  evidence: many(eventEvidence),
}));

export const eventPeopleRelations = relations(eventPeople, ({ one }) => ({
  event: one(events, { fields: [eventPeople.eventId], references: [events.id] }),
  person: one(people, { fields: [eventPeople.personId], references: [people.id] }),
}));

export const eventOrganisationsRelations = relations(eventOrganisations, ({ one }) => ({
  event: one(events, { fields: [eventOrganisations.eventId], references: [events.id] }),
  organisation: one(organisations, { fields: [eventOrganisations.organisationId], references: [organisations.id] }),
}));

export const eventLocationsRelations = relations(eventLocations, ({ one }) => ({
  event: one(events, { fields: [eventLocations.eventId], references: [events.id] }),
  location: one(locations, { fields: [eventLocations.locationId], references: [locations.id] }),
}));

export const eventCaseFilesRelations = relations(eventCaseFiles, ({ one }) => ({
  event: one(events, { fields: [eventCaseFiles.eventId], references: [events.id] }),
  caseFile: one(caseFiles, { fields: [eventCaseFiles.caseFileId], references: [caseFiles.id] }),
}));

export const eventRelationshipsRelations = relations(eventRelationships, ({ one }) => ({
  event: one(events, { fields: [eventRelationships.eventId], references: [events.id] }),
  relationship: one(entityRelationships, { fields: [eventRelationships.relationshipId], references: [entityRelationships.id] }),
}));

export const eventEvidenceRelations = relations(eventEvidence, ({ one }) => ({
  event: one(events, { fields: [eventEvidence.eventId], references: [events.id] }),
  evidenceItem: one(evidenceItems, { fields: [eventEvidence.evidenceId], references: [evidenceItems.id] }),
}));
"""

# Append to file
content += "\n" + events_schema

# We also need to add relations to people, organisations, locations, caseFiles, entityRelationships, evidenceItems
def add_many(table, field):
    global content
    pattern = r"export const " + table + r"Relations = relations\(" + table + r", \(\{ one, many \}\) => \(\{(.*?)\}\)\);"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        inner = match.group(1)
        new_inner = inner + f"\n  events: many({field}),"
        new_block = f"export const {table}Relations = relations({table}, ({{ one, many }}) => ({{{new_inner}}}));"
        content = content[:match.start()] + new_block + content[match.end():]

add_many('people', 'eventPeople')
add_many('organisations', 'eventOrganisations')
add_many('locations', 'eventLocations')
add_many('caseFiles', 'eventCaseFiles')
add_many('entityRelationships', 'eventRelationships')
add_many('evidenceItems', 'eventEvidence')

with open('src/db/schema.ts', 'w') as f:
    f.write(content)

