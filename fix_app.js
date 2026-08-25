import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace double handler
content = content.replace("const handleOpenEntity = (type: string, id: string) => {\n    setSelectedEntityType(type);\n    setSelectedEntityId(id);\n  };\n\n  const handleOpenEntity", "const handleOpenEntity");

// Make sure EntityProfileModal has the right variables
content = content.replace("caseFileId={selectedCaseId || undefined}", "caseFileId={activeCaseId || undefined}");
content = content.replace("currentUser={user}", "currentUser={currentUser}");

fs.writeFileSync('src/App.tsx', content);
