import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Building, 
  FileCheck,
  Printer
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  document: DocumentItem;
}

export const PrimaryDocumentViewer: React.FC<Props> = ({ document }) => {
  const [showRedacted, setShowRedacted] = useState<boolean>(true);
  const [hasScanlines, setHasScanlines] = useState<boolean>(true);

  const getStampClass = (level: string) => {
    switch (level) {
      case 'TOP SECRET': return 'text-red-500 border-red-500/80 bg-red-950/20';
      case 'SECRET': return 'text-amber-500 border-amber-500/80 bg-amber-950/20';
      case 'DECLASSIFIED': return 'text-emerald-500 border-emerald-500/80 bg-emerald-950/20';
      default: return 'text-cyan-500 border-cyan-500/80 bg-cyan-950/20';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0d14] overflow-hidden shadow-2xl">
      {/* Document Control Header */}
      <div className="px-4 py-3 bg-[#0d121c] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="font-mono font-bold text-sm text-white">{document.title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            REF: {document.fileReference}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Redaction Toggle */}
          {document.redactedExcerpt && (
            <button
              onClick={() => {
                setShowRedacted(!showRedacted);
                sound.playClick(900);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {showRedacted ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{showRedacted ? 'Declassify [Unredact]' : 'Apply Redactions'}</span>
            </button>
          )}

          {/* Scanline Effect Toggle */}
          <button
            onClick={() => setHasScanlines(!hasScanlines)}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
              hasScanlines ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Scanlines: {hasScanlines ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Primary Archival Paper Canvas */}
      <div className={`relative p-6 sm:p-8 bg-[#07090e] border-y border-slate-800/60 font-mono text-slate-300 select-text overflow-hidden ${
        hasScanlines ? 'before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] before:bg-[length:100%_4px] before:pointer-events-none' : ''
      }`}>
        {/* Watermark Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none opacity-10 select-none">
          <div className="text-6xl sm:text-8xl font-black border-8 border-cyan-400 text-cyan-400 px-8 py-4 uppercase tracking-widest">
            {document.classificationLevel}
          </div>
        </div>

        {/* Document Header Metadata Sheet */}
        <div className="border-b border-dashed border-slate-800 pb-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">ORIGIN AGENCY:</span>
            <span className="text-cyan-300 font-semibold">{document.originAgency}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">DATE CREATED:</span>
            <span className="text-white">{document.dateCreated}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">DECLASSIFICATION DATE:</span>
            <span className="text-emerald-400 font-semibold">{document.dateDeclassified || 'Public Domain Record'}</span>
          </div>
        </div>

        {/* Document Summary Box */}
        <div className="bg-[#0b0f17] border-l-2 border-cyan-500 p-3 rounded-r mb-6 text-xs text-slate-300">
          <span className="text-cyan-400 font-bold uppercase text-[10px] block mb-1">ARCHIVIST SUMMARY NOTE:</span>
          {document.summary}
        </div>

        {/* Document Excerpt Content */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
          <div className="text-[11px] text-slate-400 border-b border-slate-800/80 pb-1 flex items-center justify-between">
            <span>CERTIFIED ARCHIVE TRANSCRIPT (PAGE 1 OF {document.pageCount})</span>
            <span className="text-cyan-400 font-mono">OCR SCAN ACCURACY: 99.8%</span>
          </div>

          <div className="p-4 rounded bg-[#090c12] border border-slate-800 whitespace-pre-wrap font-mono leading-loose">
            {showRedacted && document.redactedExcerpt ? (
              document.redactedExcerpt.split(/(\[REDACTED\])/g).map((part, i) => 
                part === '[REDACTED]' ? (
                  <span 
                    key={i} 
                    title="Click Declassify to reveal text"
                    className="inline-block bg-black text-black px-1.5 mx-0.5 border border-slate-700 font-bold select-none cursor-pointer hover:bg-slate-800 hover:text-slate-400 transition-colors"
                  >
                    ████████
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )
            ) : (
              <span className="text-white">{document.fullExcerpt}</span>
            )}
          </div>
        </div>

        {/* Authenticity Certificate */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{document.authenticityNote}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">HASH: SHA256-VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
