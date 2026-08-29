import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, text, varchar, timestamp, integer, boolean, pgEnum, unique, jsonb } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['USER', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN']);
export const caseStatusEnum = pgEnum('case_status', ['CONFIRMED', 'DOCUMENTED', 'DISPUTED', 'UNVERIFIED', 'DEBUNKED', 'UNKNOWN']);
export const repEventTypeEnum = pgEnum('rep_event_type', ['CREATED_DISCUSSION', 'CREATED_CASE', 'CONTRIBUTED_EVIDENCE', 'FACT_CHECKED', 'RECEIVED_UPVOTE', 'EVIDENCE_VERIFIED', 'MANUAL_REWARD', 'PENALTY', 'DISCUSSION_REPLY']);

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
  deletedAt: timestamp('deleted_at'),
});


export const entityVerificationStatusEnum = pgEnum('entity_verification_status', ['UNVERIFIED', 'VERIFIED', 'DISPUTED']);

export const caseFiles = pgTable('case_files', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  status: caseStatusEnum('status').notNull(),
  caseNumber: text('case_number'),
  subtitle: text('subtitle'),
  officialVerdict: text('official_verdict'),
  coverImage: text('cover_image'),
  claim: text('claim'),
  claimOrigin: text('claim_origin'),
  whatWeKnow: jsonb('what_we_know'),
  speculations: jsonb('speculations'),
  timeline: jsonb('timeline'),
  featured: boolean('featured').default(false).notNull(),

  createdBy: text('created_by').references(() => users.uid).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
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
  points: integer('points').notNull().default(0),
  relatedRecordId: text('related_record_id'),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  unique('unique_user_rep_event').on(t.userId, t.type, t.relatedRecordId)
]);

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
  people: many(casePeople),
  organisations: many(caseOrganisations),
  locations: many(caseLocations),
  relationships: many(caseRelationships),

  events: many(eventCaseFiles),
  evidence: many(evidenceCaseFiles),}));

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
  deletedAt: timestamp('deleted_at'),
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
  deletedAt: timestamp('deleted_at'),
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


  people: many(evidencePeople),
  organisations: many(evidenceOrganisations),
  locations: many(evidenceLocations),
  entityRelationships: many(evidenceEntityRelationships),

  events: many(eventEvidence),}));

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
  deletedAt: timestamp('deleted_at'),
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
  deletedAt: timestamp('deleted_at'),
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
  deletedAt: timestamp('deleted_at'),
});

export const casePeople = pgTable('case_people', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  personId: text('person_id').references(() => people.id).notNull(),
});

export const caseOrganisations = pgTable('case_organisations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  organisationId: text('organisation_id').references(() => organisations.id).notNull(),
});

export const caseLocations = pgTable('case_locations', {
  caseFileId: text('case_file_id').references(() => caseFiles.id).notNull(),
  locationId: text('location_id').references(() => locations.id).notNull(),
});

export const peopleRelations = relations(people, ({ one, many }) => ({
  creator: one(users, { fields: [people.createdBy], references: [users.uid] }),
  caseFiles: many(casePeople),

  evidenceItems: many(evidencePeople),
  events: many(eventPeople),}));

export const organisationsRelations = relations(organisations, ({ one, many }) => ({
  creator: one(users, { fields: [organisations.createdBy], references: [users.uid] }),
  caseFiles: many(caseOrganisations),

  evidenceItems: many(evidenceOrganisations),
  events: many(eventOrganisations),}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  creator: one(users, { fields: [locations.createdBy], references: [users.uid] }),
  caseFiles: many(caseLocations),

  evidenceItems: many(evidenceLocations),
  events: many(eventLocations),}));

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
  deletedAt: timestamp('deleted_at'),
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

  evidenceItems: many(evidenceEntityRelationships),
  events: many(eventRelationships),}));

export const caseRelationshipsRelations = relations(caseRelationships, ({ one }) => ({
  caseFile: one(caseFiles, { fields: [caseRelationships.caseFileId], references: [caseFiles.id] }),
  relationship: one(entityRelationships, { fields: [caseRelationships.relationshipId], references: [entityRelationships.id] }),
}));


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
  deletedAt: timestamp('deleted_at'),
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


export const workspaceEntityTypeEnum = pgEnum('workspace_entity_type', ['CASE', 'PERSON', 'ORGANISATION', 'LOCATION', 'EVIDENCE', 'EVENT']);

export const investigationWorkspaces = pgTable('investigation_workspaces', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  owner: text('owner').references(() => users.uid).notNull(),
  caseId: text('case_id').references(() => caseFiles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const workspaceNotes = pgTable('workspace_notes', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => investigationWorkspaces.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
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
  deletedAt: timestamp('deleted_at'),
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

export const userAchievements = pgTable('user_achievements', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.uid, { onDelete: 'cascade' }),
  achievementId: varchar('achievement_id', { length: 255 }).notNull(),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
}, (table) => {
  return {
    uniqueUserAchievement: unique('unique_user_achievement').on(table.userId, table.achievementId)
  };
});

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.uid]
  })
}));

export const notificationTypeEnum = pgEnum('notification_type', ['DISCUSSION_REPLY', 'ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'REPUTATION_MILESTONE', 'CONTRIBUTION_STATUS', 'SYSTEM', 'NEW_FOLLOWER']);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  relatedRecordId: text('related_record_id'),
  relatedRecordType: text('related_record_type'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.uid],
  }),
}));

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

export const moderationActionEnum = pgEnum('moderation_action', ['APPROVE', 'REJECT', 'REMOVE', 'DISPUTE', 'RESTORE', 'LOCK', 'UNLOCK', 'BAN', 'UNBAN']);

export const moderationLogs = pgTable('moderation_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.uid, { onDelete: 'cascade' }).notNull(),
  action: moderationActionEnum('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  reason: text('reason'),
  previousStatus: text('previous_status'),
  newStatus: text('new_status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
