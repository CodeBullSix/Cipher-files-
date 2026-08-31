import fs from 'fs';

const path = 'src/routes/submissions.ts';
let content = fs.readFileSync(path, 'utf8');

const transactionCode = `
    // Handle approval migration
    if (status === 'APPROVED' && submission.status !== 'APPROVED') {
      const approvedComponents = req.body.approvedComponents || {};
      
      await db.transaction(async (tx) => {
        if (submission.type === 'CASE') {
          const caseData = submission.content as any;
          
          if (approvedComponents['CASE'] !== false) {
            // Ensure case doesn't exist already
            const existingCase = await tx.select().from(require('../db/schema.js').caseFiles).where(eq(require('../db/schema.js').caseFiles.id, caseData.id)).limit(1).then((res: any[]) => res[0]);
            if (!existingCase) {
              await tx.insert(require('../db/schema.js').caseFiles).values({
                id: caseData.id,
                title: caseData.title,
                slug: caseData.id,
                summary: caseData.summary || caseData.claim,
                category: caseData.category || 'OTHER',
                status: 'DOCUMENTED',
                createdById: caseData.authorUid || submission.submittedById
              });
            }
          }
          
          // Promote Evidence
          if (caseData.evidenceList && Array.isArray(caseData.evidenceList)) {
            for (const ev of caseData.evidenceList) {
              if (approvedComponents[ev.id]) {
                const existing = await tx.select().from(require('../db/schema.js').evidenceItems).where(eq(require('../db/schema.js').evidenceItems.id, ev.id)).limit(1).then((res: any[]) => res[0]);
                if (!existing) {
                  await tx.insert(require('../db/schema.js').evidenceItems).values({
                    id: ev.id,
                    title: ev.title,
                    description: ev.summary || ev.title,
                    type: 'OTHER',
                    stance: ev.isSupporting ? 'SUPPORTING' : 'CONTRADICTING',
                    status: 'VERIFIED',
                    submittedById: caseData.authorUid || submission.submittedById,
                    verifiedById: req.user!.uid,
                    verifiedAt: new Date()
                  });
                  
                  if (approvedComponents['CASE'] !== false) {
                    await tx.insert(require('../db/schema.js').evidenceCaseFiles).values({
                      evidenceId: ev.id,
                      caseFileId: caseData.id
                    });
                  }
                }
              }
            }
          }
          
          // Promote Events
          if (caseData.timeline && Array.isArray(caseData.timeline)) {
            for (const evt of caseData.timeline) {
              if (approvedComponents[evt.id]) {
                const existing = await tx.select().from(require('../db/schema.js').events).where(eq(require('../db/schema.js').events.id, evt.id)).limit(1).then((res: any[]) => res[0]);
                if (!existing) {
                  await tx.insert(require('../db/schema.js').events).values({
                    id: evt.id,
                    title: evt.title,
                    description: evt.description || evt.title,
                    type: 'OTHER',
                    dateString: evt.date,
                    datePrecision: 'EXACT'
                  });
                  
                  if (approvedComponents['CASE'] !== false) {
                    await tx.insert(require('../db/schema.js').eventCaseFiles).values({
                      eventId: evt.id,
                      caseFileId: caseData.id
                    });
                  }
                }
              }
            }
          }
          
          // Entities & Relationships can be similarly promoted...
        }
      });
    }
`;

content = content.replace(/\/\/ Handle approval migration[\s\S]*?res\.json\(\{ success: true \}\);/, transactionCode + '\n    res.json({ success: true });');

fs.writeFileSync(path, content);
console.log("Updated submissions logic with transaction for partial approval");
