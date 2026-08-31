import fs from 'fs';

const path = 'src/routes/submissions.ts';
let content = fs.readFileSync(path, 'utf8');

const relationshipPromotionCode = `
          // Promote Relationships
          if (caseData.relationships && Array.isArray(caseData.relationships)) {
            for (const rel of caseData.relationships) {
              if (approvedComponents[rel.id]) {
                const schema = require('../db/schema.js');
                if (schema.entityRelationships) {
                  const existing = await tx.select().from(schema.entityRelationships).where(eq(schema.entityRelationships.id, rel.id)).limit(1).then((res: any[]) => res[0]);
                  if (!existing) {
                    await tx.insert(schema.entityRelationships).values({
                      id: rel.id,
                      sourceEntityId: rel.sourceEntityId,
                      targetEntityId: rel.targetEntityId,
                      relationshipType: rel.relationshipType,
                      description: rel.description
                    });
                  }
                }
              }
            }
          }
`;

content = content.replace(/\/\/ Promote Documents/, relationshipPromotionCode + "\n          // Promote Documents");

fs.writeFileSync(path, content);
console.log("Fixed relationships promotion logic");
