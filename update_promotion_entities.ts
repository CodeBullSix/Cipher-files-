import fs from 'fs';

const path = 'src/routes/submissions.ts';
let content = fs.readFileSync(path, 'utf8');

const entityPromotionCode = `
          // Promote Entities
          if (caseData.entities && Array.isArray(caseData.entities)) {
            for (const ent of caseData.entities) {
              if (approvedComponents[ent.id]) {
                const existing = await tx.select().from(require('../db/schema.js').entities).where(eq(require('../db/schema.js').entities.id, ent.id)).limit(1).then((res: any[]) => res[0]);
                if (!existing) {
                  await tx.insert(require('../db/schema.js').entities).values({
                    id: ent.id,
                    name: ent.name,
                    type: ent.type,
                    description: ent.description || ent.name,
                    status: 'VERIFIED'
                  });
                  
                  if (approvedComponents['CASE'] !== false) {
                    await tx.insert(require('../db/schema.js').entityCaseFiles).values({
                      entityId: ent.id,
                      caseFileId: caseData.id
                    });
                  }
                }
              }
            }
          }
          
          // Promote Documents
          if (caseData.documents && Array.isArray(caseData.documents)) {
            for (const doc of caseData.documents) {
              if (approvedComponents[doc.id]) {
                const existing = await tx.select().from(require('../db/schema.js').documents).where(eq(require('../db/schema.js').documents.id, doc.id)).limit(1).then((res: any[]) => res[0]);
                if (!existing) {
                  await tx.insert(require('../db/schema.js').documents).values({
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
`;

content = content.replace(/\/\/ Entities & Relationships can be similarly promoted\.\.\./, entityPromotionCode);

fs.writeFileSync(path, content);
console.log("Updated submissions logic with entities and documents promotion");
