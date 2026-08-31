import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function run() {
  await db.execute(sql`
    DELETE FROM evidence_case_files 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM evidence_case_files 
      GROUP BY evidence_id, case_file_id
    );
  `);
  console.log("Deleted duplicate evidence_case_files.");
  process.exit(0);
}
run().catch(console.error);
