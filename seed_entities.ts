import { db } from './src/db/index.js';
import { INITIAL_CASES } from './src/data/initialData.js';
import { people, organisations, locations, casePeople, caseOrganisations, caseLocations } from './src/db/schema.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  const adminUid = 'seed-admin-uid';
  for (const c of INITIAL_CASES) {
    if (!c.entities) continue;
    
    for (const ent of c.entities) {
      if (ent.type === 'PERSON') {
        const id = ent.id;
        await db.insert(people).values({
          id,
          name: ent.name,
          description: ent.role,
          createdBy: adminUid
        }).onConflictDoNothing();
        
        await db.insert(casePeople).values({
          caseFileId: c.id,
          personId: id
        }).onConflictDoNothing();
      } else if (ent.type === 'AGENCY' || ent.type === 'ORGANIZATION') {
        const id = ent.id;
        await db.insert(organisations).values({
          id,
          name: ent.name,
          description: ent.role,
          createdBy: adminUid
        }).onConflictDoNothing();
        
        await db.insert(caseOrganisations).values({
          caseFileId: c.id,
          organisationId: id
        }).onConflictDoNothing();
      } else if (ent.type === 'LOCATION') {
        const id = ent.id;
        await db.insert(locations).values({
          id,
          name: ent.name,
          description: ent.role,
          createdBy: adminUid
        }).onConflictDoNothing();
        
        await db.insert(caseLocations).values({
          caseFileId: c.id,
          locationId: id
        }).onConflictDoNothing();
      }
    }
  }
  console.log("Entities seeded.");
}
seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
