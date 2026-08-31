const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update state type and initial state
content = content.replace(
  "const [queue, setQueue] = useState<{evidence: any[], discussions: any[], replies: any[], reports: any[]}>({",
  "const [queue, setQueue] = useState<{evidence: any[], discussions: any[], replies: any[], reports: any[], logs: any[]}>({"
);
content = content.replace(
  "evidence: [], discussions: [], replies: [], reports: []",
  "evidence: [], discussions: [], replies: [], reports: [], logs: []"
);

// Update activeTab type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'evidence' | 'discussions' | 'replies' | 'reports'>('reports');",
  "const [activeTab, setActiveTab] = useState<'evidence' | 'discussions' | 'replies' | 'reports' | 'logs'>('reports');"
);

// Update fetchQueue
const fetchQueueOld = `      const [res, reportsRes] = await Promise.all([
        fetch('/api/moderation/queue', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        }),
        fetch('/api/reports', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        })
      ]);
      if (!res.ok || !reportsRes.ok) {
        if (res.status === 403 || reportsRes.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }
      const data = await res.json();
      const reportsData = await reportsRes.json();
      setQueue({ ...data, reports: reportsData });`;

const fetchQueueNew = `      const [res, reportsRes, logsRes] = await Promise.all([
        fetch('/api/moderation/queue', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        }),
        fetch('/api/reports', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        }),
        fetch('/api/moderation/logs', {
          headers: { 'Authorization': \`Bearer \${token}\` }
        })
      ]);
      if (!res.ok || !reportsRes.ok || !logsRes.ok) {
        if (res.status === 403 || reportsRes.status === 403 || logsRes.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }
      const data = await res.json();
      const reportsData = await reportsRes.json();
      const logsData = await logsRes.json();
      setQueue({ ...data, reports: reportsData, logs: logsData });`;

content = content.replace(fetchQueueOld, fetchQueueNew);

// Add tab button
const logsTabBtn = `
                <button
                  onClick={() => setActiveTab('logs')}
                  className={\`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 \${
                    activeTab === 'logs' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }\`}
                >
                  AUDIT LOGS ({queue.logs.length})
                </button>
`;
content = content.replace("              <div className=\"flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide\">", "              <div className=\"flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide\">" + logsTabBtn);

// Add render function for logs
const renderLogsFn = `
  const [logFilter, setLogFilter] = useState<'ALL' | 'REPORTS' | 'EVIDENCE' | 'USERS' | 'DISCUSSIONS'>('ALL');

  const renderLogs = () => {
    let filteredLogs = queue.logs;
    if (logFilter !== 'ALL') {
      filteredLogs = queue.logs.filter(log => {
        if (logFilter === 'REPORTS' && log.targetType === 'REPORT') return true;
        if (logFilter === 'EVIDENCE' && log.targetType === 'EVIDENCE') return true;
        if (logFilter === 'USERS' && log.targetType === 'USER') return true;
        if (logFilter === 'DISCUSSIONS' && (log.targetType === 'DISCUSSION' || log.targetType === 'REPLY')) return true;
        return false;
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {['ALL', 'REPORTS', 'EVIDENCE', 'USERS', 'DISCUSSIONS'].map(f => (
            <button
              key={f}
              onClick={() => setLogFilter(f as any)}
              className={\`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg border transition-colors whitespace-nowrap \${
                logFilter === f 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }\`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
            <ShieldCheck className="w-10 h-10 text-slate-700 mb-3" />
            <h3 className="text-sm font-mono font-bold text-slate-400">NO AUDIT EVENTS FOUND</h3>
            <p className="text-xs text-slate-600 mt-1">No moderation actions match the current filter.</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="bg-[#0A0E1A] border border-slate-800/80 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-amber-950/30 border border-amber-900/50">
                    <History className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Actor</h4>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-white">{log.actorDisplayName || log.actorUsername}</span> 
                      <span className="text-slate-500 ml-1">({log.actorId})</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Target</h4>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-cyan-400">{log.targetType}</span>
                      <span className="text-slate-500 ml-1">({log.targetId})</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-800/50">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 line-through decoration-slate-600">{log.previousStatus || 'N/A'}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-emerald-400 font-bold">{log.newStatus || 'N/A'}</span>
                  </div>
                  {log.reason && (
                    <p className="mt-2 text-xs text-slate-400 italic break-words">"{log.reason}"</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };
`;

content = content.replace("  const renderReports = () => {", renderLogsFn + "\n  const renderReports = () => {");
content = content.replace("{activeTab === 'reports' && renderReports()}", "{activeTab === 'reports' && renderReports()}\n                {activeTab === 'logs' && renderLogs()}");

if (!content.includes('History')) {
  content = content.replace("Eye", "Eye,\n  History,\n  ShieldCheck");
}

fs.writeFileSync(file, content);
