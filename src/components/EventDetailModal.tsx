import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Loader, ShieldCheck, AlertTriangle, Briefcase, Users, Folder, Navigation } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { sound } from '../utils/audio';

interface Props {
  eventId: string;
  onClose: () => void;
  onOpenEvidence?: (id: string) => void;
}

export const EventDetailModal: React.FC<Props> = ({ eventId, onClose, onOpenEvidence }) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { auth } = await import('../services/firebase');
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/events/${eventId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto rounded-2xl border border-purple-500/40 bg-cipher-surface shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200 font-sans">
        <button onClick={() => { sound.click(); onClose(); }} className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-[10px] font-mono font-bold text-purple-400 tracking-wider mb-2 uppercase">
            EVENT RECORD
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
          ) : event ? (
            <>
              <h2 className="text-xl font-bold text-white mb-4">{event.title}</h2>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="bg-black/50 border border-white/10 p-3 rounded">
                  <p>{event.description || 'No description provided.'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-xs">{event.dateString || 'Unknown Date'}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-mono text-xs truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    {event.verificationStatus === 'VERIFIED' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : event.verificationStatus === 'DISPUTED' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs font-mono font-bold">
                      {event.verificationStatus || 'UNVERIFIED'}
                    </span>
                  </div>
                </div>


                {event.caseFiles && event.caseFiles.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Folder className="w-3.5 h-3.5" /> Associated Case Files</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.caseFiles.map((c: any) => (
                        <span key={c.id} className="text-xs font-mono bg-cipher-accent/10 text-cipher-accent border border-cipher-accent/30 px-2 py-1 rounded">
                          {c.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.people && event.people.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Involved People</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.people.map((p: any) => (
                        <span key={p.id} className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-1 rounded">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.organisations && event.organisations.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Involved Organisations</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.organisations.map((o: any) => (
                        <span key={o.id} className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">
                          {o.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.locations && event.locations.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Navigation className="w-3.5 h-3.5" /> Connected Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.locations.map((l: any) => (
                        <span key={l.id} className="text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-1 rounded">
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {event.evidenceList && event.evidenceList.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Associated Evidence</h3>
                    <div className="space-y-2">
                      {event.evidenceList.map((ev: any) => (
                        <div key={ev.id} onClick={() => onOpenEvidence?.(ev.id)} className="bg-black/40 border border-white/5 p-3 rounded hover:border-cipher-accent/30 cursor-pointer transition-colors">
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cipher-accent transition-colors">{ev.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{ev.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-mono text-cipher-accent">{ev.stance}</span>
                            <span className="text-[10px] text-gray-600 border border-gray-800 px-1 rounded">{ev.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">Event not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
