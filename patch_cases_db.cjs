const fs = require('fs');
const content = `import { db } from './index.js';
import { caseFiles } from './schema.js';
import { eq, ilike, and } from 'drizzle-orm';

export async function getCases(query?: string, category?: string, status?: any) {
  let q = db.query.caseFiles.findMany({
    with: {
      people: { with: { person: true } },
      organisations: { with: { organisation: true } },
      locations: { with: { location: true } }
    }
  });
  return await q;
}

export async function getCaseById(id: string) {
  const result = await db.query.caseFiles.findFirst({
    where: eq(caseFiles.id, id),
    with: {
      people: { with: { person: true } },
      organisations: { with: { organisation: true } },
      locations: { with: { location: true } }
    }
  });
  
  if (result) {
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
    (result as any).entities = entities;
  }
  
  return result;
}

export async function createCase(data: any) {
  const result = await db.insert(caseFiles).values(data).returning();
  return result[0];
}

export async function updateCase(id: string, data: any) {
  const result = await db.update(caseFiles).set(data).where(eq(caseFiles.id, id)).returning();
  return result[0];
}
`;
fs.writeFileSync('src/db/cases.ts', content);
