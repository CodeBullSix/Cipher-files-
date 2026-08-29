import fs from 'fs';
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

if (!content.includes('<AddToWorkspaceModal')) {
  content = content.replace(
    "  );};",
    `
      {isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType="CASE"
          entityId={caseFile.id}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}
  );};`
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
}

let content2 = fs.readFileSync('src/components/EvidenceDetailModal.tsx', 'utf8');
if (!content2.includes('<AddToWorkspaceModal')) {
  content2 = content2.replace(
    "  );};",
    `
      {isAddingToWorkspace && (
        <AddToWorkspaceModal
          entityType="EVIDENCE"
          entityId={evidence.id}
          onClose={() => setIsAddingToWorkspace(false)}
        />
      )}
  );};`
  );
  fs.writeFileSync('src/components/EvidenceDetailModal.tsx', content2);
}
