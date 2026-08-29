import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../db/notifications.js';

export const notificationsRouter = express.Router();

notificationsRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const notifications = await getUserNotifications(req.user!.uid, limit);
    res.json(notifications);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

notificationsRouter.get('/unread-count', requireAuth, async (req: AuthRequest, res) => {
  try {
    const count = await getUnreadCount(req.user!.uid);
    res.json(count);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

notificationsRouter.put('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  try {
    await markAsRead(req.user!.uid, req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

notificationsRouter.put('/read-all', requireAuth, async (req: AuthRequest, res) => {
  try {
    await markAllAsRead(req.user!.uid);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});
