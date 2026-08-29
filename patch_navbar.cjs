const fs = require('fs');
const file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const isModerator = "currentUser?.role === 'MODERATOR' || currentUser?.role === 'ADMIN'";

if (!content.includes('tab: \'cases\' | \'graph\' | \'discussions\' | \'supporters\' | \'evidence\' | \'workspaces\' | \'moderation\'')) {
  // Fix types
  content = content.replace(
    /tab: 'cases' \| 'graph' \| 'discussions' \| 'supporters' \| 'evidence' \| 'workspaces'/g,
    "tab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces' | 'moderation'"
  );

  const modTabHtml = `
          {(${isModerator}) && (
            <button
              onClick={() => { onSelectTab('moderation'); sound.click(); }}
              className={\`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors whitespace-nowrap \${
                currentTab === 'moderation' 
                  ? 'text-red-400 border-b-2 border-red-500 bg-red-500/10' 
                  : 'text-slate-400 hover:text-red-300 hover:bg-slate-800/50'
              }\`}
            >
              Moderation
            </button>
          )}
  `;

  content = content.replace(
    "{/* MOBILE OVERFLOW GRADIENT */}",
    modTabHtml + "\n        {/* MOBILE OVERFLOW GRADIENT */}"
  );

  const mobileModTabHtml = `
          {(${isModerator}) && (
            <button 
              onClick={() => { onSelectTab('moderation'); sound.click(); }}
              className={\`w-full text-left px-4 py-3 text-sm font-mono tracking-widest uppercase transition-colors \${
                currentTab === 'moderation' 
                  ? 'bg-red-950/40 text-red-400 border-l-2 border-red-500' 
                  : 'text-slate-400 hover:text-red-300 hover:bg-slate-800/50'
              }\`}
            >
              Moderation
            </button>
          )}
  `;

  content = content.replace(
    /<button\s+onClick=\{\(\) => \{ onSelectTab\('supporters'\); sound.click\(\); \}\}[\s\S]*?Supporters\s+<\/button>/g,
    match => match + "\n" + mobileModTabHtml
  );

  fs.writeFileSync(file, content);
}
