import { db } from './index.js';
import {
  evidenceItems, sources, documents, evidenceCaseFiles, evidenceDiscussions, evidenceAuditLogs, moderationLogs, users, evidencePeople, evidenceOrganisations, evidenceLocations, evidenceEntityRelationships,
  people, organisations, locations, events, eventEvidence
} from './schema.js';
import { eq, and, desc, isNull, inArray, ilike, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from './notifications.js';

export async function getEvidenceItems(params: {
  caseFileId?: string,
  query?: string,
  status?: string,
  page?: number,
  limit?: number
} = {}) {
  const { caseFileId, query, status, page = 1, limit = 50 } = params;
  
  let conditions = [isNull(evidenceItems.deletedAt)];
  
  if (status && status !== 'ALL') {
    conditions.push(eq(evidenceItems.status, status as any));
  }
  
  if (query) {
    conditions.push(
      or(
        ilike(evidenceItems.title, `%${query}%`),
        ilike(evidenceItems.description, `%${query}%`)
      )
    );
  }

  let q = db.select({
    id: evidenceItems.id,
    title: evidenceItems.title,
    description: evidenceItems.description,
    type: evidenceItems.type,
    stance: evidenceItems.stance,
    status: evidenceItems.status,
    createdAt: evidenceItems.createdAt,
    submittedBy: {
      uid: users.uid,
      displayName: users.displayName,
      avatar: users.avatar
    },
    source: {
      id: sources.id,
      name: sources.name,
      reliability: sources.reliability
    }
  }).from(evidenceItems)
  .leftJoin(users, eq(evidenceItems.submittedById, users.uid))
  .leftJoin(sources, eq(evidenceItems.sourceId, sources.id));

  if (caseFileId) {
    q.innerJoin(evidenceCaseFiles, eq(evidenceCaseFiles.evidenceId, evidenceItems.id))
    conditions.push(eq(evidenceCaseFiles.caseFileId, caseFileId));
  }
  
  q.where(and(...conditions));

  const offset = (page - 1) * limit;
  const result = await q.orderBy(desc(evidenceItems.createdAt)).limit(limit).offset(offset);
  
  // Quick count for total pages (hacky but functional for now)
  let countQ = db.select({ count: evidenceItems.id }).from(evidenceItems);
  if (caseFileId) {
    countQ.innerJoin(evidenceCaseFiles, eq(evidenceCaseFiles.evidenceId, evidenceItems.id));
  }
  const totalQ = await countQ.where(and(...conditions));
  
  return {
    items: result,
    total: totalQ.length,
    page,
    totalPages: Math.ceil(totalQ.length / limit)
  };
}

export async function getEvidenceById(id: string) {
  const result = await db.select().from(evidenceItems).where(eq(evidenceItems.id, id));
  if (!result.length) return null;
  
  const evidence = result[0];
  
  const source = evidence.sourceId ? (await db.select().from(sources).where(eq(sources.id, evidence.sourceId)))[0] : null;
  const document = evidence.documentId ? (await db.select().from(documents).where(eq(documents.id, evidence.documentId)))[0] : null;
  const submitter = (await db.select().from(users).where(eq(users.uid, evidence.submittedById)))[0];
  const verifier = evidence.verifiedById ? (await db.select().from(users).where(eq(users.uid, evidence.verifiedById)))[0] : null;
  
  const caseFilesResult = await db.select({ caseFileId: evidenceCaseFiles.caseFileId }).from(evidenceCaseFiles).where(eq(evidenceCaseFiles.evidenceId, id));
  
  const peopleResult = await db.select({ id: people.id, name: people.name })
    .from(evidencePeople)
    .innerJoin(people, eq(people.id, evidencePeople.personId))
    .where(eq(evidencePeople.evidenceId, id));

  const organisationsResult = await db.select({ id: organisations.id, name: organisations.name })
    .from(evidenceOrganisations)
    .innerJoin(organisations, eq(organisations.id, evidenceOrganisations.organisationId))
    .where(eq(evidenceOrganisations.evidenceId, id));

  const locationsResult = await db.select({ id: locations.id, name: locations.name })
    .from(evidenceLocations)
    .innerJoin(locations, eq(locations.id, evidenceLocations.locationId))
    .where(eq(evidenceLocations.evidenceId, id));

  const eventsResult = await db.select({ id: events.id, title: events.title })
    .from(eventEvidence)
    .innerJoin(events, eq(events.id, eventEvidence.eventId))
    .where(eq(eventEvidence.evidenceId, id));

  return {
    ...evidence,
    source,
    document,
    submitter: submitter ? { uid: submitter.uid, displayName: submitter.displayName } : null,
    verifier: verifier ? { uid: verifier.uid, displayName: verifier.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.caseFileId),
    people: peopleResult,
    organisations: organisationsResult,
    locations: locationsResult,
    events: eventsResult
  };
}

export async function createEvidence(data: any, userId: string) {
  const id = uuidv4();
  
  let sourceId = data.sourceId;
  if (!sourceId && data.source) {
    sourceId = uuidv4();
    await db.insert(sources).values({
      id: sourceId,
      ...data.source,
    });
  }

  let documentId = data.documentId;
  if (!documentId && data.document) {
    documentId = uuidv4();
    await db.insert(documents).values({
      id: documentId,
      ...data.document,
      uploadedById: userId,
    });
  }

  await db.insert(evidenceItems).values({
    id,
    title: data.title,
    description: data.description,
    type: data.type,
    stance: data.stance,
    status: 'UNVERIFIED',
    sourceId,
    documentId,
    submittedById: userId,
  });

  if (data.caseFileIds && data.caseFileIds.length > 0) {
    const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
      evidenceId: id,
      caseFileId
    }));
    await db.insert(evidenceCaseFiles).values(caseLinks);
  }

  await db.insert(evidenceAuditLogs).values({
    id: uuidv4(),
    evidenceId: id,
    userId: userId,
    action: 'SUBMITTED',
  });

  return await getEvidenceById(id);
}

