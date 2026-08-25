import { auth } from './firebase';
export interface CrossExamineResult {
  analysis: string;
  timestamp: string;
}

export interface RabbitHoleConnectResult {
  connection: string;
  timestamp: string;
}

export interface DeclassifyResult {
  suggestedTitle?: string;
  category?: string;
  suggestedRating?: string;
  coreClaim?: string;
  documentedFacts?: string[];
  speculativePoints?: string[];
  extractedEntities?: { name: string; type: string; role: string }[];
  recommendedNextInvestigationSteps?: string[];
}

export class GeminiService {
  public static async crossExamine(payload: {
    caseTitle: string;
    claim: string;
    knownFacts: string[];
    opposingEvidence?: string;
    userHypothesis: string;
  }): Promise<string> {
    try {
      const res = await fetchWithAuth('/api/ai/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errMsg = `HTTP error ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.details || errData.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      const data: CrossExamineResult = await res.json();
      return data.analysis;
    } catch (err: any) {
      console.warn('Cross examination API fallback:', err);
      throw new Error(err.message || 'Failed to synthesize intelligence.');
    }
  }

  public static async getBrief(entityName: string, entityType: string, context?: string): Promise<string> {
    try {
      const res = await fetchWithAuth('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityName, entityType, context }),
      });
      if (!res.ok) {
        let errMsg = `HTTP error ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.details || errData.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      return data.brief;
    } catch (err: any) {
      console.warn('Brief API fallback:', err);
      throw new Error(err.message || 'Failed to generate brief.');
    }
  }

  public static async connectRabbitHole(entityA: string, entityB: string, context?: string): Promise<string> {
    try {
      const res = await fetchWithAuth('/api/ai/rabbit-hole-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityA, entityB, context }),
      });
      if (!res.ok) {
        let errMsg = `HTTP error ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.details || errData.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      const data: RabbitHoleConnectResult = await res.json();
      return data.connection;
    } catch (err: any) {
      console.warn('Rabbit Hole API fallback:', err);
      throw new Error(err.message || 'Failed to connect entities.');
    }
  }

  public static async declassifyText(rawText: string): Promise<DeclassifyResult | null> {
    try {
      const res = await fetchWithAuth('/api/ai/declassify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      if (!res.ok) {
        let errMsg = `HTTP error ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.details || errData.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Declassification API fallback:', err);
      throw new Error(err.message || 'Failed to declassify text.');
    }
  }
}


async function fetchWithAuth(url: string, options: RequestInit = {}) {
  if (auth.authStateReady) {
    await auth.authStateReady();
  }
  
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated. Please wait or log in again.');
  }

  const headers = new Headers(options.headers || {});
  
  try {
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  } catch (e) {
    console.error('Error getting Firebase token:', e);
    throw new Error('Failed to retrieve authentication token.');
  }
  
  headers.set('Content-Type', 'application/json');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after 20 seconds.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
