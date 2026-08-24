import { db } from './index.js';
import { 
  people, organisations, locations, 
  casePeople, caseOrganisations, caseLocations,
  users,
  caseFiles
} from './schema.js';
import { eq, ilike, and, or, desc, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function getPeople(query?: string, caseFileId?: string) {
  let conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(people.name, `%${query}%`),
        ilike(people.aliases, `%${query}%`)
      )
    );
  }
  
  let q = db.select({
    id: people.id,
    name: people.name,
    aliases: people.aliases,
    description: people.description,
    imageUrl: people.imageUrl,
    verificationStatus: people.verificationStatus,
    createdAt: people.createdAt,
    updatedAt: people.updatedAt,
    createdBy: people.createdBy
  }).from(people);
  
  if (caseFileId) {
    q = q.innerJoin(casePeople, eq(casePeople.personId, people.id)) as any
    conditions.push(eq(casePeople.caseFileId, caseFileId));
  }
  
  if (conditions.length > 0) {
    q.where(and(...conditions));
  }
  
  return await q.orderBy(desc(people.createdAt));
}

export async function getPersonById(id: string) {
  const result = await db.select().from(people).where(eq(people.id, id));
  if (!result.length) return null;
  const person = result[0];
  
  const creator = (await db.select().from(users).where(eq(users.uid, person.createdBy)))[0];
  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(casePeople)
  .innerJoin(caseFiles, eq(caseFiles.id, casePeople.caseFileId))
  .where(eq(casePeople.personId, id));
  
  return {
    ...person,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };
}

export async function createPerson(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(people).values({
    id,
    name: data.name,
    aliases: data.aliases || null,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    createdBy: userId,
  });
  
  if (data.caseFileIds && data.caseFileIds.length > 0) {
    const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
      caseFileId,
      personId: id
    }));
    await db.insert(casePeople).values(caseLinks);
  }
  
  return await getPersonById(id);
}

export async function updatePerson(id: string, data: any) {
  await db.update(people).set({
    name: data.name,
    aliases: data.aliases,
    description: data.description,
    imageUrl: data.imageUrl,
    verificationStatus: data.verificationStatus,
    updatedAt: new Date()
  }).where(eq(people.id, id));
  
  if (data.caseFileIds !== undefined) {
    await db.delete(casePeople).where(eq(casePeople.personId, id));
    if (data.caseFileIds.length > 0) {
      const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
        caseFileId,
        personId: id
      }));
      await db.insert(casePeople).values(caseLinks);
    }
  }
  
  return await getPersonById(id);
}

// Organisations
export async function getOrganisations(query?: string, caseFileId?: string) {
  let conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(organisations.name, `%${query}%`),
        ilike(organisations.aliases, `%${query}%`)
      )
    );
  }
  
  let q = db.select({
    id: organisations.id,
    name: organisations.name,
    aliases: organisations.aliases,
    description: organisations.description,
    type: organisations.type,
    verificationStatus: organisations.verificationStatus,
    createdAt: organisations.createdAt,
    updatedAt: organisations.updatedAt,
    createdBy: organisations.createdBy
  }).from(organisations);
  
  if (caseFileId) {
    q = q.innerJoin(caseOrganisations, eq(caseOrganisations.organisationId, organisations.id)) as any
    conditions.push(eq(caseOrganisations.caseFileId, caseFileId));
  }
  
  if (conditions.length > 0) {
    q.where(and(...conditions));
  }
  
  return await q.orderBy(desc(organisations.createdAt));
}

export async function getOrganisationById(id: string) {
  const result = await db.select().from(organisations).where(eq(organisations.id, id));
  if (!result.length) return null;
  const org = result[0];
  
  const creator = (await db.select().from(users).where(eq(users.uid, org.createdBy)))[0];
  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(caseOrganisations)
  .innerJoin(caseFiles, eq(caseFiles.id, caseOrganisations.caseFileId))
  .where(eq(caseOrganisations.organisationId, id));
  
  return {
    ...org,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };
}