export async function verifyEvidence(id: string, status: any, notes: string, userId: string) {
  await db.update(evidenceItems)
    .set({
      status,
      verifiedById: userId,
      verificationNotes: notes,
      verifiedAt: new Date()
    })
    .where(eq(evidenceItems.id, id));


  const actionMap: Record<string, any> = {
    'VERIFIED': 'VERIFIED',
    'DISPUTED': 'DISPUTED',
    'REJECTED': 'REJECTED'
  };

  const updatedEv = await getEvidenceById(id);
  if (updatedEv && updatedEv.submittedById !== userId) {
    await createNotification(
      updatedEv.submittedById,
      'CONTRIBUTION_STATUS',
      'Evidence Status Updated',
      `Your evidence "${updatedEv.title.substring(0, 30)}" was marked as ${status}.`,
      id,
      'EVIDENCE'
    ).catch(console.error);
  }

  await db.insert(evidenceAuditLogs)
.values({
    id: uuidv4(),
    evidenceId: id,
    userId: userId,
    action: actionMap[status] || 'EDITED',
    notes: notes
  });

  return await getEvidenceById(id);
}


export async function getEvidenceForEntity(entityType: 'people' | 'organisations' | 'locations', entityId: string) {
  const mapResult = (res: any[]) => res.map(r => ({
    ...r.evidence,
    source: r.source,
    document: r.document,
  }));

  let joinTable: any;
  let joinCondition: any;
  
  if (entityType === 'people') {
    const res = await db.select({
      evidence: evidenceItems,
      document: documents,
      source: sources
    }).from(evidenceItems)
      .innerJoin(evidencePeople, eq(evidenceItems.id, evidencePeople.evidenceId))
      .leftJoin(documents, eq(evidenceItems.documentId, documents.id))
      .leftJoin(sources, eq(evidenceItems.sourceId, sources.id))
      .where(and(eq(evidencePeople.personId, entityId), isNull(evidenceItems.deletedAt)));
    return mapResult(res);
  } else if (entityType === 'organisations') {
    const res = await db.select({
      evidence: evidenceItems,
      document: documents,
      source: sources
    }).from(evidenceItems)
      .innerJoin(evidenceOrganisations, eq(evidenceItems.id, evidenceOrganisations.evidenceId))
      .leftJoin(documents, eq(evidenceItems.documentId, documents.id))
      .leftJoin(sources, eq(evidenceItems.sourceId, sources.id))
      .where(and(eq(evidenceOrganisations.organisationId, entityId), isNull(evidenceItems.deletedAt)));
    return mapResult(res);
  } else if (entityType === 'locations') {
    const res = await db.select({
      evidence: evidenceItems,
      document: documents,
      source: sources
    }).from(evidenceItems)
      .innerJoin(evidenceLocations, eq(evidenceItems.id, evidenceLocations.evidenceId))
      .leftJoin(documents, eq(evidenceItems.documentId, documents.id))
      .leftJoin(sources, eq(evidenceItems.sourceId, sources.id))
      .where(and(eq(evidenceLocations.locationId, entityId), isNull(evidenceItems.deletedAt)));
    return mapResult(res);
  }
  return [];
}

