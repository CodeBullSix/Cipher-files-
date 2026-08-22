import re

with open('src/components/AdminConsoleModal.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { ArchiveEvidence } from '../types';\nimport { ApiService } from '../services/apiService';\nimport { EvidenceDetailModal } from './EvidenceDetailModal';\nimport { Database } from 'lucide-react';\n"
if "ArchiveEvidence" not in content:
    content = content.replace("import { AuthService } from '../services/authService';", import_stmt + "import { AuthService } from '../services/authService';")

if "setActiveTab] = useState<'users' | 'moderation' | 'audit'>" in content:
    content = content.replace("setActiveTab] = useState<'users' | 'moderation' | 'audit'>", "setActiveTab] = useState<'users' | 'moderation' | 'evidence' | 'audit'>")

tabs_html = """
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 py-3 border-b-2 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'evidence'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Evidence Review</span>
            </button>
"""
if "<Database className=\"w-4 h-4\" />\n              <span className=\"hidden sm:inline\">Evidence Review</span>" not in content:
    content = content.replace("<span className=\"hidden sm:inline\">Audit Logs</span>\n            </button>", "<span className=\"hidden sm:inline\">Audit Logs</span>\n            </button>" + tabs_html)

evidence_state = """
  const [reviewEvidence, setReviewEvidence] = useState<ArchiveEvidence[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<ArchiveEvidence | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'evidence') {
      ApiService.getEvidence({ status: 'UNDER_REVIEW' })
        .then(data => setReviewEvidence(data.items || data))
        .catch(err => console.error(err));
    }
  }, [isOpen, activeTab]);
"""
if "const [reviewEvidence" not in content:
    content = content.replace("const [activeTab", evidence_state + "  const [activeTab")

evidence_tab_ui = """
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Database className="w-4 h-4" />
                PENDING EVIDENCE VERIFICATION
              </h3>
              
              <div className="space-y-2">
                {reviewEvidence.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg text-gray-500 text-sm font-mono">
                    No evidence records pending review.
                  </div>
                ) : (
                  reviewEvidence.map(item => (
                    <div key={item.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded border border-cyan-400/20 bg-cyan-400/10 text-[10px] text-cyan-400 font-bold uppercase">
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{item.type}</span>
                        </div>
                        <div className="text-sm font-bold text-white">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                      </div>
                      <button 
                        onClick={() => setSelectedArchiveEvidence(item)}
                        className="px-3 py-1.5 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/60 rounded text-xs font-bold transition-colors shrink-0"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>

              {selectedArchiveEvidence && (
                <EvidenceDetailModal
                  evidence={selectedArchiveEvidence}
                  currentUser={currentUser}
                  onClose={() => setSelectedArchiveEvidence(null)}
                  onUpdate={(updated) => {
                    setReviewEvidence(prev => prev.filter(e => e.id !== updated.id));
                    setSelectedArchiveEvidence(null);
                  }}
                />
              )}
            </div>
          )}
"""
if "PENDING EVIDENCE VERIFICATION" not in content:
    content = content.replace("{/* AUDIT LOGS TAB */}", evidence_tab_ui + "\n          {/* AUDIT LOGS TAB */}")

with open('src/components/AdminConsoleModal.tsx', 'w') as f:
    f.write(content)
