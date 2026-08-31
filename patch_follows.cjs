const fs = require('fs');

let file = 'src/routes/follows.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('mutationLimiter')) {
  content = content.replace(
    "import { checkIsFollowing, followUser, unfollowUser, getFollowers, getFollowing, getFollowCounts } from '../db/follows.js';",
    "import { checkIsFollowing, followUser, unfollowUser, getFollowers, getFollowing, getFollowCounts } from '../db/follows.js';\nimport { mutationLimiter } from '../middleware/rateLimiter.js';"
  );
  
  content = content.replace(
    "followsRouter.post('/:id/follow', requireAuth, async",
    "followsRouter.post('/:id/follow', requireAuth, mutationLimiter, async"
  );
  
  content = content.replace(
    "followsRouter.delete('/:id/follow', requireAuth, async",
    "followsRouter.delete('/:id/follow', requireAuth, mutationLimiter, async"
  );
  
  fs.writeFileSync(file, content);
}
