const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Appeals tab
const newTabs = `
                </button>
                <button
                  onClick={() => setActiveTab('appeals')}
                  className={\`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 \${
                    activeTab === 'appeals' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }\`}
                >
                  APPEALS ({appealsQueue.length})
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
`;

content = content.replace(
  `                </button>\n                <button\n                  onClick={() => setActiveTab('logs')}`,
  newTabs
);

// Add renderAppeals logic and call it
content = content.replace(
  "{activeTab === 'queue' && renderQueue()}",
  "{activeTab === 'queue' && renderQueue()}\n                {activeTab === 'appeals' && renderAppeals()}"
);

// Define handleAppealAction 
const appealHandlers = `
  const handleAppealAction = async (appealId: string, status: string) => {
    setProcessingId(appealId);
    try {
      sound.click();
      const token = await currentUser?.getIdToken();
      
      const reason = prompt(\`Reason for \${status.toLowerCase()} appeal:\`);
      if (reason === null) {
         setProcessingId(null);
         return;
      }
      
      const res = await fetch(\`/api/appeals/\${appealId}/status\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ status, resolutionReason: reason })
      });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || 'Failed to update appeal');
      }
      sound.blip(1200);
      fetchQueue();
    } catch (err: any) {
      sound.blip(200);
      alert(err.message || 'Failed to update appeal status');
    } finally {
      setProcessingId(null);
    }
  };

  const renderAppeals = () => {
    if (appealsQueue.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <ShieldAlert className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO APPEALS</h3>
          <p className="text-xs text-slate-600 mt-1">There are no appeals pending review.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appealsQueue.map(appeal => (
          <div key={appeal.id} className="bg-[#0A0E1A] border border-purple-900/50 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
            
            <div className="flex flex-col gap-2 shrink-0 border-r border-slate-800/80 pr-4 items-center justify-center min-w-[80px]">
              <div className={\`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase \${
                appeal.status === 'SUBMITTED' || appeal.status === 'UNDER_REVIEW' ? 'bg-amber-950/50 text-amber-500 border border-amber-900' :
                appeal.status === 'UPHELD' ? 'bg-emerald-950/50 text-emerald-500 border border-emerald-900' :
                'bg-slate-900 text-slate-500 border border-slate-800'
              }\`}>
                {appeal.status.replace('_', ' ')}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono bg-purple-950/30 text-purple-400 border border-purple-900/50 px-2 py-0.5 rounded uppercase">
                  {appeal.targetType}
                </span>
                <span className="text-xs font-mono font-bold text-white ml-2">Appeal from {appeal.appellantName || appeal.appellantId.substring(0,8)}</span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto shrink-0">
                  {formatDate(appeal.createdAt)}
                </span>
              </div>
              
              <div className="p-3 bg-slate-900/50 rounded border border-slate-800 mb-3">
                <p className="text-xs text-slate-300 italic">"{appeal.reason}"</p>
              </div>
              
              {appeal.originalModeratorId && (
                <p className="text-[10px] text-red-400/80 font-mono mt-1 mb-2">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Conflict Warning: Original decision made by {appeal.originalModeratorId === currentUser?.uid ? 'YOU' : 'another moderator'}.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0 border-l border-slate-800/80 pl-4 items-stretch justify-center">
              <button
                onClick={() => {
                  if (appeal.targetType === 'USER') onOpenEntity?.('profile', appeal.targetId);
                  else if (appeal.targetType === 'EVIDENCE') onOpenEntity?.('evidence', appeal.targetId);
                  else if (appeal.targetType === 'DISCUSSION' || appeal.targetType === 'REPLY') onOpenEntity?.('discussion', appeal.targetId);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-cyan-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 rounded text-xs font-mono transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Target
              </button>
              
              {(appeal.status === 'SUBMITTED' || appeal.status === 'UNDER_REVIEW') && (
                <>
                  <button
                    disabled={processingId === appeal.id}
                    onClick={() => handleAppealAction(appeal.id, 'UPHELD')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Uphold Original
                  </button>
                  <button
                    disabled={processingId === appeal.id}
                    onClick={() => handleAppealAction(appeal.id, 'OVERTURNED')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-950/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Overturn
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    );
  };
`;

content = content.replace(
  "  const renderQueue = () => {",
  appealHandlers + "\n  const renderQueue = () => {"
);

fs.writeFileSync(file, content);
