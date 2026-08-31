import { db } from '../db/index.js';
import { entityRelationships } from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  
  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };

  await addRel('case_files', 'aatip-pentagon-uap', 'case_files', 'tictac-uap-nimitz-2004', 'INVESTIGATED_BY_PROGRAM');
  await addRel('case_files', 'roswell-incident-1947', 'case_files', 'area-51-groom-lake', 'CRASH_RETRIEVAL_RUMORS');
  
  await addRel('people', 'ent-aatip-1', 'organisations', 'ent-aatip-2', 'DIRECTED_PROGRAM'); // Luis Elizondo -> DIA
  await addRel('people', 'node-david-fravor', 'locations', 'ent-tic-2', 'STATIONED_ON'); // Fravor -> Nimitz
  await addRel('people', 'ent-ros-1', 'locations', 'node-groom-lake', 'STATIONED_AT'); // Jesse Marcel
  
  console.log("UFO Cases Expanded!");
  process.exit(0);
}
run().catch(console.error);
