import fs from 'fs';
const path = 'src/components/CaseDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add onLaunchGraph to Props
content = content.replace(
  /  onJumpGraphEntity\?\: \(entityName: string\) => void;/,
  `  onJumpGraphEntity?: (entityName: string) => void;\n  onLaunchGraph?: (targetEntity?: string) => void;`
);

// 2. Destructure onLaunchGraph
content = content.replace(
  /  onJumpGraphEntity\,\n  currentUser\,/,
  `  onJumpGraphEntity,\n  onLaunchGraph,\n  currentUser,`
);

// 3. Update Rabbit Hole tab to use onLaunchGraph
const rabbitHoleUpdate = `
        {/* TAB: RABBIT HOLE */}
        {activeTab === 'rabbithole' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-cipher-surface border border-cipher-accent/30 text-center">
              <h3 className="font-mono text-lg font-bold text-cipher-accent uppercase mb-2">EXPLORE CONNECTIONS IN THE NEXUS</h3>
              <p className="text-sm text-gray-300">
                Visualize all interconnected evidence, people, organisations, and locations for this case in the interactive Rabbit Hole Graph.
              </p>
            </div>
            <div className="flex justify-center mt-6"> 
               <button 
                   onClick={() => { 
                     if (onLaunchGraph) {
                        onLaunchGraph(currentCase.title);
                     } else if (onJumpGraphEntity) {
                        onJumpGraphEntity(currentCase.title);
                     }
                   }} 
                   className="px-8 py-4 bg-cipher-accent/10 border border-cipher-accent hover:bg-cipher-accent/20 text-cipher-accent hover:text-white font-mono font-bold text-lg transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-3" 
               >
                  <Share2 className="w-5 h-5" />
                  ENTER RABBIT HOLE
               </button>
            </div>
          </div>
        )}
`;

content = content.replace(
  /        \{\/\* TAB\: RABBIT HOLE \*\/\}\n        \{activeTab === \'rabbithole\' && \([\s\S]*?ENTER THE NEXUS FOR THIS CASE\n               <\/button>\n            <\/div>\n          <\/div>\n        \)\}/,
  rabbitHoleUpdate
);

fs.writeFileSync(path, content);
console.log("Updated Rabbit Hole integration");
