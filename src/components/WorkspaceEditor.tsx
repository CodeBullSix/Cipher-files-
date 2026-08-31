import React, { useState, useEffect, useRef } from 'react';
import { InvestigationWorkspace, WorkspaceNote, WorkspaceReference, WorkspaceConnection } from '../types';
import { ApiService } from '../services/apiService';
import { ArrowLeft, Save, Loader, Search, Plus, X, Link as LinkIcon, FileText, Database, Users, Building2, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  workspaceId: string;
  onBack: () => void;
  onOpenEntity: (type: string, id: string) => void;
  onOpenCase: (id: string) => void;
  onOpenEvidence: (id: string) => void;
  onOpenEvent: (id: string) => void;
}

export const WorkspaceEditor: React.FC<Props> = ({ workspaceId, onBack, onOpenEntity, onOpenCase, onOpenEvidence, onOpenEvent }) => {
  const [ws, setWs] = useState<InvestigationWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Note state
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Editing details
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [activeTab, setActiveTab] = useState<'NOTEBOOK' | 'BOARD'>('NOTEBOOK');

  useEffect(() => {
    loadWorkspace();
  }, [workspaceId]);

  const loadWorkspace = async () => {
    try {
      const data = await ApiService.getWorkspace(workspaceId);
      setWs(data);
      if (data.notes && data.notes.length > 0) {
        setNoteContent(data.notes[0].content);
      }
      setEditTitle(data.title);
      setEditDesc(data.description || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!ws || !ws.notes || ws.notes.length === 0) return;
    setIsSaving(true);
    try {
      await ApiService.updateWorkspaceNote(ws.id, ws.notes[0].id, noteContent);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!ws) return;
    try {
      const updated = await ApiService.updateWorkspace(ws.id, { title: editTitle, description: editDesc });
      setWs(updated);
      setIsEditingDetails(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  // Debounced auto-save
  useEffect(() => {
    if (!ws || !ws.notes || ws.notes.length === 0) return;
    if (noteContent === ws.notes[0].content) return;
    
    const timer = setTimeout(() => {
      handleSaveNote();
    }, 2000);
    return () => clearTimeout(timer);
  }, [noteContent]);

  if (loading || !ws) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <Loader className="w-6 h-6 text-cipher-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex flex-col h-[calc(100vh-64px)] animate-in fade-in">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          {isEditingDetails ? (
            <div className="flex items-center gap-2">
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="bg-[#111] border border-white/10 text-white px-2 py-1 rounded text-lg font-bold" />
              <button onClick={handleSaveDetails} className="px-3 py-1 bg-cipher-accent/20 text-cipher-accent rounded hover:bg-cipher-accent-hover/30 text-xs uppercase tracking-wider">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white cursor-pointer hover:text-cipher-accent transition-colors" onClick={() => setIsEditingDetails(true)}>{ws.title}</h2>
              <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase border border-rose-500/30 px-2 py-0.5 rounded-full bg-rose-500/10">Private Workspace</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-4 shrink-0">
        <button 
          onClick={() => setActiveTab('NOTEBOOK')}
          className={`px-4 py-2 border-b-2 font-medium text-sm tracking-wider uppercase transition-colors ${activeTab === 'NOTEBOOK' ? 'border-cyan-400 text-cipher-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Notebook
        </button>
        <button 
          onClick={() => setActiveTab('BOARD')}
          className={`px-4 py-2 border-b-2 font-medium text-sm tracking-wider uppercase transition-colors ${activeTab === 'BOARD' ? 'border-cyan-400 text-cipher-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Theory Board
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'NOTEBOOK' && (
          <div className="absolute inset-0 flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/[0.02]">
              <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">Investigator Notes</div>
              <div className="flex items-center gap-2">
                {isSaving && <span className="text-xs text-cipher-accent animate-pulse">Saving...</span>}
              </div>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent text-gray-200 p-6 resize-none focus:outline-none focus:ring-0 leading-relaxed font-sans placeholder:text-gray-700"
              placeholder="Start typing your notes, hypotheses, and observations..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </div>
        )}
        
        {activeTab === 'BOARD' && (
          <WorkspaceBoard ws={ws} reload={loadWorkspace} onOpenEntity={onOpenEntity} onOpenCase={onOpenCase} onOpenEvidence={onOpenEvidence} onOpenEvent={onOpenEvent} />
        )}
      </div>
    </div>
  );
};


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

  return (
    <div className="absolute inset-0 flex flex-col sm:flex-row gap-4">
      {/* REFERENCES SIDEBAR */}
      <div className="w-full sm:w-1/3 flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden">
         <div className="p-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
           <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">References</span>
           <button onClick={() => setSearchOpen(true)} className="text-cipher-accent hover:text-cipher-accent-hover text-xs font-medium uppercase tracking-wider flex items-center gap-1">
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
           )}
         </div>
         <div className="flex-1 overflow-y-auto p-3">
           {ws.references?.length === 0 ? (
             <div className="text-center p-6 text-gray-500 text-sm">
               No official references added yet.<br/>Use Global Search to add entities to your workspace.
             </div>
           ) : (
             <div className="flex flex-col gap-2">
               {ws.references?.map(r => (
                 <div key={r.id} className="group relative p-3 border border-white/10 hover:border-white/20 rounded-lg bg-black/50 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteReference(r.id)} className="p-1 text-gray-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span className="font-mono">{r.entityType}</span>
                    </div>
                    <div 
                      className="text-sm font-medium text-white line-clamp-2 cursor-pointer hover:text-cipher-accent transition-colors"
                      onClick={() => {
                        if (r.entityType === 'CASE') onOpenCase(r.entityId);
                        else if (r.entityType === 'EVIDENCE') onOpenEvidence(r.entityId);
                        else if (r.entityType === 'EVENT') onOpenEvent(r.entityId);
                        else onOpenEntity(r.entityType, r.entityId);
                      }}
                    >
                      {(r as any).resolvedData?.title || r.entityId}
                    </div>
                 </div>
               ))}
             </div>
           )}
         </div>
      </div>
      
      {/* CONNECTIONS CANVAS/LIST */}
      <div className="w-full sm:w-2/3 flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
           <span className="text-xs text-amber-400 uppercase tracking-widest font-mono">YOUR PROPOSED CONNECTIONS</span>
           <button onClick={() => setAddingConnection(!addingConnection)} className="text-cipher-accent hover:text-cipher-accent-hover text-xs font-medium uppercase tracking-wider flex items-center gap-1">
             <Plus className="w-3 h-3" /> New Path
           </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4">
         {addingConnection && (
            <div className="mb-6 p-4 border border-cipher-accent/30 rounded-xl bg-cyan-950/10">
              <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Define Working Theory Connection</h4>
              <div className="flex flex-col gap-3">
                <select value={sourceId} onChange={e => setSourceId(e.target.value)} className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cipher-accent">
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
                  className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cipher-accent placeholder:text-gray-600"
                />
                
                <select value={targetId} onChange={e => setTargetId(e.target.value)} className="bg-black/50 border border-white/10 text-white text-sm rounded p-2 focus:border-cipher-accent">
                  <option value="">Select Target Reference...</option>
                  {ws.references?.map(r => (
                    <option key={r.id} value={r.id}>{(r as any).resolvedData?.title || r.entityId}</option>
                  ))}
                </select>
                
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setAddingConnection(false)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white uppercase tracking-wider">Cancel</button>
                  <button onClick={handleCreateConnection} disabled={!sourceId || !targetId || !linkLabel} className="px-3 py-1.5 text-xs font-medium bg-cipher-accent/20 text-cipher-accent hover:bg-cipher-accent-hover/30 rounded uppercase tracking-wider disabled:opacity-50">Save Connection</button>
                </div>
              </div>
            </div>
         )}
            {ws.connections?.length === 0 ? (
              <div className="text-center p-12 text-gray-500">
                <LinkIcon className="w-8 h-8 mx-auto mb-4 opacity-50" />
                <p>No connections defined.</p>
                <p className="text-sm mt-2">Connect your references to build working theories.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {ws.connections?.map(c => (
                  <div key={c.id} className="group relative p-4 border border-cipher-accent/20 hover:border-cipher-accent/40 rounded-xl bg-cyan-950/5 transition-colors">
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteConnection(c.id)} className="p-1 text-gray-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                     </div>
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full p-3 border border-white/10 rounded bg-black/50 text-sm text-center font-medium line-clamp-2">
                          {getRefDisplay(c.sourceRefId)}
                        </div>
                        <div className="px-4 text-center shrink-0">
                          <span className="block text-[10px] font-mono text-cipher-accent/80 uppercase mb-1">User Proposed</span>
                          <div className="h-0.5 w-12 sm:w-16 bg-cipher-accent/30 mx-auto relative">
                             <div className="absolute -right-1 -top-1 w-2 h-2 border-t border-r border-cipher-accent/50 rotate-45"></div>
                          </div>
                          <span className="block mt-1 text-xs text-white font-bold">{c.label}</span>
                        </div>
                        <div className="flex-1 w-full p-3 border border-white/10 rounded bg-black/50 text-sm text-center font-medium line-clamp-2">
                          {getRefDisplay(c.targetRefId)}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
