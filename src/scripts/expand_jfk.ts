import { db } from '../db/index.js';
import { events, eventCaseFiles, evidenceItems, evidenceCaseFiles, sources, entityRelationships, people, casePeople } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  const caseId = 'jfk-assassination';

  // Add Sources
  const src1 = 'jfk-src-1';
  await db.insert(sources).values({
    id: src1, name: 'Warren Commission Report', author: 'President\'s Commission', sourceType: 'OFFICIAL', reliability: 'HIGH', url: 'https://www.archives.gov/research/jfk/warren-commission-report'
  }).onConflictDoNothing();
  
  const src2 = 'jfk-src-2';
  await db.insert(sources).values({
    id: src2, name: 'HSCA Final Report', author: 'House Select Committee on Assassinations', sourceType: 'OFFICIAL', reliability: 'HIGH', url: 'https://www.archives.gov/research/jfk/select-committee-report'
  }).onConflictDoNothing();

  // Add Evidence
  const ev1 = 'jfk-ev-1';
  await db.insert(evidenceItems).values({
    id: ev1, title: 'Zapruder Film', description: 'Silent 8mm color motion picture sequence shot by Abraham Zapruder.', type: 'VIDEO', stance: 'CONTEXTUAL', status: 'VERIFIED', sourceId: src1, submittedById: admin
  }).onConflictDoNothing();
  await db.insert(evidenceCaseFiles).values({ evidenceId: ev1, caseFileId: caseId }).onConflictDoNothing();
  
  const ev2 = 'jfk-ev-2';
  await db.insert(evidenceItems).values({
    id: ev2, title: 'Acoustic Dictabelt Recording', description: 'Dallas Police Department radio dictabelt recording containing sounds interpreted by the HSCA as four gunshots.', type: 'AUDIO', stance: 'CONTRADICTING', status: 'VERIFIED', sourceId: src2, submittedById: admin
  }).onConflictDoNothing();
  await db.insert(evidenceCaseFiles).values({ evidenceId: ev2, caseFileId: caseId }).onConflictDoNothing();

  // Add Explicit Relationships
  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };

  await addRel('people', 'node-oswald', 'people', 'node-jfk', 'ASSASSINATED');
  await addRel('people', 'node-jack-ruby', 'people', 'node-oswald', 'KILLED');
  await addRel('people', 'node-jfk', 'locations', 'node-dealey-plaza', 'ASSASSINATED_AT');
  await addRel('people', 'node-oswald', 'locations', 'node-dealey-plaza', 'PRESENT_AT');
  
  console.log("JFK Expanded!");
  process.exit(0);
}
run().catch(console.error);
