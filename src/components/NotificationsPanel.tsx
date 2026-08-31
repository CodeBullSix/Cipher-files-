import React, { useEffect, useState } from 'react';
import { Bell, Check, X, ArrowRight, ShieldAlert, Award, ChevronUp, MessageSquare, FileText, Activity } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCase?: (id: string) => void;
  onOpenEntity?: (type: string, id: string) => void;
  onOpenDiscussion?: (id: string) => void;
}

export const NotificationsPanel: React.FC<Props> = ({ 
  isOpen, onClose, onOpenCase, onOpenEntity, onOpenDiscussion 
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    sound.click();
    try {
      await ApiService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    sound.click();
    try {
      await ApiService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      handleMarkAsRead(n.id);
    }

    if (!n.relatedRecordId || !n.relatedRecordType) return;

    if (n.relatedRecordType === 'DISCUSSION' && onOpenDiscussion) {
      onOpenDiscussion(n.relatedRecordId);
      onClose();
    } else if (n.relatedRecordType === 'CASE' && onOpenCase) {
      onOpenCase(n.relatedRecordId);
      onClose();
    } else if (n.relatedRecordType === 'EVIDENCE' && onOpenEntity) {
      onOpenEntity('evidence', n.relatedRecordId);
      onClose();
    } else if (n.relatedRecordType === 'PROFILE' && onOpenEntity) {
      // Just open their own profile
      onOpenEntity('profile', 'me');
      onClose();
    } else if (n.relatedRecordType === 'ACHIEVEMENT' && onOpenEntity) {
      onOpenEntity('profile', 'me');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-cipher-base border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-cipher-surface">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-mono font-bold text-white tracking-wider">SECURE COMMS</h2>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> MARK ALL READ
            </button>
          )}
          <button aria-label="Close" onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
            <Activity className="w-6 h-6 text-emerald-500 animate-spin" />
            <div className="text-[10px] font-mono text-slate-500 tracking-widest">DECRYPTING...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <ShieldAlert className="w-8 h-8 text-slate-700" />
            <div className="text-xs font-mono text-slate-500">NO NEW NOTIFICATIONS</div>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                n.isRead 
                  ? 'bg-cipher-surface border-slate-800/60 opacity-70' 
                  : 'bg-cipher-surface border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
              }`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-lg border ${
                  !n.isRead ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-700'
                }`}>
                  {n.type === 'LEVEL_UP' ? <ChevronUp className={`w-3.5 h-3.5 ${!n.isRead ? 'text-emerald-400' : 'text-slate-400'}`} /> :
                   n.type === 'ACHIEVEMENT_UNLOCKED' ? <Award className={`w-3.5 h-3.5 ${!n.isRead ? 'text-amber-400' : 'text-slate-400'}`} /> :
                   n.type === 'DISCUSSION_REPLY' ? <MessageSquare className={`w-3.5 h-3.5 ${!n.isRead ? 'text-cipher-accent' : 'text-slate-400'}`} /> :
                   n.type === 'CONTRIBUTION_STATUS' ? <FileText className={`w-3.5 h-3.5 ${!n.isRead ? 'text-purple-400' : 'text-slate-400'}`} /> :
                   <Bell className={`w-3.5 h-3.5 ${!n.isRead ? 'text-emerald-400' : 'text-slate-400'}`} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                      {n.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm font-semibold mb-1 truncate ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>

                  {n.relatedRecordId && (
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors">
                      VIEW RECORD <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
                
                {!n.isRead && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
