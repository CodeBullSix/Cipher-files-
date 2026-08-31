import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

async function run() {
  const allOrgs = await db.select({ id: schema.organisations.id, name: schema.organisations.name }).from(schema.organisations);
  const caseOrgsList = await db.select({ organisationId: schema.caseOrganisations.organisationId }).from(schema.caseOrganisations);
  const caseOrgsSet = new Set(caseOrgsList.map(co => co.organisationId));
  const orphanOrgs = allOrgs.filter(o => !caseOrgsSet.has(o.id));
  console.log(`ORPHAN ORGS (${orphanOrgs.length}):`, orphanOrgs.map(o => o.name).join(', '));
  
  const allLocs = await db.select({ id: schema.locations.id, name: schema.locations.name }).from(schema.locations);
  const caseLocsList = await db.select({ locationId: schema.caseLocations.locationId }).from(schema.caseLocations);
  const caseLocsSet = new Set(caseLocsList.map(cl => cl.locationId));
  const orphanLocs = allLocs.filter(l => !caseLocsSet.has(l.id));
  console.log(`ORPHAN LOCS (${orphanLocs.length}):`, orphanLocs.map(l => l.name).join(', '));
  
  process.exit(0);
}
run().catch(console.error);
