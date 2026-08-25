import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';
async function main() {
  const r = await db.execute(sql`SELECT count(*) FROM events;`);
  console.log(r);
  process.exit(0);
}
main();
