import React, { useState } from 'react';
import { X, Upload, Database, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { ApiService } from '../services/apiService';

interface Props {
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitted: () => void;
}

export const SubmitEvidenceModal: React.FC<Props> = ({ currentUser, onClose, onSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('DOCUMENT');
  const [stance, setStance] = useState('SUPPORTING');
  const [file, setFile] = useState<File | null>(null);
  
  // Source states
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState('PRIMARY');
  const [sourceUrl, setSourceUrl] = useState('');

  const [sourcePublisher, setSourcePublisher] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [sourcePubDate, setSourcePubDate] = useState('');
  const [sourceAccessDate, setSourceAccessDate] = useState('');
  const [documentPage, setDocumentPage] = useState('');

  const [caseFileId, setCaseFileId] = useState('');
  const [cases, setCases] = useState<any[]>([]);

  React.useEffect(() => {
    ApiService.getCases().then(setCases).catch(console.error);
  }, []);


  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      let documentData = null;
      
      if (file) {
        const uploadRes = await ApiService.uploadDocument(file);
        documentData = {
          title: file.name,
          fileName: uploadRes.fileName,
          fileType: uploadRes.fileType,
          fileSize: uploadRes.fileSize,
          storageKey: uploadRes.storageKey,
          pageCount: documentPage ? parseInt(documentPage) : null,
        };
      }
      
      const evidenceData = {
        title,
        description,
        type,
        stance,
        caseFileIds: caseFileId ? [caseFileId] : [],
        document: documentData,
        source: {
          name: sourceName || 'Unknown Source',
          sourceType,
          url: sourceUrl,
          publisher: sourcePublisher,
          author: sourceAuthor,
          publicationDate: sourcePubDate ? new Date(sourcePubDate).toISOString() : null,
          accessedAt: sourceAccessDate ? new Date(sourceAccessDate).toISOString() : null,
        }
      };
      
      await ApiService.submitEvidence(evidenceData);
      onSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cipher-base/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-cipher-surface border border-cipher-accent/30 rounded-xl shadow-[0_0_40px_rgba(0,229,255,0.1)] overflow-hidden font-mono flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-cipher-surface">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cipher-accent" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Submit Evidence Record</h2>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form id="evidence-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cipher-accent uppercase tracking-widest border-b border-gray-800 pb-2">Record Details</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Title / Designation</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  placeholder="e.g. MKULTRA Subproject 68 Memo"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Description & Context</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm min-h-[100px] resize-none"
                  placeholder="Provide context for this evidence..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Evidence Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  >
                    <option value="DOCUMENT">Document</option>
                    <option value="PHOTOGRAPH">Photograph</option>
                    <option value="VIDEO">Video</option>
                    <option value="AUDIO">Audio</option>
                    <option value="TESTIMONY">Testimony</option>
                    <option value="OFFICIAL_RECORD">Official Record</option>
                    <option value="NEWS_REPORT">News Report</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Stance</label>
                  <select
                    value={stance}
                    onChange={e => setStance(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  >
                    <option value="SUPPORTING">Supporting</option>
                    <option value="CONTRADICTING">Contradicting</option>
                    <option value="CONTEXTUAL">Contextual</option>
                    <option value="UNDETERMINED">Undetermined</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Link to Case File (Optional)</label>
                <select
                  value={caseFileId}
                  onChange={e => setCaseFileId(e.target.value)}
                  className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                >
                  <option value="">-- None --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cipher-accent uppercase tracking-widest border-b border-gray-800 pb-2">Source Attributions</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Source Name / Entity</label>
                <input
                  required
                  type="text"
                  value={sourceName}
                  onChange={e => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  placeholder="e.g. FOIA Request #1982, John Doe"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Source Type</label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="SECONDARY">Secondary</option>
                    <option value="OFFICIAL">Official</option>
                    <option value="JOURNALISTIC">Journalistic</option>
                    <option value="USER_SUBMITTED">User Submitted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">URL (Optional)</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Author</label>
                  <input
                    type="text"
                    value={sourceAuthor}
                    onChange={e => setSourceAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Publisher / Org</label>
                  <input
                    type="text"
                    value={sourcePublisher}
                    onChange={e => setSourcePublisher(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                    placeholder="e.g. CIA, NY Times"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Publication Date</label>
                  <input
                    type="date"
                    value={sourcePubDate}
                    onChange={e => setSourcePubDate(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Access Date</label>
                  <input
                    type="date"
                    value={sourceAccessDate}
                    onChange={e => setSourceAccessDate(e.target.value)}
                    className="w-full px-3 py-2 bg-cipher-elevated border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cipher-accent/50 text-sm"
                  />
                </div>
              </div>

            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cipher-accent uppercase tracking-widest border-b border-gray-800 pb-2">File Attachment</h3>
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cipher-accent/30 transition-colors">
                <input
                  type="file"
                  id="evidence-file"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
                <label htmlFor="evidence-file" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-cipher-accent mb-2" />
                  <span className="text-sm font-bold text-white mb-1">
                    {file ? file.name : 'Select File'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, JPG, PNG, WEBP (Max 50MB)'}
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-cipher-surface flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="evidence-form"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-cipher-accent text-black hover:bg-cipher-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Uploading...' : 'Submit to Archive'}
          </button>
        </div>
      </div>
    </div>
  );
};
