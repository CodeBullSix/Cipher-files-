import React from 'react';
import { X, Crown } from 'lucide-react';
import { SupporterRecord, UserProfile } from '../types';
import { SupportersView } from './SupportersView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supporters: SupporterRecord[];
  currentUser: UserProfile | null;
  onDonationSuccess?: (message: string) => void;
}

export const SupportersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  supporters,
  currentUser,
  onDonationSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-2xl border border-amber-500/40 bg-cipher-panel shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-cipher-surface border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono text-sm sm:text-base font-bold text-white tracking-wider">
                CIPHER FILES SUPPORTERS & DONOR BOARD
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Pure philanthropic support — 100% open declassified archives, zero paywalls.
              </p>
            </div>
          </div>

          <button aria-label="Close"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <SupportersView
            supporters={supporters}
            currentUser={currentUser}
            onDonationSuccess={onDonationSuccess}
          />
        </div>

      </div>
    </div>
  );
};
