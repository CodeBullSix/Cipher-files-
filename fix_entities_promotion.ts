import fs from 'fs';

const path = 'src/routes/submissions.ts';
let content = fs.readFileSync(path, 'utf8');

const entityPromotionCode = `
          // Promote Entities (People, Organisations, Locations)
          if (caseData.entities && Array.isArray(caseData.entities)) {
            for (const ent of caseData.entities) {
              if (approvedComponents[ent.id]) {
                const schema = require('../db/schema.js');
                
                let targetTable;
                if (ent.type === 'PERSON') targetTable = schema.people;
                else if (ent.type === 'ORGANISATION' || ent.type === 'AGENCY') targetTable = schema.organisations;
                else if (ent.type === 'LOCATION') targetTable = schema.locations;
                
                if (targetTable) {
                  const existing = await tx.select().from(targetTable).where(eq(targetTable.id, ent.id)).limit(1).then((res: any[]) => res[0]);
                  if (!existing) {
                    await tx.insert(targetTable).values({
                      id: ent.id,
                      name: ent.name,
                      description: ent.description || ent.name,
                      // We can omit status if it's not defined in all tables, or we just rely on defaults
                    });
                    
                    // We don't have entityCaseFiles out of the box in this snippet, skip relation for now or use the canonical relations table if one exists
                  }
                }
              }
            }
          }
          
          // Promote Documents
          if (caseData.documents && Array.isArray(caseData.documents)) {
            for (const doc of caseData.documents) {
              if (approvedComponents[doc.id]) {
                const schema = require('../db/schema.js');
                if (schema.documents) {
                  const existing = await tx.select().from(schema.documents).where(eq(schema.documents.id, doc.id)).limit(1).then((res: any[]) => res[0]);
                  if (!existing) {
                    await tx.insert(schema.documents).values({
                      id: doc.id,
                      title: doc.title,
                      summary: doc.summary,
                      classificationLevel: doc.classificationLevel || 'PUBLIC RECORD',
                      originAgency: doc.originAgency || 'Unknown',
                      dateCreated: doc.dateCreated || new Date().toISOString()
                    });
                  }
                }
              }
            }
          }
`;

content = content.replace(/\/\/ Promote Entities[\s\S]*?(?=\}\n      \}\);\n    \})/g, entityPromotionCode);

fs.writeFileSync(path, content);
console.log("Fixed entities promotion logic");
