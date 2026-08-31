import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function run() {
  await db.execute(sql`
    DELETE FROM entity_relationships 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM entity_relationships 
      GROUP BY source_type, source_id, target_type, target_id, relationship_type
    );
  `);
  console.log("Deleted duplicate relationships.");
  process.exit(0);
}
run().catch(console.error);
