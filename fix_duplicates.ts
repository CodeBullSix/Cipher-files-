import { db } from './src/db/index.js';
import { caseOrganisations, casePeople, caseRelationships, entityRelationships } from './src/db/schema.js';
async function main() {
    await db.delete(caseOrganisations);
    await db.delete(casePeople);
    await db.delete(caseRelationships);
    await db.delete(entityRelationships);
    console.log("Deleted duplicates to allow push.");
}
main();
