import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, InvestigatorRank } from '../types';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/authService';
import { TACTICAL_AVATAR_PRESETS, SPECIALIZATION_OPTIONS } from '../data/avatarPresets';
import { processImageUpload } from '../utils/imageUpload';
import { 
  User, 
  Shield, 
  Award, 
  Bookmark, 
  History, 
  Compass, 
  X, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  Edit3,
  Camera,
  Upload,
  Link,
  Check,
  MapPin,
  Briefcase,
  AtSign,
  Palette,
  Eye,
  Save,
  RotateCcw,
  Zap,
  Radio,
  FileText
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  profile: UserProfile;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  onResetFactory?: () => void;
}

export const InvestigatorProfileModal: React.FC<Props> = ({
  profile,
  currentUser,
  onClose,
  onOpenCase,
  onProfileUpdated,
  onResetFactory
}) => {
  // Use either currentUser or fallback profile
  const activeProfile = currentUser || profile;

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'dossier' | 'customize'>('dossier');

  // Form State for Customization
  const [displayName, setDisplayName] = useState<string>(activeProfile.displayName || '');
  const [username, setUsername] = useState<string>(activeProfile.username || '');
  const [callsign, setCallsign] = useState<string>(activeProfile.callsign || activeProfile.codename || 'CIPHER-INVESTIGATOR');
  const [specialization, setSpecialization] = useState<string>(
    activeProfile.specialization || SPECIALIZATION_OPTIONS[0]
  );
  const [customSpecialization, setCustomSpecialization] = useState<string>('');
  const [isCustomSpecialization, setIsCustomSpecialization] = useState<boolean>(
    Boolean(activeProfile.specialization && !SPECIALIZATION_OPTIONS.includes(activeProfile.specialization))
  );
  const [bio, setBio] = useState<string>(
    activeProfile.bio || 'Investigator dedicated to primary source analysis, historical declassification, and evidentiary verification.'
  );
  const [stationLocation, setStationLocation] = useState<string>(
    activeProfile.stationLocation || 'National Archive Research Directorate'
  );
  const [themeAccent, setThemeAccent] = useState<'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky'>(
    activeProfile.themeAccent || 'cyan'
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(activeProfile.avatarUrl);
  const [avatarPreset, setAvatarPreset] = useState<string | undefined>(activeProfile.avatarPreset || 'archival-seal');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when activeProfile updates
  useEffect(() => {
    setDisplayName(activeProfile.displayName || '');
    setUsername(activeProfile.username || '');
    setCallsign(activeProfile.callsign || activeProfile.codename || 'CIPHER-INVESTIGATOR');
    setSpecialization(activeProfile.specialization || SPECIALIZATION_OPTIONS[0]);
    setIsCustomSpecialization(Boolean(activeProfile.specialization && !SPECIALIZATION_OPTIONS.includes(activeProfile.specialization)));
    setBio(activeProfile.bio || 'Investigator dedicated to primary source analysis, historical declassification, and evidentiary verification.');
    setStationLocation(activeProfile.stationLocation || 'National Archive Research Directorate');
    setThemeAccent(activeProfile.themeAccent || 'cyan');
    setAvatarUrl(activeProfile.avatarUrl);
    setAvatarPreset(activeProfile.avatarPreset || 'archival-seal');
  }, [activeProfile]);

  const trail = StorageService.getTrail();
  const savedCases = StorageService.getCases().filter(c => (activeProfile.savedCaseIds || []).includes(c.id));
  const xpProgress = Math.min(100, Math.round((activeProfile.xp / (activeProfile.nextRankXp || 500)) * 100));

  // Handle Photo File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      sound.blip();
      const compressedDataUrl = await processImageUpload(file, 400, 400, 0.85);
      setAvatarUrl(compressedDataUrl);
      setAvatarPreset(undefined);
    } catch (err: any) {
      alert(err?.message || 'Failed to process image');
    }
  };

  // Handle Drag & Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      sound.blip();
      const compressedDataUrl = await processImageUpload(file, 400, 400, 0.85);
      setAvatarUrl(compressedDataUrl);
      setAvatarPreset(undefined);
    } catch (err: any) {
      alert(err?.message || 'Failed to process image');
    }
  };

  // Handle Preset Select
  const handleSelectPreset = (presetId: string) => {
    sound.click();
    setAvatarPreset(presetId);
    setAvatarUrl(undefined);
  };

  // Apply Image URL
  const handleApplyImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    sound.click();
    setAvatarUrl(imageUrlInput.trim());
    setAvatarPreset(undefined);
    setImageUrlInput('');
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    sound.stamp();

    const finalSpecialization = isCustomSpecialization
      ? (customSpecialization.trim() || SPECIALIZATION_OPTIONS[0])
      : specialization;

    // Clean username (no spaces, prepend @ if absent or clean handle)
    let cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      cleanUsername = (displayName || 'operative').toLowerCase().replace(/[^a-z0-9_]/g, '');
    }

    const updates: Partial<UserProfile> = {
      displayName: displayName.trim() || 'Field Investigator',
      username: cleanUsername,
      callsign: callsign.trim() || 'CIPHER-OPERATIVE',
      codename: callsign.trim() || 'CIPHER-OPERATIVE',
      specialization: finalSpecialization,
      bio: bio.trim(),
      stationLocation: stationLocation.trim(),
      themeAccent,
      avatarUrl: avatarUrl || undefined,
      avatarPreset: avatarPreset || undefined
    };

    try {
      if (AuthService.getCurrentProfile()) {
        const updated = await AuthService.updateProfile(updates);
        if (onProfileUpdated) onProfileUpdated(updated);
      } else {
        const updated = StorageService.updateProfile(updates);
        if (onProfileUpdated) onProfileUpdated(updated);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      setActiveTab('dossier');
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Get current avatar display representation
  const selectedPresetObj = TACTICAL_AVATAR_PRESETS.find(p => p.id === avatarPreset);

  // Theme Accent styles mapping
  const accentColors = {
    cyan: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-300',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      gradient: 'from-cyan-500 to-teal-400'
    },
    emerald: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      gradient: 'from-emerald-500 to-teal-400'
    },
    amber: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/20',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      gradient: 'from-amber-500 to-orange-400'
    },
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/20',
      text: 'text-purple-300',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      gradient: 'from-purple-500 to-pink-500'
    },
    rose: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-500/20',
      text: 'text-rose-300',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      gradient: 'from-rose-500 to-red-500'
    },
    sky: {
      border: 'border-sky-500/50',
      bg: 'bg-sky-500/20',
      text: 'text-sky-300',
      glow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
      gradient: 'from-sky-500 to-blue-500'
    }
  };

  const currentTheme = accentColors[themeAccent] || accentColors.cyan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className={`relative w-full max-w-4xl my-auto rounded-2xl border ${currentTheme.border} bg-[#0a0d16] shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-y-auto transition-all`}>
        
        {/* Top Control Bar with Tab Navigation */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* User Avatar Display */}
            <div className={`w-12 h-12 rounded-xl border ${currentTheme.border} overflow-hidden bg-slate-900 flex items-center justify-center relative group`}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : selectedPresetObj ? (
                <div className={`w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br ${selectedPresetObj.gradient}`}>
                  {selectedPresetObj.icon}
                </div>
              ) : (
                <div className="text-sm font-mono font-black text-cyan-400">
                  {displayName.substring(0, 2).toUpperCase() || 'OP'}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-mono font-black text-white">
                  {activeProfile.displayName}
                </h3>
                {activeProfile.username && (
                  <span className="text-xs font-mono text-cyan-400/90">
                    @{activeProfile.username}
                  </span>
                )}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
                  {activeProfile.rank ? activeProfile.rank.replace('_', ' ') : 'RESEARCHER'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>{activeProfile.clearanceLevel || 'LEVEL 2 // CLASSIFIED FIELD'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400/90 font-bold">Callsign: {activeProfile.callsign || activeProfile.codename || 'CIPHER-OPERATIVE'}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => { setActiveTab('dossier'); sound.click(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'dossier'
                    ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-sm`
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tactical Dossier</span>
                <span className="sm:hidden">Dossier</span>
              </button>

              <button
                onClick={() => { setActiveTab('customize'); sound.click(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'customize'
                    ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-sm`
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize Profile</span>
              </button>
            </div>

            <button onClick={onClose} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: CUSTOMIZE PROFILE VIEW */}
        {activeTab === 'customize' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Live Profile Header Preview */}
            <div className={`p-4 rounded-xl border ${currentTheme.border} bg-[#080c16] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl border-2 ${currentTheme.border} bg-slate-900 overflow-hidden flex items-center justify-center ${currentTheme.glow}`}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : selectedPresetObj ? (
                    <div className={`w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br ${selectedPresetObj.gradient}`}>
                      {selectedPresetObj.icon}
                    </div>
                  ) : (
                    <div className="text-xl font-mono font-black text-white">
                      {(displayName || 'OP').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-black text-white">
                      {displayName || 'Operative Name'}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      @{username || 'handle'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-300 font-bold">
                    CALLSIGN: {callsign || 'CIPHER-OPERATIVE'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {isCustomSpecialization ? (customSpecialization || 'Specialist') : specialization} • {stationLocation || 'Base Station'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Section 1: Avatar & Tactical Emblem Customization */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-[#07090f] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Camera className="w-4 h-4" />
                  <span>1. PROFILE PHOTO & TACTICAL EMBLEM</span>
                </div>
                {(avatarUrl || avatarPreset) && (
                  <button
                    onClick={() => {
                      setAvatarUrl(undefined);
                      setAvatarPreset(undefined);
                      sound.click();
                    }}
                    className="text-[11px] font-mono text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Initial Monogram
                  </button>
                )}
              </div>

              {/* Upload Dropzone & Direct URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Drag & Drop / File Input */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    isDraggingOver 
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' 
                      : 'border-slate-800 hover:border-cyan-500/50 bg-[#0a0e1a] text-slate-400'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <Upload className="w-6 h-6 mb-2 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white mb-1">
                    Upload Custom Profile Photo
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Click to browse or drag & drop (JPG, PNG, WebP)
                  </span>
                </div>

                {/* Direct Image URL input */}
                <div className="p-4 rounded-xl border border-slate-800 bg-[#0a0e1a] flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mb-1.5">
                      <Link className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Or Paste Direct Image URL:</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#060810] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={handleApplyImageUrl}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-2">
                    Supports high-resolution external avatars or profile photos.
                  </span>
                </div>
              </div>

              {/* Preset Tactical Emblems Selection */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-2">
                  Select a Tactical Clearance Emblem:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TACTICAL_AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatarPreset === preset.id && !avatarUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition-all ${
                          isSelected
                            ? `${preset.border} bg-slate-900 shadow-md ring-1 ring-cyan-400 scale-[1.02]`
                            : 'border-slate-800/80 bg-[#090d18] hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-2xl mb-1">{preset.icon}</span>
                        <span className="text-[11px] font-mono font-bold text-white line-clamp-1">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 line-clamp-1">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: Identity & Callsign Inputs */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-[#07090f] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                <User className="w-4 h-4" />
                <span>2. INVESTIGATOR IDENTITY & CALLSIGN</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Display Name */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Special Agent Vance"
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Public identity on published files.
                  </span>
                </div>

                {/* Custom Username */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <AtSign className="w-3 h-3 text-cyan-400" />
                    <span>Username / Handle</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="shadow_analyst"
                      className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 font-bold"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Unique handle for peer mentions & DMs.
                  </span>
                </div>

                {/* Tactical Callsign */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Tactical Callsign</span>
                  </label>
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                    placeholder="NIGHTSHADE-09"
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Radio & classified secure tag.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Specialization, Station & Theme Accent */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-[#07090f] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                <Briefcase className="w-4 h-4" />
                <span>3. SPECIALIZATION & FIELD BRIEF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Specialization Selection */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                    Primary Investigative Specialty
                  </label>
                  <select
                    value={isCustomSpecialization ? 'CUSTOM' : specialization}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomSpecialization(true);
                      } else {
                        setIsCustomSpecialization(false);
                        setSpecialization(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    {SPECIALIZATION_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                    <option value="CUSTOM">+ Custom Field Specialty...</option>
                  </select>

                  {isCustomSpecialization && (
                    <input
                      type="text"
                      value={customSpecialization}
                      onChange={(e) => setCustomSpecialization(e.target.value)}
                      placeholder="Type custom specialty..."
                      className="w-full mt-2 px-3 py-1.5 rounded-lg bg-[#080c16] border border-cyan-500/50 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  )}
                </div>

                {/* Base / Station Location */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Station / Base Location</span>
                  </label>
                  <input
                    type="text"
                    value={stationLocation}
                    onChange={(e) => setStationLocation(e.target.value)}
                    placeholder="e.g. Station 04 - Groom Lake, NV"
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Assigned post or archive detachment.
                  </span>
                </div>
              </div>

              {/* Investigator Bio */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1">
                  Investigator Field Brief / Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your investigative focus, background, and research methodology..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tactical Theme Accent */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tactical Accent Theme</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(['cyan', 'emerald', 'amber', 'purple', 'rose', 'sky'] as const).map((color) => {
                    const isSelected = themeAccent === color;
                    const c = accentColors[color];
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => { setThemeAccent(color); sound.click(); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize flex items-center gap-2 border transition-all ${
                          isSelected 
                            ? `${c.border} ${c.bg} ${c.text} ring-1 ring-cyan-400 shadow-sm` 
                            : 'border-slate-800 bg-[#0a0e1a] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${c.gradient}`}></span>
                        <span>{color}</span>
                        {isSelected && <Check className="w-3 h-3 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save & Confirm Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setActiveTab('dossier'); sound.click(); }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel & Revert
              </button>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Credentials Saved & Deployed!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${currentTheme.gradient} text-black font-mono font-black text-xs uppercase flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Synchronizing...' : 'Save Investigator Credentials'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TACTICAL DOSSIER OVERVIEW */}
        {activeTab === 'dossier' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Bio Briefing Card */}
            <div className={`p-5 rounded-xl border ${currentTheme.border} bg-[#080b12] space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${currentTheme.text}`} />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    OPERATIVE FIELD BRIEF & CREDENTIALS
                  </span>
                </div>
                <button
                  onClick={() => { setActiveTab('customize'); sound.click(); }}
                  className={`text-xs font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Credentials
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-[#05070e] p-3 rounded-lg border border-slate-800/80">
                "{activeProfile.bio || 'Operative actively declassifying historical anomalies, government black projects, and verified research.'}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Specialty Focus</span>
                  <span className="text-white font-bold">{activeProfile.specialization || SPECIALIZATION_OPTIONS[0]}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Station / Post</span>
                  <span className="text-emerald-400 font-bold">{activeProfile.stationLocation || 'Field Station Alpha'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Access Clearance</span>
                  <span className="text-cyan-400 font-bold">{activeProfile.clearanceLevel || 'LEVEL 2 // CLASSIFIED FIELD'}</span>
                </div>
              </div>
            </div>

            {/* XP Progression Card */}
            <div className="p-5 rounded-xl border border-cyan-500/30 bg-[#080b12]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    INVESTIGATIVE CREDIBILITY XP PROGRESSION
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {activeProfile.xp} / {activeProfile.nextRankXp || 500} XP ({xpProgress}%)
                </span>
              </div>

              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                <div 
                  style={{ width: `${xpProgress}%` }} 
                  className={`h-full bg-gradient-to-r ${currentTheme.gradient} rounded-full shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-all duration-500`}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>CURRENT RANK: {activeProfile.rank ? activeProfile.rank.replace('_', ' ') : 'RESEARCHER'}</span>
                <span>CONTRIBUTIONS: {activeProfile.contributionsCount || 0} DOSSIERS VERIFIED</span>
              </div>
            </div>

            {/* 3-Column Info Matrix: Badges, Saved Binders, Investigative Trail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Unlocked Badges */}
              <div className="rounded-xl border border-slate-800 bg-[#07090f] p-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-3 uppercase">
                  <Award className="w-4 h-4" />
                  <span>UNLOCKED BADGES ({activeProfile.badges ? activeProfile.badges.length : 0})</span>
                </div>
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {(activeProfile.badges && activeProfile.badges.length > 0) ? (
                    activeProfile.badges.map((b) => (
                      <div key={b.id} className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800/80 flex items-start gap-2.5">
                        <span className="text-lg">{b.icon}</span>
                        <div>
                          <div className="text-xs font-mono font-bold text-white">{b.name}</div>
                          <div className="text-[10px] text-slate-400">{b.description}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800/80 flex items-start gap-2.5">
                      <span className="text-lg">🛡️</span>
                      <div>
                        <div className="text-xs font-mono font-bold text-white">Field Clearance</div>
                        <div className="text-[10px] text-slate-400">Activated declassified investigator terminal.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Classified Dossiers */}
              <div className="rounded-xl border border-slate-800 bg-[#07090f] p-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-3 uppercase">
                  <Bookmark className="w-4 h-4" />
                  <span>SAVED BINDER ({savedCases.length})</span>
                </div>
                {savedCases.length === 0 ? (
                  <div className="text-[11px] font-mono text-slate-500 text-center py-6">
                    No dossiers bookmarked yet. Click the bookmark icon on any case to save.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {savedCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => { onOpenCase(c.id); sound.playClick(700); }}
                        className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold block">{c.caseNumber}</span>
                          <span className="text-xs font-mono text-white line-clamp-1">{c.title}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity / Rabbit Hole Trail */}
              <div className="rounded-xl border border-slate-800 bg-[#07090f] p-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-3 uppercase">
                  <Compass className="w-4 h-4" />
                  <span>RECENT TRAIL ({trail.length})</span>
                </div>
                {trail.length === 0 ? (
                  <div className="text-[11px] font-mono text-slate-500 text-center py-6">
                    Explore the Rabbit Hole network graph to record your investigative trail.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {trail.map((t, i) => (
                      <div key={i} className="p-2 rounded bg-[#0a0e17] border border-slate-800/80 text-[11px] font-mono flex items-center justify-between">
                        <span className="text-white line-clamp-1">{t.name}</span>
                        <span className="text-[9px] text-slate-400 shrink-0 ml-1">{t.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>OPERATIVE ID: {activeProfile.uid || activeProfile.id}</span>
              {onResetFactory && (
                <button
                  onClick={() => {
                    if (confirm('Reset CIPHER FILES local storage to factory archives?')) {
                      StorageService.resetToFactory();
                      onResetFactory();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 transition-colors text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Local Archive State</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
