import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
  "currentTab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence';",
  "currentTab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces';"
);
content = content.replace(
  "currentTab: 'cases' | 'graph' | 'discussions' | 'supporters';",
  "currentTab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces';"
);
content = content.replace(
  "onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence') => void;",
  "onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces') => void;"
);
content = content.replace(
  "onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters') => void;",
  "onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces') => void;"
);

// Add the workspaces button before graph
content = content.replace(
  `<button
            onClick={() => {
              sound.click();
              onSelectTab('graph');`,
  `<button
            onClick={() => {
              sound.click();
              onSelectTab('workspaces');
            }}
            className={\`group flex items-center px-4 py-2 sm:py-3 transition-all duration-300 relative border-r border-white/5 \${
              currentTab === 'workspaces'
                ? 'text-[#00E5FF] bg-white/[0.02]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
            }\`}
          >
            <div className="flex items-center gap-2 relative z-10">
              <FolderArchive className={\`w-4 h-4 transition-transform duration-300 \${currentTab === 'workspaces' ? 'scale-110' : 'group-hover:scale-110'}\`} />
              <span className="text-xs tracking-[0.2em] uppercase font-medium hidden sm:inline-block">Workspace</span>
            </div>
            {currentTab === 'workspaces' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            )}
          </button>
          <button
            onClick={() => {
              sound.click();
              onSelectTab('graph');`
);
fs.writeFileSync('src/components/Navbar.tsx', content);
