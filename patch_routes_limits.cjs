const fs = require('fs');

function patchFile(file, patches) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('mutationLimiter') && !content.includes('strictLimiter')) {
    content = content.replace(
      "import type { AuthRequest } from '../middleware/auth.js';",
      "import type { AuthRequest } from '../middleware/auth.js';\nimport { mutationLimiter, strictLimiter } from '../middleware/rateLimiter.js';"
    );
    patches.forEach(p => {
      content = content.replace(p.search, p.replace);
    });
    fs.writeFileSync(file, content);
  }
}

patchFile('src/routes/appeals.ts', [
  { search: "appealsRouter.post('/', requireAuthAllowSuspended, async", replace: "appealsRouter.post('/', requireAuthAllowSuspended, strictLimiter, async" }
]);

patchFile('src/routes/reports.ts', [
  { search: "reportsRouter.post('/', requireAuth, async", replace: "reportsRouter.post('/', requireAuth, strictLimiter, async" }
]);

patchFile('src/routes/evidence.ts', [
  { search: "evidenceRouter.post('/', requireAuth, async", replace: "evidenceRouter.post('/', requireAuth, mutationLimiter, async" },
  { search: "evidenceRouter.post('/upload', requireAuth, upload.single('file')", replace: "evidenceRouter.post('/upload', requireAuth, mutationLimiter, upload.single('file')" }
]);

patchFile('src/routes/relationships.ts', [
  { search: "relationshipsRouter.post('/', requireAuth, async", replace: "relationshipsRouter.post('/', requireAuth, mutationLimiter, async" },
  { search: "relationshipsRouter.delete('/:id', requireAuth, async", replace: "relationshipsRouter.delete('/:id', requireAuth, mutationLimiter, async" }
]);

patchFile('src/routes/investigation.ts', [
  { search: "investigationRouter.post('/:type/:id/evidence', requireAuth, async", replace: "investigationRouter.post('/:type/:id/evidence', requireAuth, mutationLimiter, async" },
  { search: "investigationRouter.post('/locations', requireAuth, async", replace: "investigationRouter.post('/locations', requireAuth, mutationLimiter, async" },
  { search: "investigationRouter.post('/events', requireAuth, async", replace: "investigationRouter.post('/events', requireAuth, mutationLimiter, async" }
]);

