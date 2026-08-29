import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const workspaceDesktopBtn = `
          <button
            onClick={() => { onSelectTab('workspaces'); sound.click(); }}
            className={\`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors \${
              currentTab === 'workspaces'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }\`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Workspaces</span>
          </button>
`;

if (!content.includes('<span>Workspaces</span>')) {
  // Insert into Desktop nav
  content = content.replace(
    `<nav className="hidden md:flex items-center gap-1 bg-[#090D1A] border border-gray-800 p-1 rounded-xl">`,
    `<nav className="hidden md:flex items-center gap-1 bg-[#090D1A] border border-gray-800 p-1 rounded-xl">` + workspaceDesktopBtn
  );
  
  // Insert into Mobile nav
  const workspaceMobileBtn = `
        <button
          onClick={() => { onSelectTab('workspaces'); sound.click(); }}
          className={\`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors \${
            currentTab === 'workspaces'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }\`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Workspaces</span>
        </button>
`;
  content = content.replace(
    `<div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#04060C] border-t border-gray-800/80">`,
    `<div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#04060C] border-t border-gray-800/80">` + workspaceMobileBtn
  );
  
  fs.writeFileSync('src/components/Navbar.tsx', content);
}
