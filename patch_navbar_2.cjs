const fs = require('fs');
const file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const isModerator = "currentUser?.role === 'MODERATOR' || currentUser?.role === 'ADMIN'";

if (!content.includes('<span>Moderation</span>')) {
  // Desktop Tab
  content = content.replace(
    '</nav>',
    `  {(${isModerator}) && (
            <button
              onClick={() => { onSelectTab('moderation'); sound.click(); }}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase transition-all \${
                currentTab === 'moderation'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-red-400/80 hover:text-red-300 hover:bg-gray-800/40'
              }\`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Moderation</span>
            </button>
          )}
        </nav>`
  );

  // Mobile Tab
  content = content.replace(
    '        </div>\n\n    </header>',
    `  {(${isModerator}) && (
          <button
            onClick={() => { onSelectTab('moderation'); sound.click(); }}
            className={\`flex items-center gap-2 p-2 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase transition-all \${
              currentTab === 'moderation'
                ? 'text-red-300 bg-red-950/40'
                : 'text-red-400/80 hover:text-red-300'
            }\`}
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Moderation</span>
          </button>
        )}
      </div>

    </header>`
  );

  fs.writeFileSync(file, content);
}
