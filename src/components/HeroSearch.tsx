import React from 'react';
import { 
  Search, 
  Sparkles, 
  Binary, 
  Network, 
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Category, EvidenceRating, CaseFile } from '../types';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/audio';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'ALL';
  onSelectCategory: (cat: Category | 'ALL') => void;
  selectedStatus: EvidenceRating | 'ALL';
  onSelectStatus: (status: EvidenceRating | 'ALL') => void;
  onRandomRabbitHole: () => void;
  onOpenCase: (caseId: string) => void;
  dailyCase?: CaseFile;
  cases: CaseFile[];
}

export const HeroSearch: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  onRandomRabbitHole,
  onOpenCase,
  dailyCase,
  cases
}) => {
  const categories: { id: Category | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Dossiers', icon: '📁' },
    { id: 'GOVERNMENT_INTELLIGENCE', label: 'Gov & Intelligence', icon: '🏛️' },
    { id: 'UFOS_UAP', label: 'UFOs & Aerospace', icon: '🛸' },
    { id: 'MONEY_POWER', label: 'Money & Power', icon: '💰' },
    { id: 'GLOBAL_EVENTS', label: 'Global Events', icon: '🌎' },
    { id: 'PSYCHOLOGY_CONTROL', label: 'Behavior & Mind', icon: '🧠' },
    { id: 'ANCIENT_MYSTERIES', label: 'Ancient Mysteries', icon: '🗿' },
    { id: 'UNSOLVED', label: 'Unsolved Cases', icon: '🕵️' },
    { id: 'CRYPTIDS', label: 'Cryptids & Folklore', icon: '🐉' },
  ];

  const statuses: { id: EvidenceRating | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'ALL STATUS RATINGS' },
    { id: 'VERIFIED', label: 'VERIFIED (Primary Proof)' },
    { id: 'DOCUMENTED', label: 'DOCUMENTED (Disputed Interpretation)' },
    { id: 'ALLEGED', label: 'ALLEGED (Insufficient Evidence)' },
    { id: 'SPECULATIVE', label: 'SPECULATIVE (Hypothesis)' },
    { id: 'DISPROVEN', label: 'DISPROVEN (Contradicted)' },
  ];

  return (
    <div className="relative w-full border-b border-white/10 bg-[#050505] pt-8 pb-10 px-4 sm:px-6 overflow-hidden">
      {/* Subtle Carbon Mesh Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] mono tracking-[0.2em] mb-4">
            <Binary className="w-3.5 h-3.5" />
            <span>PRIMARY EVIDENCE • CROWDSOURCED FORENSICS • UNREDACTED TRUTH</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold mono tracking-[0.2em] text-white uppercase mb-2">
            NOTHING IS <span className="text-[#00E5FF] cyan-glow">EVERYTHING.</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Examine declassified documents, verify provenance, compare competing theories, and navigate the interconnected knowledge network.
          </p>
        </div>

        {/* Master Investigative Search Input */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative flex flex-col sm:flex-row items-stretch bg-[#111111] border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <div className="flex items-center flex-1 px-4 py-3 gap-3">
              <span className="text-[#00E5FF] opacity-70 mono text-xs font-bold">SEARCH:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search theories, people (Oswald, Dulles), agencies (CIA, KGB), locations..."
                className="w-full bg-transparent text-[#00E5FF] font-mono text-xs sm:text-sm placeholder-white/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-[10px] mono text-white/60 hover:text-white px-2 py-0.5 bg-white/10"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="border-t sm:border-t-0 sm:border-l border-white/10 bg-[#0a0a0a] px-3 py-2 flex items-center justify-between gap-2 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#00E5FF]" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  onSelectStatus(e.target.value as EvidenceRating | 'ALL');
                  sound.playClick(650);
                }}
                className="bg-transparent text-[11px] mono text-[#00E5FF] focus:outline-none cursor-pointer uppercase"
              >
                {statuses.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#0D0D0D] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  sound.playClick(700);
                }}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 text-xs mono transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)] font-bold'
                    : 'bg-[#0D0D0D] text-white/60 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Grid: Daily Mystery + System Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Daily Highlight Card */}
          {dailyCase && (
            <div 
              onClick={() => { onOpenCase(dailyCase.id); sound.playClick(800); }}
              className="lg:col-span-8 cursor-pointer group relative border border-white/10 bg-[#0D0D0D] p-5 hover:border-[#00E5FF]/60 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="classified-stamp text-[9px] mono">
                      TOP SECRET
                    </span>
                    <span className="text-xs mono text-[#00E5FF] font-bold tracking-widest">
                      {dailyCase.caseNumber} // ACTIVE_CASE
                    </span>
                  </div>
                  <StatusBadge status={dailyCase.status} size="sm" />
                </div>

                <h3 className="text-base sm:text-lg font-bold mono text-white group-hover:text-[#00E5FF] transition-colors mb-2">
                  {dailyCase.title}
                </h3>
                <p className="text-xs text-white/70 font-sans line-clamp-2 mb-4 leading-relaxed">
                  {dailyCase.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] mono text-white/50 pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span>EXHIBITS: <strong className="text-white">{dailyCase.evidenceList.length}</strong></span>
                  <span>DEBATES: <strong className="text-white">{dailyCase.commentCount}</strong></span>
                  <span>NODES: <strong className="text-[#00E5FF]">{dailyCase.connectedCaseIds.length}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[#00E5FF] group-hover:translate-x-1 transition-transform font-bold">
                  <span>EXAMINE DOSSIER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* System Telemetry Stats Block */}
          <div className="lg:col-span-4 bg-[#0D0D0D] border border-white/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <h3 className="text-[10px] mono text-[#00E5FF] tracking-[0.2em] font-bold">
                  SYSTEM_STATS
                </h3>
                <span className="text-[10px] mono text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  LIVE
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] mono text-white/60">GLOBAL_ANALYSTS</span>
                  <span className="text-xs mono text-[#00E5FF] font-bold">4,821</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <div className="bg-[#00E5FF] h-full w-[72%] shadow-[0_0_8px_#00E5FF]"></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] mono text-white/60">ACTIVE_DOSSIERS</span>
                  <span className="text-xs mono text-white font-bold">{cases.length}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] mono text-white/60">ENCRYPTION_STRENGTH</span>
                  <span className="text-xs mono text-green-400 font-bold">AES-256-GCM</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] mono text-white/60">SERVER_LATENCY</span>
                  <span className="text-xs mono text-[#00E5FF]">14ms</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { onRandomRabbitHole(); sound.playWarp(); }}
              className="mt-4 w-full py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/40 hover:border-[#00E5FF] text-[#00E5FF] text-xs mono font-bold hover:bg-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.15)] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIVE RANDOM RABBIT HOLE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
