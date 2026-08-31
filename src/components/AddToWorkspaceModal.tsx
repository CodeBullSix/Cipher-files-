import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { InvestigationWorkspace } from '../types';
import { X, FolderArchive, Plus, Check, Loader } from 'lucide-react';

interface Props {
  entityType: string;
  entityId: string;
  onClose: () => void;
}

export const AddToWorkspaceModal: React.FC<Props> = ({ entityType, entityId, onClose }) => {
  const [workspaces, setWorkspaces] = useState<InvestigationWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await ApiService.getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (ws: InvestigationWorkspace) => {
    setAddingTo(ws.id);
    try {
      await ApiService.addWorkspaceReference(ws.id, { entityType, entityId });
      setSuccessId(ws.id);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setAddingTo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-cipher-accent" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Add to Workspace</span>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-6"><Loader className="w-5 h-5 text-cipher-accent animate-spin" /></div>
          ) : workspaces.length === 0 ? (
            <div className="text-center p-6 text-gray-500 text-sm">
              You have no active workspaces.<br/>Go to the Workspaces tab to create one.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => handleAdd(ws)}
                  disabled={addingTo !== null || successId !== null}
                  className="flex items-center justify-between p-3 border border-white/10 rounded bg-black hover:bg-white/[0.02] hover:border-cipher-accent/30 transition-all text-left group disabled:opacity-50"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cipher-accent">{ws.title}</h4>
                  </div>
                  <div>
                    {successId === ws.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : addingTo === ws.id ? (
                      <Loader className="w-4 h-4 text-cipher-accent animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-cipher-accent" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
