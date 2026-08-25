const fs = require('fs');
let content = fs.readFileSync('src/db/cases.ts', 'utf8');

const getCasesFunc = `export async function getCases(query?: string, category?: string, status?: any) {
  let results = await db.query.caseFiles.findMany({
    with: {
      people: { with: { person: true } },
      organisations: { with: { organisation: true } },
      locations: { with: { location: true } }
    }
  });
  
  return results.map(result => {
    const entities = [];
    if (result.people) {
      result.people.forEach((p: any) => {
        if (p.person) entities.push({ ...p.person, type: 'PERSON', role: p.person.description || p.role });
      });
    }
    if (result.organisations) {
      result.organisations.forEach((o: any) => {
        if (o.organisation) entities.push({ ...o.organisation, type: 'ORGANISATION', role: o.organisation.description || o.role });
      });
    }
    if (result.locations) {
      result.locations.forEach((l: any) => {
        if (l.location) entities.push({ ...l.location, type: 'LOCATION', role: l.location.description || l.role });
      });
    }
    
    return { ...result, entities };
  });
}`;

content = content.replace(/export async function getCases[\s\S]*?return await q;\n\}/, getCasesFunc);
fs.writeFileSync('src/db/cases.ts', content);
