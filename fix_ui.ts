import fs from 'fs';
const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add state
content = content.replace(
  "const [reviewNotes, setReviewNotes] = useState<string>('Verified primary source citations and documented historical context.');",
  "const [reviewNotes, setReviewNotes] = useState<string>('Verified primary source citations and documented historical context.');\n  const [approvedComponents, setApprovedComponents] = useState<Record<string, boolean>>({'CASE': true});"
);

// Modify handleApprovePublish to use approvedComponents
content = content.replace(
  "await ApiService.updateSubmissionStatus(sub.id, 'APPROVED', reviewNotes);",
  "await ApiService.updateSubmissionStatus(sub.id, 'APPROVED', reviewNotes, approvedComponents);"
);

// Add Component Review section before Review & Decision Actions
const componentsSection = `
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
`;

content = content.replace(
  "{/* Review & Decision Actions */}",
  componentsSection + "\n                {/* Review & Decision Actions */}"
);

// We should reset approvedComponents when selecting a new submission
content = content.replace(
  "setSelectedSub(sub);",
  "setSelectedSub(sub); setApprovedComponents({'CASE': true});"
);

// We need to fetch the real content in the frontend correctly since we updated the backend to return communitySubmissions records.
// Previously, ModerationQueueModal assumed it was the CaseFile objects (like sub.title, sub.claim) directly on sub, but now it's on sub.content (if it's using the new backend).
// Let's modify the way it renders `selectedSub` to handle both or just `sub.content`.
// Wait, the API returns the rows from community_submissions table, which have: id, type, status, title, summary, content (JSONB), submittedById, etc.

content = content.replace(/selectedSub\.caseNumber/g, "selectedSub.content?.caseNumber || 'NEW'");
content = content.replace(/selectedSub\.category\.replace/g, "(selectedSub.content?.category || 'OTHER').replace");
content = content.replace(/selectedSub\.suggestedRating/g, "selectedSub.content?.status || 'UNVERIFIED'");
content = content.replace(/selectedSub\.submitterName/g, "selectedSub.submittedById");
content = content.replace(/selectedSub\.submitterRank/g, "'Operative'");
content = content.replace(/selectedSub\.claim/g, "selectedSub.content?.claim || selectedSub.summary");
content = content.replace(/selectedSub\.knownFacts/g, "(selectedSub.content?.whatWeKnow || [])");
content = content.replace(/selectedSub\.sources/g, "(selectedSub.content?.evidenceList?.map((e: any) => e.provenance) || [])");

fs.writeFileSync(path, content);
console.log("Fixed UI in ModerationQueueModal.tsx");
