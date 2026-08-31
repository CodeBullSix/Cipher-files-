import { Router, Request } from 'express';
import { requireAuth, requireModerator, AuthRequest } from '../middleware/auth.js';
import { awardReputation } from '../db/reputation.js';
import { getEvidenceItems, getEvidenceById, createEvidence, verifyEvidence } from '../db/evidence.js';
import { db } from '../db/index.js';
import { sources, documents, evidenceItems } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { mutationLimiter } from '../middleware/rateLimiter.js';

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
    const query = req.query.query as string;
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const evidence = await getEvidenceItems({ caseFileId, query, status, page, limit });
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single evidence


// POST new evidence
router.post('/', requireAuth, mutationLimiter, async (req: AuthRequest, res) => {
  try {
    const evidence = await createEvidence(req.body, req.dbUser.uid);
    await awardReputation(req.dbUser.uid, 'CONTRIBUTED_EVIDENCE', 25, evidence.id, 'Contributed new evidence');
    res.status(201).json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST verify evidence (Moderator only)


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
router.post('/sources', requireAuth, mutationLimiter, async (req: AuthRequest, res) => {
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
      if (!(req as any).file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const storageKey = path.basename((req as any).file.filename);
      
      res.json({
        fileName: (req as any).file.originalname,
        fileType: (req as any).file.mimetype,
        fileSize: (req as any).file.size,
        storageKey: storageKey
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Download/View document
router.get('/documents/:key', requireAuth, async (req: AuthRequest, res) => {
  try {
    const safeKey = path.basename(req.params.key);
    
    const docRecords = await db.select().from(documents).where(eq(documents.storageKey, safeKey));
    if (!docRecords.length) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const document = docRecords[0];

    const evidenceList = await db.select().from(evidenceItems).where(eq(evidenceItems.documentId, document.id));
    
    let authorized = false;
    
    if (evidenceList.length > 0) {
      authorized = true;
    } else {
      if (document.uploadedById === req.dbUser!.uid || req.dbUser!.role === 'ADMIN' || req.dbUser!.role === 'MODERATOR') {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to view this document.' });
    }

    const filePath = path.join(uploadDir, safeKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File missing from storage' });
    }

    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${document.fileName || 'document'}"`);
    
    res.sendFile(filePath);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

router.post('/:id/verify', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;
    const evidence = await verifyEvidence(req.params.id, status, notes, req.dbUser.uid);
    res.json(evidence);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
