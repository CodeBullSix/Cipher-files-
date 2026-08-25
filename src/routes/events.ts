import { Router } from 'express';
import { getEventById, createEvent, updateEvent, deleteEvent, getEventsForEntity, attachEventToEntity, attachEvidenceToEvent, removeEvidenceFromEvent } from '../db/events.js';

export const eventsRouter = Router();

// Middleware to mock auth for now (or import real auth)
import { requireAuth } from '../middleware/auth.js';

eventsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const event = await createEvent(req.body, (req as any).user!.uid);
    // If entity context was provided, attach it
    if (req.body.entityType && req.body.entityId) {
      await attachEventToEntity(req.body.entityType, req.body.entityId, event!.id);
    }
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

eventsRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get event' });
  }
});

eventsRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const event = await updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

eventsRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Entity specific events
eventsRouter.get('/entity/:type/:id', requireAuth, async (req, res) => {
  try {
    const events = await getEventsForEntity(req.params.type, req.params.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get events' });
  }
});

eventsRouter.post('/:id/evidence', requireAuth, async (req, res) => {
  try {
    const { evidenceId } = req.body;
    await attachEvidenceToEvent(req.params.id, evidenceId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to attach evidence' });
  }
});

eventsRouter.delete('/:id/evidence/:evidenceId', requireAuth, async (req, res) => {
  try {
    await removeEvidenceFromEvent(req.params.id, req.params.evidenceId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove evidence' });
  }
});
