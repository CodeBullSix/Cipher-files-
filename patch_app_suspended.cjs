const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add state for suspended
if (!content.includes('isSuspended')) {
  content = content.replace(
    "const [currentUser, setCurrentUser] = useState<User | null>(null);",
    "const [currentUser, setCurrentUser] = useState<User | null>(null);\n  const [isSuspended, setIsSuspended] = useState(false);\n  const [appealingTarget, setAppealingTarget] = useState<{id: string, type: string, title: string} | null>(null);"
  );
}

if (!content.includes('AppealModal')) {
  content = content.replace(
    "import { UserProfile } from './components/UserProfile';",
    "import { UserProfile } from './components/UserProfile';\nimport { AppealModal } from './components/AppealModal';"
  );
}

// Modify the initial fetch
const newEffect = `
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const res = await ApiService.getCurrentUser();
          const data = await res.json();
          if (res.status === 403 && data.error?.includes('suspended')) {
            setIsSuspended(true);
          } else if (res.ok && data.deletedAt) {
            setIsSuspended(true);
          } else {
            setIsSuspended(false);
          }
        } catch (err) {
          // Fallback if needed
        }
      } else {
        setIsSuspended(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
`;

// Wait, the existing useEffect is:
content = content.replace(
  /useEffect\(\(\) => \{\n    const unsubscribe = auth\.onAuthStateChanged\(\(user\) => \{\n      setCurrentUser\(user\);\n      setLoading\(false\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);/g,
  newEffect
);

// Render the suspended overlay
const suspendedOverlay = `
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-900/50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0A0E1A] border border-red-900/50 rounded-lg p-6 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>
          <div className="w-16 h-16 bg-red-950/50 border border-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-400 font-mono tracking-widest uppercase mb-2">Account Suspended</h2>
          <p className="text-sm text-slate-400 mb-6">Your access to Cipher Files has been revoked by moderation.</p>
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => setAppealingTarget({ id: currentUser!.uid, type: 'USER', title: 'Account Suspension' })}
                className="w-full py-2 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 rounded text-xs font-mono font-bold transition-colors uppercase tracking-widest"
             >
                Appeal Suspension
             </button>
             <button 
                onClick={() => auth.signOut()}
                className="w-full py-2 bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 rounded text-xs font-mono font-bold transition-colors uppercase tracking-widest"
             >
                Sign Out
             </button>
          </div>
        </div>
        {appealingTarget && (
          <AppealModal
            targetType={appealingTarget.type}
            targetId={appealingTarget.id}
            targetTitle={appealingTarget.title}
            onClose={() => setAppealingTarget(null)}
          />
        )}
      </div>
    );
  }
`;

content = content.replace(
  "if (loading) {",
  suspendedOverlay + "\n  if (loading) {"
);

fs.writeFileSync(file, content);
