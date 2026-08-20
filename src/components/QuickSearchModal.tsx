import React, { useState, useEffect } from 'react';
import { CaseFile, GraphNode } from '../types';
import { 
  Search, 
  X, 
  FileText, 
  Building2, 
  Users, 
  MapPin, 
  Share2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseFile[];
  nodes: GraphNode[];
  onOpenCase: (caseId: string) => void;
  onJumpGraphEntity: (entityName: string) => void;
  onRandomRabbitHole?: () => void;
}

export const QuickSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cases,
  nodes,
  onOpenCase,
  onJumpGraphEntity,
  onRandomRabbitHole
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        // toggle search
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = query
    ? cases.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
        c.claim.toLowerCase().includes(query.toLowerCase()) ||
        c.entities.some(e => e.name.toLowerCase().includes(query.toLowerCase()))
      )
    : cases.slice(0, 4);

  const filteredNodes = query
    ? nodes.filter(n => n.label.toLowerCase().includes(query.toLowerCase()) && n.type !== 'CASE')
    : nodes.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-[#0a0d16] shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0d121c] gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all intelligence files, people, agencies, and rabbit holes..."
            className="w-full bg-transparent font-mono text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          
          {/* Quick Random Action */}
          {onRandomRabbitHole && (
            <div
              onClick={() => {
                onClose();
                onRandomRabbitHole();
              }}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/70 via-[#0A1020] to-purple-950/70 border border-cyan-500/50 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <span>RANDOM RABBIT HOLE (SURPRISE ME)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      +25 XP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Dive down an unexpected declassified intelligence trail
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {/* Matching Case Dossiers */}
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-2">
              CASE DOSSIERS ({filteredCases.length})
            </span>
            <div className="space-y-1.5">
              {filteredCases.length === 0 ? (
                <div className="text-xs font-mono text-slate-500 py-2">No matching case files found.</div>
              ) : (
                filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onOpenCase(c.id);
                      onClose();
                      sound.playClick(750);
                    }}
                    className="p-2.5 rounded-lg bg-[#07090e] border border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#0c101a] cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/30">
                        {c.caseNumber}
                      </span>
                      <div>
                        <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{c.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} size="sm" />
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Matching Graph Entities */}
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-2">
              CONNECTED ENTITIES & AGENCIES ({filteredNodes.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onJumpGraphEntity(n.label);
                    onClose();
                    sound.playWarp();
                  }}
                  className="p-2 rounded-lg bg-[#07090e] border border-slate-800/80 hover:border-amber-500/40 hover:bg-[#0c101a] cursor-pointer transition-all flex items-center gap-2"
                >
                  <span className="p-1 rounded bg-slate-900 text-amber-400">
                    {n.type === 'PERSON' && <Users className="w-3 h-3 text-cyan-400" />}
                    {n.type === 'AGENCY' && <Building2 className="w-3 h-3 text-amber-400" />}
                    {n.type === 'LOCATION' && <MapPin className="w-3 h-3 text-emerald-400" />}
                    {n.type === 'EVENT' && <Sparkles className="w-3 h-3 text-purple-400" />}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-mono font-bold text-white line-clamp-1">{n.label}</div>
                    <div className="text-[9px] text-slate-400 uppercase">{n.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
