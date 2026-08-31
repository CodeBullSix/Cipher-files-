const fs = require('fs');

let file = 'src/routes/investigation.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('mutationLimiter')) {
  content = content.replace(
    "import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';",
    "import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';\nimport { mutationLimiter } from '../middleware/rateLimiter.js';"
  );
  
  content = content.replace(
    "router.post('/people', requireAuth, async",
    "router.post('/people', requireAuth, mutationLimiter, async"
  );
  
  content = content.replace(
    "router.post('/organisations', requireAuth, async",
    "router.post('/organisations', requireAuth, mutationLimiter, async"
  );
  
  content = content.replace(
    "router.post('/locations', requireAuth, async",
    "router.post('/locations', requireAuth, mutationLimiter, async"
  );
  
  content = content.replace(
    "router.post('/:type/:id/evidence', requireAuth, async",
    "router.post('/:type/:id/evidence', requireAuth, mutationLimiter, async"
  );
  
  fs.writeFileSync(file, content);
}
