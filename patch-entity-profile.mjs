import fs from 'fs';
let content = fs.readFileSync('src/components/EntityProfileModal.tsx', 'utf8');

const importToAdd = `import { AddToWorkspaceModal } from './AddToWorkspaceModal';\n`;
if (!content.includes('AddToWorkspaceModal')) {
  content = importToAdd + content;
}

const stateToAdd = `  const [isAddingToWorkspace, setIsAddingToWorkspace] = useState(false);\n`;
if (!content.includes('isAddingToWorkspace')) {
  content = content.replace("  const [evidenceSearchResults", stateToAdd + "  const [evidenceSearchResults");
}

const buttonHtml = `
              {currentUser && (
                <button
                  onClick={() => setIsAddingToWorkspace(true)}
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

const modalHtml = `
      {isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType={type === 'people' ? 'PERSON' : type === 'organisations' ? 'ORGANISATION' : 'LOCATION'}
          entityId={entityId}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}
`;

content = content.replace(
  `{isEditModalOpen && (`,
  modalHtml + `      {isEditModalOpen && (`
);

fs.writeFileSync('src/components/EntityProfileModal.tsx', content);
