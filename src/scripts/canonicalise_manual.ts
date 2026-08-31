import { db } from '../db/index.js';
import { organisations, locations, caseOrganisations, eventOrganisations, evidenceOrganisations, caseLocations, eventLocations, evidenceLocations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function merge(table: any, fkTables: {table: any, fkField: any}[], fromId: string, toId: string) {
  // update fks
  for (const fkt of fkTables) {
    await db.update(fkt.table).set({ [fkt.fkField.name]: toId }).where(eq(fkt.fkField, fromId)).catch(() => {});
  }
  // delete
  await db.delete(table).where(eq(table.id, fromId)).catch(e => console.error(e));
  console.log(`Merged ${fromId} -> ${toId}`);
}

async function run() {
  await merge(organisations, [
    {table: caseOrganisations, fkField: caseOrganisations.organisationId},
    {table: eventOrganisations, fkField: eventOrganisations.organisationId},
    {table: evidenceOrganisations, fkField: evidenceOrganisations.organisationId}
  ], 'ent-gla-4', 'node-cia'); // CIA -> Central Intelligence Agency (CIA)
  
  await merge(locations, [
    {table: caseLocations, fkField: caseLocations.locationId},
    {table: eventLocations, fkField: eventLocations.locationId},
    {table: evidenceLocations, fkField: evidenceLocations.locationId}
  ], 'ent-ros-4', 'node-groom-lake'); // Area 51 / Groom Lake -> Groom Lake (Area 51)
  
  process.exit(0);
}
run().catch(console.error);
