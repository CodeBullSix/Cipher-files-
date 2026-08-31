import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function run() {
  const file = fs.readFileSync('drizzle/0004_community_submissions.sql', 'utf8');
  const statements = file.split('--> statement-breakpoint');
  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await db.execute(sql.raw(stmt));
      } catch (e: any) {
        console.error("Failed to execute:", stmt, "\nError:", e);
      }
    }
  }
  console.log("Migration applied.");
  process.exit(0);
}
run().catch(console.error);
