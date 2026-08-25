import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
async function test() {
  const cases = await db.select().from(schema.caseFiles);
  console.log("Cases:", cases.map(c => c.id));
  const people = await db.select().from(schema.people);
  console.log("People IDs:", people.map(p => p.id));
  const casePeople = await db.select().from(schema.casePeople);
  console.log("CasePeople:", casePeople);
  process.exit(0);
}
test();
