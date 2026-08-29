import React, { useState, useEffect } from 'react';
import { UserProfile, InvestigationWorkspace } from '../types';
import { ApiService } from '../services/apiService';
import { Plus, FolderArchive, ArrowLeft, Trash2, Edit2, Loader, Save, Search, Database } from 'lucide-react';
import { sound } from '../utils/audio';
import { WorkspaceEditor } from './WorkspaceEditor';

interface Props {
  currentUser: UserProfile | null;
  onOpenEntity: (type: string, id: string) => void;
  onOpenCase: (id: string) => void;
  onOpenEvidence: (id: string) => void;
  onOpenEvent: (id: string) => void;
}

export const InvestigationWorkspaceView: React.FC<Props> = ({ currentUser, onOpenEntity, onOpenCase, onOpenEvidence, onOpenEvent }) => {
  const [workspaces, setWorkspaces] = useState<InvestigationWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  
  useEffect(() => {
    if (currentUser) {
      loadWorkspaces();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!currentUser) return;
    sound.click();
    try {
      const ws = await ApiService.createWorkspace({ title: 'New Investigation Workspace', description: 'Private working theory' });
      setWorkspaces([ws, ...workspaces]);
      setActiveWorkspaceId(ws.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workspace?')) return;
    sound.click();
    try {
      await ApiService.deleteWorkspace(id);
      setWorkspaces(workspaces.filter(w => w.id !== id));
      if (activeWorkspaceId === id) setActiveWorkspaceId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <FolderArchive className="w-16 h-16 text-cyan-500/30 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3 font-mono">PRIVATE INVESTIGATION WORKSPACE</h2>
        <p className="text-gray-400 max-w-md font-sans">You must be logged in to create and access your private working theories and notes.</p>
      </div>
    );
  }

  if (activeWorkspaceId) {
    return (
      <WorkspaceEditor 
        workspaceId={activeWorkspaceId} 
        onBack={() => {
          sound.click();
          setActiveWorkspaceId(null);
          loadWorkspaces();
        }}
        onOpenEntity={onOpenEntity}
        onOpenCase={onOpenCase}
        onOpenEvidence={onOpenEvidence}
        onOpenEvent={onOpenEvent}
      />
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex flex-col min-h-[600px] animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-6 border-b border-gray-800 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-500/80 uppercase">PRIVATE CLEARANCE</span>
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider font-mono">PRIVATE INVESTIGATION WORKSPACE</h2>
          <p className="text-sm text-gray-400 mt-1">Private working theories, notes, and unverified paths.</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-medium">New Workspace</span>
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
          <FolderArchive className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-gray-400 mb-4">No active workspaces found.</p>
          <button
            onClick={handleCreate}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium uppercase tracking-wider"
          >
            Create your first workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <div 
              key={ws.id}
              onClick={() => {
                sound.click();
                setActiveWorkspaceId(ws.id);
              }}
              className="group relative bg-[#111] border border-white/10 hover:border-cyan-500/30 rounded-xl p-5 cursor-pointer transition-all hover:bg-white/[0.02]"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleDelete(ws.id, e)}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{ws.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{ws.description || 'No description'}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Updated: {new Date(ws.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
