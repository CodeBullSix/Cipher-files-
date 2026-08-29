import { adminDb } from './src/lib/firebase-admin.js';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { syncRssFeeds } from './src/services/rssPoller.js';
import { requireAuth, requireModerator, AuthRequest } from './src/middleware/auth.js';
import { getUser, updateUser, getAllUsersPublic } from './src/db/users.js';
import { getCases, getCaseById } from './src/db/cases.js';
import evidenceRoutes from './src/routes/evidence.js';
import investigationRoutes from './src/routes/investigation.js';
import { relationshipsRoutes } from './src/routes/relationships.js';
import { eventsRouter } from './src/routes/events.js';
import { graphRouter } from './src/routes/graph.js';

import { awardReputation } from './src/db/reputation.js';
import { getDiscussions, createDiscussion, getDiscussionReplies, createReply, voteDiscussion, getDiscussionById, updateDiscussionStatus, getDiscussionEvidence } from './src/db/discussions.js';

import { getUserReputationData } from './src/db/reputation.js';
import { getUserContributions } from './src/db/contributions.js';
import { createNotification } from './src/db/notifications.js';
import searchRoutes from "./src/routes/search.js";
import { notificationsRouter } from "./src/routes/notifications.js";
import { followsRouter } from "./src/routes/follows.js";
import { moderationRouter } from "./src/routes/moderation.js";
import workspacesRoutes from "./src/routes/workspaces.js";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use('/api/evidence', evidenceRoutes);
app.use('/api/investigation', investigationRoutes);
app.use('/api/relationships', relationshipsRoutes);
app.use('/api/events', eventsRouter);
app.use('/api/graph', graphRouter);
app.use("/api/search", searchRoutes);
app.use('/api/workspaces', workspacesRoutes);
app.use('/api/moderation', moderationRouter);


