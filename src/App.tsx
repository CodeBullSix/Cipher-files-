import React, { useState, useEffect } from 'react';
import { 
  CaseFile, 
  Category, 
  EvidenceRating, 
  UserProfile,
  InvestigatorTier,
  GraphNode,
  SupporterRecord
} from './types';
import { AuthService } from './services/authService';
import { FirestoreService } from './services/firestoreService';
import { StorageService } from './services/storage';
import { INITIAL_SUPPORTERS, INITIAL_CASES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { EditorialHome } from './components/EditorialHome';
import { HeroSearch } from './components/HeroSearch';
import { CaseCard } from './components/CaseCard';
import { normalizeStatus } from './components/StatusBadge';
import { CaseDetailModal } from './components/CaseDetailModal';
import { RabbitHoleGraph } from './components/RabbitHoleGraph';
import { EvidenceArchiveView } from './components/EvidenceArchiveView';
import { DiscussionsView } from './components/DiscussionsView';
import { SupportersView } from './components/SupportersView';
import { SubmitTheoryModal } from './components/SubmitTheoryModal';
import { DirectMessageModal } from './components/DirectMessageModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { VipClearanceModal } from './components/VipClearanceModal';
import { InvestigatorProfileModal } from './components/InvestigatorProfileModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { sound } from './utils/audio';
import { 
  FolderArchive, 
  Sparkles, 
  ShieldAlert, 
  Crown, 
  Lock, 
  Flame, 
  Terminal,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Auth & Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'cases' | 'graph' | 'discussions' | 'supporters'>('cases');
  const [cases, setCases] = useState<CaseFile[]>(StorageService.getCases());
  const [legacyProfile, setLegacyProfile] = useState(StorageService.getProfile());
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(StorageService.getGraphNodes());
  const [supporters, setSupporters] = useState<SupporterRecord[]>(INITIAL_SUPPORTERS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<EvidenceRating | 'ALL'>('ALL');

  // Modals
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isDirectMessageModalOpen, setIsDirectMessageModalOpen] = useState<boolean>(false);
  const [directMessageTarget, setDirectMessageTarget] = useState<UserProfile | null>(null);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(sound.isAudioMuted());

  // Direct entity navigation to graph
  const [graphTargetEntity, setGraphTargetEntity] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time UTC clock string
  const [utcTime, setUtcTime] = useState<string>('');

  // 1. Initialize Auth and Firestore Database
  useEffect(() => {
    // Subscribe to Auth state
    const unsubAuth = AuthService.subscribeToAuthState((user) => {
      setCurrentUser(user);
    });

    // Fetch Cases from API
import('./services/apiService').then(({ ApiService }) => {
      ApiService.getCases().then((loadedCases) => {
        const localCases = StorageService.getCases();
        const merged = localCases.map(local => {
          const remote = loadedCases.find((r: any) => r.id === local.id);
          if (remote) {
            return { ...local, ...remote };
          }
          return local;
        });
        loadedCases.forEach((remote: any) => {
          if (!merged.find(m => m.id === remote.id)) {
            merged.push({
              ...remote,
              whatWeKnow: remote.whatWeKnow || [],
              speculations: remote.speculations || [],
              evidenceList: remote.evidenceList || [],
              timeline: remote.timeline || [],
              documents: remote.documents || [],
              entities: remote.entities || [],
              connectedCaseIds: remote.connectedCaseIds || []
            });
          }
        });
        setCases(merged);
      }).catch(console.error);
    });

    // Subscribe to Supporters in Firestore (leave this if supporters aren't migrated yet)
    const unsubSupporters = FirestoreService.listenSupporters((loadedSupporters) => {
      setSupporters(loadedSupporters);
    });

    return () => {
      unsubAuth();
      unsubSupporters();
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 19) + ' UTC';
      setUtcTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = async () => {
    sound.click();
    try {
      const profile = await AuthService.loginWithGoogle();
      if (profile) {
        showToast(`Welcome Operative ${profile.callsign} [${profile.role.toUpperCase()}]`);
        sound.blip();
      }
    } catch (e: any) {
      if (
        e?.code !== 'auth/popup-closed-by-user' &&
        e?.code !== 'auth/cancelled-popup-request' &&
        e?.code !== 'auth/user-cancelled' &&
        !e?.message?.includes('popup-closed-by-user')
      ) {
        console.error('Login error:', e);
        showToast('Login attempt failed.');
      }
    }
  };

  const handleLogout = async () => {
    sound.click();
    try {
      await AuthService.logout();
      showToast('Operative session terminated.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRewardXp = (amount: number, reason: string) => {
    const res = StorageService.addXp(amount, reason);
    setLegacyProfile(StorageService.getProfile());
    if (res.leveledUp && res.newRank) {
      showToast(`🎖️ PROMOTION! Security Clearance Elevated to ${res.newRank.replace('_', ' ')}`);
      sound.blip();
    } else {
      showToast(`+${amount} XP: ${reason}`);
    }
  };

  const handleToggleBookmark = (caseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    StorageService.toggleBookmark(caseId);
    setLegacyProfile(StorageService.getProfile());
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const targetCase = cases.find(c => c.id === caseId) || INITIAL_CASES.find(c => c.id === caseId);
    StorageService.pushTrail(
      targetCase?.title || caseId,
      caseId,
      'CASE'
    );
    setLegacyProfile(StorageService.getProfile());
  };

  const handleRandomRabbitHole = () => {
    // Robust pool fallback to ensure a case is always available
    const pool = cases.length > 0 ? cases : INITIAL_CASES;
    if (pool.length === 0) return;

    // Pick a case different from the currently open one if possible
    const candidates = pool.filter(c => c.id !== activeCaseId);
    const chosen = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : pool[Math.floor(Math.random() * pool.length)];

    if (!chosen) return;

    sound.playWarp();
    setActiveCaseId(chosen.id);
    StorageService.pushTrail(chosen.title, chosen.id, 'CASE');
    setLegacyProfile(StorageService.getProfile());
    showToast(`🌀 Entered rabbit hole: ${chosen.title} (${chosen.caseNumber})`);
    handleRewardXp(25, `Fell down rabbit hole: ${chosen.title}`);
  };

  const handleJumpGraphEntity = (entityName: string) => {
    setActiveCaseId(null);
    setGraphTargetEntity(entityName);
    setCurrentTab('graph');
    sound.click();
  };

  const handleOpenDirectMessageWithAuthor = (authorUid: string, authorName: string, authorCallsign: string) => {
    if (!currentUser) {
      handleLogin();
      return;
    }
    const target: UserProfile = {
      uid: authorUid,
      email: '',
      displayName: authorName,
      callsign: authorCallsign,
      role: 'operative',
      tier: 'FREE',
      rank: 'RESEARCHER',
      clearanceLevel: 'LEVEL 2 // CLASSIFIED FIELD',
      xp: 100,
      contributionsCount: 1,
      debunkCount: 0,
      sourcesDiscovered: 0,
      rabbitHolesFollowed: 0,
      badges: [],
      savedCaseIds: [],
      createdAt: new Date().toISOString()
    };
    setDirectMessageTarget(target);
    setIsDirectMessageModalOpen(true);
    sound.click();
  };

  const isVip = currentUser?.tier === 'VIP_MAJESTIC' || currentUser?.tier === 'BENEFACTOR' || currentUser?.role === 'admin';

  // Filtered cases
  const filteredCases = cases.filter(c => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL') {
      const currentNorm = normalizeStatus(c.status);
      const targetNorm = normalizeStatus(selectedStatus);
      if (currentNorm !== targetNorm) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = c.title?.toLowerCase().includes(q);
      const inNum = c.caseNumber?.toLowerCase().includes(q);
      const inClaim = c.claim?.toLowerCase().includes(q);
      const inEntities = (c.entities || []).some(e => e.name.toLowerCase().includes(q));
      if (!inTitle && !inNum && !inClaim && !inEntities) return false;
    }
    return true;
  });

  const activeCaseFile = cases.find(c => c.id === activeCaseId) || INITIAL_CASES.find(c => c.id === activeCaseId);

  return (
    <div className="min-h-screen flex flex-col bg-[#04060B] text-[#e0e0e0] font-sans selection:bg-[#00E5FF]/30">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-14 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0A0E18] border border-[#00E5FF]/80 rounded-xl shadow-2xl text-[#00E5FF] font-mono text-xs animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-[#00E5FF] animate-spin" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSubmitModal={() => {
          if (!currentUser) {
            handleLogin();
          } else {
            setIsSubmitModalOpen(true);
          }
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenDirectMessages={() => {
          if (!currentUser) {
            handleLogin();
          } else {
            setDirectMessageTarget(null);
            setIsDirectMessageModalOpen(true);
          }
        }}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onOpenSupportersModal={() => setIsVipModalOpen(true)}
        onRandomRabbitHole={handleRandomRabbitHole}
        currentUser={currentUser}
        legacyProfile={legacyProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSearch={() => setIsQuickSearchOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = sound.toggleMute();
          setIsMuted(next);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: EDITORIAL INTELLIGENCE ARCHIVE */}
        {currentTab === 'cases' && (
          <EditorialHome
            cases={cases}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            onOpenCase={handleOpenCase}
            onLaunchGraph={handleJumpGraphEntity}
            onRandomRabbitHole={handleRandomRabbitHole}
            savedCaseIds={legacyProfile.savedCaseIds}
            onToggleBookmark={(id, e) => handleToggleBookmark(id, e)}
          />
        )}

        {/* VIEW 2: SUPPORTERS & DONOR BOARD */}
        {currentTab === 'supporters' && (
          <SupportersView
            supporters={supporters}
            currentUser={currentUser}
            onDonationSuccess={showToast}
          />
        )}

        {/* VIEW 3: RABBIT HOLE GRAPH */}
        {currentTab === 'graph' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold tracking-[0.25em]">
                    KNOWLEDGE GRAPH INTERFACE
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2 tracking-wider">
                  <span>THE RABBIT HOLE ENGINE (INTERACTIVE MAP)</span>
                </h2>
              </div>

              <button
                onClick={() => setCurrentTab('cases')}
                className="px-3 py-1.5 rounded-lg border border-gray-800 bg-[#090C16] text-gray-300 hover:text-white text-xs font-mono"
              >
                RETURN TO DOSSIERS
              </button>
            </div>

            <RabbitHoleGraph
              onOpenCase={handleOpenCase}
              onRewardXp={handleRewardXp}
              initialSelectedEntity={graphTargetEntity}
              onRandomRabbitHole={handleRandomRabbitHole}
            />
          </div>
        )}

        {/* VIEW 4: RESEARCH FORUMS & PEER REVIEW DEBATES */}
        {currentTab === 'discussions' && (
          <DiscussionsView
            cases={cases}
            currentUser={currentUser || (legacyProfile as any)}
            onOpenCase={handleOpenCase}
            onRewardXp={handleRewardXp}
          />
        )}
      
        {/* VIEW 5: EVIDENCE ARCHIVE */}
        {currentTab === 'evidence' && (
          <EvidenceArchiveView
            currentUser={currentUser || (legacyProfile as any)}
            onOpenCase={handleOpenCase}
            onRewardXp={handleRewardXp}
          />
        )}

      </main>

      {/* Bottom Tactical Status Bar */}
      <footer className="h-10 bg-[#00E5FF]/5 border-t border-[#00E5FF]/20 flex items-center justify-between px-4 sm:px-6 font-mono text-[10px] uppercase tracking-widest text-[#e0e0e0] shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-white font-bold">Firebase Auth & Firestore: ONLINE</span>
          </div>
          <span className="opacity-40 hidden sm:inline text-white">|</span>
          <span className="hidden sm:inline text-white/80">SECURE CHANNEL / TLS</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#00E5FF] font-bold">[{utcTime || '12:00:44 UTC'}]</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Case Detail Modal */}
      {activeCaseFile && (
        <CaseDetailModal
          caseFile={activeCaseFile}
          onClose={() => setActiveCaseId(null)}
          onJumpCase={handleOpenCase}
          isBookmarked={legacyProfile.savedCaseIds.includes(activeCaseFile.id)}
          onToggleBookmark={(id) => handleToggleBookmark(id)}
          onRewardXp={handleRewardXp}
          onJumpGraphEntity={handleJumpGraphEntity}
          currentUser={currentUser}
          onOpenDirectMessageWithUser={handleOpenDirectMessageWithAuthor}
          onRandomRabbitHole={handleRandomRabbitHole}
        />
      )}

      {/* 2. Submit Theory Modal */}
      {isSubmitModalOpen && (
        <SubmitTheoryModal
          currentUser={currentUser}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={() => {
            setIsSubmitModalOpen(false);
            showToast('✅ Conspiracy theory published to live community archive (+150 XP)');
          }}
        />
      )}

      {/* 3. Direct Message Modal */}
      <DirectMessageModal
        isOpen={isDirectMessageModalOpen}
        onClose={() => {
          setIsDirectMessageModalOpen(false);
          setDirectMessageTarget(null);
        }}
        currentUser={currentUser}
        targetUser={directMessageTarget}
      />

      {/* 4. Admin & Moderation Console Modal */}
      <AdminConsoleModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        currentUser={currentUser}
        cases={cases}
        onRefreshCases={() => {
          showToast('Live database sync refreshed.');
        }}
      />

      {/* 5. Supporters & Top Donator Modal */}
      <VipClearanceModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        currentUser={currentUser}
        supporters={supporters}
        onTierUpgraded={(tier) => {
          showToast(`Contribution recorded! Thank you for supporting the open archive.`);
        }}
      />

      {/* 6. Investigator Profile & Customizer Modal */}
      {isProfileModalOpen && (
        <InvestigatorProfileModal
          profile={legacyProfile}
          currentUser={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenCase={handleOpenCase}
          onProfileUpdated={(updated) => {
            if (currentUser) {
              setCurrentUser(updated);
            } else {
              setLegacyProfile(updated);
            }
            showToast(`Operative credentials updated: ${updated.displayName} (${updated.callsign})`);
          }}
          onResetFactory={() => {
            setIsProfileModalOpen(false);
            setLegacyProfile(StorageService.getProfile());
            showToast('Archive reset to factory defaults.');
          }}
        />
      )}

      {/* 7. Quick Search Modal */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        cases={cases}
        nodes={graphNodes}
        onOpenCase={handleOpenCase}
        onJumpGraphEntity={handleJumpGraphEntity}
        onRandomRabbitHole={handleRandomRabbitHole}
      />
    </div>
  );
}
