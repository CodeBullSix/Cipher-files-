const fs = require('fs');
const file = 'src/middleware/auth.ts';
let content = fs.readFileSync(file, 'utf8');

// Add requireAuthAllowSuspended
const newMiddleware = `
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
`;

content = content + newMiddleware;
fs.writeFileSync(file, content);