export async function createOrganisation(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(organisations).values({
    id,
    name: data.name,
    aliases: data.aliases || null,
    description: data.description || null,
    type: data.type || null,
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    createdBy: userId,
  });
  
  if (data.caseFileIds && data.caseFileIds.length > 0) {
    const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
      caseFileId,
      organisationId: id
    }));
    await db.insert(caseOrganisations).values(caseLinks);
  }
  
  return await getOrganisationById(id);
}

export async function updateOrganisation(id: string, data: any) {
  await db.update(organisations).set({
    name: data.name,
    aliases: data.aliases,
    description: data.description,
    type: data.type,
    verificationStatus: data.verificationStatus,
    updatedAt: new Date()
  }).where(eq(organisations.id, id));
  
  if (data.caseFileIds !== undefined) {
    await db.delete(caseOrganisations).where(eq(caseOrganisations.organisationId, id));
    if (data.caseFileIds.length > 0) {
      const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
        caseFileId,
        organisationId: id
      }));
      await db.insert(caseOrganisations).values(caseLinks);
    }
  }
  
  return await getOrganisationById(id);
}

// Locations
export async function getLocations(query?: string, caseFileId?: string) {
  let conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(locations.name, `%${query}%`),
        ilike(locations.description, `%${query}%`)
      )
    );
  }
  
  let q = db.select({
    id: locations.id,
    name: locations.name,
    locationType: locations.locationType,
    description: locations.description,
    country: locations.country,
    coordinates: locations.coordinates,
    verificationStatus: locations.verificationStatus,
    createdAt: locations.createdAt,
    updatedAt: locations.updatedAt,
    createdBy: locations.createdBy
  }).from(locations);
  
  if (caseFileId) {
    q = q.innerJoin(caseLocations, eq(caseLocations.locationId, locations.id)) as any
    conditions.push(eq(caseLocations.caseFileId, caseFileId));
  }
  
  if (conditions.length > 0) {
    q.where(and(...conditions));
  }
  
  return await q.orderBy(desc(locations.createdAt));
}

export async function getLocationById(id: string) {
  const result = await db.select().from(locations).where(eq(locations.id, id));
  if (!result.length) return null;
  const loc = result[0];
  
  const creator = (await db.select().from(users).where(eq(users.uid, loc.createdBy)))[0];
  const caseFilesResult = await db.select({ 
    id: caseFiles.id, 
    title: caseFiles.title 
  })
  .from(caseLocations)
  .innerJoin(caseFiles, eq(caseFiles.id, caseLocations.caseFileId))
  .where(eq(caseLocations.locationId, id));
  
  return {
    ...loc,
    creator: creator ? { uid: creator.uid, displayName: creator.displayName } : null,
    caseFileIds: caseFilesResult.map(c => c.id),
    associatedCases: caseFilesResult
  };
}

export async function createLocation(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(locations).values({
    id,
    name: data.name,
    locationType: data.locationType || null,
    description: data.description || null,
    country: data.country || null,
    coordinates: data.coordinates || null,
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    createdBy: userId,
  });
  
  if (data.caseFileIds && data.caseFileIds.length > 0) {
    const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
      caseFileId,
      locationId: id
    }));
    await db.insert(caseLocations).values(caseLinks);
  }
  
  return await getLocationById(id);
}

export async function updateLocation(id: string, data: any) {
  await db.update(locations).set({
    name: data.name,
    locationType: data.locationType,
    description: data.description,
    country: data.country,
    coordinates: data.coordinates,
    verificationStatus: data.verificationStatus,
    updatedAt: new Date()
  }).where(eq(locations.id, id));
  
  if (data.caseFileIds !== undefined) {
    await db.delete(caseLocations).where(eq(caseLocations.locationId, id));
    if (data.caseFileIds.length > 0) {
      const caseLinks = data.caseFileIds.map((caseFileId: string) => ({
        caseFileId,
        locationId: id
      }));
      await db.insert(caseLocations).values(caseLinks);
    }
  }
  
  return await getLocationById(id);
}
