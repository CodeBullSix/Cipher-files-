import { db } from './index.js';
import { eq, and, isNull, desc, or, ilike } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {
  events, eventPeople, eventOrganisations, eventLocations, eventCaseFiles,
  eventRelationships, eventEvidence, evidenceItems, users, documents, sources
} from './schema.js';

export async function createEvent(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(events).values({
    id,
    title: data.title,
    description: data.description,
    type: data.type,
    dateString: data.dateString,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    datePrecision: data.datePrecision || 'EXACT',
    location: data.location,
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    createdBy: userId,
  });

  return getEventById(id);
}

export async function updateEvent(id: string, data: any) {
  await db.update(events).set({
    title: data.title,
    description: data.description,
    type: data.type,
    dateString: data.dateString,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    datePrecision: data.datePrecision,
    location: data.location,
    verificationStatus: data.verificationStatus,
    updatedAt: new Date(),
  }).where(eq(events.id, id));

  return getEventById(id);
}

export async function deleteEvent(id: string) {
  // Delete from all junction tables first
  await db.delete(eventPeople).where(eq(eventPeople.eventId, id));
  await db.delete(eventOrganisations).where(eq(eventOrganisations.eventId, id));
  await db.delete(eventLocations).where(eq(eventLocations.eventId, id));
  await db.delete(eventCaseFiles).where(eq(eventCaseFiles.eventId, id));
  await db.delete(eventRelationships).where(eq(eventRelationships.eventId, id));
  await db.delete(eventEvidence).where(eq(eventEvidence.eventId, id));
  
  await db.delete(events).where(eq(events.id, id));
  return { success: true };
}

export async function getEventById(id: string) {
  const result = await db.select().from(events).where(eq(events.id, id));
  if (!result.length) return null;
  const event = result[0];

  // Fetch associated evidence
  const evidenceRes = await db.select({
    evidence: evidenceItems,
    document: documents,
    source: sources
  }).from(evidenceItems)
    .innerJoin(eventEvidence, eq(evidenceItems.id, eventEvidence.evidenceId))
    .leftJoin(documents, eq(evidenceItems.documentId, documents.id))
    .leftJoin(sources, eq(evidenceItems.sourceId, sources.id))
    .where(and(eq(eventEvidence.eventId, id), isNull(evidenceItems.deletedAt)));
    
  const evidenceList = evidenceRes.map(r => ({
    ...r.evidence,
    source: r.source,
    document: r.document
  }));

  // Creator
  const creator = await db.select({ uid: users.uid, displayName: users.displayName })
    .from(users).where(eq(users.uid, event.createdBy)).then(res => res[0]);

  // Fetch associated entities
  const caseFilesList = await db.query.eventCaseFiles.findMany({
    where: eq(eventCaseFiles.eventId, id),
    with: { caseFile: true }
  }).then(res => res.map(r => r.caseFile).filter(Boolean));

  const peopleList = await db.query.eventPeople.findMany({
    where: eq(eventPeople.eventId, id),
    with: { person: true }
  }).then(res => res.map(r => r.person).filter(Boolean));

  const organisationsList = await db.query.eventOrganisations.findMany({
    where: eq(eventOrganisations.eventId, id),
    with: { organisation: true }
  }).then(res => res.map(r => r.organisation).filter(Boolean));

  const locationsList = await db.query.eventLocations.findMany({
    where: eq(eventLocations.eventId, id),
    with: { location: true }
  }).then(res => res.map(r => r.location).filter(Boolean));

  return { 
    ...event, 
    evidenceList, 
    creator,
    caseFiles: caseFilesList,
    people: peopleList,
    organisations: organisationsList,
    locations: locationsList
  };
}

export async function getEventsForEntity(entityType: string, entityId: string) {
  let joinTable: any;
  let joinCondition: any;
  if (entityType === 'people') {
    joinTable = eventPeople;
    joinCondition = eq(eventPeople.personId, entityId);
  } else if (entityType === 'organisations') {
    joinTable = eventOrganisations;
    joinCondition = eq(eventOrganisations.organisationId, entityId);
  } else if (entityType === 'locations') {
    joinTable = eventLocations;
    joinCondition = eq(eventLocations.locationId, entityId);
  } else if (entityType === 'relationships') {
    joinTable = eventRelationships;
    joinCondition = eq(eventRelationships.relationshipId, entityId);
  } else if (entityType === 'case_files') {
    joinTable = eventCaseFiles;
    joinCondition = eq(eventCaseFiles.caseFileId, entityId);
  } else {
    return [];
  }

  const result = await db.select({ event: events })
    .from(events)
    .innerJoin(joinTable, eq(events.id, (joinTable as any).eventId))
    .where(joinCondition)
    .orderBy(desc(events.startDate), desc(events.createdAt));

  return Promise.all(result.map(r => getEventById(r.event.id)));
}

export async function attachEventToEntity(entityType: string, entityId: string, eventId: string) {
  if (entityType === 'people') {
    await db.insert(eventPeople).values({ eventId, personId: entityId }).onConflictDoNothing();
  } else if (entityType === 'organisations') {
    await db.insert(eventOrganisations).values({ eventId, organisationId: entityId }).onConflictDoNothing();
  } else if (entityType === 'locations') {
    await db.insert(eventLocations).values({ eventId, locationId: entityId }).onConflictDoNothing();
  } else if (entityType === 'relationships') {
    await db.insert(eventRelationships).values({ eventId, relationshipId: entityId }).onConflictDoNothing();
  } else if (entityType === 'case_files') {
    await db.insert(eventCaseFiles).values({ eventId, caseFileId: entityId }).onConflictDoNothing();
  }
}

export async function attachEvidenceToEvent(eventId: string, evidenceId: string) {
  await db.insert(eventEvidence).values({ eventId, evidenceId }).onConflictDoNothing();
}

export async function removeEvidenceFromEvent(eventId: string, evidenceId: string) {
  await db.delete(eventEvidence).where(and(eq(eventEvidence.eventId, eventId), eq(eventEvidence.evidenceId, evidenceId)));
}

export async function getAllEvents() {
  const result = await db.select().from(events).orderBy(desc(events.startDate), desc(events.createdAt));
  return Promise.all(result.map(r => getEventById(r.id)));
}

