const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `            {!isOwnProfile && currentUser && (
              <button
                onClick={handleToggleFollow}`;

const replacement = `            {!isOwnProfile && (currentUser?.role === 'MODERATOR' || currentUser?.role === 'ADMIN') && (
              <button
                onClick={async () => {
                  try {
                    const action = activeProfile.deletedAt ? 'UNBAN' : 'BAN';
                    if (!window.confirm(\`Are you sure you want to \${action} this user?\`)) return;
                    await ApiService.moderateContent('USER', activeProfile.uid, action);
                    setActiveProfile(prev => ({ ...prev, deletedAt: action === 'BAN' ? new Date().toISOString() : undefined }));
                  } catch (e) {
                    console.error('Failed to moderate user', e);
                    alert('Failed to moderate user');
                  }
                }}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border \${
                  activeProfile.deletedAt 
                     ? 'bg-emerald-900/30 border-emerald-900/50 text-emerald-400 hover:text-emerald-300' 
                     : 'bg-red-900/30 border-red-900/50 text-red-400 hover:text-red-300'
                }\`}
              >
                {activeProfile.deletedAt ? (
                  <span>Unban</span>
                ) : (
                  <span>Ban</span>
                )}
              </button>
            )}
` + target;

content = content.replace(target, replacement);

const topTarget = `            {/* User Avatar Display */}`;
const topReplacement = `
            {activeProfile.deletedAt && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/80 border border-red-500/50 text-red-200 px-3 py-1 rounded font-mono text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                ACCOUNT SUSPENDED
              </div>
            )}
` + topTarget;

content = content.replace(topTarget, topReplacement);

fs.writeFileSync(file, content);
