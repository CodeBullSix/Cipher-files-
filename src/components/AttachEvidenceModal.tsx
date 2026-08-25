import React, { useState, useEffect } from 'react';
import { X, Search, Link as LinkIcon, Scale } from 'lucide-react';

import { sound } from '../utils/audio';

interface AttachEvidenceModalProps {
  currentUser?: any;
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

export function AttachEvidenceModal({ isOpen, onClose, eventId, onSuccess, currentUser }: AttachEvidenceModalProps) {
  
  
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Just fetch all evidence for now (or a search endpoint if we had one)
      // Since we don't have a specific global search, we fetch all evidence items or let the user type ID
      fetchEvidence();
    }
  }, [isOpen]);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evidence', { headers: { 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` }});
      if (res.ok) {
        const data = await res.json();
        setEvidenceList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttach = async (evidenceId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await (await import('../services/firebase')).auth.currentUser?.getIdToken()}` },
        body: JSON.stringify({ evidenceId })
      });
      if (res.ok) {
        sound.click();
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      sound.click();
    }
  };

  if (!isOpen) return null;

  const filtered = evidenceList.filter(e => e.title?.toLowerCase().includes(query.toLowerCase()) || e.id.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-500" />
            Attach Evidence
          </h2>
          <button onClick={() => { onClose(); sound.click(); }} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-9 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-96 custom-scrollbar p-2">
          {loading ? (
            <div className="text-center p-4 text-gray-500 font-mono text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-4 text-gray-500 font-mono text-sm">No evidence found.</div>
          ) : (
            <div className="space-y-2">
              {filtered.map(e => (
                <div key={e.id} className="p-3 bg-black/40 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-between transition-colors">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-gray-200 font-medium truncate">{e.title || 'Untitled Evidence'}</span>
                    <span className="text-xs text-gray-500 font-mono truncate">{e.id}</span>
                  </div>
                  <button onClick={() => handleAttach(e.id)} className="ml-3 p-1.5 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/60 rounded transition-colors shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
