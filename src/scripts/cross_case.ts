import { db } from '../db/index.js';
import { entityRelationships } from '../db/schema.js';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  
  await db.insert(entityRelationships).values({
    id: uuidv4(), sourceType: 'case_files', sourceId: 'operation-mockingbird', targetType: 'case_files', targetId: 'mkultra-program', relationshipType: 'CONTEMPORANEOUS_CIA_PROGRAM', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();
  
  await db.insert(entityRelationships).values({
    id: uuidv4(), sourceType: 'case_files', sourceId: 'gary-webb-dark-alliance', targetType: 'case_files', targetId: 'operation-mockingbird', relationshipType: 'MEDIA_INFILTRATION_PARALLELS', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();

  console.log("Cross case linked via entityRelationships!");
  process.exit(0);
}
run().catch(console.error);
