import React from 'react';
import { 
  FileText, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  CheckCircle2, 
  Users, 
  Building2, 
  MapPin,
  ArrowRight,
  Flame,
  Crown,
  Eye
} from 'lucide-react';
import { CaseFile } from '../types';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/audio';

interface Props {
  caseFile: CaseFile;
  onOpen: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onJumpEntity?: (entityName: string) => void;
}

export const CaseCard: React.FC<Props> = ({
  caseFile,
  onOpen,
  isBookmarked,
  onToggleBookmark,
  onJumpEntity
}) => {
  const supportingCount = caseFile.evidenceList?.filter(e => e.isSupporting).length || 0;
  const counterCount = caseFile.evidenceList?.filter(e => !e.isSupporting).length || 0;
  const beliefScore = caseFile.beliefScore ?? (caseFile.status === 'CONFIRMED' ? 95 : caseFile.status === 'DISPUTED' ? 68 : 45);

  return (
    <div 
      onClick={() => { onOpen(caseFile.id); sound.click(); }}
      className="group relative flex flex-col justify-between border border-gray-800 bg-cipher-surface hover:border-cyan-500/60 hover:bg-cipher-elevated transition-all duration-150 cursor-pointer shadow-lg rounded-xl overflow-hidden border-l-2 border-l-cipher-accent/40 hover:border-l-cipher-accent"
    >
      {/* Optional Cover Image Banner */}
      {caseFile.coverImage && (
        <div className="relative h-36 w-full overflow-hidden bg-black/50 border-b border-gray-800/80">
          <img 
            src={caseFile.coverImage} 
            alt={caseFile.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cipher-surface via-transparent to-black/30" />
          
          {caseFile.isVipExclusive && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-mono font-extrabold flex items-center space-x-1 uppercase tracking-wider">
              <Crown className="w-3 h-3" />
              <span>BLACK VAULT</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Metadata */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-cipher-accent bg-cipher-accent/10 px-2 py-0.5 rounded border border-cipher-accent/30">
                {caseFile.caseNumber}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
                {caseFile.category.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={caseFile.status} size="sm" />
              <button
                onClick={(e) => onToggleBookmark(caseFile.id, e)}
                title={isBookmarked ? 'Remove from Saved Binder' : 'Save Dossier'}
                className={`p-1.5 rounded transition-colors ${
                  isBookmarked 
                    ? 'text-cipher-accent bg-cipher-accent/15 border border-cipher-accent/40' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Case Title */}
          <h3 className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-cipher-accent transition-colors mb-1 tracking-tight leading-snug">
            {caseFile.title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-1 mb-3">
            {caseFile.subtitle}
          </p>

          {/* The Claim */}
          <div className="bg-cipher-panel border border-gray-800/80 rounded-lg p-2.5 mb-3">
            <div className="text-[9px] font-mono text-cipher-accent font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>CORE HYPOTHESIS</span>
            </div>
            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-mono">
              "{caseFile.claim}"
            </p>
          </div>

          {/* Belief / Conviction Meter Bar */}
          <div className="mb-3 p-2 rounded-lg bg-black/40 border border-gray-800/60">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-gray-400 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Community Conviction</span>
              </span>
              <span className="font-bold text-cipher-accent-hover">{beliefScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cipher-accent to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${beliefScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 hover:text-cipher-accent transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-cipher-accent" />
              <span>{caseFile.commentCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>{caseFile.views || 1}</span>
            </span>
            {caseFile.authorCallsign && (
              <span className="text-[10px] text-cipher-accent truncate max-w-[100px] hidden sm:inline">
                by {caseFile.authorCallsign}
              </span>
            )}
          </div>

          <span className="text-cipher-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
            <span>EXAMINE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
};
