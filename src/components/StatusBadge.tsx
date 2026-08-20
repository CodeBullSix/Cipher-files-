import React from 'react';
import { EvidenceRating, OFFICIAL_STATUS_DEFINITIONS } from '../types';
import { 
  CheckCircle2, 
  FileCheck2, 
  HelpCircle, 
  Sparkles, 
  XCircle, 
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

interface Props {
  status: EvidenceRating;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  showTagline?: boolean;
  variant?: 'badge' | 'banner';
}

export function normalizeStatus(status: EvidenceRating): 'VERIFIED' | 'DOCUMENTED' | 'ALLEGED' | 'SPECULATIVE' | 'DISPROVEN' {
  switch (status) {
    case 'VERIFIED':
    case 'CONFIRMED':
      return 'VERIFIED';
    case 'DOCUMENTED':
    case 'DISPUTED':
      return 'DOCUMENTED';
    case 'ALLEGED':
    case 'UNVERIFIED':
      return 'ALLEGED';
    case 'SPECULATIVE':
    case 'UNKNOWN':
      return 'SPECULATIVE';
    case 'DISPROVEN':
    case 'DEBUNKED':
      return 'DISPROVEN';
    default:
      return 'ALLEGED';
  }
}

export const StatusBadge: React.FC<Props> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  showTagline = false,
  variant = 'badge'
}) => {
  const norm = normalizeStatus(status);
  const def = OFFICIAL_STATUS_DEFINITIONS[norm];

  const iconMap = {
    VERIFIED: CheckCircle2,
    DOCUMENTED: FileCheck2,
    ALLEGED: HelpCircle,
    SPECULATIVE: Sparkles,
    DISPROVEN: XCircle
  };

  const IconComponent = iconMap[norm] || ShieldAlert;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1 tracking-wider',
    md: 'text-[10px] px-2 py-0.5 gap-1.5 tracking-wider',
    lg: 'text-xs px-2.5 py-1 gap-2 tracking-widest',
    xl: 'text-sm px-3 py-1.5 gap-2.5 tracking-widest'
  }[size];

  if (variant === 'banner') {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border ${def.badgeClass}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-black/40 border border-current shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-widest uppercase">
                STATUS: {def.label}
              </span>
              <span className={`w-2 h-2 rounded-full ${def.dotClass}`}></span>
            </div>
            <p className="text-xs font-sans text-gray-200 mt-0.5">
              {def.tagline}
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-gray-400 sm:text-right hidden md:block max-w-xs">
          {def.definition}
        </div>
      </div>
    );
  }

  return (
    <span 
      title={`${def.label}: ${def.tagline}`}
      className={`inline-flex items-center font-mono font-bold uppercase rounded border ${def.badgeClass} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${def.dotClass}`}></span>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />}
      <span>{def.label}</span>
      {showTagline && (
        <span className="normal-case font-normal text-gray-300 ml-1 hidden sm:inline text-[10px]">
          — {def.tagline}
        </span>
      )}
    </span>
  );
};
