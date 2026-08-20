import React, { useState, useEffect, useRef } from 'react';
import { 
  CaseFile, 
  EvidenceItem, 
  DocumentItem, 
  RelatedEntity, 
  EvidenceRating,
  Comment,
  UserProfile,
  CIPHER_FILES_PHILOSOPHY,
  OFFICIAL_STATUS_DEFINITIONS
} from '../types';
import { StatusBadge } from './StatusBadge';
import { PrimaryDocumentViewer } from './PrimaryDocumentViewer';
import { AICrossExaminer } from './AICrossExaminer';
import { MediaAttachmentViewer } from './MediaAttachmentViewer';
import { FirestoreService } from '../services/firestoreService';
import { processImageUpload } from '../utils/imageUpload';
import { processVideoUpload } from '../utils/mediaUtils';
import { TACTICAL_AVATAR_PRESETS } from '../data/avatarPresets';
import { 
  X, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Calendar, 
  Building2, 
  Users, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Send,
  ArrowRight,
  Shield,
  Layers,
  Flame,
  Image as ImageIcon,
  Crown,
  UserCheck,
  Radio,
  FileCheck2,
  Lock,
  Cpu,
  Brain,
  Quote,
  Eye,
  Info,
  Film,
  Video
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  caseFile: CaseFile;
  onClose: () => void;
  onJumpCase: (caseId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (caseId: string) => void;
  onRewardXp: (amount: number, reason: string) => void;
  onJumpGraphEntity?: (entityName: string) => void;
  currentUser?: UserProfile | null;
  onOpenDirectMessageWithUser?: (authorUid: string, authorName: string, authorCallsign: string) => void;
  onRandomRabbitHole?: () => void;
}

export const CaseDetailModal: React.FC<Props> = ({
  caseFile,
  onClose,
  onJumpCase,
  isBookmarked,
  onToggleBookmark,
  onRewardXp,
  onJumpGraphEntity,
  currentUser,
  onOpenDirectMessageWithUser,
  onRandomRabbitHole
}) => {
  // Master investigative view tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'facts' | 'allegations' | 'theories' | 'ai_analysis' | 'evidence' | 'timeline' | 'rabbithole' | 'discussions'
  >('overview');
  
  const [currentCase, setCurrentCase] = useState<CaseFile>(caseFile);
  const [selectedDocId, setSelectedDocId] = useState<string>(caseFile.documents?.[0]?.id || '');
  
  // Real-time Comments state from Firestore
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentStance, setNewCommentStance] = useState<'SUPPORTING' | 'SKEPTICAL' | 'NEUTRAL' | 'DEVILS_ADVOCATE'>('NEUTRAL');
  const [attachedCommentImage, setAttachedCommentImage] = useState<string | null>(null);
  const [attachedCommentVideo, setAttachedCommentVideo] = useState<string | null>(null);
  const [commentVideoUrlInput, setCommentVideoUrlInput] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  // Evidence filtering
  const [evidenceFilter, setEvidenceFilter] = useState<'ALL' | 'SUPPORTING' | 'COUNTER'>('ALL');
  const [localBeliefScore, setLocalBeliefScore] = useState<number>(caseFile.beliefScore ?? 65);
  const [hasVotedBelief, setHasVotedBelief] = useState(false);

  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const commentVideoInputRef = useRef<HTMLInputElement>(null);

  // Sync when caseFile changes
  useEffect(() => {
    setCurrentCase(caseFile);
    setSelectedDocId(caseFile.documents?.[0]?.id || '');
    setLocalBeliefScore(caseFile.beliefScore ?? 65);
    setHasVotedBelief(false);
  }, [caseFile]);

  // Real-time Comments Sync
  useEffect(() => {
    const unsubscribe = FirestoreService.listenComments(caseFile.id, (loadedComments) => {
      setComments(loadedComments);
    });
    return () => unsubscribe();
  }, [caseFile.id]);

  const handleReaction = async (reaction: 'up' | 'down' | 'mindblown' | 'skeptic') => {
    sound.click();
    try {
      await FirestoreService.voteCaseReaction(currentCase.id, reaction);
      setCurrentCase(prev => ({
        ...prev,
        upvotes: reaction === 'up' ? (prev.upvotes || 0) + 1 : prev.upvotes,
        downvotes: reaction === 'down' ? (prev.downvotes || 0) + 1 : prev.downvotes,
        mindblownCount: reaction === 'mindblown' ? (prev.mindblownCount || 0) + 1 : prev.mindblownCount,
        skepticCount: reaction === 'skeptic' ? (prev.skepticCount || 0) + 1 : prev.skepticCount
      }));
      onRewardXp(15, `Evaluated case ${currentCase.caseNumber}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBeliefChange = (newVal: number) => {
    setLocalBeliefScore(newVal);
  };

  const handleBeliefSubmit = async () => {
    sound.click();
    setHasVotedBelief(true);
    try {
      await FirestoreService.updateBeliefScore(currentCase.id, localBeliefScore);
      onRewardXp(25, `Submitted conviction score on ${currentCase.caseNumber}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const dataUrl = await processImageUpload(file);
      setAttachedCommentImage(dataUrl);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCommentVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingVideo(true);
      const dataUrl = await processVideoUpload(file);
      setAttachedCommentVideo(dataUrl);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalVideo = attachedCommentVideo || (commentVideoUrlInput.trim() ? commentVideoUrlInput.trim() : undefined);
    if (!newCommentText.trim() && !attachedCommentImage && !finalVideo) return;

    sound.click();
    const commentId = `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newComm: Comment = {
      id: commentId,
      caseId: currentCase.id,
      authorUid: currentUser?.uid || 'guest',
      authorName: currentUser?.displayName || currentUser?.callsign || 'Anonymous Operative',
      authorCallsign: currentUser?.callsign || 'AGENT-UNKNOWN',
      authorRank: currentUser?.role?.toUpperCase() || 'OPERATIVE',
      authorAvatar: currentUser?.avatarUrl,
      authorBadge: currentUser?.avatarPreset || currentUser?.role,
      content: newCommentText.trim(),
      stance: newCommentStance,
      upvotes: 1,
      downvotes: 0,
      imageUrl: attachedCommentImage || undefined,
      videoUrl: finalVideo,
      createdAt: new Date().toISOString()
    };

    // Instant optimistic update
    setComments(prev => [newComm, ...prev]);
    setCurrentCase(prev => ({
      ...prev,
      commentCount: (prev.commentCount || 0) + 1
    }));

    setNewCommentText('');
    setAttachedCommentImage(null);
    setAttachedCommentVideo(null);
    setCommentVideoUrlInput('');
    setShowVideoInput(false);

    try {
      await FirestoreService.addComment(currentCase.id, newComm);
      sound.blip();
      onRewardXp(35, `Published tactical debate argument in ${currentCase.caseNumber}`);
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleVoteComment = async (commId: string, dir: 'up' | 'down') => {
    sound.click();
    setComments(prev => prev.map(c => {
      if (c.id === commId) {
        return {
          ...c,
          upvotes: dir === 'up' ? (c.upvotes || 0) + 1 : c.upvotes,
          downvotes: dir === 'down' ? (c.downvotes || 0) + 1 : c.downvotes
        };
      }
      return c;
    }));
    try {
      await FirestoreService.voteComment(currentCase.id, commId, dir);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvidence = (currentCase.evidenceList || []).filter(e => {
    if (evidenceFilter === 'SUPPORTING') return e.isSupporting;
    if (evidenceFilter === 'COUNTER') return !e.isSupporting;
    return true;
  });

  const selectedDocument = (currentCase.documents || []).find(d => d.id === selectedDocId) || currentCase.documents?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-2xl border border-cyan-500/40 bg-[#080B14] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200">
        
        {/* Top Intelligence Header Banner */}
        <div className="bg-[#04060C] border-b border-cyan-500/20 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-black text-xs sm:text-sm text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/40">
              {currentCase.caseNumber}
            </span>
            <StatusBadge status={currentCase.status} size="sm" />
            <span className="text-[11px] font-mono text-gray-400 hidden sm:inline uppercase">
              {currentCase.category.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct message author button */}
            {currentCase.authorUid && currentCase.authorUid !== currentUser?.uid && (
              <button
                onClick={() => {
                  onOpenDirectMessageWithUser?.(
                    currentCase.authorUid || '',
                    currentCase.authorName || 'Author',
                    currentCase.authorCallsign || 'AGENT-UNKNOWN'
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
                title="Open encrypted direct communication with author"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">DM Theorist</span>
              </button>
            )}

            {onRandomRabbitHole && (
              <button
                onClick={() => {
                  onRandomRabbitHole();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-gradient-to-r from-cyan-950/80 to-purple-950/80 hover:from-cyan-900/80 hover:to-purple-900/80 text-cyan-300 border border-cyan-500/50 transition-colors shadow-sm"
                title="Jump to another declassified dossier"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Next Random Dossier</span>
              </button>
            )}

            <button
              onClick={() => onToggleBookmark(currentCase.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                isBookmarked 
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' 
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved Dossier' : 'Save Dossier'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Header Info */}
        <div className="px-4 sm:px-6 py-4 bg-[#060912] border-b border-gray-800/80">
          
          {/* Status & Epistemic Disclaimer Banner */}
          <div className="mb-4">
            <StatusBadge status={currentCase.status} variant="banner" size="lg" />
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-black/60 border border-gray-800/80 flex items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
              <span className="text-cyan-400 font-bold">EPISTEMIC PRINCIPLE:</span>
              <span className="text-gray-300 italic text-center sm:text-left">
                "Cipher Files does not endorse the theories presented in this dossier. Here is the evidence. Investigate it yourself."
              </span>
              <span className="hidden sm:inline text-gray-500">PRIMARY SOURCES ONLY</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white mb-1">
                {currentCase.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-sans">
                {currentCase.subtitle}
              </p>
              {currentCase.authorCallsign && (
                <div className="flex items-center space-x-2 mt-1.5 text-xs font-mono text-cyan-400">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Investigator: <strong className="text-white">{currentCase.authorCallsign}</strong></span>
                  {currentCase.authorRole && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-gray-800 text-gray-300 uppercase">{currentCase.authorRole}</span>
                  )}
                </div>
              )}
            </div>

            {/* Reactions Bar */}
            <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 p-1.5 rounded-xl text-xs font-mono shrink-0">
              <button
                onClick={() => handleReaction('up')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-cyan-950 hover:text-cyan-400 transition-colors text-gray-300"
                title="Support Theory"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentCase.upvotes || 0}</span>
              </button>

              <button
                onClick={() => handleReaction('mindblown')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-amber-950 hover:text-amber-400 transition-colors text-gray-300"
                title="Mind Blown"
              >
                <span>🤯</span>
                <span>{currentCase.mindblownCount || 0}</span>
              </button>

              <button
                onClick={() => handleReaction('skeptic')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-purple-950 hover:text-purple-400 transition-colors text-gray-300"
                title="Skeptical Analysis"
              >
                <span>🧐</span>
                <span>{currentCase.skepticCount || 0}</span>
              </button>
            </div>
          </div>

          {/* Interactive Belief / Conviction Meter */}
          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-cyan-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase">COMMUNITY CONVICTION SCORE</span>
                <span className="text-cyan-300 font-bold">({localBeliefScore}%)</span>
              </div>
              <span className="text-[11px] text-gray-400">
                {localBeliefScore > 80 ? 'High Corroborating Evidence' : localBeliefScore > 40 ? 'Actively Disputed / Open Investigation' : 'High Skepticism / Proven Hoax'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="range"
                min="0"
                max="100"
                value={localBeliefScore}
                onChange={(e) => handleBeliefChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <button
                onClick={handleBeliefSubmit}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                  hasVotedBelief 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                }`}
              >
                {hasVotedBelief ? '✓ Recorded' : 'Vote'}
              </button>
            </div>
          </div>
        </div>

        {/* Master Investigative Tabs (Pillars) */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-gray-800 bg-[#050810] overflow-x-auto scrollbar-none">
          
          <button
            onClick={() => { setActiveTab('overview'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Overview & Hypothesis</span>
          </button>

          {/* 1. FACTS & OFFICIAL RECORD */}
          <button
            onClick={() => { setActiveTab('facts'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'facts'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-gray-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Confirmed Facts ({(currentCase.whatWeKnow || []).length})</span>
          </button>

          {/* 2. ALLEGATIONS & TESTIMONY */}
          <button
            onClick={() => { setActiveTab('allegations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'allegations'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-gray-400 hover:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Allegations & Leaks</span>
          </button>

          {/* 3. SPECULATIVE THEORIES */}
          <button
            onClick={() => { setActiveTab('theories'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'theories'
                ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-gray-400 hover:text-purple-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Speculative Theories</span>
          </button>

          {/* 4. AI FORENSIC ANALYSIS */}
          <button
            onClick={() => { setActiveTab('ai_analysis'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ai_analysis'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>4. AI Analysis</span>
          </button>

          {/* 5. PRIMARY EVIDENCE VAULT */}
          <button
            onClick={() => { setActiveTab('evidence'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Evidence & Sources ({(currentCase.evidenceList || []).length})</span>
          </button>

          {/* 6. TIMELINE */}
          <button
            onClick={() => { setActiveTab('timeline'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          {/* 7. RABBIT HOLE CONNECTIONS */}
          <button
            onClick={() => { setActiveTab('rabbithole'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'rabbithole'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rabbit Holes ({(currentCase.connectedCaseIds || []).length})</span>
          </button>

          {/* 8. COMMUNITY DEBATES */}
          <button
            onClick={() => { setActiveTab('discussions'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'discussions'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Debates ({comments.length})</span>
          </button>

        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#04060C]">
          
          {/* TAB 0: OVERVIEW & HYPOTHESIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Cover photo banner */}
              {currentCase.coverImage && (
                <div className="rounded-2xl overflow-hidden border border-cyan-500/30 max-h-72 bg-black/60 shadow-lg">
                  <img src={currentCase.coverImage} alt={currentCase.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Core Hypothesis & Official Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* The Hypothesis */}
                <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Quote className="w-4 h-4 text-cyan-400" />
                      <span>THE CORE HYPOTHESIS</span>
                    </h4>
                    <p className="text-sm font-mono text-white leading-relaxed">
                      "{currentCase.claim}"
                    </p>
                  </div>
                  {currentCase.claimOrigin && (
                    <p className="text-[11px] text-gray-400 font-mono mt-3 pt-2 border-t border-gray-800">
                      Provenance: {currentCase.claimOrigin}
                    </p>
                  )}
                </div>

                {/* Official Verdict / Public Stance */}
                <div className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>OFFICIAL RECORD / PUBLIC VERDICT</span>
                    </h4>
                    <p className="text-sm font-sans text-gray-300 leading-relaxed">
                      {currentCase.officialVerdict}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>CATEGORY: {currentCase.category.replace(/_/g, ' ')}</span>
                    <span className="text-cyan-400">{currentCase.evidenceList?.length || 0} Primary Exhibits</span>
                  </div>
                </div>

              </div>

              {/* Summary Breakdown */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-gray-800">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
                  EXECUTIVE SUMMARY
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  {currentCase.summary}
                </p>
              </div>

              {/* 4 Pillars Fast Nav Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div 
                  onClick={() => { setActiveTab('facts'); sound.click(); }}
                  className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. CONFIRMED FACTS</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    {(currentCase.whatWeKnow || []).length} verified forensic facts and primary records.
                  </p>
                </div>

                <div 
                  onClick={() => { setActiveTab('allegations'); sound.click(); }}
                  className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2. ALLEGATIONS & LEAKS</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Whistleblower statements and declassified claims.
                  </p>
                </div>

                <div 
                  onClick={() => { setActiveTab('theories'); sound.click(); }}
                  className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-1">
                    <Brain className="w-4 h-4" />
                    <span>3. SPECULATIVE THEORIES</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Alternative explanations and cover-up motives.
                  </p>
                </div>

                <div 
                  onClick={() => { setActiveTab('ai_analysis'); sound.click(); }}
                  className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>4. AI FORENSIC AUDIT</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Gemini cross-examiner and contradiction detector.
                  </p>
                </div>
              </div>

              {/* Tags */}
              {currentCase.tags && currentCase.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentCase.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-cyan-300">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 1: CONFIRMED FACTS & OFFICIAL RECORD */}
          {activeTab === 'facts' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                    PRIMARY VERIFIED FACTS & CHAIN OF CUSTODY
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    These points are validated through officially declassified government documents, FOIA releases, ballistic forensics, public transcripts, or undisputed historical records.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(currentCase.whatWeKnow || []).map((fact, index) => (
                  <div key={index} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 shrink-0 mt-0.5">
                      FACT #{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>

              {/* Official Inquest Verdict */}
              <div className="p-5 rounded-xl bg-[#070A14] border border-gray-800">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
                  OFFICIAL GOVERNMENT / INQUEST STANCE
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  {currentCase.officialVerdict}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ALLEGATIONS & WHISTLEBLOWER LEAKS */}
          {activeTab === 'allegations' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                    UNREDACTED ALLEGATIONS, TESTIMONIES & WHISTLEBLOWER CLAIMS
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    Claims provided by eyewitnesses, former intelligence personnel, investigative reporters, or declassified informants that remain unacknowledged or disputed by official authorities.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#090D1A] border border-amber-500/30">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                    CENTRAL WHISTLEBLOWER / INFORMANTS CLAIM:
                  </h4>
                  <p className="text-sm font-mono text-white leading-relaxed">
                    "{currentCase.claim}"
                  </p>
                  {currentCase.claimOrigin && (
                    <p className="text-xs text-gray-400 font-mono mt-3 pt-2 border-t border-gray-800">
                      Provenance: {currentCase.claimOrigin}
                    </p>
                  )}
                </div>

                {/* Supporting evidence snippet highlights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                    CORROBORATING TESTIMONY & WITNESS EXHIBITS
                  </h4>
                  {currentCase.evidenceList?.filter(e => e.isSupporting).map((ev) => (
                    <div key={ev.id} className="p-4 rounded-xl bg-[#070A14] border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-300">{ev.title}</span>
                        <StatusBadge status={ev.rating} size="sm" />
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{ev.summary}</p>
                      {ev.provenance && (
                        <p className="text-[10px] text-gray-500 font-mono">Provenance: {ev.provenance}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECULATIVE THEORIES & HYPOTHESES */}
          {activeTab === 'theories' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                    SPECULATIVE THEORIES, ALTERNATIVE NARRATIVES & ANOMALIES
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    Unverified hypotheses, speculative explanations, motive analyses, and fringe angles proposed by researchers and community analysts.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(currentCase.speculations || []).map((spec, index) => (
                  <div key={index} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-xs font-bold border border-purple-500/30 shrink-0 mt-0.5">
                      HYPOTHESIS #{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                      {spec}
                    </p>
                  </div>
                ))}
              </div>

              {/* Counter Evidence & Skeptical Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>COUNTER-EVIDENCE & DEBUNKING FACTORS</span>
                </h4>
                {currentCase.evidenceList?.filter(e => !e.isSupporting).map((ev) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-[#070A14] border border-rose-950/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-rose-300">{ev.title}</span>
                      <StatusBadge status={ev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{ev.summary}</p>
                    {ev.provenance && (
                      <p className="text-[10px] text-gray-500 font-mono">Counter Source: {ev.provenance}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI FORENSIC ANALYSIS & CROSS-EXAMINATION */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                    GEMINI AI ADVERSARIAL FORENSIC CROSS-EXAMINER
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    Execute automated logical fallacy audits, chain-of-custody checks, probability assessments, and adversarial interrogations on this dossier.
                  </p>
                </div>
              </div>

              <AICrossExaminer caseFile={currentCase} onRewardXp={onRewardXp} />
            </div>
          )}

          {/* TAB 5: PRIMARY EVIDENCE & SOURCES VAULT */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              
              {/* Evidence Filter Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div className="flex gap-2 text-xs font-mono">
                  <button
                    onClick={() => setEvidenceFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      evidenceFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold' : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    All Exhibits ({(currentCase.evidenceList || []).length})
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('SUPPORTING')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      evidenceFilter === 'SUPPORTING' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold' : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    Supporting ({(currentCase.evidenceList || []).filter(e => e.isSupporting).length})
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('COUNTER')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      evidenceFilter === 'COUNTER' ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold' : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    Counter ({(currentCase.evidenceList || []).filter(e => !e.isSupporting).length})
                  </button>
                </div>

                <span className="text-[11px] font-mono text-gray-500">
                  {filteredEvidence.length} Exhibits Indexed
                </span>
              </div>

              {/* Elevated Evidence Cards */}
              <div className="space-y-4">
                {filteredEvidence.map((ev) => (
                  <div key={ev.id} className="p-5 rounded-xl bg-[#090D1A] border border-gray-800 space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-800/80">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
                          ev.isSupporting 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {ev.isSupporting ? 'SUPPORTING EXHIBIT' : 'COUNTER EVIDENCE'}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-cyan-300 border border-gray-700">
                          {ev.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <StatusBadge status={ev.rating} size="sm" />
                    </div>

                    <h4 className="text-sm font-mono font-bold text-white">
                      {ev.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                      {ev.summary}
                    </p>

                    {ev.provenance && (
                      <div className="p-2.5 rounded-lg bg-[#04060C] border border-gray-800/80 text-[11px] font-mono text-gray-400 flex items-center justify-between">
                        <span><strong>ARCHIVAL PROVENANCE:</strong> {ev.provenance}</span>
                        {ev.url && (
                          <a 
                            href={ev.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
                          >
                            <span>View Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Primary Document Viewer Section */}
              {currentCase.documents && currentCase.documents.length > 0 && (
                <div className="pt-6 border-t border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>DECLASSIFIED PRIMARY DOCUMENT VIEWER</span>
                    </h4>

                    {/* Document Selector */}
                    {currentCase.documents.length > 1 && (
                      <div className="flex gap-1 overflow-x-auto">
                        {currentCase.documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className={`px-2.5 py-1 text-xs font-mono rounded ${
                              selectedDocId === doc.id 
                                ? 'bg-cyan-500 text-black font-bold' 
                                : 'bg-gray-900 text-gray-400 hover:text-white'
                            }`}
                          >
                            {doc.title.substring(0, 20)}...
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedDocument && (
                    <PrimaryDocumentViewer document={selectedDocument} />
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 6: TIMELINE & CHRONOLOGY */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30">
                <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                  HISTORICAL CHRONOLOGY & DECLASSIFIED TIMELINE
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Chronological progression of key events, leaks, investigations, and declassifications.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-cyan-500/30">
                {(currentCase.timeline || []).map((t, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#04060C] shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                    
                    <div className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 group-hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-1 text-xs font-mono">
                        <span className="font-bold text-cyan-400">{t.date}</span>
                        {t.location && (
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{t.location}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold font-mono text-white mb-1.5">{t.event}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{t.details}</p>
                      {t.source && (
                        <p className="text-[10px] text-gray-500 font-mono mt-2 pt-1 border-t border-gray-800">Source: {t.source}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: RABBIT HOLE CONNECTIONS */}
          {activeTab === 'rabbithole' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30">
                <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">
                  INTERCONNECTED KNOWLEDGE NETWORK
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Click any connected case or entity to immediately explore its declassified dossier or jump to the interactive graph.
                </p>
              </div>

              {/* Connected Cases */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  LINKED DOSSIERS ({(currentCase.connectedCaseIds || []).length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentCase.connectedCaseIds || []).map((connId) => (
                    <div
                      key={connId}
                      onClick={() => { onJumpCase(connId); sound.click(); }}
                      className="p-3.5 rounded-xl bg-[#070A14] border border-gray-800 hover:border-cyan-400 hover:bg-[#0D1220] cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 uppercase">
                          {connId.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Key Figures & Agencies */}
              {currentCase.relatedEntities && currentCase.relatedEntities.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    KEY PRINCIPALS & AGENCIES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentCase.relatedEntities.map((ent, idx) => (
                      <div
                        key={idx}
                        onClick={() => onJumpGraphEntity?.(ent.name)}
                        className="p-3 rounded-xl bg-[#070A14] border border-gray-800 hover:border-amber-400 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1">
                          <span>{ent.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">{ent.type}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{ent.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: COMMUNITY DEBATES & TACTICAL BRIEFS */}
          {activeTab === 'discussions' && (
            <div className="space-y-6">
              
              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>PUBLISH TACTICAL ARGUMENT / FORENSIC CRITIQUE</span>
                  </h4>
                  
                  {/* Stance Selector */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-[10px] text-gray-400 hidden sm:inline">STANCE:</span>
                    <select
                      value={newCommentStance}
                      onChange={(e) => setNewCommentStance(e.target.value as any)}
                      className="bg-gray-900 border border-gray-700 text-cyan-300 text-xs rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="SUPPORTING">Supporting Theory</option>
                      <option value="SKEPTICAL">Skeptical Critique</option>
                      <option value="NEUTRAL">Neutral Evidence</option>
                      <option value="DEVILS_ADVOCATE">Devil's Advocate</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="State your evidence-based argument, dispute a primary source, or offer corroborating testimony..."
                  className="w-full h-24 p-3 rounded-lg bg-[#04060C] border border-gray-800 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono resize-none"
                />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Image Upload Button */}
                      <input 
                        type="file" 
                        ref={commentFileInputRef} 
                        onChange={handleCommentImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => commentFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-mono flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{attachedCommentImage ? 'Photo Attached' : 'Attach Photo'}</span>
                      </button>

                      {/* Video Upload Button */}
                      <input 
                        type="file" 
                        ref={commentVideoInputRef} 
                        onChange={handleCommentVideoUpload} 
                        accept="video/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => commentVideoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-mono flex items-center gap-1.5"
                      >
                        <Film className="w-3.5 h-3.5 text-rose-400" />
                        <span>{attachedCommentVideo ? 'Video Attached' : 'Attach Video'}</span>
                      </button>

                      {/* Toggle Video Link Input */}
                      <button
                        type="button"
                        onClick={() => setShowVideoInput(!showVideoInput)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
                          showVideoInput || commentVideoUrlInput 
                            ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>YouTube / Link</span>
                      </button>

                      {(attachedCommentImage || attachedCommentVideo || commentVideoUrlInput) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAttachedCommentImage(null);
                            setAttachedCommentVideo(null);
                            setCommentVideoUrlInput('');
                            setShowVideoInput(false);
                          }}
                          className="text-[10px] font-mono text-rose-400 hover:underline px-1"
                        >
                          Clear Media
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!newCommentText.trim() && !attachedCommentImage && !attachedCommentVideo && !commentVideoUrlInput.trim()}
                      className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-mono text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Argument</span>
                    </button>
                  </div>

                  {/* Video URL Input Field */}
                  {showVideoInput && (
                    <input
                      type="url"
                      value={commentVideoUrlInput}
                      onChange={(e) => setCommentVideoUrlInput(e.target.value)}
                      placeholder="Paste YouTube or video URL (e.g. https://youtu.be/...)"
                      className="w-full px-3 py-1.5 bg-[#04060C] border border-rose-500/40 rounded-lg text-xs text-rose-300 placeholder-gray-600 focus:outline-none focus:border-rose-400 font-mono"
                    />
                  )}

                  {/* Preview if attached */}
                  {(attachedCommentImage || attachedCommentVideo || commentVideoUrlInput.trim()) && (
                    <div className="p-2.5 rounded-lg bg-[#04060C] border border-gray-800">
                      <MediaAttachmentViewer
                        imageUrl={attachedCommentImage || undefined}
                        videoUrl={attachedCommentVideo || (commentVideoUrlInput.trim() ? commentVideoUrlInput.trim() : undefined)}
                        allowZoom={false}
                      />
                    </div>
                  )}
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-[#090D1A] border border-gray-800 text-xs font-mono text-gray-500">
                    No debate arguments filed yet. Be the first investigator to post!
                  </div>
                ) : (
                  comments.map((comm) => {
                    const presetObj = comm.authorBadge ? TACTICAL_AVATAR_PRESETS.find(p => p.id === comm.authorBadge) : null;
                    return (
                      <div key={comm.id} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2.5">
                            {/* Author Avatar Thumbnail */}
                            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0">
                              {comm.authorAvatar ? (
                                <img src={comm.authorAvatar} alt={comm.authorCallsign} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : presetObj ? (
                                <span className="text-sm">{presetObj.icon}</span>
                              ) : (
                                <span className="text-[10px] font-bold text-cyan-400 font-mono">
                                  {(comm.authorName || comm.authorCallsign || 'OP').substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-white">{comm.authorCallsign || comm.authorName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-900 text-cyan-400 border border-gray-800">
                                {comm.authorRank}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                comm.stance === 'SUPPORTING' ? 'bg-emerald-950 text-emerald-400' :
                                comm.stance === 'SKEPTICAL' ? 'bg-rose-950 text-rose-400' :
                                comm.stance === 'DEVILS_ADVOCATE' ? 'bg-purple-950 text-purple-400' :
                                'bg-gray-800 text-gray-300'
                              }`}>
                                {comm.stance}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                      <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
                        {comm.content}
                      </p>

                      {/* Render photos, video embeds, and attachment collections */}
                      {(comm.imageUrl || comm.videoUrl || (comm.attachments && comm.attachments.length > 0)) && (
                        <div className="mt-2">
                          <MediaAttachmentViewer
                            imageUrl={comm.imageUrl}
                            videoUrl={comm.videoUrl}
                            attachments={comm.attachments}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2 text-xs font-mono text-gray-400">
                        <button
                          onClick={() => handleVoteComment(comm.id, 'up')}
                          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{comm.upvotes || 0}</span>
                        </button>
                        <button
                          onClick={() => handleVoteComment(comm.id, 'down')}
                          className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                          <span>{comm.downvotes || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
