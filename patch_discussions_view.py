import re

with open('src/components/DiscussionsView.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { ArchiveEvidence } from '../types';\nimport { EvidenceDetailModal } from './EvidenceDetailModal';\nimport { Database } from 'lucide-react';\n"
if "ArchiveEvidence" not in content:
    content = content.replace("import { StorageService }", import_stmt + "import { StorageService }")

states = """
  const [threadEvidence, setThreadEvidence] = useState<ArchiveEvidence[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<ArchiveEvidence | null>(null);
"""
if "const [threadEvidence" not in content:
    content = content.replace("const [comments, setComments] = useState<Comment[]>([]);", "const [comments, setComments] = useState<Comment[]>([]);\n" + states)

fetch_evidence = """
        import('../services/apiService').then(({ ApiService }) => {
          ApiService.getDiscussionEvidence(activeThreadId).then(ev => {
            if (mounted) setThreadEvidence(ev);
          }).catch(err => console.error(err));
        });
"""
# inject in useEffect
content = content.replace("ApiService.getReplies(activeThreadId).then(comms => {", fetch_evidence + "\n          ApiService.getReplies(activeThreadId).then(comms => {")

evidence_html = """
            {/* PHASE 2 REFERENCED EVIDENCE */}
            {threadEvidence.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>REFERENCED EVIDENCE</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {threadEvidence.map(ev => (
                    <div 
                      key={ev.id} 
                      onClick={() => setSelectedArchiveEvidence(ev)}
                      className="p-3 bg-[#090D1A] border border-gray-800 rounded-lg hover:border-cyan-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          ev.status === 'VERIFIED' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          'bg-gray-400/10 text-gray-400 border-gray-400/20'
                        }`}>
                          {ev.status}
                        </span>
                        <span className="text-[10px] text-cyan-500 font-bold">{ev.stance}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1 leading-tight line-clamp-1">{ev.title}</h5>
                      <p className="text-xs text-gray-400 line-clamp-1">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
"""

content = content.replace("{/* ATTACHED PHOTOS & VIDEOS FORUM EXHIBITS */}", evidence_html + "\n            {/* ATTACHED PHOTOS & VIDEOS FORUM EXHIBITS */}")

modal_html = """
      {selectedArchiveEvidence && (
        <EvidenceDetailModal
          evidence={selectedArchiveEvidence}
          currentUser={currentUser as any}
          onClose={() => setSelectedArchiveEvidence(null)}
          onUpdate={(updated) => {
            setThreadEvidence(prev => prev.map(item => item.id === updated.id ? updated : item));
            setSelectedArchiveEvidence(updated);
          }}
        />
      )}
"""
content = content.replace("    </div>\n  );\n};", modal_html + "\n    </div>\n  );\n};")

with open('src/components/DiscussionsView.tsx', 'w') as f:
    f.write(content)
