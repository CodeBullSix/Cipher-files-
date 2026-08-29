import fs from 'fs';
let content = fs.readFileSync('src/components/WorkspaceEditor.tsx', 'utf8');

const oldBoardCode = `const WorkspaceBoard = ({ ws, reload }: { ws: InvestigationWorkspace, reload: () => void }) => {`;

const newBoardCode = `
import { QuickSearchModal } from './QuickSearchModal';

const WorkspaceBoard = ({ ws, reload, onOpenEntity, onOpenCase, onOpenEvidence, onOpenEvent }: { ws: InvestigationWorkspace, reload: () => void, onOpenEntity: any, onOpenCase: any, onOpenEvidence: any, onOpenEvent: any }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addingConnection, setAddingConnection] = useState(false);
  
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [linkLabel, setLinkLabel] = useState('');

  const handleAddReference = async (type: string, id: string) => {
    try {
      await ApiService.addWorkspaceReference(ws.id, { entityType: type, entityId: id });
      reload();
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteReference = async (refId: string) => {
    try {
      await ApiService.removeWorkspaceReference(ws.id, refId);
      reload();
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleCreateConnection = async () => {
    if (!sourceId || !targetId || !linkLabel) return;
    try {
      await ApiService.addWorkspaceConnection(ws.id, {
        sourceRefId: sourceId,
        targetRefId: targetId,
        label: linkLabel
      });
      setAddingConnection(false);
      setSourceId('');
      setTargetId('');
      setLinkLabel('');
      reload();
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteConnection = async (connId: string) => {
    try {
      await ApiService.removeWorkspaceConnection(ws.id, connId);
      reload();
    } catch (err) {
      console.error(err);
    }
  };
  
  const getRefDisplay = (refId: string) => {
    const ref = ws.references?.find(r => r.id === refId);
    if (!ref) return 'Unknown Reference';
    return (ref as any).resolvedData?.title || ref.entityId;
  };
`;

content = content.replace(
  `import { ArrowLeft, Save, Loader, Search, Plus, X, Link as LinkIcon, FileText, Database, Users, Building2, MapPin, Sparkles } from 'lucide-react';`,
  `import { ArrowLeft, Save, Loader, Search, Plus, X, Link as LinkIcon, FileText, Database, Users, Building2, MapPin, Sparkles, Trash2 } from 'lucide-react';`
);

content = content.replace(
  `<WorkspaceBoard ws={ws} reload={loadWorkspace} />`,
  `<WorkspaceBoard ws={ws} reload={loadWorkspace} onOpenEntity={onOpenEntity} onOpenCase={onOpenCase} onOpenEvidence={onOpenEvidence} onOpenEvent={onOpenEvent} />`
);

content = content.replace(oldBoardCode, newBoardCode);

// Update references list
content = content.replace(
  `{ws.references?.map(r => (
                 <div key={r.id} className="p-3 border border-white/10 rounded-lg bg-black/50">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span className="font-mono">{r.entityType}</span>
                    </div>
                    <div className="text-sm font-medium text-white break-all">{r.entityId}</div>
                 </div>
               ))}`,
  `{ws.references?.map(r => (
                 <div key={r.id} className="group relative p-3 border border-white/10 hover:border-white/20 rounded-lg bg-black/50 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteReference(r.id)} className="p-1 text-gray-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span className="font-mono">{r.entityType}</span>
                    </div>
                    <div className="text-sm font-medium text-white line-clamp-2">{(r as any).resolvedData?.title || r.entityId}</div>
                 </div>
               ))}`
);

// Add quick search integration inside WorkspaceBoard
content = content.replace(
  `<button className="text-cyan-400 hover:text-cyan-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
             <Search className="w-3 h-3" /> Add
           </button>`,
  `<button onClick={() => setSearchOpen(true)} className="text-cyan-400 hover:text-cyan-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
             <Search className="w-3 h-3" /> Add
           </button>
           
           {/* We reuse QuickSearchModal but intercept clicks */}
           {searchOpen && (
             <QuickSearchModal
               isOpen={searchOpen}
               onClose={() => setSearchOpen(false)}
               onOpenCase={(id) => { handleAddReference('CASE', id); setSearchOpen(false); }}
               onOpenEntity={(type, id) => { 
                 const mappedType = type === 'people' ? 'PERSON' : type === 'organisations' ? 'ORGANISATION' : 'LOCATION';
                 handleAddReference(mappedType, id); 
                 setSearchOpen(false); 
               }}
               onOpenEvidence={(id) => { handleAddReference('EVIDENCE', id); setSearchOpen(false); }}
               onOpenEvent={(id) => { handleAddReference('EVENT', id); setSearchOpen(false); }}
             />
           )}`
);

