import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';

async function test() {
  const rels = await db.select({ id: schema.entityRelationships.id }).from(schema.entityRelationships).limit(1);
  console.log('Test OK', rels);
  process.exit(0);
}
test();
