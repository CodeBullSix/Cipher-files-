const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

const reportTabHTML = `
                <button
                  onClick={() => setActiveTab('reports')}
                  className={\`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 \${
                    activeTab === 'reports' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }\`}
                >
                  REPORTS ({queue.reports.length})
                </button>
`;

content = content.replace("              <div className=\"flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide\">", "              <div className=\"flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide\">" + reportTabHTML);

const renderReportsFn = `
  const handleReportAction = async (reportId: string, status: string) => {
    try {
      setProcessingId(reportId);
      await ApiService.updateReportStatus(reportId, status);
      await fetchQueue();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const renderReports = () => {
    if (queue.reports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <CheckCircle className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO REPORTS</h3>
          <p className="text-xs text-slate-600 mt-1">Report queue is clear.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {queue.reports.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono font-bold text-red-400">REPORT</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-1">Target: {item.targetType}</p>
              <p className="text-xs text-slate-400 mb-1">Reason: <span className="font-bold text-slate-300">{item.reason}</span></p>
              {item.description && <p className="text-xs text-slate-400 italic mb-2">"{item.description}"</p>}
              <div className="text-[10px] font-mono text-slate-500 mt-2">
                Reporter: <button onClick={() => onOpenEntity?.('profile', item.reporterId)} className="text-cyan-400 hover:underline">{item.reporterDisplayName || item.reporterUsername}</button>
                {item.targetAuthorId && (
                  <span className="ml-2">Target Author: <button onClick={() => onOpenEntity?.('profile', item.targetAuthorId)} className="text-orange-400 hover:underline">{item.targetAuthorId}</button></span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button
                disabled={processingId === item.id}
                onClick={() => onOpenEntity?.(item.targetType.toLowerCase(), item.targetId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded text-xs font-mono transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Target
              </button>
              {item.status !== 'RESOLVED' && (
                <button
                  disabled={processingId === item.id}
                  onClick={() => handleReportAction(item.id, 'RESOLVED')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve
                </button>
              )}
              {item.status !== 'DISMISSED' && (
                <button
                  disabled={processingId === item.id}
                  onClick={() => handleReportAction(item.id, 'DISMISSED')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800 rounded text-xs font-mono transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
`;

content = content.replace("  const renderReplies = () => {", renderReportsFn + "\n  const renderReplies = () => {");
content = content.replace("{activeTab === 'replies' && renderReplies()}", "{activeTab === 'replies' && renderReplies()}\n                {activeTab === 'reports' && renderReports()}");

fs.writeFileSync(file, content);
