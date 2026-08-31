const fs = require('fs');
const file = 'src/components/ModerationDashboardView.tsx';
let content = fs.readFileSync(file, 'utf8');

const logTargetBtnStr = `              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">`;

const logTargetBtnNewStr = `              <div className="flex flex-col gap-2 shrink-0 border-r border-slate-800/80 pr-4 mr-4 items-center justify-center">
                 <button
                  onClick={() => {
                     if (log.targetType === 'USER') onOpenEntity?.('profile', log.targetId);
                     else if (log.targetType === 'EVIDENCE') onOpenEntity?.('evidence' as any, log.targetId);
                     else if (log.targetType === 'DISCUSSION' || log.targetType === 'REPLY') onOpenEntity?.('discussion' as any, log.targetId);
                  }}
                  className="p-2 bg-slate-900 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-colors"
                  title="View Target"
                 >
                   <Eye className="w-4 h-4" />
                 </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">`;

if (!content.includes('log.targetType === \'USER\'')) {
  content = content.replace(logTargetBtnStr, logTargetBtnNewStr);
}

fs.writeFileSync(file, content);
