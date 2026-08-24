import { db } from './src/db/index.js';
import { people, casePeople } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
async function main() {
    let q = db.select().from(people);
    q.innerJoin(casePeople, eq(casePeople.personId, people.id));
    q.where(eq(casePeople.caseFileId, "some-id"));
    console.log(q.toSQL());
}
main();
