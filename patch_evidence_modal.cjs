const fs = require('fs');
const file = 'src/components/EvidenceDetailModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { ReportModal }')) {
  content = content.replace("import { EvidenceItem } from '../types';", "import { EvidenceItem } from '../types';\nimport { ReportModal } from './ReportModal';");
}

if (!content.includes('AlertTriangle')) {
  content = content.replace("Edit,", "Edit,\n  AlertTriangle,");
}

if (!content.includes('const [reportingTarget')) {
  content = content.replace("  const [showEdit, setShowEdit] = useState(false);", "  const [showEdit, setShowEdit] = useState(false);\n  const [reportingTarget, setReportingTarget] = useState<string | null>(null);");
}

const actionButtons = `                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR') && (
                  <button onClick={() => setShowEdit(true)} className="flex items-center justify-center p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors" title="Edit Evidence">
                    <Edit className="w-5 h-5" />
                  </button>
                )}`;

const reportBtn = `                <button onClick={() => setReportingTarget(item.id)} className="flex items-center justify-center p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-colors" title="Report Evidence">
                  <AlertTriangle className="w-5 h-5" />
                </button>`;

if (content.includes(actionButtons)) {
   content = content.replace(actionButtons, reportBtn + "\n" + actionButtons);
} else {
   // Alternative placement
   const alternative = `<div className="flex gap-2">`;
   content = content.replace(alternative, alternative + "\n" + reportBtn);
}

const modalString = `
      {reportingTarget && (
        <ReportModal
          targetType="EVIDENCE"
          targetId={reportingTarget}
          onClose={() => setReportingTarget(null)}
        />
      )}
    </div>
  );
`;
content = content.replace("    </div>\n  );\n};", modalString + "};");

fs.writeFileSync(file, content);
