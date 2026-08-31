import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { sound } from '../utils/audio';

interface AppealModalProps {
  targetType: string;
  targetId: string;
  targetTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AppealModal: React.FC<AppealModalProps> = ({ targetType, targetId, targetTitle, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A meaningful explanation is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      sound.click();
      const res = await ApiService.submitAppeal(targetType, targetId, reason);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appeal');
      }

      setSuccess(true);
      sound.blip(1200);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      sound.blip(200);
      setError(err.message || 'Failed to submit appeal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-cipher-surface border border-cyan-900/50 rounded-lg w-full max-w-md shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-900/30 bg-cyan-950/20">
          <div className="flex items-center gap-2 text-cipher-accent">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-sm font-bold font-mono tracking-widest uppercase">File Appeal</h2>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 hover:bg-cyan-900/50 rounded text-cipher-accent hover:text-cipher-accent-hover transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-emerald-400 font-bold font-mono text-lg mb-2 uppercase tracking-wide">Appeal Submitted</h3>
              <p className="text-slate-400 text-sm">Your appeal has been recorded and will be reviewed by a different moderator.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded">
                <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Appealing Moderation Decision On:</div>
                <div className="text-sm font-bold text-white line-clamp-1">{targetTitle}</div>
                <div className="text-[10px] text-cipher-accent font-mono mt-1 uppercase tracking-widest bg-cyan-950/30 px-2 py-0.5 rounded inline-block">
                  {targetType}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 rounded flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-cipher-accent mb-2 font-mono uppercase tracking-widest">
                  Explanation for Appeal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-cipher-base border border-cyan-900/50 rounded p-3 text-sm text-cyan-50 focus:border-cipher-accent focus:ring-1 focus:ring-cyan-500 transition-all font-mono h-32 resize-none"
                  placeholder="Explain why the moderation decision should be reconsidered. Provide specific details..."
                  required
                />
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  Appeals are for procedural fairness, not rewriting official facts. Duplicate active appeals are prevented.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim()}
                  className="px-5 py-2 bg-cyan-900/30 text-cipher-accent border border-cyan-900/50 hover:bg-cyan-900/50 hover:text-cipher-accent-hover rounded text-xs font-mono font-bold transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {loading ? 'Submitting...' : 'Submit Appeal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
