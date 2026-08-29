import fs from 'fs';
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

// Replace the unique constraint on case_locations
content = content.replace(
  `export const caseLocations = pgTable('case_locations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
}, (t) => [
  unique('unique_case_location').on(t.caseFileId, t.locationId)
]);`,
  `export const caseLocations = pgTable('case_locations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
});`
);

// We should also replace case_organisations and case_people just in case they have the same issue.
content = content.replace(
  `export const caseOrganisations = pgTable('case_organisations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
}, (t) => [
  unique('unique_case_organisation').on(t.caseFileId, t.organisationId)
]);`,
  `export const caseOrganisations = pgTable('case_organisations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
});`
);

content = content.replace(
  `export const casePeople = pgTable('case_people', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
}, (t) => [
  unique('unique_case_person').on(t.caseFileId, t.personId)
]);`,
  `export const casePeople = pgTable('case_people', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
});`
);

fs.writeFileSync('src/db/schema.ts', content);
