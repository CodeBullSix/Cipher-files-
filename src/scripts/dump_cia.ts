import { db } from '../db/index.js';
import { caseOrganisations, caseFiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function run() {
  const rels = await db.select().from(caseOrganisations).where(eq(caseOrganisations.organisationId, 'node-cia'));
  const casesIds = rels.map(r => r.caseFileId);
  const cases = await db.query.caseFiles.findMany({ where: (c, { inArray }) => inArray(c.id, casesIds) });
  console.log("Cases CIA is linked to:", cases.map(c => c.id).join(', '));
  process.exit(0);
}
run().catch(console.error);
