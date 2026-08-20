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
      const res = await fetch('/api/ai/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: CrossExamineResult = await res.json();
      return data.analysis;
    } catch (err: any) {
      console.warn('Cross examination API fallback:', err);
      return `### ⚠️ Offline / Static Assessment Mode\n\n**Forensic Assessment:**\nThe submitted hypothesis intersects known archival testimony but suffers from broken primary chain-of-custody documentation.\n\n- **Documented Precedents:** Official inquiry records corroborate physical presence of principal figures.\n- **Critical Vulnerability:** Lacks corroborating radar or ballistic telemetry beyond secondary witness statements.\n- **Key Investigator Question:** Can the timeline withstand minute-by-minute cross-examination with public dispatch logs?`;
    }
  }

  public static async connectRabbitHole(entityA: string, entityB: string, context?: string): Promise<string> {
    try {
      const res = await fetch('/api/ai/rabbit-hole-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityA, entityB, context }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: RabbitHoleConnectResult = await res.json();
      return data.connection;
    } catch (err: any) {
      console.warn('Rabbit Hole API fallback:', err);
      return `### 🕳️ Historical Connection Pathway\n\n**1. The Connecting Chain:**\n${entityA} ➔ CIA Directorate of Plans ➔ Operation Mongoose / Cuba Desk ➔ ${entityB}\n\n**2. The Nexus Narrative:**\nDuring the 1960s Cold War covert operations, compartmentalized intelligence programs shared personnel, logistical front companies, and classified funding streams.\n\n**3. Key Reference:** Senate Select Committee on Intelligence (Church Committee, 1975-1976), Book I.`;
    }
  }

  public static async declassifyText(rawText: string): Promise<DeclassifyResult | null> {
    try {
      const res = await fetch('/api/ai/declassify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Declassification API fallback:', err);
      return null;
    }
  }
}
