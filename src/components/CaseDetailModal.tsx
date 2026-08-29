import { AddToWorkspaceModal } from './AddToWorkspaceModal';
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
import { ApiService } from '../services/apiService';
import { ArchiveEvidence } from '../types';
import { EntitiesView } from './EntitiesView';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { StatusBadge } from './StatusBadge';
import { PrimaryDocumentViewer } from './PrimaryDocumentViewer';
import { TimelineView } from './TimelineView';
import { DiscussionsView } from './DiscussionsView';
import { MediaAttachmentViewer } from './MediaAttachmentViewer';
import { FirestoreService } from '../services/firestoreService';
import { processImageUpload } from '../utils/imageUpload';
import { processVideoUpload } from '../utils/mediaUtils';
import { TACTICAL_AVATAR_PRESETS } from '../data/avatarPresets';
import { 
  FolderArchive,
  X, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Building, 
  MapPin, 
  HelpCircle, 
  XCircle, 
  Calendar, 
  Building2, 
  Users, 
  FileText, Database, 
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
  onReputationEarned: (amount: number, reason: string, persist?: boolean) => void;
  onJumpGraphEntity?: (entityName: string) => void;
  currentUser?: UserProfile | null;
  onOpenDirectMessageWithUser?: (authorUid: string, authorName: string, authorCallsign: string) => void;
  onRandomRabbitHole?: () => void;
  onOpenEntity?: (type: string, id: string) => void;
  onOpenEvent?: (id: string) => void;
  onOpenEvidence?: (id: string) => void;
}

