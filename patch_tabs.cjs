const fs = require('fs');
const file = 'src/components/InvestigatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const tabHtml = `              <button
                onClick={() => { setActiveTab('contributions'); sound.click(); }}
                className={\`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors \${
                  activeTab === 'contributions'
                    ? \`\${currentTheme.bg} \${currentTheme.text} border \${currentTheme.border} shadow-sm\`
                    : 'text-slate-400 hover:text-white'
                }\`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Contributions</span>
              </button>
`;

content = content.replace(
  "<span>Customize Profile</span>",
  "<span>Customize Profile</span>\n              </button>\n\n" + tabHtml
);
content = content.replace(/<Activity/g, "<Activity");
// Note: we'll check if Activity is imported

fs.writeFileSync(file, content);