app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
  try {
    const users = await getAllUsersPublic();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await getUser(req.user!.uid);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/:id/role', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateUser(req.params.id, { role: req.body.role.toUpperCase() });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

app.put('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateUser(req.user!.uid, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/users/:id/reputation', async (req, res) => {
  try {
    const data = await getUserReputationData(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reputation history' });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await getCases();
    res.json(cases);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const c = await getCaseById(req.params.id);
    res.json(c);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

app.get('/api/discussions', async (req, res) => {
  try {
    const caseFileId = req.query.caseFileId as string;
    const discussions = await getDiscussions(caseFileId);
    res.json(discussions);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});


app.get('/api/discussions/:id/evidence', async (req, res) => {
  try {
    const evidence = await getDiscussionEvidence(req.params.id);
    res.json(evidence);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch discussion evidence' });
  }
});

app.post('/api/discussions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const discussion = await createDiscussion({ ...req.body, id: `disc-${Date.now()}`, authorId: req.user!.uid });
    await awardReputation(req.user!.uid, 'CREATED_DISCUSSION', 10, discussion.id, 'Started a new discussion');
    res.json(discussion);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

app.get('/api/discussions/:id/replies', async (req, res) => {
  try {
    const replies = await getDiscussionReplies(req.params.id);
    res.json(replies);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

app.post('/api/discussions/:id/replies', requireAuth, async (req: AuthRequest, res) => {
  try {
    const disc = await getDiscussionById(req.params.id);
    if (!disc) return res.status(404).json({ error: 'Discussion not found' });
    
    const isModerator = req.dbUser.role === 'MODERATOR' || req.dbUser.role === 'ADMIN';
    if (disc.locked && !isModerator) {
      return res.status(403).json({ error: 'Discussion is locked' });
    }

    
    const reply = await createReply({ 
      id: `reply-${Date.now()}`,
      discussionId: req.params.id, 
      content: req.body.content,
      authorId: req.user!.uid 
    });
    
    // Notify discussion author if it's not their own reply
    if (disc.authorId !== req.user!.uid) {
      await createNotification(
        disc.authorId,
        'DISCUSSION_REPLY',
        'New Reply to your Discussion',
        `${req.dbUser.username || 'An investigator'} replied: "${req.body.content.substring(0, 30)}..."`,
        disc.id,
        'DISCUSSION'
      );
    }

    await awardReputation(req.user!.uid, 'DISCUSSION_REPLY', 2, reply.id, 'Participated in a discussion');
    res.json(reply);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

app.post('/api/discussions/:id/vote', requireAuth, async (req: AuthRequest, res) => {
  try {
    const vote = await voteDiscussion(req.params.id, req.user!.uid, req.body.value);
    res.json(vote);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

app.post('/api/discussions/:id/lock', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateDiscussionStatus(req.params.id, { locked: true });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to lock discussion' });
  }
});

app.post('/api/discussions/:id/unlock', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateDiscussionStatus(req.params.id, { locked: false });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to unlock discussion' });
  }
});

app.delete('/api/discussions/:id', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateDiscussionStatus(req.params.id, { deletedAt: new Date() });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to soft-delete discussion' });
  }
});

app.post('/api/discussions/:id/restore', requireAuth, requireModerator, async (req: AuthRequest, res) => {
  try {
    const updated = await updateDiscussionStatus(req.params.id, { deletedAt: null });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to restore discussion' });
  }
});

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CIPHER_FILES_INTELLIGENCE_CORE', timestamp: new Date().toISOString() });
});

// AI Cross-Examiner Endpoint
app.post('/api/ai/cross-examine', requireAuth, async (req: AuthRequest, res: any) => {
  try {
    const { caseTitle, claim, knownFacts, opposingEvidence, userHypothesis } = req.body;
    const ai = getAi();

    const prompt = `You are the lead adversarial intelligence analyst at CIPHER FILES, a rigorous investigative intelligence platform.
Your mandate: Strictly distinguish documented FACTS from SPECULATION and CONSPIRACY CLAIMS. Never tell people what to believe; instead provide merciless, objective adversarial cross-examination based on primary evidence and historical forensics.

Case: ${caseTitle || 'Investigative Dossier'}
Core Claim: ${claim || 'N/A'}
Documented Verifiable Facts:
${Array.isArray(knownFacts) ? knownFacts.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n') : 'N/A'}

Counter-Evidence / Established Alternative Explanations:
${opposingEvidence || 'Standard historical records and official inquiry findings.'}

User's Hypothesis / Question to Cross-Examine:
"${userHypothesis || 'Evaluate the forensic plausibility and logical gaps in this case.'}"

Please return a structured analytical response containing:
1. "Forensic Assessment": A sharp 2-3 sentence summary of whether the hypothesis withstands primary source scrutiny.
2. "Strengths & Documented Precedents": What parts of the claim actually touch verified declassified records or established facts.
3. "Vulnerabilities & Logical Gaps": The biggest logical fallacies, unproven assumptions, missing physical chains of custody, or counter-telemetry.
4. "Key Cross-Examination Questions": 3 sharp, specific questions that an archivist or forensic investigator must ask to prove or disprove this theory.
5. "Assigned Evidence Rating": One of [CONFIRMED, DISPUTED, UNVERIFIED, DEBUNKED, UNKNOWN] with a 1-sentence justification.

Format your output in clean Markdown with bold bullet points. Maintain a professional, technical intelligence archive tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      analysis: response.text || 'Unable to complete forensic cross-examination.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/cross-examine:', error);
    res.status(500).json({
      error: 'Intelligence cross-examination failed',
      details: error?.message || 'Server error',
      fallback: 'Forensic cross-examination unavailable. Please check evidence citations manually.',
    });
  }
});


// AI Declassification / Entity Extraction Tool
app.post('/api/ai/declassify', requireAuth, async (req: AuthRequest, res: any) => {
  try {
    const { rawText } = req.body;
    const ai = getAi();

    const prompt = `You are the CIPHER FILES Declassification Parser.
Analyze the following raw historical/investigative text or theory submission:
"""${rawText}"""

Extract and return structured JSON with the following fields:
{
  "suggestedTitle": "Short, striking dossier title",
  "category": "One of [GOVERNMENT_INTELLIGENCE, UFOS_UAP, ANCIENT_MYSTERIES, UNSOLVED, MONEY_POWER, GLOBAL_EVENTS, PSYCHOLOGY_CONTROL, CRYPTIDS]",
  "suggestedRating": "One of [CONFIRMED, DISPUTED, UNVERIFIED, DEBUNKED, UNKNOWN]",
  "coreClaim": "1-2 sentence core allegation",
  "documentedFacts": ["Array of verifiable documented historical facts extracted"],
  "speculativePoints": ["Array of unverified leaps or assumptions"],
  "extractedEntities": [
    {"name": "Entity Name", "type": "PERSON | AGENCY | LOCATION | EVENT", "role": "Short description of role"}
  ],
  "recommendedNextInvestigationSteps": ["Step 1", "Step 2"]
}

Respond ONLY with valid parseable JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/declassify:', error);
    res.status(500).json({
      error: 'Declassification parser failed',
      details: error?.message || 'Server error',
    });
  }
});

// RSS Poller Endpoint & Background Service
app.post('/api/sync-rss', async (req, res) => {
  try {
    await syncRssFeeds();
    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Manual RSS Sync Failed:', error);
    res.status(500).json({ error: 'Sync failed', details: error?.message });
  }
});

// Start Background Poller (Every 12 hours)
setInterval(() => {
  console.log('[Background Service] Running scheduled RSS Sync...');
  syncRssFeeds().catch(console.error);
}, 12 * 60 * 60 * 1000);
// Trigger an initial sync 5 seconds after server start
setTimeout(() => {
  console.log('[Background Service] Running initial RSS Sync...');
  syncRssFeeds().catch(console.error);
}, 5000);

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  
app.post('/api/users/me/reputation/reward', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, reason } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const result = await awardReputation(req.user!.uid, 'MANUAL_REWARD', amount, undefined, reason);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to award reputation' });
  }
});


app.get('/api/users/:id/contributions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const filter = req.query.filter as string | undefined;
    const data = await getUserContributions(req.params.id, filter, limit);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIPHER FILES Intelligence Server active on http://0.0.0.0:${PORT}`);
  });
}

start();
