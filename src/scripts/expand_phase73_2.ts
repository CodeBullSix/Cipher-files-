import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, ilike } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  const admin = 'seed-admin-uid';
  
  const addPersonToCase = async (personId: string, caseId: string) => {
    await db.insert(schema.casePeople).values({ personId, caseFileId: caseId }).onConflictDoNothing();
  };
  
  const addRel = async (sT: string, sI: string, tT: string, tI: string, rT: string) => {
    await db.insert(schema.entityRelationships).values({
      id: uuidv4(), sourceType: sT, sourceId: sI, targetType: tT, targetId: tI, relationshipType: rT, verificationStatus: 'VERIFIED', createdBy: admin
    }).onConflictDoNothing();
  };

  const p = async (namePart: string) => {
    const res = await db.query.people.findFirst({ where: ilike(schema.people.name, `%${namePart}%`) });
    return res?.id;
  };

  const elizondo = await p('Elizondo');
  if (elizondo) {
    await addPersonToCase(elizondo, 'aatip-pentagon-uap');
    await addRel('people', elizondo, 'organisations', 'node-dia', 'EMPLOYED_BY');
  }

  const snowden = await p('Snowden');
  if (snowden) {
    await addPersonToCase(snowden, 'nsa-tao-surveillance');
    await addRel('people', snowden, 'organisations', 'node-nsa', 'CONTRACTOR_FOR');
    await addRel('people', snowden, 'organisations', 'node-cia', 'CONTRACTOR_FOR');
  }

  const olson = await p('Frank Olson');
  if (olson) {
    await addPersonToCase(olson, 'mkultra-program');
    await addRel('people', olson, 'organisations', 'node-cia', 'EMPLOYED_BY');
  }

  const lemnitzer = await p('Lemnitzer');
  if (lemnitzer) {
    await addPersonToCase(lemnitzer, 'operation-northwoods');
    await addRel('people', lemnitzer, 'organisations', 'node-dod', 'CHAIRMAN_JOINT_CHIEFS');
  }

  const mcnamara = await p('McNamara');
  if (mcnamara) {
    await addPersonToCase(mcnamara, 'gulf-of-tonkin-1964');
    await addRel('people', mcnamara, 'organisations', 'node-dod', 'SECRETARY_OF_DEFENSE');
  }

  const marcel = await p('Jesse Marcel');
  const ramey = await p('Roger Ramey');
  if (marcel) await addPersonToCase(marcel, 'roswell-incident-1947');
  if (ramey) await addPersonToCase(ramey, 'roswell-incident-1947');
  
  const ross = await p('Freeway Ricky Ross');
  const blandon = await p('Danilo Blandon');
  const north = await p('Oliver North');
  if (ross) await addPersonToCase(ross, 'gary-webb-dark-alliance');
  if (blandon) {
    await addPersonToCase(blandon, 'gary-webb-dark-alliance');
    await addRel('people', blandon, 'organisations', 'node-cia', 'ASSET');
  }
  if (north) await addPersonToCase(north, 'gary-webb-dark-alliance');

  console.log("Phase 7.3 Batch 2 complete!");
  process.exit(0);
}
run().catch(console.error);
