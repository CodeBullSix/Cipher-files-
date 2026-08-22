with open('src/components/CaseDetailModal.tsx', 'r') as f:
    content = f.read()

evidence_tab_html = """
        {/* PHASE 2 EVIDENCE ARCHIVE TAB */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  EVIDENCE REPOSITORY
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 rounded-md border border-emerald-400/20 font-bold">
                    {caseEvidence.filter(e => e.stance === 'SUPPORTING' && e.status === 'VERIFIED').length} SUPPORTING
                  </span>
                  <span className="px-2 py-1 bg-amber-400/10 text-amber-400 rounded-md border border-amber-400/20 font-bold">
                    {caseEvidence.filter(e => e.stance === 'CONTRADICTING' && e.status === 'VERIFIED').length} CONTRADICTING
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseEvidence.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-gray-500 font-mono text-sm border border-dashed border-gray-800 rounded-xl">
                    No verified evidence items attached to this dossier yet.
                  </div>
                ) : (
                  caseEvidence.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedArchiveEvidence(item)}
                      className="bg-[#050810] border border-gray-800 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          item.status === 'VERIFIED' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          item.status === 'UNDER_REVIEW' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' :
                          item.status === 'DISPUTED' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          'bg-gray-400/10 text-gray-400 border-gray-400/20'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-cyan-500 font-bold">{item.stance}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 leading-tight">{item.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>{item.type}</span>
                        <span>Source: {item.source?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {selectedArchiveEvidence && (
              <EvidenceDetailModal
                evidence={selectedArchiveEvidence}
                currentUser={currentUser}
                onClose={() => setSelectedArchiveEvidence(null)}
                onUpdate={(updated) => {
                  setCaseEvidence(prev => prev.map(item => item.id === updated.id ? updated : item));
                  setSelectedArchiveEvidence(updated);
                }}
              />
            )}
          </div>
        )}
"""

import re
# We need to replace the entire {activeTab === 'evidence' && (...)} block.
start_idx = content.find("{activeTab === 'evidence' && (")
if start_idx != -1:
    # Find matching closing bracket
    open_brackets = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '{': open_brackets += 1
        elif content[i] == '}':
            open_brackets -= 1
            if open_brackets == 0:
                end_idx = i
                break
    
    if end_idx != -1:
        new_content = content[:start_idx] + evidence_tab_html + content[end_idx+1:]
        with open('src/components/CaseDetailModal.tsx', 'w') as f:
            f.write(new_content)
        print("Success")
    else:
        print("Could not find matching closing bracket")
else:
    print("Could not find {activeTab === 'evidence' && (")
