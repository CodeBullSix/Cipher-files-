import { db } from './src/db/index.js';
import { caseFiles, people, organisations, locations, events, evidenceItems, sources, entityRelationships } from './src/db/schema.js';
import { sql, eq } from 'drizzle-orm';

async function run() {
  const casesCount = await db.select({ count: sql<number>`count(*)` }).from(caseFiles);
  const peopleCount = await db.select({ count: sql<number>`count(*)` }).from(people);
  const orgCount = await db.select({ count: sql<number>`count(*)` }).from(organisations);
  const locCount = await db.select({ count: sql<number>`count(*)` }).from(locations);
  const eventCount = await db.select({ count: sql<number>`count(*)` }).from(events);
  const evidenceCount = await db.select({ count: sql<number>`count(*)` }).from(evidenceItems);
  const sourcesCount = await db.select({ count: sql<number>`count(*)` }).from(sources);
  const relationshipsCount = await db.select({ count: sql<number>`count(*)` }).from(entityRelationships);

  console.log('--- CURRENT CONTENT AUDIT ---');
  console.log(`Cases: ${casesCount[0].count}`);
  console.log(`People: ${peopleCount[0].count}`);
  console.log(`Organisations: ${orgCount[0].count}`);
  console.log(`Locations: ${locCount[0].count}`);
  console.log(`Events: ${eventCount[0].count}`);
  console.log(`Evidence: ${evidenceCount[0].count}`);
  console.log(`Sources: ${sourcesCount[0].count}`);
  console.log(`Relationships: ${relationshipsCount[0].count}`);
  console.log('-----------------------------');
  
  const orgs = await db.select({name: organisations.name, id: organisations.id}).from(organisations);
  console.log('Orgs:', orgs.map(o => o.name).join(', '));
  
  const ppl = await db.select({name: people.name, id: people.id}).from(people);
  console.log('People:', ppl.map(p => p.name).join(', '));
  
  process.exit(0);
}

run().catch(console.error);
