const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ModerationDashboardView')) {
  // Add import
  content = content.replace(
    "import { SupportersView } from './components/SupportersView';",
    "import { SupportersView } from './components/SupportersView';\nimport { ModerationDashboardView } from './components/ModerationDashboardView';"
  );

  // Update currentTab type
  content = content.replace(
    /const \[currentTab, setCurrentTab\] = useState<\'cases\' \| \'graph\' \| \'discussions\' \| \'supporters\' \| \'evidence\' \| \'workspaces\'>\(\'cases\'\);/,
    "const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces' | 'moderation'>('cases');"
  );

  // Add the view block inside <main>
  const modViewBlock = `
        {/* VIEW 7: MODERATION DASHBOARD */}
        {currentTab === 'moderation' && (
          <ModerationDashboardView 
            currentUser={currentUser} 
            onOpenEntity={handleOpenEntity}
          />
        )}
`;

  content = content.replace(
    "      </main>",
    modViewBlock + "      </main>"
  );

  fs.writeFileSync(file, content);
}
