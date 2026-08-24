import { db } from './src/db/index.js';
import { people, casePeople } from './src/db/schema.js';
async function main() {
    console.log("People:", await db.select().from(people));
    console.log("Case People:", await db.select().from(casePeople));
}
main();
