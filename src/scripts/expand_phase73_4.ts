import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  
  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(schema.entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };

  await addRel('case_files', 'roswell-incident-1947', 'case_files', 'rendlesham-forest-incident', 'UAP_INCIDENTS');
  await addRel('case_files', 'project-stargate-remote-viewing', 'case_files', 'mkultra-program', 'CIA_PARAPSYCHOLOGY_RESEARCH');
  await addRel('case_files', 'operation-paperclip', 'case_files', 'mkultra-program', 'PERSONNEL_OVERLAP');
  await addRel('case_files', 'operation-northwoods', 'case_files', 'gulf-of-tonkin-1964', 'FALSE_FLAG_TACTICS');
  
  // Person -> Person
  await addRel('people', 'node-harold-puthoff', 'people', 'node-russell-targ', 'COLLABORATED_WITH');
  await addRel('people', 'node-wernher-von-braun', 'organisations', 'node-dod', 'CONSULTED_FOR');
  await addRel('organisations', 'node-nsa', 'organisations', 'node-dod', 'SUBORDINATE_TO');

  // Let's add some connections to the locations
  await addRel('organisations', 'node-dod', 'locations', 'node-pentagon', 'HEADQUARTERED_AT');
  await addRel('organisations', 'node-dia', 'locations', 'node-pentagon', 'HEADQUARTERED_AT');
  await addRel('people', 'ent-aatip-1', 'locations', 'node-pentagon', 'STATIONED_AT'); // Elizondo

  console.log("Phase 7.3 Batch 4 complete!");
  process.exit(0);
}
run().catch(console.error);
