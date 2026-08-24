import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { X, Save, User, Building, MapPin } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entity: any | null;
  type: 'people' | 'organisations' | 'locations';
  caseFileId: string;
  onSaved: () => void;
}

export const EntityModal: React.FC<Props> = ({ isOpen, onClose, entity, type, caseFileId, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    aliases: '',
    description: '',
    typeOrLocationType: '',
    country: '',
    coordinates: '',
    imageUrl: '',
    verificationStatus: 'UNVERIFIED',
    caseFileIds: [caseFileId]
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.name || '',
        aliases: entity.aliases || '',
        description: entity.description || '',
        typeOrLocationType: entity.type || entity.locationType || '',
        country: entity.country || '',
        coordinates: entity.coordinates || '',
        imageUrl: entity.imageUrl || '',
        verificationStatus: entity.verificationStatus || 'UNVERIFIED',
        caseFileIds: entity.caseFileIds || [caseFileId]
      });
    }
  }, [entity, caseFileId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      const payload: any = {
        name: formData.name,
        aliases: formData.aliases,
        description: formData.description,
        verificationStatus: formData.verificationStatus,
        caseFileIds: formData.caseFileIds
      };
      
      if (type === 'people') {
        payload.imageUrl = formData.imageUrl;
      } else if (type === 'organisations') {
        payload.type = formData.typeOrLocationType;
      } else if (type === 'locations') {
        payload.locationType = formData.typeOrLocationType;
        payload.country = formData.country;
        payload.coordinates = formData.coordinates;
      }
      
      if (entity?.id) {
        if (type === 'people') await ApiService.updatePerson(entity.id, payload);
        else if (type === 'organisations') await ApiService.updateOrganisation(entity.id, payload);
        else if (type === 'locations') await ApiService.updateLocation(entity.id, payload);
      } else {
        if (type === 'people') await ApiService.createPerson(payload);
        else if (type === 'organisations') await ApiService.createOrganisation(payload);
        else if (type === 'locations') await ApiService.createLocation(payload);
      }
      
      sound.blip();
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save entity');
    } finally {
      setSaving(false);
    }
  };

  const getTitle = () => {
    const action = entity ? 'Edit' : 'Add';
    if (type === 'people') return `${action} Person`;
    if (type === 'organisations') return `${action} Organisation`;
    return `${action} Location`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#090D1A] border border-cyan-900/50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            {type === 'people' && <User className="w-5 h-5 text-cyan-400" />}
            {type === 'organisations' && <Building className="w-5 h-5 text-amber-400" />}
            {type === 'locations' && <MapPin className="w-5 h-5 text-emerald-400" />}
            {getTitle()}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border border-red-500/50 rounded text-red-400 text-sm font-mono">
              {error}
            </div>
          )}
          
          <form id="entity-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Primary Name <span className="text-cyan-400">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                placeholder={`e.g. ${type === 'people' ? 'John Doe' : type === 'organisations' ? 'Acme Corp' : 'Facility X'}`}
              />
            </div>
            
            {type !== 'locations' && (
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Aliases / Known As</label>
                <input
                  type="text"
                  value={formData.aliases}
                  onChange={e => setFormData({...formData, aliases: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="Comma separated..."
                />
              </div>
            )}
            
            {(type === 'organisations' || type === 'locations') && (
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  {type === 'organisations' ? 'Type / Industry' : 'Location Type'}
                </label>
                <input
                  type="text"
                  value={formData.typeOrLocationType}
                  onChange={e => setFormData({...formData, typeOrLocationType: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder={type === 'organisations' ? 'e.g. Government, PMC, NGO' : 'e.g. Military Base, Office, City'}
                />
              </div>
            )}
            
            {type === 'locations' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Coordinates (optional)</label>
                  <input
                    type="text"
                    value={formData.coordinates}
                    onChange={e => setFormData({...formData, coordinates: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500/50"
                    placeholder="Lat, Lng"
                  />
                </div>
              </div>
            )}
            
            {type === 'people' && (
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="https://..."
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Description & Notes</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black border border-gray-800 rounded p-2.5 text-white focus:outline-none focus:border-cyan-500/50 resize-y"
                placeholder="Background, known activities, context..."
              />
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
              <label className="block text-xs font-mono text-gray-400 mb-2">Verification Status</label>
              <select
                value={formData.verificationStatus}
                onChange={e => setFormData({...formData, verificationStatus: e.target.value})}
                className="w-full bg-black border border-gray-800 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
              >
                <option value="UNVERIFIED">Unverified / Suspected</option>
                <option value="VERIFIED">Verified / Confirmed</option>
                <option value="DISPUTED">Disputed / Unreliable</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-wider">
                Note: Investigation entities should be supported by evidence and sources.
              </p>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            disabled={saving}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
};
