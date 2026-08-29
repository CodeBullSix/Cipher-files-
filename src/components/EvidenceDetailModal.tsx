import { AddToWorkspaceModal } from './AddToWorkspaceModal';
import React, { useState } from 'react';
import { FolderArchive, X, ShieldCheck, AlertTriangle, ShieldAlert, Database, FileText, Download, User, ExternalLink, Calendar } from 'lucide-react';
import { ArchiveEvidence, UserProfile } from '../types';
import { ApiService } from '../services/apiService';

interface Props {
  evidence: ArchiveEvidence;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUpdate: (updated: ArchiveEvidence) => void;
  onOpenEntity?: (type: 'person' | 'organisation' | 'location', id: string) => void;
  onOpenEvent?: (eventId: string) => void;
}

export const EvidenceDetailModal: React.FC<Props> = ({ evidence, currentUser, onClose, onUpdate, onOpenEntity, onOpenEvent }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(evidence.status);
  
  const isModerator = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'VERIFIED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'DISPUTED': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'UNDER_REVIEW': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'VERIFIED': return <ShieldCheck className="w-5 h-5" />;
      case 'DISPUTED': return <AlertTriangle className="w-5 h-5" />;
      case 'REJECTED': return <ShieldAlert className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const handleVerify = async () => {
    if (!isModerator) return;
    try {
      const updated = await ApiService.verifyEvidence(evidence.id, verifyStatus, verificationNotes);
      onUpdate(updated);
      setIsVerifying(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto rounded-2xl border border-cyan-500/40 bg-[#080B14] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200 font-mono">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#090D1A]">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider truncate">EVIDENCE RECORD: {evidence.id.split('-')[0]}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#050810]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5 uppercase ${getStatusColor(evidence.status)}`}>
                    {getStatusIcon(evidence.status)}
                    {evidence.status}
                  </div>
                  <div className="px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-800 bg-gray-900 text-gray-300 uppercase">
                    {evidence.type}
                  </div>
                  <div className="px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-800 bg-gray-900 text-cyan-400 uppercase">
                    {evidence.stance}
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mt-4">{evidence.title}</h1>
              </div>
              
              <div className="prose prose-invert prose-cyan max-w-none">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Context & Analysis</h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{evidence.description}</p>
              </div>

              {evidence.document && (
                <div>
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest border-b border-gray-800 pb-2 mb-3">Attached File</h3>
                  <div className="flex items-center justify-between p-4 bg-[#090D1A] border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-cyan-400/70" />
                      <div>
                        <div className="text-sm font-bold text-white">{evidence.document.title}</div>
                        <div className="text-[10px] text-gray-500 uppercase mt-1">
                          {evidence.document.fileType} • {(evidence.document.fileSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        ApiService.downloadDocument(evidence.document!.storageKey, evidence.document!.fileName, evidence.document!.fileType).catch(err => alert(err.message));
                      }}
                      className="px-3 py-1.5 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 rounded flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      View / Download
                    </button>
                  </div>
                </div>
              )}
              
              {evidence.verificationNotes && (
                <div className={`p-4 rounded-lg border ${evidence.status === 'VERIFIED' ? 'bg-emerald-950/20 border-emerald-500/30' : evidence.status === 'REJECTED' ? 'bg-red-950/20 border-red-500/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    {getStatusIcon(evidence.status)}
                    Moderator Verification Notes
                  </h3>
                  <p className="text-sm text-gray-300 italic">{evidence.verificationNotes}</p>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase">Verified by: {evidence.verifier?.displayName}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {evidence.source && (
                <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Source Provenance</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Entity / Title</div>
                      <div className="font-bold text-white">{evidence.source.name}</div>
                    </div>
                    
                    {evidence.source.author && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Author</div>
                        <div className="text-gray-300">{evidence.source.author}</div>
                      </div>
                    )}
                    
                    {evidence.source.publisher && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Publisher / Org</div>
                        <div className="text-gray-300">{evidence.source.publisher}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {evidence.source.publicationDate && (
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Published</div>
                          <div className="text-gray-300 text-xs">{new Date(evidence.source.publicationDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      {evidence.source.accessedAt && (
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Accessed</div>
                          <div className="text-gray-300 text-xs">{new Date(evidence.source.accessedAt).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Type</div>
                      <div className="text-gray-300">{evidence.source.sourceType}</div>
                    </div>
                    {evidence.source.url && (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Link</div>
                        <a href={evidence.source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 text-xs">
                          External Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {((evidence.people && evidence.people.length > 0) || 
                (evidence.organisations && evidence.organisations.length > 0) || 
                (evidence.locations && evidence.locations.length > 0) || 
                (evidence.events && evidence.events.length > 0)) && (
                <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Associated References</h3>
                  <div className="space-y-3">
                    {evidence.people?.map(p => (
                      <div key={p.id} onClick={() => onOpenEntity?.('person', p.id)} className="text-sm text-cyan-400 hover:underline cursor-pointer">
                        • {p.name} (Person)
                      </div>
                    ))}
                    {evidence.organisations?.map(o => (
                      <div key={o.id} onClick={() => onOpenEntity?.('organisation', o.id)} className="text-sm text-cyan-400 hover:underline cursor-pointer">
                        • {o.name} (Organisation)
                      </div>
                    ))}
                    {evidence.locations?.map(l => (
                      <div key={l.id} onClick={() => onOpenEntity?.('location', l.id)} className="text-sm text-cyan-400 hover:underline cursor-pointer">
                        • {l.name} (Location)
                      </div>
                    ))}
                    {evidence.events?.map(e => (
                      <div key={e.id} onClick={() => onOpenEvent?.(e.id)} className="text-sm text-cyan-400 hover:underline cursor-pointer">
                        • {e.title} (Event)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Submission Metadata</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase">Submitter</span>
                    <span className="text-gray-300 flex items-center gap-1.5 text-xs">
                      <User className="w-3 h-3" />
                      {evidence.submitter?.displayName || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase">Timestamp</span>
                    <span className="text-gray-300 flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(evidence.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {isModerator && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Moderation</h3>
                  {!isVerifying ? (
                    <button 
                      onClick={() => setIsVerifying(true)}
                      className="w-full py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded text-xs font-bold uppercase transition-colors"
                    >
                      Assess Evidence
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <select 
                        value={verifyStatus}
                        onChange={e => setVerifyStatus(e.target.value as any)}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                      >
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="DISPUTED">Disputed</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      <textarea 
                        value={verificationNotes}
                        onChange={e => setVerificationNotes(e.target.value)}
                        placeholder="Moderator notes..."
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-white min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setIsVerifying(false)} className="flex-1 py-1.5 border border-gray-700 text-gray-400 rounded text-xs">Cancel</button>
                        <button onClick={handleVerify} className="flex-1 py-1.5 bg-red-600 text-white rounded text-xs font-bold">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
