import React, { useState } from 'react';
import { 
  Crown, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Send, 
  Trophy, 
  DollarSign, 
  Award, 
  CheckCircle2,
  Lock,
  Globe,
  Radio
} from 'lucide-react';
import { SupporterRecord, UserProfile } from '../types';
import { FirestoreService } from '../services/firestoreService';
import { sound } from '../utils/audio';

interface Props {
  supporters: SupporterRecord[];
  currentUser: UserProfile | null;
  onDonationSuccess?: (message: string) => void;
}

const PRESET_TIERS = [
  { amount: 5, name: 'Field Supporter', badge: '🛡️ SUPPORTER', desc: 'Maintains open server bandwidth & public access' },
  { amount: 15, name: 'Archive Patron', badge: '⭐ PATRON', desc: 'Funds FOIA document processing & optical OCR scanning' },
  { amount: 50, name: 'Grand Benefactor', badge: '🥈 GRAND PATRON', desc: 'Powers live database sync & encrypted communication nodes' },
  { amount: 100, name: 'Majestic Titan', badge: '👑 TITAN', desc: 'Directly finances extensive declassification archives' }
];

export const SupportersView: React.FC<Props> = ({
  supporters,
  currentUser,
  onDonationSuccess
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(currentUser?.displayName || '');
  const [donorCallsign, setDonorCallsign] = useState<string>(currentUser?.callsign || '');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const sortedSupporters = [...supporters].sort((a, b) => b.amount - a.amount);
  const highestDonator = sortedSupporters.length > 0 ? sortedSupporters[0] : null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amount: number) => {
    sound.click();
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    sound.click();
    setIsSubmitting(true);

    const name = donorName.trim() || currentUser?.displayName || 'Anonymous Operative';
    const callsign = donorCallsign.trim() || currentUser?.callsign || 'CIPHER_SUPPORTER';
    const msg = donorMessage.trim() || 'Support for unrestricted open declassification archives.';

    // Determine tier name & badge
    let tierName = 'Field Supporter';
    let badge = '🛡️ SUPPORTER';
    if (currentAmount >= 100) {
      tierName = 'Majestic Titan';
      badge = '👑 TITAN';
    } else if (currentAmount >= 50) {
      tierName = 'Grand Benefactor';
      badge = '🥈 GRAND PATRON';
    } else if (currentAmount >= 15) {
      tierName = 'Archive Patron';
      badge = '⭐ PATRON';
    }

    const newRecord: SupporterRecord = {
      id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      donorName: name,
      callsign: callsign.toUpperCase(),
      amount: currentAmount,
      tierName: tierName,
      message: msg,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badge: badge,
      isTopDonor: !highestDonator || currentAmount > highestDonator.amount
    };

    try {
      await FirestoreService.addSupporter(newRecord);
      sound.blip();

      const isNewTop = !highestDonator || currentAmount > highestDonator.amount;
      const successText = isNewTop 
        ? `👑 Transmitted $${currentAmount}! You are now the #1 HIGHEST DONATOR on the Live Donor Board!`
        : `❤️ Transmitted $${currentAmount}! Thank you for supporting open declassification archives.`;

      setShowSuccessToast(successText);
      onDonationSuccess?.(successText);
      setDonorMessage('');

      setTimeout(() => {
        setShowSuccessToast(null);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>SUPPORT CIPHER FILES ARCHIVE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
          OPEN ARCHIVE SUPPORTERS & DONOR BOARD
        </h1>
        <p className="text-sm text-gray-300 font-sans leading-relaxed">
          Cipher Files operates as a 100% public, evidence-first research collective. 
          There are <strong className="text-cyan-300">zero paywalled dossiers</strong> or locked intelligence — all files and investigative tools are free for all operatives. 
          Supporter contributions directly keep our infrastructure running, with the <strong className="text-amber-300">#1 Highest Donator</strong> honored at the head of our permanent ledger.
        </p>
      </div>

      {/* #1 HIGHEST DONATOR PEDESTAL */}
      {highestDonator && (
        <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#120F08] to-amber-950/40 border-2 border-amber-500/60 p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5 text-center md:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0E0C06] rounded-2xl flex flex-col items-center justify-center">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500 text-black text-xs font-mono font-extrabold tracking-wider uppercase shadow">
                    👑 CURRENT #1 HIGHEST DONATOR
                  </span>
                  <span className="text-xs font-mono text-amber-400/80">
                    Tier: {highestDonator.tierName}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wide">
                  {highestDonator.donorName}
                </h2>
                
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-xs font-mono text-gray-300">
                  <span className="text-cyan-300 font-bold">[{highestDonator.callsign}]</span>
                  <span>•</span>
                  <span>Recorded: {highestDonator.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end shrink-0 bg-black/40 border border-amber-500/30 p-4 sm:p-5 rounded-xl text-center md:text-right w-full md:w-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 font-bold">
                TOP CONTRIBUTION
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300">
                ${highestDonator.amount.toFixed(2)}
              </div>
              <p className="text-xs font-mono text-gray-300 italic mt-2 max-w-xs text-center md:text-right">
                "{highestDonator.message}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center justify-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{showSuccessToast}</span>
        </div>
      )}

      {/* TWO COLUMN SECTION: DONATION FORM + SUPPORTER LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: MAKE A CONTRIBUTION / BECOME A SUPPORTER */}
        <div className="lg:col-span-5 bg-[#090C16] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-gray-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-mono font-bold text-white text-base uppercase tracking-wider">
                TRANSMIT ARCHIVE SUPPORT
              </h3>
            </div>

            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Choose a support level or enter a custom amount. Your contribution is recorded live on the Donor Ledger.
            </p>

            <form onSubmit={handleDonate} className="space-y-4">
              {/* Preset Tier Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_TIERS.map((tier) => {
                  const isSelected = !customAmount && selectedAmount === tier.amount;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => handleSelectPreset(tier.amount)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                          : 'bg-[#0E121E] border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono mb-1">
                        <span className="font-bold text-sm text-white">${tier.amount}</span>
                        <span className="text-[10px] text-amber-400 font-bold">{tier.badge.split(' ')[0]}</span>
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-gray-300 leading-tight">
                        {tier.name}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                        {tier.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Or Custom Contribution Amount ($USD):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-mono">
                    $
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 250"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-[#0E121E] border border-gray-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Contributor Details */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Doe"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    Operative Callsign:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VECTOR-09"
                    value={donorCallsign}
                    onChange={(e) => setDonorCallsign(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E121E] border border-gray-800 rounded-lg text-white font-mono text-xs uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Transmission Message / Quote */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  Public Transmission / Dedication Note:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. For Gary Webb and all seekers of declassified truth."
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E121E] border border-gray-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || currentAmount <= 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Transmitting...' : `Transmit $${currentAmount || 0} Contribution`}
                </span>
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/80 text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Simulated Instant Ledger Sync</span>
            </span>
            <span className="text-gray-500">Public & Permanent</span>
          </div>
        </div>

        {/* RIGHT: LIVE SUPPORTER LEDGER & HALL OF FAME */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-mono font-bold text-white text-base uppercase tracking-wider">
                LIVE DONOR ROLL OF HONOR ({sortedSupporters.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              REAL-TIME FIRESTORE SYNC
            </span>
          </div>

          {/* List of Supporters */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {sortedSupporters.map((supporter, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={supporter.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isTop
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#10131E] to-[#0A0D18] border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-[#090C16] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isTop 
                          ? 'bg-amber-500 text-black font-extrabold' 
                          : idx === 1 
                          ? 'bg-gray-300 text-black' 
                          : idx === 2 
                          ? 'bg-amber-800 text-white' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {supporter.donorName}
                          </span>
                          {supporter.badge && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              isTop 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                : 'bg-gray-800 text-gray-300'
                            }`}>
                              {supporter.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
                          <span className="text-cyan-400">[{supporter.callsign}]</span>
                          <span>•</span>
                          <span>{supporter.tierName}</span>
                          <span>•</span>
                          <span>{supporter.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-right shrink-0">
                      <span className={`text-lg font-extrabold ${isTop ? 'text-amber-400' : 'text-white'}`}>
                        ${supporter.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {supporter.message && (
                    <div className="mt-2.5 pt-2 border-t border-gray-800/60 text-xs font-mono text-gray-300 italic">
                      "{supporter.message}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
