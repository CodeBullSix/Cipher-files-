import { db } from '../db/index.js';
import { caseFiles, people, organisations, locations, events, evidenceItems, entityRelationships, discussions } from '../db/schema.js';

async function audit() {
  const c = await db.select().from(caseFiles);
  const p = await db.select().from(people);
  const o = await db.select().from(organisations);
  const l = await db.select().from(locations);
  const e = await db.select().from(events);
  const ev = await db.select().from(evidenceItems);
  const r = await db.select().from(entityRelationships);
  const d = await db.select().from(discussions);
  
  console.log(`Cases: ${c.length}`);
  console.log(`People: ${p.length}`);
  console.log(`Organisations: ${o.length}`);
  console.log(`Locations: ${l.length}`);
  console.log(`Events: ${e.length}`);
  console.log(`Evidence: ${ev.length}`);
  console.log(`Relationships: ${r.length}`);
  console.log(`Discussions: ${d.length}`);
  
  console.log("\nCases breakdown:");
  for (const caseRec of c) {
    console.log(`- ${caseRec.id} (${caseRec.title}) - Status: ${caseRec.status}`);
  }
  
  process.exit(0);
}

audit().catch(console.error);
