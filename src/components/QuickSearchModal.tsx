import React, { useState, useEffect } from 'react';
import { 
  Search, X, FileText, Building2, Users, MapPin, 
  Sparkles, Database, Loader, Filter
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
  onOpenEntity: (type: string, id: string) => void;
  onOpenEvidence: (evidenceId: string) => void;
  onOpenEvent: (eventId: string) => void;
  onRandomRabbitHole?: () => void;
}

export const QuickSearchModal: React.FC<Props> = ({
  isOpen, onClose, onOpenCase, onOpenEntity, onOpenEvidence, onOpenEvent, onRandomRabbitHole
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() && selectedTypes.length === 0) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const { ApiService } = await import('../services/apiService');
        const data = await ApiService.search(query, selectedTypes);
        setResults(data.results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query, selectedTypes]);

  if (!isOpen) return null;

  const toggleType = (t: string) => {
    sound.click();
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CASE': return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'PERSON': return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ORGANISATION': return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'LOCATION': return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      case 'EVENT': return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'EVIDENCE': return <Database className="w-3.5 h-3.5 text-rose-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const handleResultClick = (r: any) => {
    sound.click();
    onClose();
    switch (r.resultType) {
      case 'CASE': onOpenCase(r.id); break;
      case 'PERSON': onOpenEntity('people', r.id); break;
      case 'ORGANISATION': onOpenEntity('organisations', r.id); break;
      case 'LOCATION': onOpenEntity('locations', r.id); break;
      case 'EVENT': onOpenEvent(r.id); break;
      case 'EVIDENCE': onOpenEvidence(r.id); break;
    }
  };

  const ALL_TYPES = ['CASE', 'PERSON', 'ORGANISATION', 'LOCATION', 'EVENT', 'EVIDENCE'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-xl border border-cyan-500/40 bg-[#0D0D0D] shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[85vh]">
        
        {/* Search Input */}
        <div className="flex flex-col bg-cyan-950/20 px-4 py-2 border-b border-cyan-500/20"><span className="text-[10px] text-cyan-400 font-mono tracking-widest font-bold mb-1">CIPHER FILES MASTER DATABASE</span></div><div className="flex items-center px-4 py-4 border-b border-white/10 shrink-0 gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="GLOBAL DATABASE SEARCH (Cases, People, Evidence...)"
            className="w-full bg-transparent font-mono text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
          />
          <button onClick={() => { sound.click(); onClose(); }} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        {onRandomRabbitHole && (
          <div className="px-4 py-2 border-b border-white/5 shrink-0 bg-cyan-950/10">
            <button
              onClick={() => { onClose(); onRandomRabbitHole(); sound.playWarp(); }}
              className="w-full flex items-center justify-between p-2 rounded bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30 hover:border-cyan-400/80 transition-all group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-mono font-bold text-cyan-300">RANDOM RABBIT HOLE (SURPRISE ME)</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-500 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-black/50">
                +25 REP
              </span>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 py-2 border-b border-white/5 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span className="text-[10px] font-mono text-gray-500 mr-2 shrink-0">FILTER:</span>
          {ALL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-colors border ${
                selectedTypes.includes(t) 
                  ? 'bg-cyan-900/50 border-cyan-500/50 text-cyan-400' 
                  : 'bg-black border-white/10 text-gray-500 hover:border-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-rose-400">
              <span className="font-mono text-sm mb-3">Search unavailable. Please try again.</span>
              <button 
                onClick={() => setQuery(query + ' ')}
                className="px-4 py-1.5 border border-rose-500/50 rounded hover:bg-rose-950/30 transition-colors font-mono text-xs"
              >
                RETRY
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Search className="w-8 h-8 mb-4 opacity-20" />
              <p className="font-mono text-sm">No intelligence matches found.</p>
              <p className="font-mono text-[10px] opacity-50 mt-1">Try adjusting keywords or filters.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map(r => (
                <div
                  key={`${r.resultType}-${r.id}`}
                  onClick={() => handleResultClick(r)}
                  className="flex items-start gap-3 p-3 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-colors group"
                >
                  <div className="pt-0.5">
                    {getTypeIcon(r.resultType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {r.title}
                      </div>
                      <div className="text-[9px] font-mono text-gray-500 border border-gray-800 px-1.5 py-0.5 rounded shrink-0">
                        {r.resultType}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {r.description || 'No summary available.'}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {r.status && (
                        <span className={`text-[9px] font-mono font-bold ${
                          r.status === 'VERIFIED' ? 'text-emerald-400' :
                          r.status === 'DISPUTED' ? 'text-amber-400' : 'text-gray-500'
                        }`}>
                          {r.status}
                        </span>
                      )}
                      {r.metadata?.caseNumber && (
                        <span className="text-[9px] font-mono text-blue-400">
                          {r.metadata.caseNumber}
                        </span>
                      )}
                      {r.metadata?.dateString && (
                        <span className="text-[9px] font-mono text-purple-400">
                          {r.metadata.dateString}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
