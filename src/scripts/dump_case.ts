import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function run(caseId: string) {
  const c = await db.query.caseFiles.findFirst({ where: eq(schema.caseFiles.id, caseId) });
  console.log("=== CASE ===");
  console.log(c?.title, c?.status);
  
  const ev = await db.query.evidenceCaseFiles.findMany({ where: eq(schema.evidenceCaseFiles.caseFileId, caseId), with: { evidenceItem: true } });
  console.log("\n=== EVIDENCE ===");
  ev.forEach(e => console.log(e.evidenceItem?.title, e.evidenceItem?.status));
  
  const p = await db.query.casePeople.findMany({ where: eq(schema.casePeople.caseFileId, caseId), with: { person: true } });
  console.log("\n=== PEOPLE ===");
  p.forEach(x => console.log(x.person?.name));
  
  const orgs = await db.query.caseOrganisations.findMany({ where: eq(schema.caseOrganisations.caseFileId, caseId), with: { organisation: true } });
  console.log("\n=== ORGS ===");
  orgs.forEach(x => console.log(x.organisation?.name));

  const locs = await db.query.caseLocations.findMany({ where: eq(schema.caseLocations.caseFileId, caseId), with: { location: true } });
  console.log("\n=== LOCS ===");
  locs.forEach(x => console.log(x.location?.name));

  const evts = await db.query.eventCaseFiles.findMany({ where: eq(schema.eventCaseFiles.caseFileId, caseId), with: { event: true } });
  console.log("\n=== EVENTS ===");
  evts.forEach(x => console.log(x.event?.title, x.event?.dateString));
  
  process.exit(0);
}
run('jfk-assassination').catch(console.error);
