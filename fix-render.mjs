import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

if (!content.includes('<AddToWorkspaceModal')) {
  content = content.replace(
    "{activeEvidence && (",
    `{isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType="CASE"
          entityId={caseFile.id}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}
      {activeEvidence && (`
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
}
