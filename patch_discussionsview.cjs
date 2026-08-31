const fs = require('fs');
const file = 'src/components/DiscussionsView.tsx';
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
    "const [reportingTarget, setReportingTarget] = useState<{id: string, type: string} | null>(null);",
    "const [reportingTarget, setReportingTarget] = useState<{id: string, type: string} | null>(null);\n  const [appealingTarget, setAppealingTarget] = useState<{id: string, type: string, title: string} | null>(null);"
  );
}

// Thread appeal button
content = content.replace(
  "{activeThread.deletedAt ? '[This thread was removed by moderation]' : activeThread.initialComment}",
  "{activeThread.deletedAt ? '[This thread was removed by moderation]' : activeThread.initialComment}\n              {activeThread.deletedAt && currentUser?.uid === activeThread.authorUid && (\n                <button\n                  onClick={() => setAppealingTarget({ id: activeThread.id, type: 'DISCUSSION', title: activeThread.title })}\n                  className=\"ml-4 px-2 py-1 bg-red-950/50 border border-red-500/30 text-red-400 hover:bg-red-900/80 rounded text-[10px] font-bold font-mono tracking-widest uppercase transition-colors inline-flex\"\n                >\n                  Appeal Decision\n                </button>\n              )}"
);

// Reply appeal button
content = content.replace(
  "{comment.deletedAt ? '[This comment was removed by moderation]' : comment.content}",
  "{comment.deletedAt ? '[This comment was removed by moderation]' : comment.content}\n            {comment.deletedAt && currentUser?.uid === comment.authorUid && (\n                <button\n                  onClick={() => setAppealingTarget({ id: comment.id, type: 'REPLY', title: 'Reply to: ' + activeThread!.title })}\n                  className=\"ml-4 px-2 py-1 bg-red-950/50 border border-red-500/30 text-red-400 hover:bg-red-900/80 rounded text-[10px] font-bold font-mono tracking-widest uppercase transition-colors inline-flex\"\n                >\n                  Appeal Decision\n                </button>\n            )}"
);

// Render AppealModal
content = content.replace(
  "{reportingTarget && (",
  "{appealingTarget && (\n        <AppealModal\n          targetType={appealingTarget.type}\n          targetId={appealingTarget.id}\n          targetTitle={appealingTarget.title}\n          onClose={() => setAppealingTarget(null)}\n        />\n      )}\n\n      {reportingTarget && ("
);

fs.writeFileSync(file, content);
