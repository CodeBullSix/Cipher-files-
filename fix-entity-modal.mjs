import fs from 'fs';
let content = fs.readFileSync('src/components/EntityProfileModal.tsx', 'utf8');

if (!content.includes('AddToWorkspaceModal')) {
  content = `import { AddToWorkspaceModal } from './AddToWorkspaceModal';\n` + content;
  content = content.replace(
    "  const [evidenceSearchResults, setEvidenceSearchResults] = useState<any[]>([]);",
    "  const [evidenceSearchResults, setEvidenceSearchResults] = useState<any[]>([]);\n  const [isAddingToWorkspace, setIsAddingToWorkspace] = useState(false);"
  );
  content = content.replace(
    "{isEditModalOpen && (",
    `{isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType={type === 'people' ? 'PERSON' : type === 'organisations' ? 'ORGANISATION' : 'LOCATION'}
          entityId={entityId}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}\n      {isEditModalOpen && (`
  );
  fs.writeFileSync('src/components/EntityProfileModal.tsx', content);
}
