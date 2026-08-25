import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add EntityProfileModal import
content = content.replace(
  "import { CaseDetailModal } from './components/CaseDetailModal';",
  "import { CaseDetailModal } from './components/CaseDetailModal';\nimport { EntityProfileModal } from './components/EntityProfileModal';"
);

// 2. Add state
const statePattern = "const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);";
content = content.replace(
  statePattern,
  statePattern + "\n  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);\n  const [selectedEntityType, setSelectedEntityType] = useState<string>('people');"
);

// 3. Add handleOpenEntity
const handlersPattern = "const handleOpenCase = (caseId: string) => {";
content = content.replace(
  handlersPattern,
  "const handleOpenEntity = (type: string, id: string) => {\n    setSelectedEntityType(type);\n    setSelectedEntityId(id);\n  };\n\n  " + handlersPattern
);

// 4. Pass handleOpenEntity to RabbitHoleGraph
content = content.replace(
  "onRewardXp={handleRewardXp}",
  "onRewardXp={handleRewardXp}\n              onOpenEntity={handleOpenEntity}"
);

// 5. Add EntityProfileModal component in the return statement near CaseDetailModal
const renderPattern = "{/* 1. Case Detail Modal */}\n      {selectedCaseId && (\n        <CaseDetailModal";
content = content.replace(
  "{/* 1. Case Detail Modal */}",
  "{selectedEntityId && (\n        <EntityProfileModal\n          isOpen={!!selectedEntityId}\n          onClose={() => setSelectedEntityId(null)}\n          entityId={selectedEntityId}\n          type={selectedEntityType as any}\n          currentUser={user}\n          caseFileId={selectedCaseId || undefined}\n        />\n      )}\n\n      {/* 1. Case Detail Modal */}"
);

fs.writeFileSync('src/App.tsx', content);
