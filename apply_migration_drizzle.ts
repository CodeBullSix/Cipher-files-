import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function main() {
  const query = fs.readFileSync('drizzle/0001_warm_stranger.sql', 'utf8');
  const statements = query.split('--> statement-breakpoint');
  
  // Clear any duplicates in case_locations, etc before adding unique constraint
  await db.execute(sql`DELETE FROM case_locations;`);
  await db.execute(sql`DELETE FROM case_people;`);
  await db.execute(sql`DELETE FROM case_organisations;`);
  await db.execute(sql`DELETE FROM case_relationships;`);
  await db.execute(sql`DELETE FROM evidence_people;`);
  await db.execute(sql`DELETE FROM evidence_organisations;`);
  await db.execute(sql`DELETE FROM evidence_locations;`);
  await db.execute(sql`DELETE FROM evidence_entity_relationships;`);

  for (let s of statements) {
    if (!s.trim()) continue;
    try {
      await db.execute(sql.raw(s));
    } catch (e) {
      console.log('Error executing:', s.substring(0, 50));
      console.log('Error msg:', e.message);
    }
  }
  console.log('Done!');
  process.exit(0);
}
main();
