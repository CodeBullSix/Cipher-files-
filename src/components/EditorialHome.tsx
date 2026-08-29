import React, { useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  Filter, 
  FolderArchive,
  Flame,
  ShieldCheck,
  Building2,
  Calendar,
  Activity,
  Layers,
  Zap,
  Globe2,
  Lock,
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Database
} from 'lucide-react';
import { Category, EvidenceRating, CaseFile, OFFICIAL_STATUS_DEFINITIONS, CIPHER_FILES_PHILOSOPHY } from '../types';
import { StatusBadge, normalizeStatus } from './StatusBadge';
import { CaseCard } from './CaseCard';
import { sound } from '../utils/audio';

interface Props {
  cases: CaseFile[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: Category | 'ALL';
  onSelectCategory: (cat: Category | 'ALL') => void;
  selectedStatus: EvidenceRating | 'ALL';
  onSelectStatus: (st: EvidenceRating | 'ALL') => void;
  onOpenCase: (caseId: string) => void;
  onLaunchGraph: (targetEntity?: string) => void;
  onRandomRabbitHole: () => void;
  savedCaseIds: string[];
  onToggleBookmark: (caseId: string, e?: React.MouseEvent) => void;
}

export const EditorialHome: React.FC<Props> = ({
  cases,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  onOpenCase,
  onLaunchGraph,
  onRandomRabbitHole,
  savedCaseIds,
  onToggleBookmark
}) => {
  const exploreRef = useRef<HTMLDivElement>(null);

  const categories: { id: Category | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Files', icon: '📁' },
    { id: 'GOVERNMENT_INTELLIGENCE', label: 'Gov & Intel', icon: '🏛️' },
    { id: 'UFOS_UAP', label: 'UFOs & UAP', icon: '🛸' },
    { id: 'MONEY_POWER', label: 'Money & Power', icon: '💰' },
    { id: 'GLOBAL_EVENTS', label: 'Global Events', icon: '🌎' },
    { id: 'PSYCHOLOGY_CONTROL', label: 'Mind Control', icon: '🧠' },
    { id: 'ANCIENT_MYSTERIES', label: 'Ancient Lore', icon: '🗿' },
    { id: 'UNSOLVED', label: 'Unsolved', icon: '🕵️' },
    { id: 'CRYPTIDS', label: 'Cryptids', icon: '🐉' },
  ];

  const statuses: { id: EvidenceRating | 'ALL'; label: string; tagline?: string }[] = [
    { id: 'ALL', label: 'ALL RATINGS' },
    { id: 'VERIFIED', label: 'VERIFIED', tagline: 'Supported by reliable primary evidence.' },
    { id: 'DOCUMENTED', label: 'DOCUMENTED', tagline: 'Documented event, disputed interpretation.' },
    { id: 'ALLEGED', label: 'ALLEGED', tagline: 'Claim exists, evidence insufficient.' },
    { id: 'SPECULATIVE', label: 'SPECULATIVE', tagline: 'Hypothesis with limited evidence.' },
    { id: 'DISPROVEN', label: 'DISPROVEN', tagline: 'Contradicted by available evidence.' },
  ];

  const handleScrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
    sound.click();
  };

  const trendingCases = cases.filter(c => 
    c.id === 'jfk-assassination' || 
    c.id === 'project-mkultra' || 
    c.id === 'roswell-incident' || 
    c.id === 'operation-gladio'
  ).slice(0, 3);

  const recentlyUpdatedCases = cases.filter(c => 
    c.id === 'aatip-pentagon-uap' || 
    c.id === 'nsa-tao-surveillance' || 
    c.id === 'dyatlov-pass'
  ).slice(0, 3);

