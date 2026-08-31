import React, { useState, useEffect } from 'react';
import { 
  FolderArchive, Database, Share2, Terminal, MessageSquare, 
  ShieldCheck, X, CheckCircle2, AlertTriangle, Lock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-cipher-accent/30 bg-cipher-surface shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 bg-cipher-panel shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cipher-accent/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cipher-accent" />
            </div>
            <div>
              <h2 id="onboarding-title" className="text-base sm:text-lg font-bold text-white font-mono tracking-wider uppercase">
                New Investigator Orientation
              </h2>
              <p className="text-xs font-mono text-cipher-accent uppercase tracking-widest mt-0.5">
                Cipher Files Protocol
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close orientation"
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cipher-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] bg-cipher-surface space-y-6">
          
          <div className="mb-6">
            <p className="text-sm font-mono text-gray-300 leading-relaxed">
              Welcome to Cipher Files, an investigative intelligence platform. To ensure the integrity of the archive, you must understand the distinction between <strong className="text-white">Official Records</strong>, <strong className="text-white">Community Theory</strong>, and <strong className="text-white">Private Investigation</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <FolderArchive className="w-4 h-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest">1. Case Dossiers</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Official investigative records and documented case information. Start here to read established facts.
              </p>
            </section>

            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Database className="w-4 h-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest">2. Evidence</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Documents and sources used to support or challenge claims. Contains verification states.
              </p>
            </section>

            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Share2 className="w-4 h-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest">3. The Rabbit Hole</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Explore real relationships between records, entities, and events already present in Cipher Files.
              </p>
            </section>

            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Lock className="w-4 h-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest">4. Private Workspace</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Keep your own notes, theories and proposed connections separate from official data. Only visible to you.
              </p>
            </section>

            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel md:col-span-2">
              <div className="flex items-center gap-2 mb-2 text-cipher-accent">
                <MessageSquare className="w-4 h-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest">5. Community Forums & Verification</h3>
              </div>
              <p className="text-xs font-mono text-gray-400 leading-relaxed mb-3">
                Discuss theories and research with other investigators. <strong className="text-white">Community content is not automatically verified.</strong> Cipher Files does not endorse an unverified theory simply because it is present in the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="flex items-start gap-2 bg-black/40 p-2 rounded border border-gray-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono text-gray-400">
                    <strong className="text-emerald-400">OFFICIAL:</strong> Documented by primary evidence.
                  </span>
                </div>
                <div className="flex items-start gap-2 bg-black/40 p-2 rounded border border-gray-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono text-gray-400">
                    <strong className="text-amber-400">COMMUNITY:</strong> Unverified speculation.
                  </span>
                </div>
              </div>
            </section>
            
            <section className="p-4 rounded-xl border border-gray-800 bg-cipher-panel md:col-span-2">
               <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest mb-1">Reputation & Levels</h3>
               <p className="text-xs font-mono text-gray-400 leading-relaxed">
                 <strong className="text-cipher-accent">REP</strong> represents community contribution reputation. <strong className="text-cipher-accent">LEVEL</strong> represents community participation progression. Neither represents factual authority, moderator authority, or evidence verification authority.
               </p>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-cipher-panel flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-cipher-accent hover:bg-cipher-accent-hover text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            Acknowledge & Enter
          </button>
        </div>

      </div>
    </div>
  );
};
