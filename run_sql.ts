import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`DELETE FROM reputation_events`);
  console.log("Deleted reputation events");
  process.exit(0);
}
main();