  const filteredCases = cases.filter(c => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL') {
      const norm = normalizeStatus(c.status);
      if (norm !== selectedStatus) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.summary.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const dailyCase = cases.find(c => c.id === 'project-blue-book');
  const dailyDocCase = cases.find(c => c.id === 'jfk-assassination');
  const dailyDocItem = dailyDocCase?.evidenceList?.[0];


  const rabbitHoleTeasers = [
    { label: 'CIA', category: 'ORGANISATION' },
    { label: 'JFK', category: 'PERSON' },
    { label: 'Area 51', category: 'LOCATION' },
    { label: 'Majestic 12', category: 'ORGANISATION' },
    { label: 'Roswell', category: 'LOCATION' },
    { label: 'MKUltra', category: 'OPERATION' },
    { label: 'Pentagon', category: 'LOCATION' },
    { label: 'Bohemian Grove', category: 'LOCATION' },
    { label: 'Operation Gladio', category: 'OPERATION' },
    { label: 'Denver Airport', category: 'LOCATION' },
  ];

  return (
    <div className="w-full bg-[#05070E] text-gray-200">
      
      {/* 1. CINEMATIC EDITORIAL HERO */}
      <section className="relative w-full min-h-[58vh] sm:min-h-[64vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-16 sm:py-20 border-b border-cyan-500/20 bg-gradient-to-b from-[#03050B] via-[#070B16] to-[#05070E] overflow-hidden">
        
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:28px_28px]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[250px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono tracking-[0.25em] uppercase mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>CIPHER FILES // DECLASSIFIED ARCHIVE</span>
          </div>

          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.18em] text-white uppercase mb-4 leading-tight">
            NOTHING IS <span className="text-cyan-400 cyan-glow">EVERYTHING.</span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
            Investigate classified documents, unexplained events, covert operations and controversial theories.
          </p>

          {/* New Investigator Orientation */}
          <div className="w-full max-w-3xl mx-auto mb-10 bg-[#090D1A] border border-cyan-500/30 rounded-xl p-5 text-left shadow-lg">
            <h3 className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 border-b border-cyan-500/20 pb-2 mb-4">
              <ShieldCheck className="w-4 h-4" />
              NEW INVESTIGATOR ORIENTATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FolderArchive className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] text-white font-bold block mb-0.5">CASE DOSSIERS</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] font-sans leading-tight block">Official investigations separating verified facts from unverified speculation.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] text-white font-bold block mb-0.5">PRIMARY EVIDENCE</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] font-sans leading-tight block">Source materials, FOIA releases, and declassified records.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] text-white font-bold block mb-0.5">THE RABBIT HOLE</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] font-sans leading-tight block">A visual graph connecting people, organisations, locations, and cases.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] text-white font-bold block mb-0.5">PRIVATE WORKSPACE</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] font-sans leading-tight block">Your personal area to collect evidence and build your own theories.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md justify-center">
            <button
              onClick={handleScrollToExplore}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02]"
            >
              <FolderArchive className="w-4 h-4 text-black" />
              <span>EXPLORE FILES</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={() => { onRandomRabbitHole(); sound.playWarp(); }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#090D1A] hover:bg-[#0E1528] border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>RANDOM RABBIT HOLE</span>
            </button>
          </div>

        </div>

      </section>

      {/* 1.5. SECTION: DAILY INTEL BRIEFING */}
      {(dailyCase || dailyDocItem) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-gray-800/80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
              <h2 className="font-mono text-base sm:text-lg font-bold text-white tracking-[0.15em] uppercase">
                DAILY INTEL BRIEFING
              </h2>
            </div>
            <span className="text-[11px] font-mono text-gray-500 hidden sm:inline uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Case (Trending Conspiracy) */}
            {dailyCase && (
              <div 
                className="group rounded-2xl bg-[#0A0E18] border border-cyan-900/50 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden"
                onClick={() => { onOpenCase(dailyCase.id); sound.click(); }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-800">
                      TRENDING INVESTIGATION
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">{dailyCase.caseNumber}</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {dailyCase.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans line-clamp-3 mb-4 leading-relaxed">
                    {dailyCase.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={dailyCase.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400 text-xs font-mono font-bold group-hover:translate-x-1 transition-transform">
                    <span>REVIEW DOSSIER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Daily Document (Newly Added) */}
            {dailyDocItem && (
              <div 
                className="group rounded-2xl bg-[#0A0E18] border border-rose-900/40 hover:border-rose-500/50 p-5 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden"
                onClick={() => { onOpenCase(dailyDocCase?.id || ""); sound.click(); }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[10px] font-bold border border-rose-900">
                      NEWLY DECLASSIFIED DOCUMENT
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">{dailyDocItem.date || "Unknown Date"}</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                    {dailyDocItem.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans line-clamp-3 mb-4 italic border-l-2 border-rose-900/50 pl-3">
                    "{dailyDocItem.summary}"
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 truncate mr-4">
                    <FileText className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    <span className="truncate">From: {dailyDocCase?.title || ""}</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-mono font-bold shrink-0 group-hover:translate-x-1 transition-transform">
                    <span>VIEW SOURCE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. SECTION: TRENDING INVESTIGATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-800/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
            <h2 className="font-mono text-base sm:text-lg font-bold text-white tracking-[0.15em] uppercase">
              TRENDING INVESTIGATIONS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-500 hidden sm:inline uppercase">
            Top Forensics & Documented Leaks
          </span>
        </div>

        {/* Three Prominent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingCases.map((c) => (
            <div
              key={c.id}
              onClick={() => { onOpenCase(c.id); sound.click(); }}
              className="group relative rounded-2xl border border-gray-800 bg-[#080B14] hover:border-cyan-500/60 hover:bg-[#0D1220] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between shadow-xl"
            >
              {/* Cover Image Banner */}
              {c.coverImage && (
                <div className="relative h-48 w-full overflow-hidden bg-black/60">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-black/40"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/40">
                      {c.caseNumber}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                    {c.category.replace(/_/g, ' ')}
                  </span>
                  
                  <h3 className="font-mono text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-gray-300 font-sans line-clamp-3 leading-relaxed mb-4">
                    {c.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-cyan-400 font-bold">{c.evidenceList?.length || 0} PRIMARY EXHIBITS</span>
                  <div className="flex items-center gap-1 text-cyan-300 font-bold group-hover:translate-x-1 transition-transform">
                    <span>INVESTIGATE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: RECENTLY UPDATED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-800/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <h2 className="font-mono text-base sm:text-lg font-bold text-white tracking-[0.15em] uppercase">
              RECENTLY UPDATED DOSSIERS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-500 hidden sm:inline uppercase">
            Surfaced Records & Analysis
          </span>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyUpdatedCases.map((c) => (
            <CaseCard
              key={c.id}
              caseFile={c}
              onOpen={onOpenCase}
              isBookmarked={savedCaseIds.includes(c.id)}
              onToggleBookmark={(id, e) => onToggleBookmark(id, e)}
              onJumpEntity={(ent) => onLaunchGraph(ent)}
            />
          ))}
        </div>
      </section>

      {/* 4. SECTION: THE RABBIT HOLE (One Visually Distinctive Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-b border-gray-800/80">
        <div className="relative rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-[#070C1B] via-[#0A1024] to-[#070C1B] p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Subtle radar / circular network rings in background */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none"></div>
          <div className="absolute -right-32 -top-32 w-112 h-112 rounded-full border border-cyan-500/10 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
                <Share2 className="w-3.5 h-3.5" />
                <span>INTERACTIVE KNOWLEDGE GRAPH</span>
              </div>

              <h2 className="font-mono text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-3 leading-tight">
                THE RABBIT HOLE ENGINE
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mb-6 max-w-xl">
                No conspiracy exists in a vacuum. Explore the interconnected web linking military operations, covert black projects, declassified intelligence cables, and mysterious global phenomena.
              </p>

              {/* Connected node chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {rabbitHoleTeasers.map((node, i) => (
                  <button
                    key={i}
                    onClick={() => onLaunchGraph(node.label)}
                    className="px-3 py-1.5 rounded-lg bg-[#0E1528] border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:border-cyan-400 hover:bg-cyan-950/60 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { onLaunchGraph(); sound.playWarp(); }}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              >
                <Share2 className="w-4 h-4 text-black" />
                <span>LAUNCH INTERACTIVE KNOWLEDGE GRAPH</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Visual Radar / Network graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-cyan-500/30 bg-[#050811] flex items-center justify-center p-4 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-25"></div>
                <div className="w-48 h-48 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-dashed border-cyan-400/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold text-center">
                      CIPHER CORE
                    </div>
                  </div>
                </div>
                
                {/* Orbital nodes */}
                <div className="absolute top-4 right-8 px-2 py-0.5 rounded bg-black/80 border border-amber-500/50 text-[10px] font-mono text-amber-300">
                  MKULTRA
                </div>
                <div className="absolute bottom-6 left-6 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/50 text-[10px] font-mono text-cyan-300">
                  STARGATE
                </div>
                <div className="absolute top-12 left-6 px-2 py-0.5 rounded bg-black/80 border border-purple-500/50 text-[10px] font-mono text-purple-300">
                  GLADIO
                </div>
                <div className="absolute bottom-8 right-6 px-2 py-0.5 rounded bg-black/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-300">
                  ROSWELL
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION: FULL DOSSIER ARCHIVE & SEARCH EXPLORER */}
      <section ref={exploreRef} id="all-dossiers" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        
        {/* Epistemic Credibility Philosophy Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#060810] via-[#090D1A] to-[#060810] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>EPISTEMIC CHARTER & PRIMARY EVIDENCE PRINCIPLE</span>
              </div>

              <h3 className="font-mono text-base sm:text-lg font-black text-white uppercase tracking-wide mb-1.5">
                "{CIPHER_FILES_PHILOSOPHY.headline}"
              </h3>

              <p className="text-xs sm:text-sm text-cyan-200/90 font-sans leading-relaxed">
                {CIPHER_FILES_PHILOSOPHY.subtext}
              </p>
            </div>

            {/* Quick Status Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
              {(['VERIFIED', 'DOCUMENTED', 'ALLEGED', 'SPECULATIVE', 'DISPROVEN'] as const).map((statKey) => {
                const def = OFFICIAL_STATUS_DEFINITIONS[statKey];
                const isActive = selectedStatus === statKey;
                return (
                  <button
                    key={statKey}
                    onClick={() => {
                      onSelectStatus(isActive ? 'ALL' : statKey);
                      sound.click();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isActive 
                        ? `${def.badgeClass} ring-1 ring-current shadow-lg scale-[1.02]` 
                        : 'bg-black/40 border-gray-800/80 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-[10px] uppercase tracking-wider">{def.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${def.dotClass}`}></span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-sans line-clamp-2 leading-tight">
                      {def.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Header with Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-1">
                <FolderArchive className="w-4 h-4" />
                <span>COMPLETE DOSSIER VAULT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider uppercase">
                EXPLORE ALL CLASSIFIED INVESTIGATIONS ({filteredCases.length})
              </h2>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cases, figures, operations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090D1A] border border-cyan-500/30 text-xs sm:text-sm text-cyan-300 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    sound.click();
                  }}
                  className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                      : 'bg-[#090D1A] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Evidence Rating Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest shrink-0">
              RATING FILTER:
            </span>
            {statuses.map((st) => {
              const isSelected = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    onSelectStatus(st.id);
                    sound.click();
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold'
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dossiers Grid */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#090D1A] border border-gray-800">
            <FolderArchive className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="font-mono text-base font-bold text-white mb-1">NO MATCHING DOSSIERS FOUND</h3>
            <p className="text-xs text-gray-400 font-mono mb-4">
              Try adjusting your search criteria or switching category filters.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('ALL');
                onSelectStatus('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <CaseCard
                key={c.id}
                caseFile={c}
                onOpen={onOpenCase}
                isBookmarked={savedCaseIds.includes(c.id)}
                onToggleBookmark={(id, e) => onToggleBookmark(id, e)}
                onJumpEntity={(ent) => onLaunchGraph(ent)}
              />
            ))}
          </div>
        )}

      </section>

      {/* 6. SECTION: ARCHIVE STATISTICS (Small, Unobtrusive Footer Section) */}
      <footer className="w-full border-t border-gray-800 bg-[#03050A] px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="font-mono text-sm font-bold text-cyan-400 tracking-wider">
              CIPHER FILES ARCHIVE
            </div>
            <span className="hidden sm:inline text-gray-700">|</span>
            <div className="text-xs text-gray-500 font-mono">
              Open Investigative Intelligence & Primary Records
            </div>
          </div>

          {/* Minimalist Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">DOSSIERS:</span>
              <strong className="text-white">{cases.length}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">PRIMARY EXHIBITS:</span>
              <strong className="text-cyan-400">120+</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">ANALYSTS:</span>
              <strong className="text-white">4,820</strong>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FIREBASE LIVE SYNC</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
