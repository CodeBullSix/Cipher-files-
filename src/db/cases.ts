import { db } from './index.js';
import { caseFiles, entityRelationships } from './schema.js';
import { eq, ilike, and, or, desc } from 'drizzle-orm';

export async function getCases(query?: string, category?: string, statusFilter?: any) {
  let conditions = [];
  if (category) {
    conditions.push(eq(caseFiles.category, category));
  }
  if (statusFilter) {
    conditions.push(eq(caseFiles.status, statusFilter));
  }
  if (query) {
    conditions.push(ilike(caseFiles.title, `%${query}%`));
  }

  let results = await db.query.caseFiles.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(caseFiles.createdAt)]
  });
  
  return results.map(result => {
    return { ...result, entities: [] };
  });
}

export async function getCaseById(id: string) {
  const result = await db.query.caseFiles.findFirst({
    where: eq(caseFiles.id, id),
    with: {
      people: { with: { person: true } },
      organisations: { with: { organisation: true } },
      locations: { with: { location: true } },
      evidence: { with: { evidenceItem: true } },
      events: { with: { event: true } }
    }
  });
  
  if (!result) return null;

  // Map relations to entities array for backward compatibility
  const entities = [];
  if (result.people) {
    result.people.forEach(p => {
      if (p.person) entities.push({ ...p.person, type: 'PERSON', role: p.person.description });
    });
  }
  if (result.organisations) {
    result.organisations.forEach(o => {
      if (o.organisation) entities.push({ ...o.organisation, type: 'ORGANISATION', role: o.organisation.description });
    });
  }
  if (result.locations) {
    result.locations.forEach(l => {
      if (l.location) entities.push({ ...l.location, type: 'LOCATION', role: l.location.description });
    });
  }
  
  // Map evidenceList
  const evidenceList = [];
  if (result.evidence) {
    result.evidence.forEach(e => {
      if (e.evidenceItem) {
        evidenceList.push({
          ...e.evidenceItem,
          isSupporting: e.evidenceItem.stance === 'SUPPORTING',
          rating: e.evidenceItem.status
        });
      }
    });
  }
  
  // Find connected cases
  const caseRels = await db.query.entityRelationships.findMany({
    where: or(
      and(eq(entityRelationships.sourceType, 'case_files'), eq(entityRelationships.sourceId, id)),
      and(eq(entityRelationships.targetType, 'case_files'), eq(entityRelationships.targetId, id))
    )
  });
  
  const connectedCaseIds = new Set();
  caseRels.forEach(rel => {
    if (rel.sourceType === 'case_files' && rel.sourceId !== id) connectedCaseIds.add(rel.sourceId);
    if (rel.targetType === 'case_files' && rel.targetId !== id) connectedCaseIds.add(rel.targetId);
  });

  return {
    ...result,
    entities,
    evidenceList,
    connectedCaseIds: Array.from(connectedCaseIds)
  };
}

export async function createCase(data: any) {
  const result = await db.insert(caseFiles).values(data).returning();
  return result[0];
}

export async function updateCase(id: string, data: any) {
  const result = await db.update(caseFiles).set(data).where(eq(caseFiles.id, id)).returning();
  return result[0];
}
