import React, { useState } from 'react';
import { CaseFile } from '../types';
import { GeminiService } from '../services/geminiService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  RefreshCw,
  Flame
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  caseFile: CaseFile;
  onRewardXp: (amount: number, reason: string) => void;
}

export const AICrossExaminer: React.FC<Props> = ({ caseFile, onRewardXp }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);

  const presets = [
    `Cross-examine the physical evidence: does the official explanation withstand ballistics and forensic scrutiny?`,
    `Identify the top 3 logical fallacies or unverified leaps in the popular conspiracy theory.`,
    `What missing primary source document would definitively prove or disprove this case?`,
    `Act as an aggressive defense attorney questioning the chain of custody on primary exhibits.`
  ];

  const handleRunCrossExamination = async (queryText?: string) => {
    const textToRun = queryText || userInput;
    if (!textToRun.trim() || isLoading) return;

    setIsLoading(true);
    sound.playClick(900);

    try {
      const opposing = caseFile.evidenceList
        .filter(e => !e.isSupporting)
        .map(e => `${e.title}: ${e.summary}`)
        .join('\n');

      const result = await GeminiService.crossExamine({
        caseTitle: caseFile.title,
        claim: caseFile.claim,
        knownFacts: caseFile.whatWeKnow,
        opposingEvidence: opposing,
        userHypothesis: textToRun
      });

      setAnalysisOutput(result);
      onRewardXp(40, `Ran AI Adversarial Cross-Examination on ${caseFile.caseNumber}`);
      sound.playUnlock();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-[#0a0d14] p-5 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <span>ADVERSARIAL INTELLIGENCE CROSS-EXAMINER</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                GEMINI 3.7 FLASH
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Merciless forensic audit challenging assumptions, testing evidence reliability, and identifying logical fallacies.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Strategy Prompts */}
      <div className="mb-4">
        <span className="text-[11px] font-mono text-slate-400 block mb-2 font-semibold">
          SUGGESTED CROSS-EXAMINATION ANGLE:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserInput(preset);
                handleRunCrossExamination(preset);
              }}
              className="text-left text-xs font-mono p-2.5 rounded-lg bg-[#0e131e] border border-slate-800 hover:border-cyan-500/40 hover:bg-[#121826] text-slate-300 hover:text-cyan-200 transition-colors"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your hypothesis, question, or specific piece of contradictory evidence to cross-examine..."
            rows={3}
            className="w-full bg-[#080b11] border border-slate-700 rounded-lg p-3 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
          <div className="mt-2 flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">
              Evaluates against {caseFile.whatWeKnow.length} documented facts & {caseFile.evidenceList.length} archival exhibits.
            </span>
            <button
              onClick={() => handleRunCrossExamination()}
              disabled={isLoading || !userInput.trim()}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>CROSS-EXAMINING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXECUTE FORENSIC AUDIT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Dossier */}
      {analysisOutput && (
        <div className="rounded-xl border border-cyan-500/40 bg-[#07090f] p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <span className="text-cyan-400 font-bold tracking-wider text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              INTELLIGENCE CROSS-EXAMINATION REPORT
            </span>
            <span className="text-[10px] text-slate-400">STATUS: AUDITED</span>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-slate-300 whitespace-pre-wrap">
            {analysisOutput}
          </div>
        </div>
      )}
    </div>
  );
};
