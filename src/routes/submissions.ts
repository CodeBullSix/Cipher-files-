import { Router } from 'express';
import { db } from '../db/index.js';
import { communitySubmissions } from '../db/schema.js';
import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const submissionsRouter = Router();

// Get all submissions (moderators only)
submissionsRouter.get('/', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const subs = await db.select().from(communitySubmissions).orderBy(desc(communitySubmissions.createdAt));
    res.json({ submissions: subs });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get my submissions
submissionsRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const subs = await db.select().from(communitySubmissions).where(eq(communitySubmissions.submittedById, req.user!.uid)).orderBy(desc(communitySubmissions.createdAt));
    res.json({ submissions: subs });
  } catch (err) {
    console.error('Error fetching my submissions:', err);
    res.status(500).json({ error: 'Failed to fetch your submissions' });
  }
});

// Create a new submission
submissionsRouter.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, summary, type, content } = req.body;
    
    if (!title || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newSubId = `sub_${uuidv4()}`;
    
    await db.insert(communitySubmissions).values({
      id: newSubId,
      type,
      title,
      summary: summary || null,
      content,
      submittedById: req.user!.uid,
      status: 'PENDING_REVIEW'
    });
    
    res.json({ success: true, id: newSubId });
  } catch (err) {
    console.error('Error creating submission:', err);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Update submission status (moderator only)
submissionsRouter.patch('/:id/status', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const { id } = req.params;
    
    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }
    
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
}
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating submission:', err);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

