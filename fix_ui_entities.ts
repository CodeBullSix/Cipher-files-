import fs from 'fs';
const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const entitiesSection = `
                    {selectedSub.content?.entities?.map((ent: any) => (
                      <label key={ent.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[ent.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [ent.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-purple-400 block">ENTITY ({ent.type}): {ent.name}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{ent.description || 'No description'}</span>
                        </div>
                      </label>
                    ))}
                    {selectedSub.content?.documents?.map((doc: any) => (
                      <label key={doc.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[doc.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [doc.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-blue-400 block">DOCUMENT: {doc.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{doc.originAgency} - {doc.classificationLevel}</span>
                        </div>
                      </label>
                    ))}
                  </div>
`;

content = content.replace(/                  <\/div>\n                <\/div>/, entitiesSection + "                </div>");

fs.writeFileSync(path, content);
console.log("Fixed UI in ModerationQueueModal.tsx for entities");
