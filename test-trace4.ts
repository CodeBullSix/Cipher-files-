import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
async function check() {
  const casePeople = await db.query.casePeople.findMany();
  const caseOrgs = await db.query.caseOrganisations.findMany();
  console.log("casePeople:", casePeople);
  console.log("caseOrgs:", caseOrgs);
  process.exit(0);
}
check();
