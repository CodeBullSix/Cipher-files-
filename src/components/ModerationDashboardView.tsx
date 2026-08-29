import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Lock, 
  Unlock,
  AlertTriangle,
  FileText,
  MessageSquare,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { ApiService } from '../services/apiService';
import { sound } from '../utils/audio';


interface ModerationDashboardViewProps {
  currentUser: any;
  onOpenEntity?: (type: string, id: string) => void;
}


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ModerationDashboardView: React.FC<ModerationDashboardViewProps> = ({ 
  currentUser,
  onOpenEntity 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queue, setQueue] = useState<{evidence: any[], discussions: any[], replies: any[]}>({
    evidence: [], discussions: [], replies: []
  });
  const [activeTab, setActiveTab] = useState<'evidence' | 'discussions' | 'replies'>('evidence');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch('/api/moderation/queue', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }
      const data = await res.json();
      setQueue(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'MODERATION DATA UNAVAILABLE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchQueue();
  }, [currentUser]);

  const handleAction = async (targetType: string, targetId: string, action: string, reason: string = 'Moderator action') => {
    if (action === 'REMOVE' || action === 'REJECT') {
      if (!window.confirm(`Are you sure you want to ${action} this content?`)) return;
    }
    
    setProcessingId(targetId);
    sound.click();
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch('/api/moderation/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetType, targetId, action, reason })
      });
      
      if (!res.ok) throw new Error('Action failed');
      
      await fetchQueue(); // Refresh to ensure accuracy
      sound.click();
    } catch (err: any) {
      console.error(err);
      alert('Failed to perform action.');
      sound.click();
    } finally {
      setProcessingId(null);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#020617] min-h-0">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-80" />
        <h2 className="text-xl font-mono font-bold text-red-400 mb-2">MODERATION DATA UNAVAILABLE</h2>
        <p className="text-sm font-mono text-gray-500 mb-6">{error}</p>
        <button 
          onClick={fetchQueue}
          className="px-6 py-2 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 transition-colors flex items-center gap-2 rounded"
        >
          <RefreshCw className="w-4 h-4" /> RETRY CONNECTION
        </button>
      </div>
    );
  }

  const renderEvidence = () => {
    if (queue.evidence.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <CheckCircle className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO MODERATION ITEMS</h3>
          <p className="text-xs text-slate-600 mt-1">Evidence queue is clear.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {queue.evidence.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-mono font-bold text-cyan-400">EVIDENCE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{item.description}</p>
              <div className="text-[10px] font-mono text-slate-500">
                Submitter: <button onClick={() => onOpenEntity?.('profile', item.submittedById)} className="text-cyan-400 hover:underline">{item.submittedById}</button>
              </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button
                disabled={processingId === item.id}
                onClick={() => handleAction('EVIDENCE', item.id, 'APPROVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                disabled={processingId === item.id}
                onClick={() => handleAction('EVIDENCE', item.id, 'REJECT')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 rounded text-xs font-mono transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
              <button
                onClick={() => onOpenEntity?.('evidence', item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded text-xs font-mono transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDiscussions = () => {
    if (queue.discussions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <CheckCircle className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO MODERATION ITEMS</h3>
          <p className="text-xs text-slate-600 mt-1">Discussion queue is clear.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {queue.discussions.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-mono font-bold text-purple-400">DISCUSSION</span>
                {item.locked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-orange-950/50 text-orange-400 border border-orange-900/50 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{item.content}</p>
              <div className="text-[10px] font-mono text-slate-500">
                Author: <button onClick={() => onOpenEntity?.('profile', item.authorId)} className="text-cyan-400 hover:underline">{item.authorId}</button>
              </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              {!item.locked ? (
                <button
                  disabled={processingId === item.id}
                  onClick={() => handleAction('DISCUSSION', item.id, 'LOCK')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-950/30 text-orange-400 border border-orange-900/50 hover:bg-orange-900/50 rounded text-xs font-mono transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" /> Lock
                </button>
              ) : (
                <button
                  disabled={processingId === item.id}
                  onClick={() => handleAction('DISCUSSION', item.id, 'UNLOCK')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded text-xs font-mono transition-colors"
                >
                  <Unlock className="w-3.5 h-3.5" /> Unlock
                </button>
              )}
              <button
                disabled={processingId === item.id}
                onClick={() => handleAction('DISCUSSION', item.id, 'REMOVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 rounded text-xs font-mono transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReplies = () => {
    if (queue.replies.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <CheckCircle className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO MODERATION ITEMS</h3>
          <p className="text-xs text-slate-600 mt-1">Reply queue is clear.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {queue.replies.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-mono font-bold text-pink-400">REPLY</span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 mb-2">{item.content}</p>
              <div className="text-[10px] font-mono text-slate-500">
                Author: <button onClick={() => onOpenEntity?.('profile', item.authorId)} className="text-cyan-400 hover:underline">{item.authorId}</button>
              </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button
                disabled={processingId === item.id}
                onClick={() => handleAction('REPLY', item.id, 'REMOVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 rounded text-xs font-mono transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] min-h-0 overflow-hidden relative">
      <div className="sticky top-0 z-10 bg-[#020617]/95 backdrop-blur-sm border-b border-gray-800 p-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-950/50 border border-red-900/50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-mono tracking-tight uppercase">Moderation Control</h1>
              <p className="text-xs text-red-400/80 font-mono">Restricted Access: TIER 3 CLEARANCE REQUIRED</p>
            </div>
          </div>
          <button 
            onClick={fetchQueue}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 rounded disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {loading && !queue.evidence.length ? (
            <div className="flex justify-center p-12">
              <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'evidence' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  PENDING EVIDENCE ({queue.evidence.length})
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'discussions' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  DISCUSSIONS ({queue.discussions.length})
                </button>
                <button
                  onClick={() => setActiveTab('replies')}
                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'replies' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  REPLIES ({queue.replies.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="animate-in fade-in duration-300">
                {activeTab === 'evidence' && renderEvidence()}
                {activeTab === 'discussions' && renderDiscussions()}
                {activeTab === 'replies' && renderReplies()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
