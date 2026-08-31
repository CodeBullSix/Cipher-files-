import React, { useState } from 'react';
import { TheorySubmission, EvidenceRating } from '../types';
import { ApiService } from '../services/apiService';
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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    ApiService.getModerationSubmissions().then(data => {
      if (data && data.submissions) {
        setSubmissions(data.submissions);
        setSelectedSub(data.submissions[0] || null);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const [selectedSub, setSelectedSub] = useState<TheorySubmission | null>(submissions[0] || null);
  const [assignedRating, setAssignedRating] = useState<EvidenceRating>('UNVERIFIED');
  const [reviewNotes, setReviewNotes] = useState<string>('Verified primary source citations and documented historical context.');
  const [approvedComponents, setApprovedComponents] = useState<Record<string, boolean>>({'CASE': true});

  const handleApprovePublish = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'APPROVED', reviewNotes, approvedComponents);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    onReputationEarned(80, `Approved & declassified community investigation: ${sub.title}`, true);
    onRefreshCases();
    sound.playStamp();
  };

  const handleNeedsChanges = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'RETURNED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    sound.playClick(700);
  };

  const handleReject = async (sub: any) => {
    await ApiService.updateSubmissionStatus(sub.id, 'REJECTED', reviewNotes);
    const data = await ApiService.getModerationSubmissions();
    if (data && data.submissions) setSubmissions(data.submissions);
    sound.playClick(500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl my-auto rounded-2xl border border-cipher-accent/40 bg-cipher-surface shadow-2xl p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        
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
                  {submissions.filter(s => s.status === 'PENDING_REVIEW').length} PENDING
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Senior Investigator clearance required to audit provenance and publish community dossiers.
              </p>
            </div>
          </div>

          <button aria-label="Close" onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout: Submissions List (Left) + Detail & Review Actions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {/* Submissions List */}
          <div className="md:col-span-1 border border-slate-800 rounded-xl bg-cipher-panel p-3 space-y-2 overflow-y-auto max-h-[70vh]">
            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">
              INCOMING DOSSIER QUEUE
            </span>
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSub(sub); setApprovedComponents({'CASE': true});
                  setAssignedRating(sub.content?.status || 'UNVERIFIED');
                  sound.playClick(650);
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedSub?.id === sub.id
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-800 bg-cipher-surface hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-cipher-accent">{sub.content?.caseNumber || 'NEW'}</span>
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
                  <span>By {sub.submittedById}</span>
                  <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Review Panel */}
          <div className="md:col-span-2 border border-slate-800 rounded-xl bg-cipher-surface p-5 overflow-y-auto max-h-[70vh] flex flex-col justify-between">
            {selectedSub ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cipher-accent font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cipher-accent/30">
                      {selectedSub.content?.caseNumber || 'NEW'} • {(selectedSub.content?.category || 'OTHER').replace(/_/g, ' ')}
                    </span>
                    <StatusBadge status={selectedSub.content?.status || 'UNVERIFIED'} size="sm" />
                  </div>

                  <h3 className="text-lg font-mono font-black text-white mb-1">
                    {selectedSub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Submitted by Investigator {selectedSub.submittedById} ({'Operative'})
                  </p>
                </div>

                {/* Claim */}
                <div className="rounded-lg bg-cipher-panel p-3.5 border border-slate-800">
                  <span className="text-[10px] font-mono text-cipher-accent font-bold uppercase block mb-1">
                    THE PROPOSED CLAIM:
                  </span>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">
                    "{selectedSub.content?.claim || selectedSub.summary}"
                  </p>
                </div>

                {/* Facts & Sources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-cipher-panel p-3 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                      DOCUMENTED FACTS:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {(selectedSub.content?.whatWeKnow || []).map((f, i) => (
                        <li key={i} className="line-clamp-2">• {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-cipher-panel p-3 border border-slate-800">
                    <span className="text-[10px] font-mono text-cipher-accent font-bold uppercase block mb-1">
                      CITED SOURCES:
                    </span>
                    <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                      {(selectedSub.content?.evidenceList?.map((e: any) => e.provenance) || []).map((s, i) => (
                        <li key={i} className="line-clamp-2">🔗 {s}</li>
                      ))}
                    </ul>

                    {selectedSub.content?.entities?.map((ent: any) => (
                      <label key={ent.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[ent.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [ent.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-purple-400 block">ENTITY ({ent.type}): {ent.name}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{ent.description || 'No description'}</span>
                        </div>
                      </label>
                    ))}
                    {selectedSub.content?.documents?.map((doc: any) => (
                      <label key={doc.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[doc.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [doc.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-blue-400 block">DOCUMENT: {doc.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{doc.originAgency} - {doc.classificationLevel}</span>
                        </div>
                      </label>
                    ))}

                    {selectedSub.content?.relationships?.map((rel: any) => (
                      <label key={rel.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[rel.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [rel.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-pink-400 block">RELATIONSHIP: {rel.relationshipType}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{rel.description || 'Unspecified link'}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                
                {/* Component Verification */}
                <div className="rounded-lg bg-cipher-panel p-3 border border-slate-800">
                  <span className="text-[10px] font-mono text-cipher-accent font-bold uppercase block mb-2 border-b border-slate-800 pb-1">
                    COMPONENT VERIFICATION CHECKLIST:
                  </span>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded">
                      <input type="checkbox" checked={approvedComponents['CASE'] !== false} onChange={(e) => setApprovedComponents(prev => ({ ...prev, 'CASE': e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500" />
                      <span className="text-xs font-mono text-white">CORE CASE DOSSIER</span>
                    </label>
                    
                    {selectedSub.content?.evidenceList?.map((ev: any) => (
                      <label key={ev.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[ev.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [ev.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-emerald-400 block">EVIDENCE: {ev.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{ev.provenance}</span>
                        </div>
                      </label>
                    ))}
                    
                    {selectedSub.content?.timeline?.map((evt: any) => (
                      <label key={evt.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[evt.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [evt.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-amber-400 block">EVENT: {evt.date}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{evt.title}</span>
                        </div>
                      </label>
                    ))}
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
                        className="w-full bg-cipher-panel border border-slate-700 rounded p-2 text-xs font-mono text-cipher-accent-hover focus:outline-none"
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
                        className="w-full bg-cipher-panel border border-slate-700 rounded p-2 text-xs font-mono text-white focus:outline-none"
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
