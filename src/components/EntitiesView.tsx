import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { User, Building, MapPin, Search, Plus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { EntityModal } from './EntityModal';
import { sound } from '../utils/audio';

interface Props {
  caseFileId: string;
  type: 'people' | 'organisations' | 'locations';
  currentUser: any;
}

export const EntitiesView: React.FC<Props> = ({ caseFileId, type, currentUser }) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  useEffect(() => {
    loadEntities();
  }, [type, caseFileId, searchQuery]);

  const loadEntities = async () => {
    try {
      setLoading(true);
      let data;
      if (type === 'people') {
        data = await ApiService.getPeople(searchQuery, caseFileId);
      } else if (type === 'organisations') {
        data = await ApiService.getOrganisations(searchQuery, caseFileId);
      } else if (type === 'locations') {
        data = await ApiService.getLocations(searchQuery, caseFileId);
      }
      setEntities(data || []);
    } catch (err) {
      console.error('Failed to load entities', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (type === 'people') return <User className="w-5 h-5 text-cyan-400" />;
    if (type === 'organisations') return <Building className="w-5 h-5 text-amber-400" />;
    return <MapPin className="w-5 h-5 text-emerald-400" />;
  };

  const getTitle = () => {
    if (type === 'people') return 'Involved Persons';
    if (type === 'organisations') return 'Linked Organisations';
    return 'Key Locations';
  };

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
    sound.click();
  };

  const handleAddNew = () => {
    setSelectedEntity(null);
    setIsModalOpen(true);
    sound.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            
            {currentUser && (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-900/60 rounded-lg flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entities.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-3">
              {getIcon()}
            </div>
            <p className="text-gray-400 font-mono text-sm">No {type} found for this case.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entities.map(entity => (
              <div 
                key={entity.id}
                onClick={() => handleEntityClick(entity)}
                className="p-4 bg-black border border-gray-800 hover:border-gray-600 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {entity.imageUrl ? (
                    <img src={entity.imageUrl} alt={entity.name} className="w-12 h-12 rounded object-cover border border-gray-700" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0">
                      {getIcon()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">{entity.name}</h4>
                    {(entity.aliases || entity.locationType || entity.type) && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {entity.aliases || entity.locationType || entity.type}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center">
                      {entity.verificationStatus === 'VERIFIED' && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                          <ShieldCheck className="w-3 h-3" /> Confirmed
                        </span>
                      )}
                      {entity.verificationStatus === 'DISPUTED' && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-950/30 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">
                          <AlertTriangle className="w-3 h-3" /> Disputed
                        </span>
                      )}
                      {entity.verificationStatus === 'UNVERIFIED' && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                          <AlertTriangle className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EntityModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          entity={selectedEntity} 
          type={type}
          caseFileId={caseFileId}
          onSaved={loadEntities}
        />
      )}
    </div>
  );
};
