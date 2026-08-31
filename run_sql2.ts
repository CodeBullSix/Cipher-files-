import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    ALTER TYPE "moderation_action" ADD VALUE IF NOT EXISTS 'BAN';
    ALTER TYPE "moderation_action" ADD VALUE IF NOT EXISTS 'UNBAN';
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;
  `);
  console.log("SQL executed");
  process.exit(0);
}
main();
