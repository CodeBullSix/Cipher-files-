const fs = require('fs');
const file = 'src/components/EvidenceDetailModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add AppealModal import
if (!content.includes('AppealModal')) {
  content = content.replace(
    "import { ReportModal } from './ReportModal';",
    "import { ReportModal } from './ReportModal';\nimport { AppealModal } from './AppealModal';"
  );
}

// Add state for appealing
if (!content.includes('appealingTarget')) {
  content = content.replace(
    "const [reportingTarget, setReportingTarget] = useState<string | null>(null);",
    "const [reportingTarget, setReportingTarget] = useState<string | null>(null);\n  const [appealingTarget, setAppealingTarget] = useState<string | null>(null);"
  );
}

// Add Appeal button in the verification notes block
const appealButtonCode = `
                  <p className="text-[10px] text-gray-500 mt-2 uppercase">Verified by: {evidence.verifier?.displayName}</p>
                  
                  {currentUser?.uid === evidence.submittedById && (evidence.status === 'REJECTED' || evidence.status === 'DISPUTED') && (
                    <div className="mt-4 pt-4 border-t border-red-900/30">
                      <button 
                        onClick={() => setAppealingTarget(evidence.id)}
                        className="px-3 py-1.5 bg-red-950/50 border border-red-500/30 text-red-400 hover:bg-red-900/80 rounded text-[10px] font-bold font-mono tracking-widest uppercase transition-colors"
                      >
                        Appeal Decision
                      </button>
                    </div>
                  )}
`;

content = content.replace(
  '<p className="text-[10px] text-gray-500 mt-2 uppercase">Verified by: {evidence.verifier?.displayName}</p>',
  appealButtonCode
);

// Add AppealModal rendering
if (!content.includes('appealingTarget &&')) {
  content = content.replace(
    "{reportingTarget && (",
    "{appealingTarget && (\n        <AppealModal\n          targetType=\"EVIDENCE\"\n          targetId={appealingTarget}\n          targetTitle={evidence.title}\n          onClose={() => setAppealingTarget(null)}\n        />\n      )}\n\n      {reportingTarget && ("
  );
}

fs.writeFileSync(file, content);
