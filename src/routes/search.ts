import { Router } from 'express';

import { globalSearch } from '../db/search.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const query = (req.query.q as string) || '';
    const types = req.query.types ? (req.query.types as string).split(',') : undefined;
    const status = req.query.status ? (req.query.status as string).split(',') : undefined;
    const caseId = req.query.caseId as string;
    
    const results = await globalSearch({ query, types, status, caseId });
    res.json({ results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
