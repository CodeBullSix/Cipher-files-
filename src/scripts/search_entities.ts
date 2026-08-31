import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { ilike } from 'drizzle-orm';

async function run() {
  const terms = ['Targ', 'Puthoff', 'Geller', 'Swann', 'McMoneagle', 'Elizondo', 'Penniston', 'Burroughs', 'Andreotti', 'Vinciguerra', 'Stargate', 'Rendlesham', 'Gladio', 'SRI', 'DIA', 'CIA', 'NATO'];
  for (const term of terms) {
    const p = await db.query.people.findMany({ where: ilike(schema.people.name, `%${term}%`) });
    const o = await db.query.organisations.findMany({ where: ilike(schema.organisations.name, `%${term}%`) });
    const l = await db.query.locations.findMany({ where: ilike(schema.locations.name, `%${term}%`) });
    
    if (p.length > 0) console.log(`People matching ${term}:`, p.map(x => `${x.id}: ${x.name}`).join(', '));
    if (o.length > 0) console.log(`Orgs matching ${term}:`, o.map(x => `${x.id}: ${x.name}`).join(', '));
    if (l.length > 0) console.log(`Locs matching ${term}:`, l.map(x => `${x.id}: ${x.name}`).join(', '));
  }
  process.exit(0);
}
run().catch(console.error);
