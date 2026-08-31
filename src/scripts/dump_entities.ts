import { db } from '../db/index.js';
import { people, organisations, locations, caseFiles } from '../db/schema.js';

async function run() {
  const p = await db.select().from(people);
  const o = await db.select().from(organisations);
  const l = await db.select().from(locations);
  const c = await db.select().from(caseFiles);

  console.log("=== PEOPLE ===");
  p.forEach(x => console.log(`${x.id}: ${x.name}`));

  console.log("\n=== ORGS ===");
  o.forEach(x => console.log(`${x.id}: ${x.name}`));

  console.log("\n=== LOCS ===");
  l.forEach(x => console.log(`${x.id}: ${x.name}`));

  process.exit(0);
}
run().catch(console.error);
