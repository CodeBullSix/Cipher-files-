import React from 'react';
import { X, Crown } from 'lucide-react';
import { UserProfile, SupporterRecord } from '../types';
import { SupportersView } from './SupportersView';
import { INITIAL_SUPPORTERS } from '../data/initialData';

interface VipClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  supporters?: SupporterRecord[];
  onTierUpgraded?: (tier: any) => void;
}

export const VipClearanceModal: React.FC<VipClearanceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  supporters = INITIAL_SUPPORTERS,
  onTierUpgraded
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#090C16] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/40 via-[#0C101D] to-amber-950/40 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-white tracking-wider">
                  CIPHER FILES SUPPORTERS & DONORS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40 font-bold">
                  OPEN ARCHIVE LEDGER
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                No paywalls or locked perks — 100% public declassified research with live donor recognition.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supporters View Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <SupportersView
            supporters={supporters}
            currentUser={currentUser}
            onDonationSuccess={(msg) => {
              onTierUpgraded?.('BENEFACTOR');
            }}
          />
        </div>

      </div>
    </div>
  );
};
