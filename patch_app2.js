import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert entity state
const insertState = "const [graphTargetEntity, setGraphTargetEntity] = useState<string | null>(null);";
content = content.replace(insertState, insertState + "\n  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);\n  const [selectedEntityType, setSelectedEntityType] = useState<string>('people');");

// The handler insertion failed because it didn't find selectedCaseId. It was activeCaseId!
// Fix the EntityProfileModal props
content = content.replace("currentUser={user}", "currentUser={currentUser}");
content = content.replace("caseFileId={selectedCaseId || undefined}", "caseFileId={activeCaseId || undefined}");

// Let's insert the handleOpenEntity before handleOpenCase
const insertHandler = "const handleOpenCase = (caseId: string) => {";
content = content.replace(insertHandler, "const handleOpenEntity = (type: string, id: string) => {\n    setSelectedEntityType(type);\n    setSelectedEntityId(id);\n  };\n\n  " + insertHandler);

fs.writeFileSync('src/App.tsx', content);
