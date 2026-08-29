import { db } from './src/db/index.js';
import { caseLocations } from './src/db/schema.js';
const rows = await db.select().from(caseLocations);
console.log(rows);
process.exit(0);
