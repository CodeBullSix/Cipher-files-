import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, InvestigatorRank } from '../types';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/authService';
import { TACTICAL_AVATAR_PRESETS, SPECIALIZATION_OPTIONS } from '../data/avatarPresets';
import { processImageUpload } from '../utils/imageUpload';
import { 
  User, Users, 
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
  Radio, Activity,
  FileText
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ApiService } from '../services/apiService';
import { calculateLevel, LevelInfo } from '../lib/levels';

interface Props {
  profile: UserProfile;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
  onOpenEntity?: (type: string, id: string) => void;
  onOpenDiscussion?: (id: string) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  onResetFactory?: () => void;
}

export const InvestigatorProfileModal: React.FC<Props> = ({
  profile,
  currentUser,
  onClose,
  onOpenCase,
  onOpenEntity,
  onOpenDiscussion,
  onProfileUpdated,
  onResetFactory
}) => {
  // Use either currentUser or fallback profile
  const activeProfile = profile;
  const isOwnProfile = currentUser?.uid === profile.uid;

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'dossier' | 'contributions' | 'customize' | 'followers' | 'following'>('dossier');
  const [contributions, setContributions] = useState<any[]>([]);
  const [contributionFilter, setContributionFilter] = useState<string>('ALL');
  const [loadingContributions, setLoadingContributions] = useState<boolean>(false);

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

  const [reputationEvents, setReputationEvents] = useState<any[]>([]);
  const [totalReputation, setTotalReputation] = useState<number>(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loadingReputation, setLoadingReputation] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loadingFollows, setLoadingFollows] = useState<boolean>(false);
  const levelInfo = calculateLevel(totalReputation);

  

  useEffect(() => {
    let mounted = true;
    ApiService.getFollowCounts(activeProfile.uid).then((data: any) => {
      if (mounted && data) {
        setFollowersCount(data.followersCount || 0);
        setFollowingCount(data.followingCount || 0);
      }
    }).catch(console.error);

    if (isOwnProfile || !currentUser) return;
    
    ApiService.getFollowStatus(activeProfile.uid).then((data: any) => {
      if (mounted && data && data.isFollowing !== undefined) {
        setIsFollowing(data.isFollowing);
      }
    }).catch(console.error);

    return () => { mounted = false; };
  }, [activeProfile.uid, currentUser, isOwnProfile]);

  useEffect(() => {
    if (activeTab === 'followers') {
      setLoadingFollows(true);
      ApiService.getFollowers(activeProfile.uid).then((data: any) => {
        setFollowers(data);
      }).catch(console.error).finally(() => setLoadingFollows(false));
    } else if (activeTab === 'following') {
      setLoadingFollows(true);
      ApiService.getFollowing(activeProfile.uid).then((data: any) => {
        setFollowing(data);
      }).catch(console.error).finally(() => setLoadingFollows(false));
    }
  }, [activeTab, activeProfile.uid]);

  const handleToggleFollow = async () => {
    if (!currentUser) return;
    sound.click();
    
    // Optimistic UI (with revert if failed is optional, but we can do it)
    const originalFollowing = isFollowing;
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setFollowersCount(prev => prev + 1);
    } else {
      setFollowersCount(prev => prev - 1);
    }

    try {
      if (originalFollowing) {
        await ApiService.unfollowUser(activeProfile.uid);
      } else {
        await ApiService.followUser(activeProfile.uid);
      }
    } catch (e) {
      console.error(e);
      // Revert on fail
      setIsFollowing(originalFollowing);
      if (originalFollowing) {
        setFollowersCount(prev => prev + 1);
      } else {
        setFollowersCount(prev => prev - 1);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoadingContributions(true);
    ApiService.getUserContributions(activeProfile.uid, contributionFilter)
      .then((data: any) => {
        if (mounted && Array.isArray(data)) {
          setContributions(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (mounted) setLoadingContributions(false);
      });
      
    return () => { mounted = false; };
  }, [activeProfile.uid, contributionFilter]);

  useEffect(() => {
    let mounted = true;
    ApiService.getUserReputation(activeProfile.uid)
      .then((data: any) => {
        if (mounted && data) {
          if (Array.isArray(data.events)) {
            setReputationEvents(data.events);
          }
          if (Array.isArray(data.achievements)) {
            setAchievements(data.achievements);
          }
          if (typeof data.totalReputation === 'number') {
            setTotalReputation(data.totalReputation);
          } else if (Array.isArray(data)) {
            // Fallback for older API response before we updated backend
            setReputationEvents(data);
            setTotalReputation(data.reduce((sum, ev) => sum + (ev.points || 0), 0));
          }
          setLoadingReputation(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load reputation', err);
        if (mounted) setLoadingReputation(false);
      });
    return () => { mounted = false; };
  }, [activeProfile.uid]);
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
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-400">
                <span><strong className="text-cyan-400">{followersCount}</strong> Followers</span>
                <span><strong className="text-cyan-400">{followingCount}</strong> Following</span>
              </div>
            </div>

          </div>

          
          {/* Mode Switcher Buttons */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleToggleFollow}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                  isFollowing 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500' 
                    : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}

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

              <button
                onClick={() => { setActiveTab('contributions'); sound.click(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'contributions' || activeTab === 'followers' || activeTab === 'following'
                    ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-sm`
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Contributions</span>
              </button>
            <button
              onClick={() => { setActiveTab('followers'); sound.click(); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                activeTab === 'followers' 
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-cyan-300' 
                  : 'bg-[#0A0E1A] border-gray-800 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'followers' ? 'text-cyan-400' : ''}`} />
              <span className="text-[10px] font-mono font-bold tracking-wider">Followers</span>
            </button>
            <button
              onClick={() => { setActiveTab('following'); sound.click(); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                activeTab === 'following' 
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-cyan-300' 
                  : 'bg-[#0A0E1A] border-gray-800 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'following' ? 'text-cyan-400' : ''}`} />
              <span className="text-[10px] font-mono font-bold tracking-wider">Following</span>
            </button>
            </div>

            <button onClick={onClose} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        
        {/* TAB 3: CONTRIBUTION HISTORY */}
        {activeTab === 'contributions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Filters */}
            <div className="flex gap-2 pb-2 border-b border-gray-800 overflow-x-auto scrollbar-hide">
              {['ALL', 'CASES', 'ENTITIES', 'EVIDENCE', 'DISCUSSIONS'].map(f => (
                <button
                  key={f}
                  onClick={() => { setContributionFilter(f); sound.click(); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${
                    contributionFilter === f
                      ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`
                      : 'text-slate-500 hover:text-white border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Contributions List */}
            <div className="space-y-3">
              {loadingContributions ? (
                <div className="py-8 text-center text-xs font-mono text-slate-500 flex flex-col items-center">
                  <RefreshCw className="w-5 h-5 animate-spin mb-2" />
                  ACCESSING DECLASSIFIED ARCHIVES...
                </div>
              ) : contributions.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-slate-500 flex flex-col items-center bg-[#05070e] rounded-xl border border-slate-800">
                  <History className="w-8 h-8 mb-3 opacity-30" />
                  NO CONTRIBUTIONS IN THIS CATEGORY
                </div>
              ) : (
                contributions.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-800/80 bg-[#080b12] hover:bg-[#0a0e17] transition-colors group flex items-start justify-between">
                    <div className="space-y-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 ${currentTheme.text}`}>
                          {c.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        {c.status && c.status !== 'ACTIVE' && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            c.status === 'VERIFIED' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                            c.status === 'DISPUTED' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                            'text-red-400 bg-red-400/10 border-red-400/20'
                          }`}>
                            {c.status}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs font-semibold text-white line-clamp-2">
                        {c.title}
                      </p>
                      
                      {c.navigationPath && (
                        <div className="pt-1">
                          {c.recordType === 'PERSON' && (
                            <button onClick={() => { if(onOpenEntity) { onOpenEntity('person', c.recordId); onClose(); } }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Target Profile
                            </button>
                          )}
                          {c.recordType === 'ORGANISATION' && (
                            <button onClick={() => { if(onOpenEntity) { onOpenEntity('organisation', c.recordId); onClose(); } }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Organisation
                            </button>
                          )}
                          {c.recordType === 'LOCATION' && (
                            <button onClick={() => { if(onOpenEntity) { onOpenEntity('location', c.recordId); onClose(); } }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Location
                            </button>
                          )}
                          {c.recordType === 'EVIDENCE' && (
                            <button onClick={() => { if(onOpenEntity) { onOpenEntity('evidence', c.recordId); onClose(); } }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Evidence
                            </button>
                          )}
                          {c.recordType === 'DISCUSSION' && (
                            <button onClick={() => { if(onOpenDiscussion) onOpenDiscussion(c.recordId); onClose(); }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Discussion
                            </button>
                          )}
                          {c.recordType === 'CASE' && (
                            <button onClick={() => { if(onOpenCase) { onOpenCase(c.recordId); onClose(); } }} className={`text-[10px] font-mono ${currentTheme.text} hover:underline flex items-center gap-1`}>
                              <ArrowRight className="w-3 h-3" /> View Case File
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${currentTheme.text}`}>
                        +{c.points} REP
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


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


        {/* TAB: FOLLOWERS */}
        {activeTab === 'followers' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {loadingFollows ? (
              <div className="p-10 flex justify-center"><Zap className="w-6 h-6 text-cyan-500 animate-spin" /></div>
            ) : followers.length === 0 ? (
              <div className="p-10 border border-dashed border-gray-800 rounded-xl text-center flex flex-col items-center">
                <Users className="w-8 h-8 text-gray-700 mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">NO FOLLOWERS YET</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">This investigator hasn't gained any followers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {followers.map(f => (
                  <div key={f.uid} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-[#0A0E1A] hover:border-cyan-500/50 cursor-pointer transition-colors" onClick={() => onOpenEntity && onOpenEntity('profile', f.uid)}>
                    {f.avatar ? (
                      <img src={f.avatar} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {f.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{f.displayName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">Level {f.level || 1} • {f.reputation || 0} REP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: FOLLOWING */}
        {activeTab === 'following' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {loadingFollows ? (
              <div className="p-10 flex justify-center"><Zap className="w-6 h-6 text-cyan-500 animate-spin" /></div>
            ) : following.length === 0 ? (
              <div className="p-10 border border-dashed border-gray-800 rounded-xl text-center flex flex-col items-center">
                <Users className="w-8 h-8 text-gray-700 mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">NOT FOLLOWING ANY INVESTIGATORS YET</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">This investigator hasn't followed anyone.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {following.map(f => (
                  <div key={f.uid} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-[#0A0E1A] hover:border-cyan-500/50 cursor-pointer transition-colors" onClick={() => onOpenEntity && onOpenEntity('profile', f.uid)}>
                    {f.avatar ? (
                      <img src={f.avatar} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {f.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{f.displayName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">Level {f.level || 1} • {f.reputation || 0} REP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {/* Investigator Level Card */}
            <div className="p-5 rounded-xl border border-cyan-500/30 bg-[#080b12]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    INVESTIGATOR LEVEL
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase hidden sm:block">
                  Community participation level
                </div>
              </div>
              
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-2xl font-bold text-cyan-400 uppercase tracking-wide">
                    LEVEL {levelInfo.level}
                  </div>
                  <div className="text-xs font-mono text-white mt-1 uppercase">
                    {levelInfo.title}
                  </div>
                </div>
                {levelInfo.maxRep !== null && (
                  <div className="text-right">
                    <div className="text-xs font-mono text-cyan-400 font-bold">
                      {totalReputation} / {levelInfo.maxRep + 1} REP
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                      {levelInfo.repToNext} REP TO NEXT LEVEL
                    </div>
                  </div>
                )}
              </div>
              
              {levelInfo.maxRep !== null ? (
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                  <div 
                    style={{ width: `${levelInfo.progressPercent}%` }} 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-all duration-500"
                  ></div>
                </div>
              ) : (
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                  <div className="h-full w-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full opacity-50"></div>
                </div>
              )}
            </div>

            {/* Community Reputation Card */}
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#080b12]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    REPUTATION
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase hidden sm:block">
                  Community contribution score
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-[#0a0e17] p-3 rounded-lg border border-slate-800 mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase">Total Lifetime Reputation</span>
                <span className="text-emerald-400 font-bold text-lg">{loadingReputation ? '...' : totalReputation}</span>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {loadingReputation ? (
                   <div className="text-xs font-mono text-slate-500 py-4 text-center border-t border-slate-800/50 mt-4">
                     SYNCING CONTRIBUTION RECORDS...
                   </div>
                ) : reputationEvents.length > 0 ? (
                  reputationEvents.map((ev, i) => (
                    <div key={ev.id || i} className="p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800/80 flex items-start gap-3">
                      <div className="text-emerald-400 font-bold text-xs mt-0.5">{ev.points > 0 ? `+${ev.points}` : ev.points}</div>
                      <div className="flex-1">
                        <div className="text-[11px] font-mono font-bold text-slate-300">
                          {ev.reason || ev.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {new Date(ev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-slate-500 py-4 text-center border border-dashed border-slate-800/50 rounded-lg mt-4">
                     NO CONTRIBUTIONS YET
                   </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono italic leading-relaxed">
                Reputation represents community contributions. It does not reflect investigative certainty, verification status, or factual accuracy.
              </div>
            </div>
            {/* 3-Column Info Matrix: Badges, Saved Binders, Investigative Trail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Achievements */}
              <div className="rounded-xl border border-slate-800 bg-[#07090f] p-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-3 uppercase">
                  <Award className="w-4 h-4" />
                  <span>ACHIEVEMENTS ({achievements.length})</span>
                </div>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {loadingReputation ? (
                    <div className="text-[11px] font-mono text-slate-500 text-center py-6">
                      SYNCING ACHIEVEMENTS...
                    </div>
                  ) : achievements.length > 0 ? (
                    achievements.map((a: any) => (
                      <div key={a.id} className="p-2.5 rounded-lg bg-[#0a0e17] border border-amber-900/30 flex items-start gap-2.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 blur-xl rounded-full"></div>
                        <span className="text-xl relative z-10">{a.definition?.icon || '🏆'}</span>
                        <div className="relative z-10">
                          <div className="text-xs font-mono font-bold text-amber-500">{a.definition?.name || a.achievementId}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{a.definition?.description}</div>
                          <div className="text-[8px] text-slate-500 mt-1 uppercase">EARNED {new Date(a.earnedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] font-mono text-slate-500 text-center py-6 border border-dashed border-slate-800/50 rounded-lg">
                      No achievements unlocked yet.
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
