import { db } from '../db/index.js';
import { people, organisations, locations, casePeople, caseOrganisations, caseLocations, eventPeople, eventOrganisations, eventLocations, evidencePeople, evidenceOrganisations, evidenceLocations, workspaceConnections } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';

async function processTable(table: any, idField: any, nameField: any, fkTables: {table: any, fkField: any}[]) {
  const records = await db.select().from(table);
  const byName = new Map<string, any[]>();
  for (const r of records) {
    if (!byName.has(r.name)) byName.set(r.name, []);
    byName.get(r.name)!.push(r);
  }

  for (const [name, matches] of byName.entries()) {
    if (matches.length > 1) {
      // canonical is the one with 'node-' prefix if available, else first
      let canonical = matches.find(m => m.id.startsWith('node-'));
      if (!canonical) canonical = matches[0];
      
      console.log(`Canonicalising ${name} to ${canonical.id}`);
      
      const toMerge = matches.filter(m => m.id !== canonical!.id);
      for (const m of toMerge) {
        // update FKs
        for (const fkt of fkTables) {
          await db.update(fkt.table).set({ [fkt.fkField.name]: canonical.id }).where(eq(fkt.fkField, m.id)).catch(() => {}); // ignore conflicts
        }
        
        // now delete duplicate
        await db.delete(table).where(eq(idField, m.id)).catch(e => console.error(`Failed to delete ${m.id}`, e));
      }
    }
  }
}

async function run() {
  await processTable(people, people.id, people.name, [
    {table: casePeople, fkField: casePeople.personId},
    {table: eventPeople, fkField: eventPeople.personId},
    {table: evidencePeople, fkField: evidencePeople.personId},
  ]);
  
  await processTable(organisations, organisations.id, organisations.name, [
    {table: caseOrganisations, fkField: caseOrganisations.organisationId},
    {table: eventOrganisations, fkField: eventOrganisations.organisationId},
    {table: evidenceOrganisations, fkField: evidenceOrganisations.organisationId},
  ]);
  
  await processTable(locations, locations.id, locations.name, [
    {table: caseLocations, fkField: caseLocations.locationId},
    {table: eventLocations, fkField: eventLocations.locationId},
    {table: evidenceLocations, fkField: evidenceLocations.locationId},
  ]);
  
  console.log("Canonicalisation complete");
  process.exit(0);
}
run().catch(console.error);
