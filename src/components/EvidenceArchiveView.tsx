import { EmptyState } from "./EmptyState";
import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Plus, ShieldCheck, AlertTriangle, ShieldAlert, FileText, Download } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { ArchiveEvidence } from '../types';
import { UserProfile } from '../types';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { EvidenceDetailModal } from './EvidenceDetailModal';

interface Props {
  currentUser: UserProfile | null;
  onOpenCase: (caseId: string) => void;
  onReputationEarned: (amount: number, reason: string, persist?: boolean) => void;
  onOpenEntity?: (type: string, id: string) => void;
  onOpenEvent?: (id: string) => void;
}

export const EvidenceArchiveView: React.FC<Props> = ({ currentUser, onOpenCase, onReputationEarned, onOpenEntity, onOpenEvent }) => {
  const [evidenceItems, setEvidenceItems] = useState<ArchiveEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<ArchiveEvidence | null>(null);
  
const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadEvidence();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, page]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getEvidence({ query: searchQuery, status: statusFilter, page });
      setEvidenceItems(data.items || data);
      if (data.totalPages) setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load evidence', err);
    } finally {
      setLoading(false);
    }
  };

  // We can remove the old local evidenceItems and just map evidenceItems directly.


  const getStatusColor = (status: string) => {
    switch(status) {
      case 'VERIFIED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'DISPUTED': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'UNDER_REVIEW': return 'text-cipher-accent bg-cipher-accent/10 border-cyan-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'VERIFIED': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'DISPUTED': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'REJECTED': return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <Database className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono text-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-wider">
            <Database className="w-6 h-6 text-cipher-accent" />
            EVIDENCE ARCHIVE
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Global Repository of Source Material</p>
        </div>
        
        {currentUser && (
          <button onClick={() => setIsSubmitModalOpen(true)} className="px-4 py-2 bg-cyan-950/40 border border-cipher-accent/40 text-cipher-accent hover:bg-cyan-900/60 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors">
            <Plus className="w-4 h-4" />
            Submit Evidence
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents, transcripts, and records..." aria-label="Search documents, transcripts, and records..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cipher-surface border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cipher-accent/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-cipher-surface border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-cipher-accent/50 appearance-none min-w-[160px]"
          >
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="DISPUTED">Disputed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-cipher-accent/50 text-sm font-bold uppercase tracking-widest animate-pulse">
          Decrypting Archive...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceItems.map(item => (
            <div key={item.id} onClick={() => setSelectedEvidence(item)} className="bg-cipher-surface border border-gray-800 rounded-xl p-5 hover:border-cipher-accent/30 transition-colors flex flex-col h-full cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <FileText className="w-24 h-24" />
              </div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
                <span className="text-[10px] text-gray-500">{item.type}</span>
              </div>
              
              <h3 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-cipher-accent transition-colors relative z-10">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-3 mb-4 flex-1 relative z-10">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto relative z-10">
                <div className="text-[10px] text-gray-500">
                  Sub: {item.submitter?.displayName || 'Unknown'}
                </div>
                <div className="text-[10px] font-bold text-cipher-accent">
                  {item.stance}
                </div>
              </div>
            </div>
          ))}
          {evidenceItems.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={Database}
                title="NO EVIDENCE RECORDS FOUND"
                message="No documentation or primary evidence matches the current filters."
              />
            </div>
          )}
        </div>
      )}

      {selectedEvidence && (
        <EvidenceDetailModal
          evidence={selectedEvidence}
          currentUser={currentUser}
          onClose={() => setSelectedEvidence(null)}
          onUpdate={(updated) => {
            setEvidenceItems(items => items.map(i => i.id === updated.id ? updated : i));
            setSelectedEvidence(updated);
          }}
          onOpenEntity={onOpenEntity as any}
          onOpenEvent={onOpenEvent}
        />
      )}

      {isSubmitModalOpen && currentUser && (
        <SubmitEvidenceModal
          currentUser={currentUser}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={() => {
            setIsSubmitModalOpen(false);
            loadEvidence();
          }}
        />
      )}
    </div>

  );
};
