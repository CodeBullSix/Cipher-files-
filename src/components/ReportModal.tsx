import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ApiService } from '../services/apiService';

interface Props {
  targetType: 'DISCUSSION' | 'REPLY' | 'EVIDENCE' | 'USER';
  targetId: string;
  onClose: () => void;
}

const REASONS = [
  { id: 'SPAM', label: 'Spam or malicious content' },
  { id: 'HARASSMENT', label: 'Harassment or abusive behavior' },
  { id: 'MISINFORMATION', label: 'Deliberate misinformation' },
  { id: 'INAPPROPRIATE', label: 'Inappropriate or offensive content' },
  { id: 'OTHER', label: 'Other violation of community guidelines' }
];

export const ReportModal: React.FC<Props> = ({ targetType, targetId, onClose }) => {
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for your report.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await ApiService.submitReport(targetType, targetId, reason, description);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-cipher-surface border border-red-900/50 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-red-900/30 bg-red-900/10">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-mono font-bold">Report Content</h2>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 hover:bg-white/5 rounded transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Report Submitted</h3>
              <p className="text-slate-400 text-sm mb-6">
                Thank you for helping keep Cipher Files secure. Our moderation team will review this report shortly.
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm font-mono">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-mono font-bold text-slate-300 mb-2">
                  Select a reason for reporting:
                </label>
                <div className="space-y-2">
                  {REASONS.map(r => (
                    <label key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-cipher-elevated hover:border-slate-600 cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="reason" 
                        value={r.id} 
                        checked={reason === r.id}
                        onChange={(e) => setReason(e.target.value)}
                        className="text-red-500 focus:ring-red-500 bg-slate-900 border-slate-700"
                      />
                      <span className="text-sm text-slate-200">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-slate-300 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional context to help moderators review this content..."
                  className="w-full bg-cipher-elevated border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-500/50 min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-white font-mono text-sm transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading || !reason}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
