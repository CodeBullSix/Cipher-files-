const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { ReportModal }')) {
  content = content.replace("import { ApiService } from '../services/apiService';", "import { ApiService } from '../services/apiService';\nimport { ReportModal } from './ReportModal';");
}

if (!content.includes('const [reportingTarget')) {
  content = content.replace("  const [activeTab, setActiveTab]", "  const [reportingTarget, setReportingTarget] = useState<string | null>(null);\n  const [activeTab, setActiveTab]");
}

const followBtnBlock = `{isFollowing ? (
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
            )}`;

const reportUserBtn = `
            {!isOwnProfile && currentUser && (
              <button
                onClick={() => setReportingTarget(activeProfile.uid)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border bg-slate-900 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            )}
`;

content = content.replace(followBtnBlock, followBtnBlock + reportUserBtn);

const modalString = `
      {reportingTarget && (
        <ReportModal
          targetType="USER"
          targetId={reportingTarget}
          onClose={() => setReportingTarget(null)}
        />
      )}
    </div>
  );
`;
content = content.replace("    </div>\n  );\n};", modalString + "};");

fs.writeFileSync(file, content);
