const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('apiLimiter')) {
  content = content.replace(
    "import { reportsRouter } from \"./src/routes/reports.js\";",
    "import { reportsRouter } from \"./src/routes/reports.js\";\nimport { apiLimiter, mutationLimiter, strictLimiter } from \"./src/middleware/rateLimiter.js\";"
  );
  
  content = content.replace(
    "app.use(express.json());",
    "app.use(express.json());\n\n  // Apply global rate limiting to all /api routes\n  app.use('/api/', apiLimiter);"
  );
  
  content = content.replace(
    "app.post('/api/users/me/reputation/reward', requireAuth, async (req: AuthRequest, res) => {",
    "app.post('/api/users/me/reputation/reward', requireAuth, mutationLimiter, async (req: AuthRequest, res) => {"
  );
  
  content = content.replace(
    "app.post('/api/discussions', requireAuth, async (req: AuthRequest, res) => {",
    "app.post('/api/discussions', requireAuth, mutationLimiter, async (req: AuthRequest, res) => {"
  );
  
  content = content.replace(
    "app.post('/api/discussions/:id/replies', requireAuth, async (req: AuthRequest, res) => {",
    "app.post('/api/discussions/:id/replies', requireAuth, mutationLimiter, async (req: AuthRequest, res) => {"
  );
  
  fs.writeFileSync(file, content);
}
