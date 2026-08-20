import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.post('/api/ai/cross-examine', async (req, res) => {
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
      model: 'gemini-3.7-flash',
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

// AI Rabbit Hole Connector Endpoint
app.post('/api/ai/rabbit-hole-connect', async (req, res) => {
  try {
    const { entityA, entityB, context } = req.body;
    const ai = getAi();

    const prompt = `You are the Rabbit Hole Network Engine for CIPHER FILES.
Identify real, historical, intelligence, organizational, or forensic links connecting:
- Entity A: "${entityA}"
- Entity B: "${entityB}"
Context: ${context || 'General 20th/21st century historical and intelligence records'}

Provide:
1. "The Connecting Chain": Step-by-step nodes linking Entity A to Entity B (e.g. Entity A ➔ Agency/Event ➔ Person ➔ Entity B).
2. "The Nexus Narrative": A concise, engaging 150-word intelligence brief explaining how their operations, personnel, or investigations intersected.
3. "Key Historical Documents / Inquiries": 2 primary government, academic, or court references documenting this connection.
4. "Degree of Separation": (1 to 4 hops).
5. "Connection Reliability": (Documented Historical Fact / Corroborated Intelligence Link / Speculative Hypothesis).

Format with bold headers and clean Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({
      connection: response.text || 'No direct pathway located in declassified archives.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/rabbit-hole-connect:', error);
    res.status(500).json({
      error: 'Rabbit Hole synthesis failed',
      details: error?.message || 'Server error',
    });
  }
});

// AI Declassification / Entity Extraction Tool
app.post('/api/ai/declassify', async (req, res) => {
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
      model: 'gemini-3.7-flash',
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIPHER FILES Intelligence Server active on http://0.0.0.0:${PORT}`);
  });
}

start();
