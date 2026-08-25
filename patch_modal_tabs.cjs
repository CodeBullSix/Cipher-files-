const fs = require('fs');
let content = fs.readFileSync('src/components/CaseDetailModal.tsx', 'utf8');

const peopleTabRender = `
        {/* TAB: PEOPLE */}
        {activeTab === 'people' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">
                PERSONS OF INTEREST
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Individuals connected to this investigation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e: any) => e.type === 'PERSON').map((ent: any, idx: number) => (
                <div key={idx} onClick={() => onJumpGraphEntity?.(ent.name)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-cyan-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-white">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
              {(currentCase.entities || []).filter((e: any) => e.type === 'PERSON').length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500 font-mono text-xs">NO KNOWN PERSONS OF INTEREST</div>
              )}
            </div>
          </div>
        )}
`;

const orgsTabRender = `
        {/* TAB: ORGANISATIONS */}
        {activeTab === 'organisations' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">
                INVOLVED ORGANISATIONS
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Agencies, corporations, and groups connected to this investigation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e: any) => e.type === 'ORGANISATION').map((ent: any, idx: number) => (
                <div key={idx} onClick={() => onJumpGraphEntity?.(ent.name)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-amber-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-amber-400">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
              {(currentCase.entities || []).filter((e: any) => e.type === 'ORGANISATION').length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500 font-mono text-xs">NO KNOWN ORGANISATIONS</div>
              )}
            </div>
          </div>
        )}
`;

const locsTabRender = `
        {/* TAB: LOCATIONS */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">
                KEY LOCATIONS
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Geographic points of interest connected to this investigation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e: any) => e.type === 'LOCATION').map((ent: any, idx: number) => (
                <div key={idx} onClick={() => onJumpGraphEntity?.(ent.name)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-blue-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-blue-400">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
              {(currentCase.entities || []).filter((e: any) => e.type === 'LOCATION').length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500 font-mono text-xs">NO KNOWN LOCATIONS</div>
              )}
            </div>
          </div>
        )}
`;

const rabbitTabRender = `
        {/* TAB: RABBIT HOLE */}
        {activeTab === 'rabbithole' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30">
              <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                RABBIT HOLE CONNECTIONS
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Related investigations and cross-case connections.
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
               <button 
                  onClick={() => onJumpGraphEntity?.('case_files_' + currentCase.id)} 
                  className="px-6 py-3 bg-cyan-900/40 border border-cyan-500/50 hover:bg-cyan-800/60 text-cyan-300 font-mono font-bold transition-colors shadow-lg"
               >
                  ENTER THE NEXUS FOR THIS CASE
               </button>
            </div>
          </div>
        )}
`;

// Insert the new tab renders right before the closing tag of the main content area (which we can identify by finding the end of the discussions tab or similar).
// Let's insert it before `{/* TAB 8: COMMUNITY DEBATES`

if (!content.includes("{/* TAB: PEOPLE */}")) {
  content = content.replace(
    "{/* TAB 8: COMMUNITY DEBATES & TACTICAL BRIEFS */}",
    `${peopleTabRender}\n${orgsTabRender}\n${locsTabRender}\n${rabbitTabRender}\n\n          {/* TAB 8: COMMUNITY DEBATES & TACTICAL BRIEFS */}`
  );
  fs.writeFileSync('src/components/CaseDetailModal.tsx', content);
  console.log("Successfully patched CaseDetailModal.tsx");
} else {
  console.log("Already patched.");
}
