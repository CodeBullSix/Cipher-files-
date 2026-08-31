import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.js';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getOrCreateUser } from '../db/users.js';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Sync user with DB
    const email = decodedToken.email || '';
    const name = decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown';
    const dbUser = await getOrCreateUser(decodedToken.uid, email, name);
    req.dbUser = dbUser;

    if (dbUser.deletedAt) {
      return res.status(403).json({ error: 'Forbidden: Account suspended' });
    }
    
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireModerator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.dbUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.dbUser.role !== 'MODERATOR' && req.dbUser.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Requires moderation privileges' });
  }
  next();
};

export const requireAuthAllowSuspended = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    const email = decodedToken.email || '';
    const name = decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown';
    const dbUser = await getOrCreateUser(decodedToken.uid, email, name);
    req.dbUser = dbUser;
    
    // We DO NOT check dbUser.deletedAt here, allowing suspended users to access this route
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
