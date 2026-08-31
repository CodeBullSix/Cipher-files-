import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;`);
  console.log("Users altered");
  process.exit(0);
}
main();
