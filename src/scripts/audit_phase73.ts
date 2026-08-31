import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';

async function run() {
  const casesToAudit = ['project-stargate-remote-viewing', 'rendlesham-forest-incident', 'operation-gladio'];
  
  for (const caseId of casesToAudit) {
    console.log(`\n=== CASE: ${caseId} ===`);
    
    const caseRec = await db.query.caseFiles.findFirst({ where: eq(schema.caseFiles.id, caseId) });
    if (!caseRec) {
      console.log(`Not found: ${caseId}`);
      continue;
    }

    const people = await db.query.casePeople.findMany({ where: eq(schema.casePeople.caseFileId, caseId), with: { person: true } });
    console.log(`PEOPLE (${people.length}):`, people.map(p => p.person?.name).join(', '));
    
    const orgs = await db.query.caseOrganisations.findMany({ where: eq(schema.caseOrganisations.caseFileId, caseId), with: { organisation: true } });
    console.log(`ORGANISATIONS (${orgs.length}):`, orgs.map(o => o.organisation?.name).join(', '));
    
    const locs = await db.query.caseLocations.findMany({ where: eq(schema.caseLocations.caseFileId, caseId), with: { location: true } });
    console.log(`LOCATIONS (${locs.length}):`, locs.map(l => l.location?.name).join(', '));
    
    const events = await db.query.eventCaseFiles.findMany({ where: eq(schema.eventCaseFiles.caseFileId, caseId), with: { event: true } });
    console.log(`EVENTS (${events.length}):`, events.map(e => e.event?.title).join(', '));
    
    const evidence = await db.query.evidenceCaseFiles.findMany({ where: eq(schema.evidenceCaseFiles.caseFileId, caseId), with: { evidenceItem: true } });
    console.log(`EVIDENCE (${evidence.length}):`, evidence.map(e => e.evidenceItem?.title).join(', '));
  }
  
  console.log("\n=== ORPHAN CHECK ===");
  // Quick orphan check for people
  const allPeople = await db.select({ id: schema.people.id, name: schema.people.name }).from(schema.people);
  const casePeopleList = await db.select({ personId: schema.casePeople.personId }).from(schema.casePeople);
  const casePeopleSet = new Set(casePeopleList.map(cp => cp.personId));
  const orphanPeople = allPeople.filter(p => !casePeopleSet.has(p.id));
  console.log(`ORPHAN PEOPLE (${orphanPeople.length}):`, orphanPeople.slice(0, 10).map(p => p.name).join(', '));
  
  process.exit(0);
}
run().catch(console.error);
