import fs from 'fs';
const path = 'src/routes/submissions.ts';
let content = fs.readFileSync(path, 'utf8');

const newLogic = `
    const submission = await db.select().from(communitySubmissions).where(eq(communitySubmissions.id, id)).limit(1).then(res => res[0]);
    if (!submission) return res.status(404).json({ error: 'Not found' });

    await db.update(communitySubmissions)
      .set({ 
        status, 
        reviewNotes: reviewNotes || null, 
        reviewerId: req.user!.uid,
        updatedAt: new Date()
      })
      .where(eq(communitySubmissions.id, id));
      
    // Handle approval migration
    if (status === 'APPROVED' && submission.status !== 'APPROVED') {
      if (submission.type === 'CASE') {
        const caseData = submission.content;
        
        // Ensure case doesn't exist already
        const existingCase = await db.select().from(require('../db/schema.js').caseFiles).where(eq(require('../db/schema.js').caseFiles.id, caseData.id)).limit(1).then((res: any[]) => res[0]);
        if (!existingCase) {
          // Insert case
          await db.insert(require('../db/schema.js').caseFiles).values({
            id: caseData.id,
            title: caseData.title,
            slug: caseData.id,
            summary: caseData.summary || caseData.claim,
            category: caseData.category || 'OTHER',
            status: 'DOCUMENTED',
            createdById: caseData.authorUid || submission.submittedById
          });
          
          // Optionally, we could migrate evidenceItems here as well, but this fulfills the basic approval flow safely
        }
      }
    }
    
    res.json({ success: true });
`;

content = content.replace(/await db\.update\(communitySubmissions\)[\s\S]*?res\.json\(\{ success: true \}\);/m, newLogic.trim());
fs.writeFileSync(path, content);
console.log("Updated submissions approval logic.");
