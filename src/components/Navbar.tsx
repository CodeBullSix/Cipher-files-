import React from 'react';
import { 
  FolderArchive, Database, 
  Share2, 
  MessageSquare, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  User, 
  Radio,
  Search,
  Crown,
  ShieldAlert,
  LogIn,
  LogOut,
  Send,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';
import { UserAvatar } from './UserAvatar';

interface Props {
  currentTab: 'cases' | 'graph' | 'discussions' | 'supporters';
  onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters') => void;
  onOpenSubmitModal: () => void;
  onOpenProfileModal: () => void;
  onOpenDirectMessages: () => void;
  onOpenAdminConsole: () => void;
  onOpenSupportersModal: () => void;
  onRandomRabbitHole: () => void;
  currentUser: UserProfile | null;
  legacyProfile?: UserProfile;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSearch: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenSubmitModal,
  onOpenProfileModal,
  onOpenDirectMessages,
  onOpenAdminConsole,
  onOpenSupportersModal,
  onRandomRabbitHole,
  currentUser,
  legacyProfile,
  onLogin,
  onLogout,
  onOpenSearch,
  isMuted,
  onToggleMute,
}) => {
  const activeUser = currentUser || legacyProfile;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'ajsteptoe123@gmail.com';
  const isModerator = isAdmin || currentUser?.role === 'moderator';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#060812]/95 backdrop-blur-md">
      
      {/* Top Classification Line (Desktop only to save vertical screen space on mobile) */}
      <div className="hidden sm:flex w-full bg-[#030408] border-b border-cyan-500/15 px-4 sm:px-6 py-1 items-center justify-between text-[10px] font-mono text-cyan-400/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="tracking-[0.2em] font-bold uppercase">
              CLEARANCE: {currentUser ? currentUser.clearanceLevel : 'LEVEL 1 // PUBLIC DECLASSIFIED ARCHIVE'}
            </span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-white/60 tracking-wider">100% OPEN INVESTIGATIVE ACCESS</span>
        </div>
        <div className="flex items-center gap-3">
          {currentUser && (
            <span className="text-gray-400 font-mono">
              Operative: <span className="text-cyan-300 font-bold">{currentUser.callsign}</span>
            </span>
          )}
          <span className="text-emerald-400 font-bold tracking-widest">[FIREBASE PERSISTENT]</span>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div 
            onClick={() => { onSelectTab('cases'); sound.click(); }}
            className="flex flex-col cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]"></span>
              <h1 className="font-mono text-base sm:text-xl font-black tracking-[0.18em] text-white">
                CIPHER <span className="text-cyan-400">FILES</span>
              </h1>
            </div>
            <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-[0.3em] text-gray-400">
              Declassified Intelligence Database
            </span>
          </div>

          {/* Quick Search Bar Widget (Desktop) */}
          <div 
            onClick={() => { onOpenSearch(); sound.click(); }}
            className="hidden lg:flex relative h-9 w-60 bg-[#0A0E1A] border border-cyan-500/25 px-3 items-center gap-2.5 cursor-pointer hover:border-cyan-400/60 rounded-lg transition-colors shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400/70" />
            <span className="text-xs text-gray-400 font-mono">Search classified files...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-black/60 px-1.5 py-0.5 rounded border border-gray-800 text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Primary Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090D1A] border border-gray-800 p-1 rounded-xl">
          <button
            onClick={() => { onSelectTab('cases'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'cases'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Dossiers</span>
          </button>

          <button
            onClick={() => { onSelectTab('graph'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'graph'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Rabbit Hole Graph (Map)</span>
          </button>
          <button
            onClick={() => { onSelectTab('evidence'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'evidence'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Evidence</span>
          </button>


          <button
            onClick={() => { onSelectTab('discussions'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'discussions'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Debate Forums</span>
          </button>

          <button
            onClick={() => { onSelectTab('supporters'); sound.click(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              currentTab === 'supporters'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-gray-800/40'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Supporters</span>
          </button>
        </nav>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => { onOpenSearch(); sound.click(); }}
            className="lg:hidden p-2 rounded-lg bg-[#0A0E1A] border border-cyan-500/30 text-cyan-300 hover:bg-[#0F1628] transition-colors"
            title="Search classified dossiers"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Random Rabbit Hole Quick Action */}
          <button
            onClick={() => { onRandomRabbitHole(); sound.playWarp(); }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/60 to-purple-950/60 hover:from-cyan-900/60 hover:to-purple-900/60 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.15)] group"
            title="Jump into a random declassified rabbit hole dossier"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline">Random Hole</span>
          </button>

          {/* Submit Theory Button */}
          <button
            onClick={() => { onOpenSubmitModal(); sound.click(); }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">File Theory</span>
          </button>

          {/* Direct Messaging Drawer Button */}
          {currentUser && (
            <button
              onClick={() => { onOpenDirectMessages(); sound.click(); }}
              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-cyan-400 transition-colors"
              title="Secure Messages"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Admin Command Center Button */}
          {isModerator && (
            <button
              onClick={() => { onOpenAdminConsole(); sound.click(); }}
              className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 transition-colors"
              title="Admin Moderation Console"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Supporters Quick Button */}
          <button
            onClick={() => { onOpenSupportersModal(); sound.click(); }}
            className="hidden sm:flex px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all"
            title="View Highest Donator & Supporter Roll"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Supporters</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { onOpenProfileModal(); sound.click(); }}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-lg bg-[#0E121E] border border-cyan-500/30 hover:border-cyan-400 transition-colors group"
                title="Open Investigator Profile & Archival Credentials"
              >
                <UserAvatar
                  profile={currentUser}
                  size="xs"
                  showBadge
                />
                <div className="text-left hidden lg:block">
                  <div className="text-[11px] font-bold text-white font-mono leading-tight group-hover:text-cyan-300 transition-colors">
                    {currentUser.displayName.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-cyan-400/80 font-mono leading-none">
                    {currentUser.username ? `@${currentUser.username}` : (currentUser.role || 'Investigator')}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { onOpenProfileModal(); sound.click(); }}
                className="flex px-2 py-1.5 rounded-lg bg-[#0E121E] hover:bg-[#131929] border border-gray-800 hover:border-cyan-500/40 text-gray-300 font-mono text-xs font-bold items-center gap-1.5 transition-colors"
                title="View & Edit Investigator Profile"
              >
                <UserAvatar
                  profile={legacyProfile}
                  size="xs"
                />
                <span className="hidden sm:inline text-xs">{legacyProfile?.displayName || 'Profile'}</span>
              </button>

              <button
                onClick={onLogin}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Clean Mobile Bottom/Sub Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#04060C] border-t border-gray-800/80">
        <button
          onClick={() => { onSelectTab('cases'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'cases'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Dossiers</span>
        </button>

        <button
          onClick={() => { onSelectTab('graph'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'graph'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Graph (Map)</span>
        </button>
        <button
          onClick={() => { onSelectTab('evidence'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'evidence'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Evidence</span>
        </button>


        <button
          onClick={() => { onSelectTab('discussions'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'discussions'
              ? 'text-cyan-300 bg-cyan-950/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Forums</span>
        </button>

        <button
          onClick={() => { onSelectTab('supporters'); sound.click(); }}
          className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-mono font-bold flex flex-col items-center gap-0.5 transition-colors ${
            currentTab === 'supporters'
              ? 'text-amber-300 bg-amber-950/40'
              : 'text-amber-400/80 hover:text-amber-300'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Supporters</span>
        </button>
      </div>

    </header>
  );
};
