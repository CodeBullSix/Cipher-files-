import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

const importToAdd = `import { AddToWorkspaceModal } from './AddToWorkspaceModal';\n`;
if (!content.includes('AddToWorkspaceModal')) {
  content = importToAdd + content;
}

const stateToAdd = `  const [isAddingToWorkspace, setIsAddingToWorkspace] = useState(false);\n`;
if (!content.includes('isAddingToWorkspace')) {
  content = content.replace("  const [showSubmissionRules", stateToAdd + "  const [showSubmissionRules");
}

const buttonHtml = `
              {currentUser && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}
                  className="p-2 border border-white/10 rounded hover:bg-white/[0.02] text-gray-400 hover:text-cyan-400 transition-colors"
                  title="Add to Workspace"
                >
                  <FolderArchive className="w-4 h-4" />
                </button>
              )}
              <button
`;

content = content.replace(
  `              <button\n                onClick={onClose}`,
  buttonHtml + `                onClick={onClose}`
);

// We need to make sure FolderArchive is imported. It might already be from lucide-react.

const modalHtml = `
      {isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType="CASE"
          entityId={caseFile.id}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}
`;

content = content.replace(
  `{activeEvidence && (`,
  modalHtml + `      {activeEvidence && (`
);

fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
