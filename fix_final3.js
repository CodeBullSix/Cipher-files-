import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

// The best way to fix this is to find all the opened tags and closed tags and make them match.
// Let's just restore the file from my earliest mistake if we can't, but I can just replace the whole timeline tab block.

const rx = /\{\s*activeTab === 'timeline' && \([\s\S]*?\{\s*\/\* TAB 8: COMMUNITY DEBATES/m;

const correctTimelineTab = `{activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30">
                <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                  HISTORICAL CHRONOLOGY & DECLASSIFIED TIMELINE
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Chronological progression of key events, leaks, investigations, and declassifications.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-cyan-500/30">
                {(currentCase.timeline || []).map((t: any, idx: number) => (
                  <div key={idx} className="relative flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] z-10" />
                      <div className="w-px h-full bg-gray-800 -mt-1" />
                    </div>
                    <div className="pt-0">
                      <span className="text-cyan-400 font-mono text-sm tracking-widest font-bold">
                        {t.date}
                      </span>
                      <h4 className="text-gray-200 mt-1 uppercase text-sm tracking-wider font-semibold">
                        {t.event}
                      </h4>
                      <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                        {t.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-800">
                <TimelineView entityType="case_files" entityId={currentCase.id} />
              </div>

              <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">
                <div>
                  <h3 className="font-mono text-sm font-bold text-gray-400 uppercase mb-4">
                    CONNECTED INVESTIGATIONS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentCase.connectedCaseIds || []).map((connId: any) => (
                      <div
                        key={connId}
                        onClick={() => { onJumpCase(connId); sound.click(); }}
                        className="p-3.5 rounded-xl bg-[#070A14] border border-gray-800 hover:border-cyan-400 hover:bg-[#0D1220] cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 uppercase">
                            {connId.replace(/-/g, ' ')}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {currentCase.entities && currentCase.entities.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    KEY PRINCIPALS & AGENCIES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentCase.entities.map((ent: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => onJumpGraphEntity?.(ent.name)}
                        className="p-3 rounded-xl bg-[#070A14] border border-gray-800 hover:border-amber-400 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1">
                          <span>{ent.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">{ent.type}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{ent.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: COMMUNITY DEBATES`;

content = content.replace(rx, correctTimelineTab);
fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
