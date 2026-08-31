import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Trash2, Lock, Unlock, AlertTriangle, FileText, MessageSquare, MessageCircle, RefreshCw, Eye, History, ShieldCheck, UserCheck, UserMinus, Flame, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { sound } from '../utils/audio';

interface ModerationDashboardViewProps {
  currentUser: any;
  onOpenEntity?: (type: string, id: string) => void;
}

export const ModerationDashboardView: React.FC<ModerationDashboardViewProps> = ({ currentUser, onOpenEntity }) => {
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [appealsQueue, setAppealsQueue] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'queue' | 'appeals' | 'logs'>('queue');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'PENDING' | 'IN_REVIEW' | 'HIGH_PRIORITY' | 'REPORTS' | 'EVIDENCE'>('ALL');
  const [logFilter, setLogFilter] = useState<'ALL' | 'REPORTS' | 'EVIDENCE' | 'USERS' | 'DISCUSSIONS'>('ALL');

  const fetchQueue = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await currentUser?.getIdToken();
      const [queueRes, logsRes, appealsRes] = await Promise.all([
        fetch('/api/moderation/queue', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/moderation/logs', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/appeals/queue', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!queueRes.ok || !logsRes.ok || !appealsRes.ok) {
        if (queueRes.status === 403 || logsRes.status === 403) throw new Error('MODERATION DATA UNAVAILABLE: Unauthorized');
        throw new Error('MODERATION DATA UNAVAILABLE');
      }

      const qData = await queueRes.json();
      const lData = await logsRes.json();
      const aData = await appealsRes.json();
      
      setQueueItems(qData);
      setLogs(lData);
      setAppealsQueue(aData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [currentUser]);

  const handleAction = async (targetType: string, targetId: string, action: string) => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this ${targetType.toLowerCase()}?`)) return;
    
    setProcessingId(targetId);
    try {
      sound.click();
      await ApiService.moderateContent(targetType, targetId, action, `Moderator action: ${action}`);
      sound.blip(1200);
      fetchQueue();
    } catch (err) {
      sound.blip(200);
      console.error(err);
      alert('Failed to perform action');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReportAction = async (reportId: string, status: string) => {
    setProcessingId(reportId);
    try {
      sound.click();
      const token = await currentUser?.getIdToken();
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update report');
      sound.blip(1200);
      fetchQueue();
    } catch (err) {
      sound.blip(200);
      alert('Failed to update report status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAssign = async (itemType: string, targetId: string, assign: boolean) => {
    setProcessingId(targetId);
    try {
      sound.click();
      const token = await currentUser?.getIdToken();
      const res = await fetch('/api/moderation/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType, targetId, assign })
      });
      if (!res.ok) throw new Error('Failed to assign item');
      fetchQueue();
    } catch (err) {
      sound.blip(200);
      alert('Failed to assign item');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };


  const handleAppealAction = async (appealId: string, status: string) => {
    setProcessingId(appealId);
    try {
      sound.click();
      const token = await currentUser?.getIdToken();
      
      const reason = prompt(`Reason for ${status.toLowerCase()} appeal:`);
      if (reason === null) {
         setProcessingId(null);
         return;
      }
      
      const res = await fetch(`/api/appeals/${appealId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, resolutionReason: reason })
      });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || 'Failed to update appeal');
      }
      sound.blip(1200);
      fetchQueue();
    } catch (err: any) {
      sound.blip(200);
      alert(err.message || 'Failed to update appeal status');
    } finally {
      setProcessingId(null);
    }
  };

  const renderAppeals = () => {
    if (appealsQueue.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
          <ShieldAlert className="w-10 h-10 text-slate-700 mb-3" />
          <h3 className="text-sm font-mono font-bold text-slate-400">NO APPEALS</h3>
          <p className="text-xs text-slate-600 mt-1">There are no appeals pending review.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appealsQueue.map(appeal => (
          <div key={appeal.id} className="bg-cipher-surface border border-purple-900/50 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
            
            <div className="flex flex-col gap-2 shrink-0 border-r border-slate-800/80 pr-4 items-center justify-center min-w-[80px]">
              <div className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                appeal.status === 'SUBMITTED' || appeal.status === 'UNDER_REVIEW' ? 'bg-amber-950/50 text-amber-500 border border-amber-900' :
                appeal.status === 'UPHELD' ? 'bg-emerald-950/50 text-emerald-500 border border-emerald-900' :
                'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {appeal.status.replace('_', ' ')}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono bg-purple-950/30 text-purple-400 border border-purple-900/50 px-2 py-0.5 rounded uppercase">
                  {appeal.targetType}
                </span>
                <span className="text-xs font-mono font-bold text-white ml-2">Appeal from {appeal.appellantName || appeal.appellantId.substring(0,8)}</span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto shrink-0">
                  {formatDate(appeal.createdAt)}
                </span>
              </div>
              
              <div className="p-3 bg-slate-900/50 rounded border border-slate-800 mb-3">
                <p className="text-xs text-slate-300 italic">"{appeal.reason}"</p>
              </div>
              
              {appeal.originalModeratorId && (
                <p className="text-[10px] text-red-400/80 font-mono mt-1 mb-2">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Conflict Warning: Original decision made by {appeal.originalModeratorId === currentUser?.uid ? 'YOU' : 'another moderator'}.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0 border-l border-slate-800/80 pl-4 items-stretch justify-center">
              <button
                onClick={() => {
                  if (appeal.targetType === 'USER') onOpenEntity?.('profile', appeal.targetId);
                  else if (appeal.targetType === 'EVIDENCE') onOpenEntity?.('evidence', appeal.targetId);
                  else if (appeal.targetType === 'DISCUSSION' || appeal.targetType === 'REPLY') onOpenEntity?.('discussion', appeal.targetId);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-cipher-accent hover:text-cipher-accent-hover border border-slate-800 hover:border-cipher-accent/50 rounded text-xs font-mono transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Target
              </button>
              
              {(appeal.status === 'SUBMITTED' || appeal.status === 'UNDER_REVIEW') && (
                <>
                  <button
                    disabled={processingId === appeal.id}
                    onClick={() => handleAppealAction(appeal.id, 'UPHELD')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Uphold Original
                  </button>
                  <button
                    disabled={processingId === appeal.id}
                    onClick={() => handleAppealAction(appeal.id, 'OVERTURNED')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-950/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Overturn
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    );
  };

  const renderQueue = () => {
    let filtered = queueItems;
    if (queueFilter === 'PENDING') filtered = queueItems.filter(i => i.status === 'PENDING' || i.status === 'OPEN');
    if (queueFilter === 'IN_REVIEW') filtered = queueItems.filter(i => i.status === 'IN_REVIEW' || i.status === 'UNDER_REVIEW');
    if (queueFilter === 'HIGH_PRIORITY') filtered = queueItems.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH');
    if (queueFilter === 'REPORTS') filtered = queueItems.filter(i => i.itemType === 'REPORT');
    if (queueFilter === 'EVIDENCE') filtered = queueItems.filter(i => i.itemType === 'EVIDENCE');

    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
          {['ALL', 'PENDING', 'IN_REVIEW', 'HIGH_PRIORITY', 'REPORTS', 'EVIDENCE'].map(f => (
            <button
              key={f}
              onClick={() => setQueueFilter(f as any)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded border transition-colors whitespace-nowrap ${
                queueFilter === f 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
            <CheckCircle className="w-10 h-10 text-emerald-900 mb-3" />
            <h3 className="text-sm font-mono font-bold text-emerald-600">NO ITEMS REQUIRE REVIEW</h3>
            <p className="text-xs text-slate-600 mt-1">The queue is clear for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="bg-cipher-surface border border-slate-800 p-4 rounded flex flex-col sm:flex-row gap-4 justify-between items-start">
                
                <div className="flex flex-col gap-2 shrink-0 border-r border-slate-800/80 pr-4 items-center justify-center min-w-[80px]">
                  <div className="text-center">
                    {item.priority === 'CRITICAL' && <Flame className="w-6 h-6 text-red-500 mx-auto animate-pulse" />}
                    {item.priority === 'HIGH' && <AlertCircle className="w-6 h-6 text-orange-500 mx-auto" />}
                    {item.priority === 'NORMAL' && <FileText className="w-6 h-6 text-blue-500 mx-auto" />}
                    {item.priority === 'LOW' && <CheckCircle className="w-6 h-6 text-slate-600 mx-auto" />}
                    <div className={`text-[9px] font-mono font-bold mt-1 uppercase ${
                      item.priority === 'CRITICAL' ? 'text-red-500' : 
                      item.priority === 'HIGH' ? 'text-orange-500' : 
                      item.priority === 'NORMAL' ? 'text-blue-500' : 'text-slate-500'
                    }`}>{item.priority}</div>
                  </div>
                  <div className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                    item.status === 'PENDING' || item.status === 'OPEN' ? 'bg-amber-950/50 text-amber-500 border border-amber-900' :
                    item.status === 'IN_REVIEW' || item.status === 'UNDER_REVIEW' ? 'bg-cyan-950/50 text-cipher-accent border border-cyan-900' :
                    'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-auto shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="uppercase tracking-wider">Submitter:</span>
                      <button onClick={() => onOpenEntity?.('profile', item.submittedBy)} className="text-cipher-accent hover:underline">
                        {item.submittedByName || item.submittedBy.substring(0, 8)}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="uppercase tracking-wider">Assignee:</span>
                      {item.assigneeId ? (
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-400 font-bold">{item.assigneeName || item.assigneeId.substring(0, 8)}</span>
                          {item.assigneeId === currentUser?.uid && (
                            <button onClick={() => handleAssign(item.itemType, item.id, false)} className="ml-1 text-slate-500 hover:text-red-400" title="Unassign me">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => handleAssign(item.itemType, item.id, true)} className="text-amber-500 hover:underline flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Assign to me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 border-l border-slate-800/80 pl-4 items-stretch justify-center">
                  <button
                    onClick={() => {
                      if (item.itemType === 'REPORT') {
                        if (item.targetType === 'USER') onOpenEntity?.('profile', item.targetId);
                        else if (item.targetType === 'EVIDENCE') onOpenEntity?.('evidence', item.targetId);
                        else if (item.targetType === 'DISCUSSION' || item.targetType === 'REPLY') onOpenEntity?.('discussion', item.targetId);
                      } else {
                        onOpenEntity?.('evidence', item.targetId);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-cipher-accent hover:text-cipher-accent-hover border border-slate-800 hover:border-cipher-accent/50 rounded text-xs font-mono transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                  
                  {item.itemType === 'REPORT' && (
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleReportAction(item.id, 'RESOLVED')}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve
                    </button>
                  )}
                  {item.itemType === 'REPORT' && (
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleReportAction(item.id, 'DISMISSED')}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-slate-500 hover:text-slate-400 border border-slate-800 hover:bg-slate-800 rounded text-xs font-mono transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  )}
                  
                  {item.itemType === 'EVIDENCE' && (
                    <>
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction('EVIDENCE', item.targetId, 'APPROVE')}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Verify
                      </button>
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleAction('EVIDENCE', item.targetId, 'REJECT')}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 rounded text-xs font-mono transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLogs = () => {
    let filteredLogs = logs;
    if (logFilter !== 'ALL') {
      filteredLogs = logs.filter(log => {
        if (logFilter === 'REPORTS' && log.targetType === 'REPORT') return true;
        if (logFilter === 'EVIDENCE' && log.targetType === 'EVIDENCE') return true;
        if (logFilter === 'USERS' && log.targetType === 'USER') return true;
        if (logFilter === 'DISCUSSIONS' && (log.targetType === 'DISCUSSION' || log.targetType === 'REPLY')) return true;
        return false;
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
          {['ALL', 'REPORTS', 'EVIDENCE', 'USERS', 'DISCUSSIONS'].map(f => (
            <button
              key={f}
              onClick={() => setLogFilter(f as any)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded border transition-colors whitespace-nowrap ${
                logFilter === f 
                  ? 'bg-slate-700 text-white border-slate-500' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg">
            <ShieldCheck className="w-10 h-10 text-slate-700 mb-3" />
            <h3 className="text-sm font-mono font-bold text-slate-400">NO AUDIT EVENTS FOUND</h3>
            <p className="text-xs text-slate-600 mt-1">No moderation actions match the current filter.</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="bg-cipher-surface border border-slate-800/80 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
              
              <div className="flex flex-col gap-2 shrink-0 border-r border-slate-800/80 pr-4 items-center justify-center min-w-[80px]">
                 <button
                  onClick={() => {
                     if (log.targetType === 'USER') onOpenEntity?.('profile', log.targetId);
                     else if (log.targetType === 'EVIDENCE') onOpenEntity?.('evidence', log.targetId);
                     else if (log.targetType === 'DISCUSSION' || log.targetType === 'REPLY') onOpenEntity?.('discussion', log.targetId);
                  }}
                  className="p-2 bg-slate-900 text-cipher-accent hover:text-cipher-accent-hover border border-slate-700 hover:border-cipher-accent/50 rounded-lg transition-colors"
                  title="View Target"
                 >
                   <Eye className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-slate-900 border border-slate-700">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto shrink-0">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Actor</h4>
                    <p className="text-xs text-slate-300 truncate">
                      <span className="font-bold text-white">{log.actorDisplayName || log.actorUsername}</span> 
                      <span className="text-slate-500 ml-1">({log.actorId.substring(0, 8)})</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Target</h4>
                    <p className="text-xs text-slate-300 truncate">
                      <span className="font-bold text-cipher-accent">{log.targetType}</span>
                      <span className="text-slate-500 ml-1">({log.targetId.substring(0, 8)})</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-800/50">
                  <div className="flex items-center gap-3 text-xs font-mono overflow-hidden">
                    <span className="text-slate-400 line-through decoration-slate-600 truncate">{log.previousStatus || 'N/A'}</span>
                    <span className="text-slate-600 shrink-0">→</span>
                    <span className="text-emerald-400 font-bold truncate">{log.newStatus || 'N/A'}</span>
                  </div>
                  {log.reason && (
                    <p className="mt-2 text-xs text-slate-400 italic break-words line-clamp-3">"{log.reason}"</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-cipher-base min-h-0 overflow-hidden relative">
      <div className="sticky top-0 z-10 bg-cipher-base/95 backdrop-blur-sm border-b border-gray-800 p-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-950/50 border border-red-900/50 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-mono tracking-tight uppercase">Review Queues</h1>
              <p className="text-xs text-red-400/80 font-mono">Restricted Access: TIER 3 CLEARANCE REQUIRED</p>
            </div>
          </div>
          <button 
            onClick={fetchQueue}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 rounded disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-950/30 border border-red-900/50 rounded flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-mono text-red-400">{error}</p>
            </div>
          )}
          
          {loading && queueItems.length === 0 ? (
            <div className="flex justify-center p-12">
              <RefreshCw className="w-8 h-8 text-cipher-accent animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'queue' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  REVIEW QUEUE ({queueItems.length})

                </button>
                <button
                  onClick={() => setActiveTab('appeals')}
                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'appeals' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  APPEALS ({appealsQueue.length})
                </button>
                <button
                  onClick={() => setActiveTab('logs')}

                  className={`px-4 py-2 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === 'logs' ? 'border-cyan-500 text-cipher-accent' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  AUDIT LOGS ({logs.length})
                </button>
              </div>

              <div className="animate-in fade-in duration-300">
                {activeTab === 'queue' && renderQueue()}
                {activeTab === 'appeals' && renderAppeals()}
                {activeTab === 'logs' && renderLogs()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