export async function attachEvidenceToEntity(entityType: 'people' | 'organisations' | 'locations', entityId: string, evidenceId: string) {
  if (entityType === 'people') {
    await db.insert(evidencePeople).values({ evidenceId, personId: entityId }).onConflictDoNothing();
  } else if (entityType === 'organisations') {
    await db.insert(evidenceOrganisations).values({ evidenceId, organisationId: entityId }).onConflictDoNothing();
  } else if (entityType === 'locations') {
    await db.insert(evidenceLocations).values({ evidenceId, locationId: entityId }).onConflictDoNothing();
  }
}

export async function removeEvidenceFromEntity(entityType: 'people' | 'organisations' | 'locations', entityId: string, evidenceId: string) {
  if (entityType === 'people') {
    await db.delete(evidencePeople).where(and(eq(evidencePeople.evidenceId, evidenceId), eq(evidencePeople.personId, entityId)));
  } else if (entityType === 'organisations') {
    await db.delete(evidenceOrganisations).where(and(eq(evidenceOrganisations.evidenceId, evidenceId), eq(evidenceOrganisations.organisationId, entityId)));
  } else if (entityType === 'locations') {
    await db.delete(evidenceLocations).where(and(eq(evidenceLocations.evidenceId, evidenceId), eq(evidenceLocations.locationId, entityId)));
  }
}

export async function getEvidenceForRelationship(relationshipId: string) {
  const res = await db.select({
    evidence: evidenceItems,
    document: documents,
    source: sources
  }).from(evidenceItems)
    .innerJoin(evidenceEntityRelationships, eq(evidenceItems.id, evidenceEntityRelationships.evidenceId))
    .leftJoin(documents, eq(evidenceItems.documentId, documents.id))
    .leftJoin(sources, eq(evidenceItems.sourceId, sources.id))
    .where(and(eq(evidenceEntityRelationships.relationshipId, relationshipId), isNull(evidenceItems.deletedAt)));
  return res.map(r => ({
    ...r.evidence,
    source: r.source,
    document: r.document
  }));
}

export async function attachEvidenceToRelationship(relationshipId: string, evidenceId: string) {
  await db.insert(evidenceEntityRelationships).values({ evidenceId, relationshipId }).onConflictDoNothing();
}

export async function removeEvidenceFromRelationship(relationshipId: string, evidenceId: string) {
  await db.delete(evidenceEntityRelationships).where(and(eq(evidenceEntityRelationships.evidenceId, evidenceId), eq(evidenceEntityRelationships.relationshipId, relationshipId)));
}
