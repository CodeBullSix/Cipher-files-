import React, { useState } from 'react';
import { TheorySubmission, EvidenceRating } from '../types';
import { StorageService } from '../services/storage';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  User, 
  Calendar,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onClose: () => void;
  onReputationEarned: (amount: number, reason: string, persist?: boolean) => void;
  onRefreshCases: () => void;
}

export const ModerationQueueModal: React.FC<Props> = ({ onClose, onReputationEarned, onRefreshCases }) => {
  const [submissions, setSubmissions] = useState<TheorySubmission[]>(StorageService.getSubmissions());
  const [selectedSub, setSelectedSub] = useState<TheorySubmission | null>(submissions[0] || null);
  const [assignedRating, setAssignedRating] = useState<EvidenceRating>('UNVERIFIED');
  const [reviewNotes, setReviewNotes] = useState<string>('Verified primary source citations and documented historical context.');

  const handleApprovePublish = (sub: TheorySubmission) => {
    StorageService.updateSubmissionStatus(sub.id, 'PUBLISHED', reviewNotes, assignedRating);
    setSubmissions(StorageService.getSubmissions());
    onReputationEarned(80, `Approved & declassified community investigation: ${sub.title}`, true);
    onRefreshCases();
    sound.playStamp();
  };

  const handleNeedsChanges = (sub: TheorySubmission) => {
    StorageService.updateSubmissionStatus(sub.id, 'NEEDS_CHANGES', reviewNotes);
    setSubmissions(StorageService.getSubmissions());
    sound.playClick(700);
  };

  const handleReject = (sub: TheorySubmission) => {
    StorageService.updateSubmissionStatus(sub.id, 'REJECTED', reviewNotes);
    setSubmissions(StorageService.getSubmissions());
    sound.playClick(500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl my-auto rounded-2xl border border-cyan-500/40 bg-[#0a0d16] shadow-2xl p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-mono font-black text-white flex items-center gap-2">
                <span>ARCHIVAL PEER-REVIEW & MODERATION BOARD</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {submissions.filter(s => s.status === 'SUBMITTED').length} PENDING
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Senior Investigator clearance required to audit provenance and publish community dossiers.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout: Submissions List (Left) + Detail & Review Actions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {/* Submissions List */}
          <div className="md:col-span-1 border border-slate-800 rounded-xl bg-[#07090f] p-3 space-y-2 overflow-y-auto max-h-[70vh]">
            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
              INCOMING DOSSIER QUEUE
            </span>
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSub(sub);
                  setAssignedRating(sub.suggestedRating);
                  sound.playClick(650);
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedSub?.id === sub.id
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-800 bg-[#0a0d14] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{sub.caseNumber}</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                    sub.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400' :
                    sub.status === 'SUBMITTED' ? 'bg-amber-950 text-amber-400' :
                    sub.status === 'NEEDS_CHANGES' ? 'bg-blue-950 text-blue-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {sub.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-mono font-bold text-white line-clamp-1 mb-1">
                  {sub.title}
                </h4>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>By {sub.submitterName}</span>
                  <span>{sub.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Review Panel */}
          <div className="md:col-span-2 border border-slate-800 rounded-xl bg-[#090c14] p-5 overflow-y-auto max-h-[70vh] flex flex-col justify-between">
            {selectedSub ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {selectedSub.caseNumber} • {selectedSub.category.replace(/_/g, ' ')}
                    </span>
                    <StatusBadge status={selectedSub.suggestedRating} size="sm" />
                  </div>

                  <h3 className="text-lg font-mono font-black text-white mb-1">
                    {selectedSub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Submitted by Investigator {selectedSub.submitterName} ({selectedSub.submitterRank})
                  </p>
                </div>

                {/* Claim */}
                <div className="rounded-lg bg-[#06080e] p-3.5 border border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                    THE PROPOSED CLAIM:
                  </span>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">
                    "{selectedSub.claim}"
                  </p>
                </div>

                {/* Facts & Sources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-[#06080e] p-3 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                      DOCUMENTED FACTS:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {selectedSub.knownFacts.map((f, i) => (
                        <li key={i} className="line-clamp-2">• {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-[#06080e] p-3 border border-slate-800">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                      CITED SOURCES:
                    </span>
                    <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                      {selectedSub.sources.map((s, i) => (
                        <li key={i} className="line-clamp-2">🔗 {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Review & Decision Actions */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-300 font-bold block mb-1">
                        CONFIRM / ADJUST EVIDENCE RATING:
                      </label>
                      <select
                        value={assignedRating}
                        onChange={(e) => setAssignedRating(e.target.value as EvidenceRating)}
                        className="w-full bg-[#06080e] border border-slate-700 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                      >
                        <option value="CONFIRMED">🟢 CONFIRMED (Independently Documented)</option>
                        <option value="DISPUTED">🟡 DISPUTED (Contested Thesis)</option>
                        <option value="UNVERIFIED">🔵 UNVERIFIED (Needs More Evidence)</option>
                        <option value="DEBUNKED">🔴 DEBUNKED (Conclusively Refuted)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-300 font-bold block mb-1">
                        ARCHIVIST REVIEW NOTE:
                      </label>
                      <input
                        type="text"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Archivist feedback / justification note..."
                        className="w-full bg-[#06080e] border border-slate-700 rounded p-2 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleReject(selectedSub)}
                      className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 text-xs font-mono font-bold"
                    >
                      Reject Submission
                    </button>

                    <button
                      onClick={() => handleNeedsChanges(selectedSub)}
                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/30 hover:bg-amber-950/60 text-amber-400 text-xs font-mono font-bold"
                    >
                      Request Revisions
                    </button>

                    <button
                      onClick={() => handleApprovePublish(selectedSub)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <Check className="w-4 h-4" />
                      <span>APPROVE & PUBLISH DOSSIER</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400 font-mono text-xs">
                Select a submission from the left queue to review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
