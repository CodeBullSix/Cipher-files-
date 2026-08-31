import { db } from '../db/index.js';
import { entityRelationships, caseRelationships, evidenceEntityRelationships, eventRelationships } from '../db/schema.js';

async function audit() {
  const c = await db.select().from(caseRelationships);
  const ev = await db.select().from(evidenceEntityRelationships);
  const evnt = await db.select().from(eventRelationships);
  const ent = await db.select().from(entityRelationships);

  console.log(`caseRelationships: ${c.length}`);
  console.log(`evidenceEntityRelationships: ${ev.length}`);
  console.log(`eventRelationships: ${evnt.length}`);
  console.log(`entityRelationships: ${ent.length}`);
  process.exit(0);
}

audit().catch(console.error);
