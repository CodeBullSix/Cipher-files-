import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function mergeOrg(fromId: string, toId: string) {
  const fkTables = [
    {table: schema.caseOrganisations, fkField: schema.caseOrganisations.organisationId},
    {table: schema.eventOrganisations, fkField: schema.eventOrganisations.organisationId},
    {table: schema.evidenceOrganisations, fkField: schema.evidenceOrganisations.organisationId}
  ];
  for (const fkt of fkTables) {
    await db.update(fkt.table).set({ [fkt.fkField.name]: toId }).where(eq(fkt.fkField, fromId)).catch(() => {});
  }
  await db.delete(schema.organisations).where(eq(schema.organisations.id, fromId)).catch(() => {});
  console.log(`Merged org ${fromId} -> ${toId}`);
}

async function run() {
  const admin = 'seed-admin-uid';
  
  // 1. Canonicalise
  await mergeOrg('ent-aatip-2', 'node-dia'); // DIA

  // Helper to add relationship
  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(schema.entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };
  
  // Helper to associate with case
  const addPersonToCase = async (personId: string, caseId: string) => {
    await db.insert(schema.casePeople).values({ personId, caseFileId: caseId }).onConflictDoNothing();
  };
  const addOrgToCase = async (orgId: string, caseId: string) => {
    await db.insert(schema.caseOrganisations).values({ organisationId: orgId, caseFileId: caseId }).onConflictDoNothing();
  };
  const addLocToCase = async (locId: string, caseId: string) => {
    await db.insert(schema.caseLocations).values({ locationId: locId, caseFileId: caseId }).onConflictDoNothing();
  };

  // --- STARGATE ---
  const stargateId = 'project-stargate-remote-viewing';
  await addPersonToCase('ent-sta-1', stargateId); // Ingo Swann
  await addPersonToCase('ent-sta-2', stargateId); // Joseph McMoneagle
  await addRel('people', 'ent-sta-1', 'organisations', 'node-sri', 'PARTICIPATED_IN');
  await addRel('people', 'ent-sta-2', 'organisations', 'node-sri', 'PARTICIPATED_IN');
  await addRel('people', 'ent-sta-2', 'organisations', 'node-dia', 'EMPLOYED_BY');
  
  // Add Stanford Research Institute to CIA
  await addRel('organisations', 'node-sri', 'organisations', 'node-cia', 'FUNDED_BY');
  await addRel('organisations', 'node-sri', 'organisations', 'node-dia', 'FUNDED_BY');

  // Let's add Harold Puthoff & Russell Targ
  const hpId = 'node-harold-puthoff';
  await db.insert(schema.people).values({
    id: hpId, name: 'Dr. Harold Puthoff', description: 'Physicist who directed the SRI remote viewing program.', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();
  await addPersonToCase(hpId, stargateId);
  await addRel('people', hpId, 'organisations', 'node-sri', 'DIRECTED');

  const rtId = 'node-russell-targ';
  await db.insert(schema.people).values({
    id: rtId, name: 'Russell Targ', description: 'Physicist and parapsychologist who co-founded the SRI remote viewing program.', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();
  await addPersonToCase(rtId, stargateId);
  await addRel('people', rtId, 'organisations', 'node-sri', 'CO_FOUNDED');

  // A source & evidence for Stargate
  const sgSrc = 'src-stargate-cia-reading-room';
  await db.insert(schema.sources).values({
    id: sgSrc, name: 'CIA CREST Database - Stargate Files', author: 'Central Intelligence Agency', sourceType: 'OFFICIAL', reliability: 'HIGH', url: 'https://www.cia.gov/readingroom/collection/stargate'
  }).onConflictDoNothing();

  const sgEv1 = 'ev-stargate-memo';
  await db.insert(schema.evidenceItems).values({
    id: sgEv1, title: 'CIA Stargate Declassified Memos', description: 'Collection of declassified memos detailing the operational use of remote viewers.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED', sourceId: sgSrc, submittedById: admin
  }).onConflictDoNothing();
  await db.insert(schema.evidenceCaseFiles).values({ evidenceId: sgEv1, caseFileId: stargateId }).onConflictDoNothing();

  // --- RENDLESHAM ---
  const rendleshamId = 'rendlesham-forest-incident';
  const haltId = 'node-charles-halt';
  const rafWoodbridgeId = 'ent-ren-2'; // RAF Woodbridge
  const rafBentwatersId = 'node-raf-bentwaters';
  
  await addPersonToCase(haltId, rendleshamId);
  
  await db.insert(schema.locations).values({
    id: rafBentwatersId, name: 'RAF Bentwaters', description: 'Royal Air Force station used by the USAF, near Rendlesham Forest.', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();

  await addLocToCase(rafWoodbridgeId, rendleshamId);
  await addLocToCase(rafBentwatersId, rendleshamId);
  
  await addRel('people', haltId, 'locations', rafBentwatersId, 'DEPUTY_COMMANDER_AT');
  await addRel('locations', rafWoodbridgeId, 'locations', rafBentwatersId, 'NEARBY');

  const jpId = 'node-jim-penniston';
  await db.insert(schema.people).values({
    id: jpId, name: 'Jim Penniston', description: 'USAF Staff Sergeant who approached the landed craft in Rendlesham Forest.', verificationStatus: 'VERIFIED', createdBy: admin
  }).onConflictDoNothing();
  await addPersonToCase(jpId, rendleshamId);
  await addRel('people', jpId, 'locations', rafWoodbridgeId, 'STATIONED_AT');

  const renSrc = 'src-rendlesham-memo';
  await db.insert(schema.sources).values({
    id: renSrc, name: 'Halt Memo', author: 'Lt. Col. Charles Halt', sourceType: 'OFFICIAL', reliability: 'HIGH', url: 'https://www.nationalarchives.gov.uk/ufos/'
  }).onConflictDoNothing();

  const renEv1 = 'ev-halt-memo';
  await db.insert(schema.evidenceItems).values({
    id: renEv1, title: 'The Halt Memo', description: 'Official USAF memo written by Lt. Col. Halt describing the Unexplained Lights.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED', sourceId: renSrc, submittedById: admin
  }).onConflictDoNothing();
  await db.insert(schema.evidenceCaseFiles).values({ evidenceId: renEv1, caseFileId: rendleshamId }).onConflictDoNothing();

  // --- GLADIO ---
  const gladioId = 'operation-gladio';
  await addPersonToCase('ent-gla-1', gladioId); // Giulio Andreotti
  
  await addRel('people', 'ent-gla-1', 'organisations', 'node-nato', 'REVEALED_EXISTENCE_OF');
  await addRel('organisations', 'node-nato', 'organisations', 'ent-gla-3', 'COORDINATED_WITH'); // NATO Clandestine Planning -> NATO SHAPE
  await addRel('organisations', 'node-nato', 'organisations', 'node-cia', 'FUNDED_BY'); 
  await addRel('case_files', gladioId, 'organisations', 'node-cia', 'INVOLVES');
  
  // Cross case connections
  await addRel('case_files', 'operation-gladio', 'case_files', 'operation-paperclip', 'COLD_WAR_INTELLIGENCE');

  console.log("Phase 7.3 Batch 1 complete!");
  process.exit(0);
}
run().catch(console.error);
