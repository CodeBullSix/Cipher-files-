import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function main() {
  await db.execute(sql`DELETE FROM evidence_people;`);
  await db.execute(sql`DELETE FROM evidence_organisations;`);
  await db.execute(sql`DELETE FROM evidence_locations;`);
  await db.execute(sql`DELETE FROM evidence_entity_relationships;`);
  console.log('Deleted.');
  process.exit(0);
}
main();
