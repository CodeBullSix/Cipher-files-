with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

desktop_evidence_tab = """
          <button
            onClick={() => { onSelectTab('evidence'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'evidence'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Evidence</span>
          </button>
"""

if "onSelectTab('evidence')" not in content:
    content = content.replace("<span>Rabbit Hole Graph (Map)</span>\n          </button>", "<span>Rabbit Hole Graph (Map)</span>\n          </button>" + desktop_evidence_tab)

mobile_evidence_tab = """
        <button
          onClick={() => { onSelectTab('evidence'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'evidence'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Evidence</span>
        </button>
"""

if "<Database className=\"w-4 h-4\" />" not in content:
    content = content.replace("<span>Graph (Map)</span>\n        </button>", "<span>Graph (Map)</span>\n        </button>" + mobile_evidence_tab)
    
if "Database," not in content:
    content = content.replace("FolderArchive,", "FolderArchive, Database,")
elif "Database" not in content:
    content = content.replace("FolderArchive", "FolderArchive, Database")

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
