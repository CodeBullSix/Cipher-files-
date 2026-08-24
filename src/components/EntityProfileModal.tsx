import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { X, User, Building, MapPin, ShieldCheck, AlertTriangle, Edit, FolderArchive, Share2, Scale, Calendar, Database } from 'lucide-react';
import { sound } from '../utils/audio';
import { EntityModal } from './EntityModal';
import { RelationshipModal } from './RelationshipModal';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  type: 'people' | 'organisations' | 'locations';
  currentUser: any;
  caseFileId?: string; // If opened from a case, to pass back to the edit modal
}

export const EntityProfileModal: React.FC<Props> = ({ isOpen, onClose, entityId, type, currentUser, caseFileId }) => {
  const [entity, setEntity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'evidence' | 'timeline'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [relationships, setRelationships] = useState<any[]>([]);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<any>(null);


  useEffect(() => {
    if (isOpen && entityId) {
      loadEntity();
    }
  }, [isOpen, entityId, type]);

  const loadEntity = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (type === 'people') data = await ApiService.getPersonById(entityId);
      else if (type === 'organisations') data = await ApiService.getOrganisationById(entityId);
      else if (type === 'locations') data = await ApiService.getLocationById(entityId);
      setEntity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load entity details');
    } finally {
      setLoading(false);
    }
  };

  
  const loadRelationships = async () => {
    try {
      const data = await ApiService.getRelationshipsForEntity(type, entityId);
      setRelationships(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && entityId && activeTab === 'relationships') {
      loadRelationships();
    }
  }, [isOpen, entityId, type, activeTab]);

  if (!isOpen) return null;

  const getIcon = (className = "w-5 h-5") => {
    if (type === 'people') return <User className={`${className} text-cyan-400`} />;
    if (type === 'organisations') return <Building className={`${className} text-amber-400`} />;
    return <MapPin className={`${className} text-emerald-400`} />;
  };

  const isEditable = currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || entity?.creator?.uid === currentUser?.uid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#090D1A] border border-cyan-900/50 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            {getIcon()}
            {type === 'people' ? 'Person Profile' : type === 'organisations' ? 'Organisation Profile' : 'Location Record'}
          </h2>
          <div className="flex items-center gap-3">
            {entity && isEditable && (
              <button 
                onClick={() => { setIsEditModalOpen(true); sound.click(); }}
                className="px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded text-gray-300 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            <button onClick={() => { onClose(); sound.click(); }} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400 font-mono text-sm">{error}</div>
        ) : !entity ? (
          <div className="p-6 text-center text-gray-400 font-mono text-sm">Entity not found.</div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Left Sidebar - Profile Card */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-800 p-6 bg-black/20 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center text-center mb-6">
                {entity.imageUrl ? (
                  <img src={entity.imageUrl} alt={entity.name} className="w-32 h-32 rounded-lg object-cover border-2 border-gray-700 mb-4" />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-900 border-2 border-gray-700 flex items-center justify-center mb-4">
                    {getIcon("w-12 h-12")}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{entity.name}</h3>
                {(entity.aliases || entity.locationType || entity.type) && (
                  <p className="text-sm text-gray-400 font-mono mb-3">
                    {entity.aliases || entity.locationType || entity.type}
                  </p>
                )}
                
                {/* Verification Badge */}
                <div className="inline-flex">
                  {entity.verificationStatus === 'VERIFIED' && (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4" /> Confirmed
                    </span>
                  )}
                  {entity.verificationStatus === 'DISPUTED' && (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-950/30 px-2 py-1 rounded border border-red-500/20 uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4" /> Disputed
                    </span>
                  )}
                  {entity.verificationStatus === 'UNVERIFIED' && (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4" /> Unverified
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {type === 'locations' && entity.country && (
                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase font-mono tracking-wider mb-1">Region / Country</h4>
                    <p className="text-sm text-gray-300">{entity.country}</p>
                  </div>
                )}
                {type === 'locations' && entity.coordinates && (
                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase font-mono tracking-wider mb-1">Coordinates</h4>
                    <p className="text-sm text-gray-300 font-mono">{entity.coordinates}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase font-mono tracking-wider mb-1">Created By</h4>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    {entity.creator ? entity.creator.displayName : 'Unknown'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase font-mono tracking-wider mb-1">Record Created</h4>
                  <p className="text-sm text-gray-300">{new Date(entity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-gray-800 bg-black/40 custom-scrollbar hide-scrollbar-arrows">
                <button
                  onClick={() => { setActiveTab('overview'); sound.click(); }}
                  className={`px-4 py-3 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'overview' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Database className="w-4 h-4" /> Overview
                </button>
                <button
                  onClick={() => { setActiveTab('relationships'); sound.click(); }}
                  className={`px-4 py-3 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'relationships' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Share2 className="w-4 h-4" /> Relationships
                </button>
                <button
                  onClick={() => { setActiveTab('evidence'); sound.click(); }}
                  className={`px-4 py-3 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'evidence' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Scale className="w-4 h-4" /> Evidence
                </button>
                <button
                  onClick={() => { setActiveTab('timeline'); sound.click(); }}
                  className={`px-4 py-3 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'timeline' ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20' : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Timeline
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-mono font-bold text-gray-400 uppercase mb-3">Intelligence Summary</h3>
                      <div className="p-4 rounded-xl bg-black border border-gray-800 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {entity.description || 'No detailed background provided.'}
                      </div>
                    </div>

                    {/* Associated Cases */}
                    <div>
                      <h3 className="text-sm font-mono font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <FolderArchive className="w-4 h-4" /> Associated Case Files
                      </h3>
                      {entity.associatedCases && entity.associatedCases.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {entity.associatedCases.map((c: any) => (
                            <div key={c.id} className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg flex items-center gap-3 hover:border-gray-600 transition-colors">
                              <FolderArchive className="w-4 h-4 text-cyan-500 shrink-0" />
                              <span className="text-sm text-gray-200 truncate">{c.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No case files associated with this record.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Placeholders for Future Phases */}
                {activeTab === 'relationships' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">Known Connections</h3>
                      {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || currentUser?.tier === 'CONTRIBUTOR') && (
                        <button
                          onClick={() => { setEditingRelationship(null); setIsRelationshipModalOpen(true); sound.click(); }}
                          className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-500/80 rounded text-cyan-400 text-xs font-mono transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Connection
                        </button>
                      )}
                    </div>
                    
                    {relationships.length === 0 ? (
                      <div className="text-center py-12 border border-gray-800 rounded-xl bg-gray-900/30">
                        <Share2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 font-mono text-sm">No documented relationships.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {relationships.map(rel => {
                          const isSource = rel.sourceId === entity.id;
                          const connectedEntity = isSource ? rel.targetEntity : rel.sourceEntity;
                          
                          // Determine direction arrow
                          const directionText = isSource ? '→ ' + rel.relationshipType.replace(/_/g, ' ') : '← ' + rel.relationshipType.replace(/_/g, ' ');
                          
                          return (
                            <div key={rel.id} className="p-4 bg-black border border-gray-800 rounded-xl flex items-start gap-4 group hover:border-gray-600 transition-colors">
                              {connectedEntity?.imageUrl ? (
                                <img src={connectedEntity.imageUrl} alt={connectedEntity.name} className="w-10 h-10 rounded object-cover border border-gray-700 mt-1" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0 mt-1">
                                  {connectedEntity?.entityType === 'people' ? <User className="w-5 h-5 text-cyan-400" /> : connectedEntity?.entityType === 'organisations' ? <Building className="w-5 h-5 text-amber-400" /> : <MapPin className="w-5 h-5 text-emerald-400" />}
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-cyan-500">{directionText}</span>
                                  {rel.verificationStatus === 'VERIFIED' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                                  {rel.verificationStatus === 'DISPUTED' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                                </div>
                                <h4 className="font-bold text-gray-200 truncate">{connectedEntity?.name}</h4>
                                {rel.description && (
                                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{rel.description}</p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {(currentUser?.tier === 'ADMIN' || currentUser?.tier === 'MODERATOR' || rel.createdBy === currentUser?.uid) && (
                                  <>
                                    <button
                                      onClick={() => { setEditingRelationship(rel); setIsRelationshipModalOpen(true); sound.click(); }}
                                      className="p-1.5 text-gray-500 hover:text-cyan-400 transition-colors"
                                      title="Edit Relationship"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (window.confirm('Delete this relationship?')) {
                                          await ApiService.deleteRelationship(rel.id);
                                          loadRelationships();
                                          sound.blip();
                                        }
                                      }}
                                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                      title="Delete Relationship"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="text-center py-12 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-4 border border-gray-800">
                      <Scale className="w-6 h-6 text-cyan-500/50" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Supporting Evidence</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-sm">
                      Phase 3.4 feature. Documents, photos, and sources linking this entity to the investigation will appear here.
                    </p>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="text-center py-12 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-4 border border-gray-800">
                      <Calendar className="w-6 h-6 text-cyan-500/50" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Chronology</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-sm">
                      Phase 3.6 feature. A chronological timeline of events involving this entity.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && entity && (
        <EntityModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          entity={entity}
          type={type}
          caseFileId={caseFileId || entity.caseFileIds?.[0]} 
          onSaved={() => {
            loadEntity();
          }}
        />
      )}

      {isRelationshipModalOpen && entity && (
        <RelationshipModal
          isOpen={isRelationshipModalOpen}
          onClose={() => setIsRelationshipModalOpen(false)}
          sourceEntity={entity}
          sourceType={type}
          caseFileId={caseFileId || entity.caseFileIds?.[0]}
          existingRelationship={editingRelationship}
          onSaved={() => {
            loadRelationships();
          }}
        />
      )}
    </div>
  );
};
