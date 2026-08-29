const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const followerCountsHTML = `
              </p>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-400">
                <span><strong className="text-cyan-400">{followersCount}</strong> Followers</span>
                <span><strong className="text-cyan-400">{followingCount}</strong> Following</span>
              </div>
            </div>
`;

content = content.replace(
  "</p>\n            </div>",
  followerCountsHTML
);

const followButtonHTML = `
          {/* Mode Switcher Buttons */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleToggleFollow}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border \${
                  isFollowing 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500' 
                    : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                }\`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
`;

content = content.replace(
  "{/* Mode Switcher Buttons */}\n          <div className=\"flex items-center gap-2\">",
  followButtonHTML
);

fs.writeFileSync(file, content);
