import re

with open('src/db/schema.ts', 'r') as f:
    content = f.read()

junctions = """
export const evidencePeople = pgTable('evidence_people', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
}, (t) => [
  unique('unique_evidence_person').on(t.evidenceId, t.personId)
]);

export const evidenceOrganisations = pgTable('evidence_organisations', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
}, (t) => [
  unique('unique_evidence_organisation').on(t.evidenceId, t.organisationId)
]);

export const evidenceLocations = pgTable('evidence_locations', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
}, (t) => [
  unique('unique_evidence_location').on(t.evidenceId, t.locationId)
]);

export const evidenceEntityRelationships = pgTable('evidence_entity_relationships', {
  evidenceId: text('evidence_id').references(() => evidenceItems.id).notNull(),
  relationshipId: text('relationship_id').references(() => entityRelationships.id).notNull(),
}, (t) => [
  unique('unique_evidence_relationship').on(t.evidenceId, t.relationshipId)
]);

export const evidencePeopleRelations = relations(evidencePeople, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidencePeople.evidenceId], references: [evidenceItems.id] }),
  person: one(people, { fields: [evidencePeople.personId], references: [people.id] }),
}));

export const evidenceOrganisationsRelations = relations(evidenceOrganisations, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceOrganisations.evidenceId], references: [evidenceItems.id] }),
  organisation: one(organisations, { fields: [evidenceOrganisations.organisationId], references: [organisations.id] }),
}));

export const evidenceLocationsRelations = relations(evidenceLocations, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceLocations.evidenceId], references: [evidenceItems.id] }),
  location: one(locations, { fields: [evidenceLocations.locationId], references: [locations.id] }),
}));

export const evidenceEntityRelationshipsRelations = relations(evidenceEntityRelationships, ({ one }) => ({
  evidenceItem: one(evidenceItems, { fields: [evidenceEntityRelationships.evidenceId], references: [evidenceItems.id] }),
  relationship: one(entityRelationships, { fields: [evidenceEntityRelationships.relationshipId], references: [entityRelationships.id] }),
}));
"""

# add junctions at the bottom
content = content + "\n" + junctions

# Update relations for evidenceItems, people, organisations, locations, entityRelationships
def update_relations(table_name, additions):
    global content
    pattern = r"export const " + table_name + r"Relations = relations\(" + table_name + r", \(\{ one, many \}\) => \(\{(.*?)\}\)\);"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        inner = match.group(1)
        new_inner = inner + "\n" + additions
        new_block = f"export const {table_name}Relations = relations({table_name}, ({{ one, many }}) => ({{{new_inner}}}));"
        content = content[:match.start()] + new_block + content[match.end():]
    else:
        # maybe doesn't have `many`?
        pattern = r"export const " + table_name + r"Relations = relations\(" + table_name + r", \(\{ one \}\) => \(\{(.*?)\}\)\);"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            inner = match.group(1)
            new_inner = inner + "\n" + additions
            new_block = f"export const {table_name}Relations = relations({table_name}, ({{ one, many }}) => ({{{new_inner}}}));"
            content = content[:match.start()] + new_block + content[match.end():]

update_relations("evidenceItems", """
  people: many(evidencePeople),
  organisations: many(evidenceOrganisations),
  locations: many(evidenceLocations),
  entityRelationships: many(evidenceEntityRelationships),
""")

update_relations("people", """  evidenceItems: many(evidencePeople),""")
update_relations("organisations", """  evidenceItems: many(evidenceOrganisations),""")
update_relations("locations", """  evidenceItems: many(evidenceLocations),""")
update_relations("entityRelationships", """  evidenceItems: many(evidenceEntityRelationships),""")

with open('src/db/schema.ts', 'w') as f:
    f.write(content)
