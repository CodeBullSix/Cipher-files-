import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import { eq } from 'drizzle-orm';
async function test() {
  const caseFile = await db.select().from(schema.caseFiles).where(eq(schema.caseFiles.id, 'jfk-assassination'));
  console.log(JSON.stringify(caseFile, null, 2));
  process.exit(0);
}
test();
