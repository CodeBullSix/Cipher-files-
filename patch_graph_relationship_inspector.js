import fs from 'fs';
let content = fs.readFileSync('src/components/RabbitHoleGraph.tsx', 'utf8');

const target = "{/* Selected Edge Inspector Drawer */}";
const newContent = `
      {/* Selected Edge Inspector Drawer */}
      {selectedLink && (
        <div className="absolute top-16 right-4 z-30 w-80 border border-amber-500/50 bg-[#0D0D0D]/95 backdrop-blur-md p-4 shadow-2xl text-white animate-in slide-in-from-right-4 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <span className="text-[9px] mono font-bold text-amber-400 uppercase tracking-wider">
              RELATIONSHIP INSPECTOR
            </span>
            <button onClick={() => setSelectedLink(null)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-500 block mb-1">SOURCE</span>
              <span className="text-cyan-400 font-bold">
                {typeof selectedLink.source === 'object' ? (selectedLink.source as any).label : selectedLink.source}
              </span>
            </div>
            
            <div className="py-2 border-y border-gray-800 flex flex-col items-center justify-center">
              <span className="text-[10px] text-amber-400 font-bold tracking-widest">{selectedLink.relationship}</span>
              <ArrowRight className="w-4 h-4 text-gray-500 my-1" />
              <span className="text-[10px] text-gray-500">{selectedLink.verified ? 'VERIFIED CONNECTION' : 'UNVERIFIED / DISPUTED'}</span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">TARGET</span>
              <span className="text-cyan-400 font-bold">
                {typeof selectedLink.target === 'object' ? (selectedLink.target as any).label : selectedLink.target}
              </span>
            </div>
            
            {selectedLink.relId && (
              <div className="pt-2">
                <span className="text-gray-500 block mb-1 text-[10px]">PROVENANCE ID</span>
                <span className="text-white/70 block text-[9px] truncate">{selectedLink.relId}</span>
              </div>
            )}
          </div>
        </div>
      )}
`;

content = content.replace(/\{\/\* Selected Edge Inspector Drawer \*\/\}.*/s, newContent.trim() + "\n    </div>\n  );\n};\n");

fs.writeFileSync('src/components/RabbitHoleGraph.tsx', content);
