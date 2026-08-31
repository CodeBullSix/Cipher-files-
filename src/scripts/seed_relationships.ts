import { db } from '../db/index.js';
import { entityRelationships } from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

async function addRel(sT: string, sI: string, tT: string, tI: string, rT: string) {
  await db.insert(entityRelationships).values({
    id: uuidv4(),
    sourceType: sT,
    sourceId: sI,
    targetType: tT,
    targetId: tI,
    relationshipType: rT,
    verificationStatus: 'VERIFIED',
    createdBy: 'seed-admin-uid'
  }).onConflictDoNothing();
}

async function run() {
  await addRel('people', 'node-gottlieb', 'organisations', 'node-cia', 'EMPLOYED_BY');
  await addRel('people', 'node-allen-dulles', 'organisations', 'node-cia', 'DIRECTOR_OF');
  await addRel('people', 'node-gary-webb', 'organisations', 'node-cia', 'INVESTIGATED');
  await addRel('people', 'node-wernher-von-braun', 'organisations', 'node-nasa', 'EMPLOYED_BY');
  await addRel('people', 'node-oppenheimer', 'locations', 'node-bohemian-grove', 'ATTENDED');
  await addRel('people', 'node-jfk', 'locations', 'node-dealey-plaza', 'ASSASSINATED_AT');
  await addRel('people', 'node-carl-bernstein', 'organisations', 'node-cia', 'EXPOSED');
  await addRel('people', 'node-david-fravor', 'locations', 'ent-tic-2', 'STATIONED_ON'); // USS Nimitz
  await addRel('people', 'ent-ros-1', 'locations', 'node-groom-lake', 'STATIONED_AT'); // Jesse Marcel
  await addRel('people', 'node-bob-lazar', 'locations', 'node-groom-lake', 'CLAIMED_EMPLOYMENT_AT');
  await addRel('people', 'node-charles-halt', 'locations', 'ent-ren-2', 'DEPUTY_COMMANDER_AT'); // RAF Woodbridge
  
  await addRel('organisations', 'node-cia', 'organisations', 'node-dod', 'COLLABORATED_WITH');
  await addRel('organisations', 'node-dia', 'organisations', 'node-dod', 'SUBORDINATE_TO');
  
  console.log("Relationships seeded");
  process.exit(0);
}
run().catch(console.error);
