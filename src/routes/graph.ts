import { Router } from 'express';
import { getGraphForCase, expandGraphNode, getInitialGraphNodes } from '../db/graph.js';
import { requireAuth } from '../middleware/auth.js';

export const graphRouter = Router();

graphRouter.get('/initial', async (req, res) => {
  try {
    const data = await getInitialGraphNodes();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

graphRouter.get('/case/:caseId', async (req, res) => {
  try {
    const data = await getGraphForCase(req.params.caseId);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

graphRouter.get('/expand/:nodeId', async (req, res) => {
  try {
    const data = await expandGraphNode(req.params.nodeId);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
