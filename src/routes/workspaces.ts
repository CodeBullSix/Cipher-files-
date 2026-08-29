import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import * as db from '../db/workspaces.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const workspaces = await db.getWorkspacesForUser(req.user!.uid);
    res.json(workspaces);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const workspace = await db.createWorkspace(req.body, req.user!.uid);
    res.json(workspace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const workspace = await db.getWorkspaceById(req.params.id, req.user!.uid);
    if (!workspace) return res.status(404).json({ error: 'Not found' });
    res.json(workspace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const workspace = await db.updateWorkspace(req.params.id, req.body, req.user!.uid);
    res.json(workspace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await db.deleteWorkspace(req.params.id, req.user!.uid);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// NOTES
router.put('/:id/notes/:noteId', async (req: AuthRequest, res) => {
  try {
    await db.updateNote(req.params.noteId, req.body.content, req.user!.uid);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REFERENCES
router.post('/:id/references', async (req: AuthRequest, res) => {
  try {
    const ref = await db.addReference(req.params.id, req.body.entityType, req.body.entityId, req.user!.uid);
    res.json(ref);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/references/:refId', async (req: AuthRequest, res) => {
  try {
    await db.removeReference(req.params.refId, req.user!.uid);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CONNECTIONS
router.post('/:id/connections', async (req: AuthRequest, res) => {
  try {
    const conn = await db.addConnection(req.params.id, req.body.sourceRefId, req.body.targetRefId, req.body.label, req.body.notes, req.user!.uid);
    res.json(conn);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/connections/:connId', async (req: AuthRequest, res) => {
  try {
    await db.updateConnection(req.params.connId, req.body.label, req.body.notes, req.user!.uid);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/connections/:connId', async (req: AuthRequest, res) => {
  try {
    await db.removeConnection(req.params.connId, req.user!.uid);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
