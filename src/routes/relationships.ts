import { Router, Request, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import * as RelationshipsDB from '../db/relationships.js';
import { entityRelationships } from '../db/schema.js';
import { db } from '../db/index.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { sourceType, sourceId, targetType, targetId, relationshipType } = req.body;
    if (!sourceType || !sourceId || !targetType || !targetId || !relationshipType) {
      return res.status(400).json({ error: 'Missing required relationship fields' });
    }
    
    // Check duplicates
    const existing = await db.select().from(entityRelationships).where(
      eq(entityRelationships.sourceType, sourceType)
    );
    const isDuplicate = existing.find(e => 
      e.sourceId === sourceId && e.targetType === targetType && e.targetId === targetId && e.relationshipType === relationshipType
    );
    if (isDuplicate) {
      return res.status(409).json({ error: 'Relationship already exists' });
    }

    const rel = await RelationshipsDB.createRelationship(req.body, req.user!.uid);
    res.status(201).json(rel);
  } catch (error: any) {
    console.error('Create relationship error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/entity/:type/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const rels = await RelationshipsDB.getRelationshipsForEntity(req.params.type, req.params.id);
    res.json(rels);
  } catch (error: any) {
    console.error('Get entity relationships error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await RelationshipsDB.getRelationshipById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    const isOwner = existing.createdBy === req.user!.uid;
    const isMod = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';
    
    if (!isOwner && !isMod) {
      return res.status(403).json({ error: 'Unauthorized to edit this relationship' });
    }

    const rel = await RelationshipsDB.updateRelationship(req.params.id, req.body);
    res.json(rel);
  } catch (error: any) {
    console.error('Update relationship error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await RelationshipsDB.getRelationshipById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    const isOwner = existing.createdBy === req.user!.uid;
    const isMod = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';
    
    if (!isOwner && !isMod) {
      return res.status(403).json({ error: 'Unauthorized to delete this relationship' });
    }

    await RelationshipsDB.deleteRelationship(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete relationship error:', error);
    res.status(500).json({ error: error.message });
  }
});

export const relationshipsRoutes = router;
