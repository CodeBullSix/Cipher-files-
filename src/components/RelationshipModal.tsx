import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { X, Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sourceEntity: any;
  sourceType: 'people' | 'organisations' | 'locations';
  caseFileId?: string;
  onSaved: () => void;
  existingRelationship?: any;
}

const RELATIONSHIP_TYPES = [
  'ASSOCIATED_WITH',
  'WORKED_FOR',
  'EMPLOYED_BY',
  'MEMBER_OF',
  'FOUNDED',
  'OWNED',
  'OPERATED',
  'LOCATED_AT',
  'BASED_AT',
  'MET',
  'CONNECTED_TO',
  'COLLABORATED_WITH',
  'OTHER'
];

export const RelationshipModal: React.FC<Props> = ({ isOpen, onClose, sourceEntity, sourceType, caseFileId, onSaved, existingRelationship }) => {
  const [targetType, setTargetType] = useState<'people' | 'organisations' | 'locations'>(existingRelationship?.targetType || 'people');
  const [targetSearch, setTargetSearch] = useState('');
  const [targetResults, setTargetResults] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<any>(existingRelationship?.targetEntity || null);
  
  const [relationshipType, setRelationshipType] = useState(existingRelationship?.relationshipType || 'ASSOCIATED_WITH');
  const [description, setDescription] = useState(existingRelationship?.description || '');
  const [verificationStatus, setVerificationStatus] = useState(existingRelationship?.verificationStatus || 'UNVERIFIED');

  const [evidenceSearch, setEvidenceSearch] = useState('');
  const [evidenceResults, setEvidenceResults] = useState<any[]>([]);
  const [isAttachingEvidence, setIsAttachingEvidence] = useState(false);

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (evidenceSearch.length > 2) {
      ApiService.getEvidence({ query: evidenceSearch, limit: 10 }).then(res => {
        setEvidenceResults(res.items || res);
      });
    } else {
      setEvidenceResults([]);
    }
  }, [evidenceSearch]);

  const handleAttachEvidence = async (evidenceId: string) => {
    if (!existingRelationship) return;
    try {
      await ApiService.attachEvidenceToRelationship(existingRelationship.id, evidenceId);
      setIsAttachingEvidence(false);
      setEvidenceSearch('');
      sound.blip();
      onSaved(); // trigger a reload in the parent
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveEvidence = async (evidenceId: string) => {
    if (!existingRelationship) return;
    if (!window.confirm('Remove this evidence association?')) return;
    try {
      await ApiService.removeEvidenceFromRelationship(existingRelationship.id, evidenceId);
      sound.blip();
      onSaved();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (targetSearch.length >= 2 && !selectedTarget) {
      const delay = setTimeout(searchTargets, 300);
      return () => clearTimeout(delay);
    }
  }, [targetSearch, targetType]);

  const searchTargets = async () => {
    try {
      let results = [];
      if (targetType === 'people') results = await ApiService.getPeople(targetSearch);
      else if (targetType === 'organisations') results = await ApiService.getOrganisations(targetSearch);
      else if (targetType === 'locations') results = await ApiService.getLocations(targetSearch);
      
      // Filter out the source entity itself if type matches
      if (targetType === sourceType) {
        results = results.filter((r: any) => r.id !== sourceEntity.id);
      }
      setTargetResults(results);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget && !existingRelationship) {
      setError('Please select a target entity');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        sourceType,
        sourceId: sourceEntity.id,
        targetType: existingRelationship ? existingRelationship.targetType : targetType,
        targetId: existingRelationship ? existingRelationship.targetId : selectedTarget.id,
        relationshipType,
        description,
        verificationStatus,
        caseFileId
      };

      if (existingRelationship) {
        await ApiService.updateRelationship(existingRelationship.id, payload);
      } else {
        await ApiService.createRelationship(payload);
      }
      
      sound.blip();
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save relationship');
      sound.blip();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#090D1A] border border-cyan-900/50 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
          <h2 className="text-lg font-bold text-white font-mono">
            {existingRelationship ? 'Edit Relationship' : 'Add Relationship'}
          </h2>
          <button onClick={() => { onClose(); sound.click(); }} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 rounded text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
            <p className="text-xs text-gray-500 font-mono mb-1">Source Entity</p>
            <p className="text-sm text-gray-300 font-bold">{sourceEntity.name}</p>
          </div>

          {!existingRelationship && (
            <div className="space-y-3 border border-gray-800 p-4 rounded bg-black/20">
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                Target Entity
              </label>
              
              {!selectedTarget ? (
                <>
                  <div className="flex gap-2">
                    {['people', 'organisations', 'locations'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTargetType(t as any); setTargetResults([]); setTargetSearch(''); sound.click(); }}
                        className={`flex-1 py-1.5 text-xs font-mono rounded border transition-colors capitalize ${
                          targetType === t ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={targetSearch}
                      onChange={(e) => setTargetSearch(e.target.value)}
                      placeholder={`Search ${targetType}...`}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                    />
                  </div>
                  
                  {targetResults.length > 0 && (
                    <div className="max-h-40 overflow-y-auto custom-scrollbar border border-gray-700 rounded bg-gray-900">
                      {targetResults.map(r => (
                        <div
                          key={r.id}
                          onClick={() => { setSelectedTarget(r); setTargetResults([]); sound.click(); }}
                          className="p-2 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 text-sm text-gray-300 transition-colors"
                        >
                          {r.name}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between bg-cyan-950/20 border border-cyan-900/50 p-2 rounded">
                  <span className="text-sm text-cyan-300 font-bold">{selectedTarget.name}</span>
                  <button
                    type="button"
                    onClick={() => { setSelectedTarget(null); setTargetSearch(''); sound.click(); }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {existingRelationship && (
             <div className="bg-gray-900/50 p-3 rounded border border-gray-800">
               <p className="text-xs text-gray-500 font-mono mb-1">Target Entity</p>
               <p className="text-sm text-gray-300 font-bold">{existingRelationship.targetEntity?.name}</p>
             </div>
          )}


          {existingRelationship && (
            <div className="border border-gray-800 rounded bg-black/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Supporting Evidence
                </label>
                <button
                  type="button"
                  onClick={() => setIsAttachingEvidence(!isAttachingEvidence)}
                  className="text-[10px] bg-cyan-900/30 text-cyan-400 border border-cyan-800 px-2 py-1 rounded"
                >
                  {isAttachingEvidence ? 'CANCEL' : '+ ATTACH'}
                </button>
              </div>
              
              {isAttachingEvidence && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={evidenceSearch}
                    onChange={(e) => setEvidenceSearch(e.target.value)}
                    placeholder="Search existing evidence..."
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white"
                  />
                  {evidenceResults.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {evidenceResults.map(ev => (
                        <div key={ev.id} className="flex items-center justify-between p-2 bg-black border border-gray-800 rounded text-xs">
                          <span className="text-gray-300 truncate pr-2">{ev.title}</span>
                          <button type="button" onClick={() => handleAttachEvidence(ev.id)} className="text-emerald-400 font-bold shrink-0">Attach</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {existingRelationship.evidenceList && existingRelationship.evidenceList.length > 0 ? (
                <div className="space-y-2">
                  {existingRelationship.evidenceList.map((evItem: any) => (
                    <div key={evItem.evidence.id} className="flex items-center justify-between p-2 bg-gray-900/30 border border-gray-800 rounded">
                      <span className="text-xs text-cyan-400 truncate pr-2">{evItem.evidence.title}</span>
                      <button type="button" onClick={() => handleRemoveEvidence(evItem.evidence.id)} className="text-red-400 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">No evidence attached.</div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              Relationship Type
            </label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              required
            >
              {RELATIONSHIP_TYPES.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              Verification Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setVerificationStatus('UNVERIFIED'); sound.click(); }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  verificationStatus === 'UNVERIFIED' ? 'bg-amber-950/40 border-amber-500/50 text-amber-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-mono tracking-wider">UNVERIFIED</span>
              </button>
              <button
                type="button"
                onClick={() => { setVerificationStatus('VERIFIED'); sound.click(); }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  verificationStatus === 'VERIFIED' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-mono tracking-wider">VERIFIED</span>
              </button>
              <button
                type="button"
                onClick={() => { setVerificationStatus('DISPUTED'); sound.click(); }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  verificationStatus === 'DISPUTED' ? 'bg-red-950/40 border-red-500/50 text-red-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-mono tracking-wider">DISPUTED</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono transition-colors min-h-[100px] resize-none"
              placeholder="Provide context for this relationship..."
            />
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { onClose(); sound.click(); }}
              className="px-4 py-2 rounded text-gray-400 hover:text-white font-mono text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!selectedTarget && !existingRelationship)}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-mono font-bold text-sm transition-colors"
            >
              {loading ? 'Saving...' : 'Save Relationship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
