import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { ilike } from 'drizzle-orm';

async function run() {
  const addOrgToCase = async (orgSearch: string, caseId: string) => {
    const res = await db.query.organisations.findFirst({ where: ilike(schema.organisations.name, `%${orgSearch}%`) });
    if (res) {
      await db.insert(schema.caseOrganisations).values({ organisationId: res.id, caseFileId: caseId }).onConflictDoNothing();
    }
  };
  
  const addLocToCase = async (locSearch: string, caseId: string) => {
    const res = await db.query.locations.findFirst({ where: ilike(schema.locations.name, `%${locSearch}%`) });
    if (res) {
      await db.insert(schema.caseLocations).values({ locationId: res.id, caseFileId: caseId }).onConflictDoNothing();
    }
  };

  // ORGS
  await addOrgToCase('BAASS', 'aatip-pentagon-uap');
  await addOrgToCase('NSA TAO', 'nsa-tao-surveillance');
  await addOrgToCase('Cryptome', 'nsa-tao-surveillance');
  await addOrgToCase('Allan Memorial', 'mkultra-program');
  await addOrgToCase('509th Bomb', 'roswell-incident-1947');
  await addOrgToCase('Skunk Works', 'area-51-groom-lake');
  await addOrgToCase('NATO SHAPE', 'operation-gladio');
  await addOrgToCase('Bohemian Club', 'bohemian-grove-elites');
  await addOrgToCase('Cicada', 'cicada-3301');
  await addOrgToCase('New World Airport', 'denver-airport-murals');
  await addOrgToCase('Ministry of Defence', 'rendlesham-forest-incident');
  await addOrgToCase('Stanford Research', 'project-stargate-remote-viewing');
  await addOrgToCase('JIOA', 'operation-paperclip');
  await addOrgToCase('Public Health', 'tuskegee-syphilis-study');
  await addOrgToCase('Department of Defense', 'aatip-pentagon-uap');
  await addOrgToCase('Federal Aviation Administration', 'phoenix-lights-1997');

  // LOCS
  await addLocToCase('Dealey Plaza', 'jfk-assassination');
  await addLocToCase('Guantanamo Bay', 'operation-northwoods');
  await addLocToCase('Wright-Patterson', 'roswell-incident-1947');
  await addLocToCase('Kholat Syakhl', 'dyatlov-pass-incident');
  await addLocToCase('USS Eldridge', 'philadelphia-experiment');
  await addLocToCase('Monte Rio', 'bohemian-grove-elites');
  await addLocToCase('Philippine Sea', 'operation-highjump-hollow-earth');
  await addLocToCase('Little America', 'operation-highjump-hollow-earth');
  await addLocToCase('Podkamennaya', 'tunguska-event-1908');
  await addLocToCase('Elbert County', 'georgia-guidestones');
  await addLocToCase('Beinecke Library', 'voynich-manuscript');
  await addLocToCase('Endeavour', 'black-knight-satellite');
  await addLocToCase('Fort Detrick', 'mkultra-program');
  await addLocToCase('Macon County', 'tuskegee-syphilis-study');
  await addLocToCase('USS Nimitz', 'tictac-uap-nimitz-2004');
  await addLocToCase('Luke Air Force', 'phoenix-lights-1997');
  await addLocToCase('Denver International Airport', 'denver-airport-murals');

  console.log("Phase 7.3 Batch 3 complete!");
  process.exit(0);
}
run().catch(console.error);
