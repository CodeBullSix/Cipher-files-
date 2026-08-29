const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const html = `
        {/* TAB 3: CONTRIBUTION HISTORY */}
        {activeTab === 'contributions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Filters */}
            <div className="flex gap-2 pb-2 border-b border-gray-800 overflow-x-auto scrollbar-hide">
              {['ALL', 'CASES', 'ENTITIES', 'EVIDENCE', 'DISCUSSIONS'].map(f => (
                <button
                  key={f}
                  onClick={() => { setContributionFilter(f); sound.click(); }}
                  className={\`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors \${
                    contributionFilter === f
                      ? \`\${currentTheme.bg} \${currentTheme.text} border \${currentTheme.border}\`
                      : 'text-slate-500 hover:text-white border border-transparent'
                  }\`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Contributions List */}
            <div className="space-y-3">
              {loadingContributions ? (
                <div className="py-8 text-center text-xs font-mono text-slate-500 flex flex-col items-center">
                  <RefreshCw className="w-5 h-5 animate-spin mb-2" />
                  ACCESSING DECLASSIFIED ARCHIVES...
                </div>
              ) : contributions.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-slate-500 flex flex-col items-center bg-[#05070e] rounded-xl border border-slate-800">
                  <History className="w-8 h-8 mb-3 opacity-30" />
                  NO CONTRIBUTIONS IN THIS CATEGORY
                </div>
              ) : (
                contributions.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-800/80 bg-[#080b12] hover:bg-[#0a0e17] transition-colors group flex items-start justify-between">
                    <div className="space-y-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={\`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 \${currentTheme.text}\`}>
                          {c.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        {c.status && c.status !== 'ACTIVE' && (
                          <span className={\`text-[9px] font-mono px-1.5 py-0.5 rounded \${
                            c.status === 'VERIFIED' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                            c.status === 'DISPUTED' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                            'text-red-400 bg-red-400/10 border-red-400/20'
                          }\`}>
                            {c.status}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs font-semibold text-white line-clamp-2">
                        {c.title}
                      </p>
                      
                      {c.navigationPath && (
                        <div className="pt-1">
                          {c.recordType === 'PERSON' && (
                            <button onClick={() => { if(window.onOpenEntity) window.onOpenEntity('person', c.recordId); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Target Profile
                            </button>
                          )}
                          {c.recordType === 'ORGANISATION' && (
                            <button onClick={() => { if(window.onOpenEntity) window.onOpenEntity('organisation', c.recordId); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Organisation
                            </button>
                          )}
                          {c.recordType === 'LOCATION' && (
                            <button onClick={() => { if(window.onOpenEntity) window.onOpenEntity('location', c.recordId); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Location
                            </button>
                          )}
                          {c.recordType === 'CASE' && (
                            <button onClick={() => { if(window.onOpenCase) window.onOpenCase(c.recordId); }} className={\`text-[10px] font-mono \${currentTheme.text} hover:underline flex items-center gap-1\`}>
                              <ArrowRight className="w-3 h-3" /> View Case File
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className={\`text-xs font-mono font-bold \${currentTheme.text}\`}>
                        +{c.points} REP
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
`;

content = content.replace(
  "{/* TAB 1: CUSTOMIZE PROFILE VIEW */}",
  html + "\n\n        {/* TAB 1: CUSTOMIZE PROFILE VIEW */}"
);

fs.writeFileSync(file, content);
