import fs from 'fs';
const path = 'src/components/ModerationQueueModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const relsSection = `
                    {selectedSub.content?.relationships?.map((rel: any) => (
                      <label key={rel.id} className="flex items-start gap-2 cursor-pointer p-1.5 hover:bg-slate-800/50 rounded ml-4">
                        <input type="checkbox" checked={!!approvedComponents[rel.id]} onChange={(e) => setApprovedComponents(prev => ({ ...prev, [rel.id]: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono text-pink-400 block">RELATIONSHIP: {rel.relationshipType}</span>
                          <span className="text-[9px] font-mono text-slate-400 line-clamp-1">{rel.description || 'Unspecified link'}</span>
                        </div>
                      </label>
                    ))}
                  </div>
`;

content = content.replace(/                  <\/div>\n                <\/div>/, relsSection + "                </div>");

fs.writeFileSync(path, content);
console.log("Fixed UI in ModerationQueueModal.tsx for relationships");
