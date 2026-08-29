import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { checkIsFollowing, followUser, unfollowUser, getFollowers, getFollowing, getFollowCounts } from '../db/follows.js';

export const followsRouter = express.Router();

followsRouter.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.uid === req.params.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    await followUser(req.user!.uid, req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

followsRouter.delete('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    await unfollowUser(req.user!.uid, req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

followsRouter.get('/:id/following', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = await getFollowing(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get following' });
  }
});

followsRouter.get('/:id/followers', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = await getFollowers(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get followers' });
  }
});

followsRouter.get('/:id/follow-status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const isFollowing = await checkIsFollowing(req.user!.uid, req.params.id);
    res.json({ isFollowing });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get follow status' });
  }
});

followsRouter.get('/:id/follow-counts', requireAuth, async (req: AuthRequest, res) => {
  try {
    const counts = await getFollowCounts(req.params.id);
    res.json(counts);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get follow counts' });
  }
});
