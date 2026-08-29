import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters'>('cases');",
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces'>('cases');"
);
content = content.replace(
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence'>('cases');",
  "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces'>('cases');"
);

const importString = "import { InvestigationWorkspaceView } from './components/InvestigationWorkspaceView';\n";
if (!content.includes('InvestigationWorkspaceView')) {
  content = content.replace("import { QuickSearchModal }", importString + "import { QuickSearchModal }");
}

const viewCode = `
        {/* VIEW 6: WORKSPACES */}
        {currentTab === 'workspaces' && (
          <InvestigationWorkspaceView
            currentUser={currentUser || (legacyProfile as any)}
            onOpenEntity={handleOpenEntity}
            onOpenCase={handleOpenCase}
            onOpenEvidence={handleOpenEvidence}
            onOpenEvent={handleOpenEvent}
          />
        )}
`;

content = content.replace(
  "{/* VIEW 5: EVIDENCE ARCHIVE */}",
  viewCode + "\n        {/* VIEW 5: EVIDENCE ARCHIVE */}"
);

fs.writeFileSync('src/App.tsx', content);