export const CaseDetailModal: React.FC<Props> = ({
  caseFile,
  onClose,
  onJumpCase,
  isBookmarked,
  onToggleBookmark,
  onReputationEarned,
  onJumpGraphEntity,
  currentUser,
  onOpenDirectMessageWithUser,
  onRandomRabbitHole,
  onOpenEntity,
  onOpenEvent,
  onOpenEvidence
}) => {
  // Master investigative view tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'facts' | 'allegations' | 'theories' | 'evidence' | 'timeline' | 'people' | 'organisations' | 'locations' | 'rabbithole' | 'discussions'
  >('overview');
  
  const [isAddingToWorkspace, setIsAddingToWorkspace] = useState(false);
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
  
  const [caseEvidence, setCaseEvidence] = useState<ArchiveEvidence[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<ArchiveEvidence | null>(null);
  
  useEffect(() => {
    ApiService.getEvidence({ caseFileId: caseFile.id })
      .then(data => setCaseEvidence(data.items || data))
      .catch(err => console.error("Failed to load case evidence", err));
  }, [caseFile.id]);

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
    
    // Fetch full case details including evidenceList and connectedCaseIds
    import('../services/apiService').then(({ ApiService }) => {
      ApiService.getCase(caseFile.id)
        .then(fullCase => {
          if (fullCase) {
            setCurrentCase({
              ...fullCase,
              whatWeKnow: fullCase.whatWeKnow || caseFile.whatWeKnow || [],
              speculations: fullCase.speculations || caseFile.speculations || [],
              timeline: fullCase.timeline || (fullCase.events && fullCase.events.length > 0 ? fullCase.events.map((e) => ({
                id: e.event?.id || e.id,
                date: e.event?.dateString || 'Unknown',
                title: e.event?.title || 'Unknown Event',
                description: e.event?.description || '',
                rating: e.event?.verificationStatus || 'UNVERIFIED',
                location: e.event?.location
              })) : caseFile.timeline) || [],
              documents: fullCase.documents || caseFile.documents || []
            });
          }
        })
        .catch(err => console.error("Failed to load full case dossier", err));
    });
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
      onReputationEarned(15, `Evaluated case ${currentCase.caseNumber}`, true);
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
      onReputationEarned(25, `Submitted conviction score on ${currentCase.caseNumber}`, true);
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
      onReputationEarned(35, `Published tactical debate argument in ${currentCase.caseNumber}`, true);
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
                title="Open secure direct communication with author"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">DM Theorist</span>
              </button>
            )}

            {onRandomRabbitHole && (
              <button
                onClick={() => {
                  if (onRandomRabbitHole) onRandomRabbitHole();
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

            {currentUser && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsAddingToWorkspace(true); }}
                className="p-1.5 border border-white/10 rounded hover:bg-white/[0.02] text-gray-400 hover:text-cyan-400 transition-colors"
                title="Add to Workspace"
              >
                <FolderArchive className="w-4 h-4" />
              </button>
            )}
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
            <div className="mt-2 px-3 py-2 rounded-lg bg-black/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
              <span className="text-cyan-400 font-bold">EPISTEMIC PRINCIPLE:</span>
              <span className="text-gray-300 italic text-center sm:text-left">
                "Cipher Files does not endorse the theories presented in this dossier. Here is the evidence. Investigate it yourself."
              </span>
              <span className="hidden sm:inline text-gray-500">PRIMARY SOURCES ONLY</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white mb-1 break-words">
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
                <span className="font-bold text-white uppercase">COMMUNITY OPINION (NOT VERIFIED FACT)</span>
                <span className="text-cyan-300 font-bold">({localBeliefScore}%)</span>
              </div>
              <span className="text-[11px] text-gray-400">
                {localBeliefScore > 80 ? 'Strong Community Belief' : localBeliefScore > 40 ? 'Divided Community Opinion' : 'High Community Skepticism'}
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
        <div className="flex items-center gap-2 px-4 sm:px-6 border-b border-gray-800 bg-[#050810] overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar pb-1 pt-1">
          
          <button
            onClick={() => { setActiveTab('overview'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. CASE IDENTITY</span>
          </button>

          <button
            onClick={() => { setActiveTab('facts'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'facts'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-gray-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. WHAT IS KNOWN ({(currentCase.whatWeKnow || []).length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('evidence'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. SUPPORTING EVIDENCE ({(currentCase.evidenceList || []).length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('timeline'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>4. TIMELINE</span>
          </button>

          <div className="w-px h-5 bg-gray-800 mx-1 flex-shrink-0"></div>
          
          <button
            onClick={() => { setActiveTab('people'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'people'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>People</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('organisations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'organisations'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Orgs</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('locations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'locations'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locations</span>
          </button>

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

          <div className="w-px h-5 bg-gray-800 mx-1 flex-shrink-0"></div>

          <button
            onClick={() => { setActiveTab('allegations'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'allegations'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-gray-400 hover:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>ALLEGATIONS</span>
          </button>

          <button
            onClick={() => { setActiveTab('theories'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'theories'
                ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-gray-400 hover:text-purple-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>SPECULATION</span>
          </button>

          <div className="w-px h-5 bg-gray-800 mx-1 flex-shrink-0"></div>

          <button
            onClick={() => { setActiveTab('discussions'); sound.click(); }}
            className={`px-3.5 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'discussions'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMUNITY OPINION ({(currentCase.discussions || []).length})</span>
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
                <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Quote className="w-4 h-4 text-amber-400" />
                      <span>THE CORE HYPOTHESIS</span>
                      {(currentCase.status === 'ALLEGED' || currentCase.status === 'UNVERIFIED' || currentCase.status === 'DISPUTED') && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 border border-amber-500/50 text-amber-500 rounded bg-amber-950/30">UNVERIFIED SPECULATION</span>
                      )}
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
                    <span>2. WHAT IS KNOWN</span>
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
                    <span>ALLEGATIONS & LEAKS</span>
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
                    <span>SPECULATIVE THEORIES</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    Alternative explanations and cover-up motives.
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

                  {/* TAB: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <TimelineView entityType="case_files" entityId={currentCase.id} onOpenEvent={onOpenEvent} />
          </div>
        )}
        {/* TAB: PEOPLE */}
        {activeTab === 'people' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">PERSONS OF INTEREST</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e) => e.type === 'PERSON').map((ent, idx) => (
                <div key={idx} onClick={() => onOpenEntity?.('PERSON', ent.id)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-cyan-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-white">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
              {(currentCase.entities || []).filter((e) => e.type === 'PERSON').length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500 font-mono text-xs">NO KNOWN PERSONS OF INTEREST</div>
              )}
            </div>
          </div>
        )}
        {/* TAB: ORGANISATIONS */}
        {activeTab === 'organisations' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">INVOLVED ORGANISATIONS</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e) => e.type === 'ORGANISATION').map((ent, idx) => (
                <div key={idx} onClick={() => onOpenEntity?.('ORGANISATION', ent.id)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-amber-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-amber-400">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB: LOCATIONS */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase mb-1">KEY LOCATIONS</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentCase.entities || []).filter((e) => e.type === 'LOCATION').map((ent, idx) => (
                <div key={idx} onClick={() => onOpenEntity?.('LOCATION', ent.id)} className="p-4 rounded-xl bg-[#090D1A] border border-gray-800 hover:border-blue-400 cursor-pointer transition-colors">
                  <h4 className="text-sm font-mono font-bold text-blue-400">{ent.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ent.role || ent.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB: RABBIT HOLE */}
        {activeTab === 'rabbithole' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/30">
              <h3 className="font-mono text-sm font-bold text-white uppercase mb-1">RABBIT HOLE CONNECTIONS</h3>
            </div>
            <div className="flex justify-center mt-6">
               <button
                   onClick={() => { if (onRandomRabbitHole) onRandomRabbitHole(); }}
                   className="px-6 py-3 bg-cyan-900/40 border border-cyan-500/50 hover:bg-cyan-800/60 text-cyan-300 font-mono font-bold transition-colors shadow-lg"
               >
                  ENTER THE NEXUS FOR THIS CASE
               </button>
            </div>
          </div>
        )}
        {/* TAB 8: DISCUSSIONS */}
        {activeTab === 'discussions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <DiscussionsView entityType="CASE" entityId={currentCase.id} />
          </div>
        )}
                  {/* PHASE 2 EVIDENCE ARCHIVE TAB */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#090D1A] border border-gray-800 rounded-xl p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  EVIDENCE REPOSITORY
                </h3>
              </div>
                            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentCase.evidenceList || []).length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-gray-500 font-mono text-sm border border-dashed border-gray-800 rounded-xl">
                    No verified evidence items attached to this dossier yet.
                  </div>
                ) : (
                  (currentCase.evidenceList || []).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => { if (onOpenEvidence) onOpenEvidence(item.id); }}
                      className="bg-[#050810] border border-gray-800 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-colors"
                    >
                      <h4 className="text-sm font-bold text-white mb-2 leading-tight">{item.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{item.summary || item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
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

        </div>
      </div>
    </div>
  );
};
