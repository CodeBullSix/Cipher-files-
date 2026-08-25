import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

import { sound } from '../utils/audio';

interface EventModalProps {
  currentUser?: any;
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
  onSuccess: () => void;
  existingEvent?: any;
}

export function EventModal({ isOpen, onClose, entityType, entityId, onSuccess, existingEvent, currentUser }: EventModalProps) {
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    type: existingEvent?.type || 'OTHER',
    dateString: existingEvent?.dateString || '',
    datePrecision: existingEvent?.datePrecision || 'EXACT',
    startDate: existingEvent?.startDate ? new Date(existingEvent.startDate).toISOString().slice(0, 10) : '',
    endDate: existingEvent?.endDate ? new Date(existingEvent.endDate).toISOString().slice(0, 10) : '',
    location: existingEvent?.location || '',
    verificationStatus: existingEvent?.verificationStatus || 'UNVERIFIED'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dateString) {
      setError('Title and Date String are required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const url = existingEvent ? `/api/events/${existingEvent.id}` : '/api/events';
      const method = existingEvent ? 'PUT' : 'POST';
      const token = await (await import('../services/firebase')).auth.currentUser?.getIdToken();
      const body = {
        ...formData,
        entityType: existingEvent ? undefined : entityType,
        entityId: existingEvent ? undefined : entityId
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to save event');
      sound.click();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      sound.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-500" />
            {existingEvent ? 'Edit Event' : 'Log New Event'}
          </h2>
          <button onClick={() => { onClose(); sound.click(); }} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded flex items-start gap-2 text-red-400 text-sm font-mono">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="e.g. MKUltra Program Initiated"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {['MEETING', 'PUBLICATION', 'EMPLOYMENT', 'FOUNDING', 'INVESTIGATION', 'INCIDENT', 'MOVEMENT', 'COMMUNICATION', 'LEGAL', 'POLITICAL', 'OTHER'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="e.g. Langley, Virginia"
                />
              </div>

              <div className="md:col-span-2 border-t border-gray-800 pt-5 mt-2">
                <h4 className="text-sm font-mono text-gray-300 mb-4">Chronology</h4>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Date String (Display) *</label>
                <input
                  type="text"
                  required
                  value={formData.dateString}
                  onChange={e => setFormData(prev => ({ ...prev, dateString: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="e.g. March 1963, Late 60s"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Date Precision</label>
                <select
                  value={formData.datePrecision}
                  onChange={e => setFormData(prev => ({ ...prev, datePrecision: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {['EXACT', 'DAY', 'MONTH', 'YEAR', 'APPROXIMATE', 'RANGE', 'UNKNOWN'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Start Date (For sorting)</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-gray-300 font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">End Date (Optional Range)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-gray-300 font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2 border-t border-gray-800 pt-5 mt-2">
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors custom-scrollbar"
                  placeholder="Detailed description of the event..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Verification Status</label>
                <select
                  value={formData.verificationStatus}
                  onChange={e => setFormData(prev => ({ ...prev, verificationStatus: e.target.value }))}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  <option value="UNVERIFIED">Unverified</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="DISPUTED">Disputed</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { onClose(); sound.click(); }}
            className="px-4 py-2 text-gray-400 hover:text-white font-mono text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-form"
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingEvent ? 'Save Changes' : 'Log Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
