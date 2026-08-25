import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import { eq } from 'drizzle-orm';
async function test() {
  const people = await db.query.casePeople.findMany({ where: eq(schema.casePeople.caseFileId, "jfk-assassination") });
  console.log("People:", people);
  process.exit(0);
}
test();
