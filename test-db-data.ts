import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';

async function check() {
  const p = await db.query.people.findMany({limit: 5});
  const o = await db.query.organisations.findMany({limit: 5});
  const rels = await db.query.entityRelationships.findMany({limit: 5});
  const casePeople = await db.query.casePeople.findMany({limit: 5});
  const caseOrgs = await db.query.caseOrganisations.findMany({limit: 5});
  console.log({ 
    people: p.length, 
    orgs: o.length, 
    rels: rels.length, 
    casePeople: casePeople.length, 
    caseOrgs: caseOrgs.length 
  });
  
  if (p.length > 0 && o.length > 0) {
     console.log('Testing path from', p[0].id, 'to', o[0].id);
  }
  
  process.exit(0);
}
check();
