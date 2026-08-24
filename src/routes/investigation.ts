import { Router } from 'express';
import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';
import {
  getPeople, getPersonById, createPerson, updatePerson,
  getOrganisations, getOrganisationById, createOrganisation, updateOrganisation,
  getLocations, getLocationById, createLocation, updateLocation
} from '../db/investigation.js';

const router = Router();

// PEOPLE
router.get('/people', async (req, res) => {
  try {
    const query = req.query.query as string;
    const caseFileId = req.query.caseFileId as string;
    const result = await getPeople(query, caseFileId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/people/:id', async (req, res) => {
  try {
    const result = await getPersonById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/people', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await createPerson(req.body, req.dbUser.uid);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/people/:id', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const result = await updatePerson(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ORGANISATIONS
router.get('/organisations', async (req, res) => {
  try {
    const query = req.query.query as string;
    const caseFileId = req.query.caseFileId as string;
    const result = await getOrganisations(query, caseFileId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/organisations/:id', async (req, res) => {
  try {
    const result = await getOrganisationById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/organisations', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await createOrganisation(req.body, req.dbUser.uid);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/organisations/:id', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const result = await updateOrganisation(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// LOCATIONS
router.get('/locations', async (req, res) => {
  try {
    const query = req.query.query as string;
    const caseFileId = req.query.caseFileId as string;
    const result = await getLocations(query, caseFileId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/locations/:id', async (req, res) => {
  try {
    const result = await getLocationById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/locations', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await createLocation(req.body, req.dbUser.uid);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/locations/:id', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const result = await updateLocation(req.params.id, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
