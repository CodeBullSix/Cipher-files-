const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const followersContent = `
        {/* TAB: FOLLOWERS */}
        {activeTab === 'followers' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {loadingFollows ? (
              <div className="p-10 flex justify-center"><Zap className="w-6 h-6 text-cyan-500 animate-spin" /></div>
            ) : followers.length === 0 ? (
              <div className="p-10 border border-dashed border-gray-800 rounded-xl text-center flex flex-col items-center">
                <Users className="w-8 h-8 text-gray-700 mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">NO FOLLOWERS YET</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">This investigator hasn't gained any followers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {followers.map(f => (
                  <div key={f.uid} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-[#0A0E1A]">
                    {f.photoURL ? (
                      <img src={f.photoURL} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {f.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{f.displayName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">Level {f.level || 1} • {f.reputation || 0} REP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: FOLLOWING */}
        {activeTab === 'following' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {loadingFollows ? (
              <div className="p-10 flex justify-center"><Zap className="w-6 h-6 text-cyan-500 animate-spin" /></div>
            ) : following.length === 0 ? (
              <div className="p-10 border border-dashed border-gray-800 rounded-xl text-center flex flex-col items-center">
                <Users className="w-8 h-8 text-gray-700 mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">NOT FOLLOWING ANY INVESTIGATORS YET</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">This investigator hasn't followed anyone.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {following.map(f => (
                  <div key={f.uid} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-[#0A0E1A]">
                    {f.photoURL ? (
                      <img src={f.photoURL} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {f.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{f.displayName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">Level {f.level || 1} • {f.reputation || 0} REP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
`;

content = content.replace(
  "        {/* TAB 2: TACTICAL DOSSIER OVERVIEW */}",
  followersContent + "\n        {/* TAB 2: TACTICAL DOSSIER OVERVIEW */}"
);

fs.writeFileSync(file, content);
