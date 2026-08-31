import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function run() {
  await db.execute(sql`
    DELETE FROM evidence_case_files a USING (
      SELECT MIN(ctid) as ctid, evidence_id, case_file_id
      FROM evidence_case_files 
      GROUP BY evidence_id, case_file_id HAVING COUNT(*) > 1
    ) b
    WHERE a.evidence_id = b.evidence_id AND a.case_file_id = b.case_file_id AND a.ctid <> b.ctid;
  `);
  console.log("Deleted duplicate evidence_case_files using ctid.");
  process.exit(0);
}
run().catch(console.error);
