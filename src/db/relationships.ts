import { db } from './index.js';
import { entityRelationships, caseRelationships, users, caseFiles, people, organisations, locations } from './schema.js';
import { eq, or, and, desc, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function createRelationship(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(entityRelationships).values({
    id,
    sourceType: data.sourceType,
    sourceId: data.sourceId,
    targetType: data.targetType,
    targetId: data.targetId,
    relationshipType: data.relationshipType,
    description: data.description || null,
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    createdBy: userId,
  });

  if (data.caseFileId) {
    await db.insert(caseRelationships).values({
      caseFileId: data.caseFileId,
      relationshipId: id,
    });
  }

  return getRelationshipById(id);
}

export async function getRelationshipById(id: string) {
  const rels = await db.select().from(entityRelationships).where(eq(entityRelationships.id, id));
  if (!rels.length) return null;
  return resolveRelationshipEntities(rels[0]);
}

export async function getRelationshipsForEntity(entityType: string, entityId: string) {
  const rawRels = await db.select()
    .from(entityRelationships)
    .where(
      or(
        and(eq(entityRelationships.sourceType, entityType), eq(entityRelationships.sourceId, entityId)),
        and(eq(entityRelationships.targetType, entityType), eq(entityRelationships.targetId, entityId))
      )
    )
    .orderBy(desc(entityRelationships.createdAt));
    
  return Promise.all(rawRels.map(resolveRelationshipEntities));
}

export async function updateRelationship(id: string, data: any) {
  await db.update(entityRelationships)
    .set({
      relationshipType: data.relationshipType,
      description: data.description,
      verificationStatus: data.verificationStatus,
      updatedAt: new Date(),
    })
    .where(eq(entityRelationships.id, id));
  
  return getRelationshipById(id);
}

export async function deleteRelationship(id: string) {
  await db.delete(caseRelationships).where(eq(caseRelationships.relationshipId, id));
  await db.delete(entityRelationships).where(eq(entityRelationships.id, id));
  return true;
}

// Helper to resolve entity data dynamically
async function resolveRelationshipEntities(rel: any) {
  const [sourceEntity, targetEntity, creator, cases] = await Promise.all([
    fetchEntityData(rel.sourceType, rel.sourceId),
    fetchEntityData(rel.targetType, rel.targetId),
    db.select().from(users).where(eq(users.uid, rel.createdBy)).then(res => res[0]),
    db.select({ id: caseFiles.id, title: caseFiles.title })
      .from(caseRelationships)
      .innerJoin(caseFiles, eq(caseFiles.id, caseRelationships.caseFileId))
      .where(eq(caseRelationships.relationshipId, rel.id))
  ]);

  return {
    ...rel,
    sourceEntity,
    targetEntity,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    associatedCases: cases
  };
}

async function fetchEntityData(type: string, id: string) {
  let res;
  if (type === 'people') res = await db.select({ id: people.id, name: people.name, imageUrl: people.imageUrl }).from(people).where(eq(people.id, id));
  else if (type === 'organisations') res = await db.select({ id: organisations.id, name: organisations.name, type: organisations.type }).from(organisations).where(eq(organisations.id, id));
  else if (type === 'locations') res = await db.select({ id: locations.id, name: locations.name, type: locations.locationType }).from(locations).where(eq(locations.id, id));
  
  if (res && res.length) {
    return { ...res[0], entityType: type };
  }
  return null;
}