// Connection logic UI
content = content.replace(
  `<button className="text-cyan-400 hover:text-cyan-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
             <Plus className="w-3 h-3" /> New Path
           </button>`,
  `<button onClick={() => setAddingConnection(!addingConnection)} className="text-cyan-400 hover:text-cyan-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
             <Plus className="w-3 h-3" /> New Path
           </button>`
);

content = content.replace(
  `<div className="flex-1 overflow-y-auto p-4">`,
  `<div className="flex-1 overflow-y-auto p-4">
         {addingConnection && (
            <div className="mb-6 p-4 border border-cyan-500/30 rounded-xl bg-cyan-950/10">
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Define Working Theory Connection</h4>
              <div className="flex flex-col gap-3">
                <select value={sourceId} onChange={e => setSourceId(e.target.value)} className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cyan-500">
                  <option value="">Select Source Reference...</option>
                  {ws.references?.map(r => (
                    <option key={r.id} value={r.id}>{(r as any).resolvedData?.title || r.entityId}</option>
                  ))}
                </select>
                
                <input 
                  type="text" 
                  value={linkLabel} 
                  onChange={e => setLinkLabel(e.target.value)} 
                  placeholder="Connection Label (e.g. 'Possible meeting location')"
                  className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cyan-500 placeholder:text-gray-600"
                />
                
                <select value={targetId} onChange={e => setTargetId(e.target.value)} className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cyan-500">
                  <option value="">Select Target Reference...</option>
                  {ws.references?.map(r => (
                    <option key={r.id} value={r.id}>{(r as any).resolvedData?.title || r.entityId}</option>
                  ))}
                </select>
                
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setAddingConnection(false)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider">Cancel</button>
                  <button onClick={handleCreateConnection} disabled={!sourceId || !targetId || !linkLabel} className="px-3 py-1.5 text-xs font-medium bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded uppercase tracking-wider disabled:opacity-50">Save Connection</button>
                </div>
              </div>
            </div>
         )}`
);

content = content.replace(
  `{ws.connections?.map(c => (
                  <div key={c.id} className="relative p-4 border border-cyan-500/30 rounded-xl bg-cyan-950/10">
                     <div className="flex items-center justify-between">
                        <div className="flex-1 p-3 border border-white/10 rounded bg-black/50 text-sm text-center">
                          {c.sourceRefId}
                        </div>
                        <div className="px-4 text-center">
                          <span className="block text-[10px] font-mono text-cyan-400 uppercase mb-1">User Hypothesis</span>
                          <div className="h-0.5 w-16 bg-cyan-500/50 mx-auto relative">
                             <div className="absolute -right-1 -top-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500/50 rotate-45"></div>
                          </div>
                          <span className="block mt-1 text-xs text-white font-medium">{c.label}</span>
                        </div>
                        <div className="flex-1 p-3 border border-white/10 rounded bg-black/50 text-sm text-center">
                          {c.targetRefId}
                        </div>
                     </div>
                  </div>
                ))}`,
  `{ws.connections?.map(c => (
                  <div key={c.id} className="group relative p-4 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl bg-cyan-950/5 transition-colors">
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteConnection(c.id)} className="p-1 text-gray-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                     </div>
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full p-3 border border-white/10 rounded bg-black/50 text-sm text-center font-medium line-clamp-2">
                          {getRefDisplay(c.sourceRefId)}
                        </div>
                        <div className="px-4 text-center shrink-0">
                          <span className="block text-[10px] font-mono text-cyan-400/80 uppercase mb-1">User Proposed</span>
                          <div className="h-0.5 w-12 sm:w-16 bg-cyan-500/30 mx-auto relative">
                             <div className="absolute -right-1 -top-1 w-2 h-2 border-t border-r border-cyan-500/50 rotate-45"></div>
                          </div>
                          <span className="block mt-1 text-xs text-white font-bold">{c.label}</span>
                        </div>
                        <div className="flex-1 w-full p-3 border border-white/10 rounded bg-black/50 text-sm text-center font-medium line-clamp-2">
                          {getRefDisplay(c.targetRefId)}
                        </div>
                     </div>
                  </div>
                ))}`
);

fs.writeFileSync('src/components/WorkspaceEditor.tsx', content);
