import { db } from '../db/index.js';
import { events, eventCaseFiles, evidenceItems, evidenceCaseFiles, sources, entityRelationships, people, casePeople } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  const caseId = 'operation-paperclip';

  const src1 = 'pap-src-1';
  await db.insert(sources).values({
    id: src1, name: 'JIOA Memo on German Scientists', publisher: 'Joint Intelligence Objectives Agency', sourceType: 'OFFICIAL', reliability: 'HIGH'
  }).onConflictDoNothing();

  const ev1 = 'pap-ev-1';
  await db.insert(evidenceItems).values({
    id: ev1, title: 'Truman\'s Initial Executive Order', description: 'Order allowing the recruitment of German scientists, strictly forbidding active Nazis.', type: 'DOCUMENT', stance: 'CONTEXTUAL', status: 'VERIFIED', sourceId: src1, submittedById: admin
  }).onConflictDoNothing();
  await db.insert(evidenceCaseFiles).values({ evidenceId: ev1, caseFileId: caseId }).onConflictDoNothing();

  const evt1 = 'pap-evt-1';
  await db.insert(events).values({
    id: evt1, title: 'President Truman Authorizes Paperclip', description: 'Truman formally authorizes the recruitment program, originally called Operation Overcast.', type: 'INCIDENT', datePrecision: 'DAY', dateString: '1946-09-03', startDate: new Date('1946-09-03'), verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();
  await db.insert(eventCaseFiles).values({ eventId: evt1, caseFileId: caseId }).onConflictDoNothing();

  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };

  await addRel('people', 'node-wernher-von-braun', 'organisations', 'ent-pap-3', 'RECRUITED_BY'); // JIOA
  await addRel('people', 'ent-pap-2', 'organisations', 'ent-pap-3', 'RECRUITED_BY'); // Kurt Blome

  console.log("Paperclip Expanded!");
  process.exit(0);
}
run().catch(console.error);
