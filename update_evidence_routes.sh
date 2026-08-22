cat << 'INNER_EOF' > src/routes/evidence.ts
import { Router, Request } from 'express';
import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';
import { getEvidenceItems, getEvidenceById, createEvidence, verifyEvidence } from '../db/evidence.js';
import { db } from '../db/index.js';
import { sources, documents } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const router = Router();

// Mock S3 setup - using local file system for now as requested
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }
    cb(null, true);
  }
});

// GET all evidence
router.get('/', async (req, res) => {
  try {
    const caseFileId = req.query.caseFileId as string;
    const evidence = await getEvidenceItems(caseFileId);
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single evidence
router.get('/:id', async (req, res) => {
  try {
    const evidence = await getEvidenceById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new evidence
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const evidence = await createEvidence(req.body, req.dbUser.uid);
    res.status(201).json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST verify evidence (Moderator only)
router.post('/:id/verify', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;
    const evidence = await verifyEvidence(req.params.id, status, notes, req.dbUser.uid);
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET sources
router.get('/sources', async (req, res) => {
  try {
    const result = await db.select().from(sources);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single source
router.get('/sources/:id', async (req, res) => {
  try {
    const result = await db.select().from(sources).where(eq(sources.id, req.params.id));
    if (!result.length) return res.status(404).json({ error: 'Not found' });
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new source
router.post('/sources', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = crypto.randomUUID();
    const result = await db.insert(sources).values({
      id,
      ...req.body
    }).returning();
    res.status(201).json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload document
router.post('/upload', requireAuth, (req: AuthRequest, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const storageKey = path.basename(req.file.filename);
      
      res.json({
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        storageKey: storageKey
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Download/View document
router.get('/documents/:key', requireAuth, (req, res) => {
  const safeKey = path.basename(req.params.key);
  const filePath = path.join(uploadDir, safeKey);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.sendFile(filePath);
});

export default router;
INNER_EOF
