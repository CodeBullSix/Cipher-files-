import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Scale, Loader, ShieldCheck, AlertTriangle } from 'lucide-react';
import { EventModal } from './EventModal';
import { AttachEvidenceModal } from './AttachEvidenceModal';

import { sound } from '../utils/audio';

interface TimelineViewProps {
  currentUser?: any;
  entityType: 'people' | 'organisations' | 'locations' | 'case_files' | 'relationships';
  entityId: string;
  onOpenEvent?: (id: string) => void;
}

export function TimelineView({ entityType, entityId, currentUser, onOpenEvent }: TimelineViewProps) {
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [attachEventId, setAttachEventId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { auth } = await import('../services/firebase');
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/events/entity/${entityType}/${entityId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [entityId, entityType]);

  if (loading) return <div className="p-8 text-center"><Loader className="w-6 h-6 animate-spin mx-auto text-cyan-500" /></div>;
  if (error) return <div className="p-8 text-red-500 text-center text-sm font-mono">{error}</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">Chronological Timeline</h3>
        {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || currentUser?.tier === 'CONTRIBUTOR') && (
          <button
            onClick={() => { sound.click(); setEditingEvent(null); setIsModalOpen(true); }}
            className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-500/80 rounded text-cyan-400 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 border border-gray-800 rounded-xl bg-gray-900/30">
          <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 font-mono text-sm">No events documented.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.5 before:w-0.5 before:bg-gray-800">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-black" />
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyan-900/50 cursor-pointer transition-colors" onClick={(e) => { if ((e.target as any).closest('button')) return; sound.click(); onOpenEvent?.(event.id); }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-cyan-400 font-mono text-sm font-bold">{event.dateString}</span>
                    <h4 className="text-white font-semibold text-base mt-1">{event.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-4 h-4 text-emerald-400" title="Verified" />}
                    {event.verificationStatus === 'DISPUTED' && <AlertTriangle className="w-4 h-4 text-red-400" title="Disputed" />}
                    {(currentUser?.tier === 'ADMIN' || currentUser?.uid === event.createdBy) && (
                      <button onClick={() => { setEditingEvent(event); setIsModalOpen(true); sound.click(); }} className="text-gray-500 hover:text-cyan-400 ml-2">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{event.description}</p>
                )}
                {event.location && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    {event.evidenceList && event.evidenceList.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                        <Scale className="w-3.5 h-3.5" /> Supporting Evidence ({event.evidenceList.length})
                        {event.evidenceList.map((e: any) => (
                          <span key={e.id} className="ml-2 px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                            {e.title || 'Ev#' + e.id.substring(0,6)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 font-mono italic">No evidence attached</span>
                    )}
                    
                    {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || currentUser?.uid === event.createdBy) && (
                      <button onClick={() => { setAttachEventId(event.id); sound.click(); }} className="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Attach Evidence
                      </button>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <EventModal currentUser={currentUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} entityType={entityType} entityId={entityId} onSuccess={fetchEvents} existingEvent={editingEvent} />
      {attachEventId && <AttachEvidenceModal currentUser={currentUser} isOpen={true} onClose={() => setAttachEventId(null)} eventId={attachEventId} onSuccess={fetchEvents} />}
    </div>
  );
}
