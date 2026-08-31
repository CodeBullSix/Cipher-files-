const fs = require('fs');
let content = fs.readFileSync('src/routes/reports.ts', 'utf8');
if (!content.includes('strictLimiter }')) {
  content = content.replace(
    "import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';",
    "import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';\nimport { strictLimiter } from '../middleware/rateLimiter.js';"
  );
  fs.writeFileSync('src/routes/reports.ts', content);
}
