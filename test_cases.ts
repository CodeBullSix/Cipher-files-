import { db } from './src/db/index.js';
import { caseFiles } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
async function main() {
    console.log(await db.select().from(caseFiles));
}
main();
