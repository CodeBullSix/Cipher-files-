import React, { useState, useEffect, useRef } from 'react';
import { DiscussionThread, CaseFile, Comment, UserProfile, MediaAttachment } from '../types';
import { ArchiveEvidence } from '../types';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { Database } from 'lucide-react';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestoreService';
import { UserAvatar } from './UserAvatar';
import { MediaAttachmentViewer } from './MediaAttachmentViewer';
import { processImageUpload } from '../utils/imageUpload';
import { processVideoUpload, parseMediaUrl } from '../utils/mediaUtils';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  ThumbsUp, 
  ThumbsDown,
  Eye, 
  Tag, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Filter, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Quote, 
  Send, 
  Share2, 
  Bookmark, 
  Scale, 
  HelpCircle,
  Flame,
  Award,
  Pin,
  Image as ImageIcon,
  Film,
  Video,
  UploadCloud,
  CornerDownRight,
  Reply,
  Maximize2,
  TrendingUp,
  Lock
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  cases: CaseFile[];
  currentUser?: UserProfile | null;
  onOpenCase: (caseId: string) => void;
  onRewardXp: (amount: number, reason: string) => void;
  initialThreadId?: string | null;
}

export const DiscussionsView: React.FC<Props> = ({ 
  cases, 
  currentUser, 
  onOpenCase, 
  onRewardXp,
  initialThreadId = null
}) => {
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(StorageService.getDiscussions());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSourceId, setSearchSourceId] = useState<string>('ALL');
  const [searchTheoryType, setSearchTheoryType] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'THEORY_DEBATES' | 'NEW_EVIDENCE' | 'SITE_ANNOUNCEMENTS'>('ALL');
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'PHOTOS' | 'VIDEOS'>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'active' | 'upvotes'>('recent');
  
  // Selected Active Thread for full reading & reply
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId);
  const [threadComments, setThreadComments] = useState<Comment[]>([]);
  const [threadEvidence, setThreadEvidence] = useState<any[]>([]);
  const [selectedArchiveEvidence, setSelectedArchiveEvidence] = useState<any | null>(null);
  const [newDiscussionEvidence, setNewDiscussionEvidence] = useState<any[]>([]);

  
  // Stance filter inside thread
  const [replyStanceFilter, setReplyStanceFilter] = useState<'ALL' | 'SUPPORTING' | 'SKEPTICAL' | 'NEUTRAL' | 'DEVILS_ADVOCATE'>('ALL');

  // Replying to a specific comment
  const [replyingToComment, setReplyingToComment] = useState<{ id: string; authorName: string } | null>(null);

  // Reply Form State
  const [replyContent, setReplyContent] = useState('');
  const [replyStance, setReplyStance] = useState<'SUPPORTING' | 'SKEPTICAL' | 'NEUTRAL' | 'DEVILS_ADVOCATE'>('SUPPORTING');
  const [replyCitedSource, setReplyCitedSource] = useState('');
  const [replyMediaUrl, setReplyMediaUrl] = useState('');
  const [replyUploadedImage, setReplyUploadedImage] = useState<string | null>(null);
  const [replyUploadedVideo, setReplyUploadedVideo] = useState<string | null>(null);
  const [isUploadingReplyMedia, setIsUploadingReplyMedia] = useState(false);
  const [showReplyMediaInput, setShowReplyMediaInput] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // New Thread Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaseId, setNewCaseId] = useState(cases[0]?.id || 'jfk-assassination');
  const [newCategory, setNewCategory] = useState<'THEORY_DEBATES' | 'NEW_EVIDENCE' | 'SITE_ANNOUNCEMENTS'>('THEORY_DEBATES');
  const [newInitialComment, setNewInitialComment] = useState('');
  const [newTagsText, setNewTagsText] = useState('Forensics, Archival Records, Primary Evidence');
  
  // New Thread Media Attachments
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newUploadedImage, setNewUploadedImage] = useState<string | null>(null);
  const [newUploadedVideo, setNewUploadedVideo] = useState<string | null>(null);
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [isUploadingNewMedia, setIsUploadingNewMedia] = useState(false);

  // File input refs
  const threadImageInputRef = useRef<HTMLInputElement>(null);
  const threadVideoInputRef = useRef<HTMLInputElement>(null);
  const replyImageInputRef = useRef<HTMLInputElement>(null);
  const replyVideoInputRef = useRef<HTMLInputElement>(null);

  // 1. Sync discussions from API
  useEffect(() => {
    let mounted = true;
    import('../services/apiService').then(({ ApiService }) => {
      ApiService.getDiscussions().then(list => {
        if (mounted) {
          // Map API data to UI format
          const mapped = list.map((item: any) => ({
            id: item.id,
            caseId: item.caseFileId || '',
            title: item.title,
            initialComment: item.content,
            authorUid: item.author?.uid,
            authorName: item.author?.displayName || 'Unknown',
            authorAvatar: item.author?.avatar,
            createdAt: item.createdAt,
            locked: item.locked,
            deletedAt: item.deletedAt,
            commentCount: 0, // We could fetch this or leave it as 0
            viewCount: 0,
            upvotes: 0,
            tags: [],
          }));
          setDiscussions(mapped);
        }
      }).catch(console.error);
    });
    return () => { mounted = false; };
  }, []);

  // 2. Sync thread comments whenever activeThreadId changes
  useEffect(() => {
    let mounted = true;
    if (activeThreadId) {
      import('../services/apiService').then(({ ApiService }) => {
        
        import('../services/apiService').then(({ ApiService }) => {
          ApiService.getDiscussionEvidence(activeThreadId).then(ev => {
            if (mounted) setThreadEvidence(ev);
          }).catch(err => console.error(err));
        });

          ApiService.getReplies(activeThreadId).then(comms => {
          if (mounted) {
            const mapped = comms.map((c: any) => ({
              id: c.id,
              threadId: activeThreadId,
              authorUid: c.author?.uid,
              authorName: c.author?.displayName || 'Unknown',
              authorAvatar: c.author?.avatar,
              content: c.content,
              timestamp: c.createdAt,
              deletedAt: c.deletedAt,
              upvotes: 0,
              downvotes: 0
            }));
            setThreadComments(mapped);
          }
        }).catch(console.error);
      });
    } else {
      setThreadComments([]);
    }
    return () => { mounted = false; };
  }, [activeThreadId]);

  const activeThread = activeThreadId ? discussions.find(d => d.id === activeThreadId) : null;
  const activeLinkedCase = activeThread ? cases.find(c => c.id === activeThread.caseId) : null;

  const allTags = Array.from(new Set(discussions.flatMap(d => d.tags || [])));

  // Handle upvote on discussion thread
  // Handle upvote on discussion thread
  const handleVoteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    sound.click();
    try {
      const { ApiService } = await import('../services/apiService');
      await ApiService.voteDiscussion(threadId, 1);
      setDiscussions(prev => prev.map(d => d.id === threadId ? { ...d, upvotes: (d.upvotes || 0) + 1, userVote: 'up' } : d));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoteReply = async (commentId: string, dir: 'up' | 'down') => {
    sound.click();
  };

  const handleThreadImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewMedia(true);
      const dataUrl = await processImageUpload(file);
      setNewUploadedImage(dataUrl);
      setNewUploadedVideo(null);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingNewMedia(false);
    }
  };

  const handleThreadVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewMedia(true);
      const dataUrl = await processVideoUpload(file);
      setNewUploadedVideo(dataUrl);
      setNewUploadedImage(null);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingNewMedia(false);
    }
  };

  const handleReplyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSubmittingReply(true);
      const dataUrl = await processImageUpload(file);
      setReplyUploadedImage(dataUrl);
      setReplyUploadedVideo(null);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplyVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSubmittingReply(true);
      const dataUrl = await processVideoUpload(file);
      setReplyUploadedVideo(dataUrl);
      setReplyUploadedImage(null);
      sound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInitialComment.trim()) return;

    sound.click();
    const tags = newTagsText.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const { ApiService } = await import('../services/apiService');
      const apiResp = await ApiService.createDiscussion({
        title: newTitle.trim(),
        content: newInitialComment.trim(),
        caseFileId: newCaseId,
        tags: tags
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewInitialComment('');
      setNewUploadedImage(null);
      setNewUploadedVideo(null);
      setNewMediaUrl('');
      setNewMediaCaption('');
      setNewTagsText('');
      setNewDiscussionEvidence([]);
      
      setDiscussions(prev => [{
        id: apiResp.id,
        title: apiResp.title,
        initialComment: apiResp.content,
        authorName: currentUser?.displayName || 'Unknown',
        authorUid: currentUser?.uid,
        createdAt: apiResp.createdAt,
        upvotes: 0,
        commentCount: 0,
        tags: tags
      }, ...prev]);
      onRewardXp(50, 'Published new research inquiry');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyContent.trim() || !activeThreadId) return;

    sound.click();
    setIsSubmittingReply(true);

    try {
      const { ApiService } = await import('../services/apiService');
      const apiResp = await ApiService.createReply(activeThreadId, replyContent.trim());
      setReplyContent('');
      
      setThreadComments(prev => [...prev, {
        id: apiResp.id,
        threadId: activeThreadId,
        content: apiResp.content,
        authorName: currentUser?.displayName || 'Unknown',
        timestamp: apiResp.createdAt,
        upvotes: 0,
        downvotes: 0
      }]);
      onRewardXp(30, 'Published peer review critique');
    } catch (err) {
      console.error(err);
      alert('Unable to post reply. Discussion may be locked.');
    } finally {
      setIsSubmittingReply(false);
      setReplyContent('');
      setReplyCitedSource('');
      setReplyMediaUrl('');
      setReplyUploadedImage(null);
      setReplyUploadedVideo(null);
      setShowReplyMediaInput(false);
      setReplyingToComment(null);
    }
  };

  // Filter and sort discussions
  const filteredDiscussions = discussions
    .filter(d => {
      // Category filter
      if (selectedCategory !== 'ALL' && d.category !== selectedCategory) {
        // Fallback: If a thread has no category, count it as THEORY_DEBATES to avoid hiding old threads, 
        // unless they are explicitly another category.
        if (!d.category && selectedCategory !== 'THEORY_DEBATES') return false;
        if (d.category && d.category !== selectedCategory) return false;
      }

      // Tag filter
      if (selectedTag !== 'ALL' && !d.tags?.includes(selectedTag)) return false;
      
      // Media filter
      if (mediaFilter === 'PHOTOS' && !d.imageUrl && !d.attachments?.some(a => a.type === 'image')) return false;
      if (mediaFilter === 'VIDEOS' && !d.videoUrl && !d.attachments?.some(a => a.type === 'video' || a.type === 'youtube')) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = d.title?.toLowerCase().includes(q);
        const inContent = d.initialComment?.toLowerCase().includes(q);
        const inAuthor = d.authorName?.toLowerCase().includes(q);
        const inTags = (d.tags || []).some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inContent && !inAuthor && !inTags) return false;
      }

      // Document Source filter
      if (searchSourceId !== 'ALL' && d.caseId !== searchSourceId) return false;

      // Theory Type filter
      if (searchTheoryType !== 'ALL') {
        const parentCase = cases.find(c => c.id === d.caseId);
        if (parentCase?.category !== searchTheoryType) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sortBy === 'active') return (b.commentCount || 0) - (a.commentCount || 0);
      if (sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

  // Filter thread replies
  const filteredComments = threadComments.filter(c => {
    if (replyStanceFilter === 'ALL') return true;
    return c.stance === replyStanceFilter;
  });

  // Build tree from filteredComments
  const buildCommentTree = (commentsList: typeof threadComments) => {
    const map = new Map<string, typeof threadComments[0] & { children: any[] }>();
    const roots: any[] = [];
    
    commentsList.forEach(c => {
      map.set(c.id, { ...c, children: [] });
    });
    
    commentsList.forEach(c => {
      if (c.replyToCommentId && map.has(c.replyToCommentId)) {
        map.get(c.replyToCommentId)!.children.push(map.get(c.id));
      } else {
        roots.push(map.get(c.id));
      }
    });
    
    return roots;
  };

  const nestedComments = buildCommentTree(filteredComments);

  const renderCommentNode = (comment: any, depth: number = 0) => {
    const stanceBadgeStyles = {
      SUPPORTING: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
      SKEPTICAL: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
      NEUTRAL: 'bg-slate-900 border-slate-700 text-slate-300',
      DEVILS_ADVOCATE: 'bg-purple-950/60 border-purple-500/40 text-purple-300'
    };

    const stanceLabels = {
      SUPPORTING: 'CORROBORATING DOCUMENT',
      SKEPTICAL: 'METHODOLOGICAL CRITIQUE',
      NEUTRAL: 'NEUTRAL EVIDENTIARY AUDIT',
      DEVILS_ADVOCATE: 'STRESS-TEST ARGUMENT'
    };
    
    return (
      <div key={comment.id} className={depth > 0 ? 'ml-3 sm:ml-8 mt-3 pl-3 sm:pl-5 border-l-2 border-gray-800/80 relative' : 'mt-4'}>
        {/* Subtle connector line for nested comments */}
        {depth > 0 && (
          <div className="absolute top-8 -left-[2px] w-4 h-px bg-gray-800/80" />
        )}
        
        <div className="p-4 sm:p-5 rounded-xl border border-gray-800/90 bg-[#070A12] hover:border-gray-700 transition-colors space-y-3">
          {/* Replying-to context callout */}
          {comment.replyToAuthorName && depth === 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/80 bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-500/20">
              <CornerDownRight className="w-3 h-3 text-cyan-400" />
              <span>Replying to <strong>@{comment.replyToAuthorName}</strong></span>
            </div>
          )}

          {/* Author row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <UserAvatar
                avatarUrl={comment.authorAvatar}
                name={comment.authorName}
                size="sm"
                showBadge
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-mono text-xs font-bold text-white">
                  {comment.authorName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400/80">
                    [{comment.authorCallsign || 'RESEARCHER'}]
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    ({(comment.authorRank || 'OBSERVER').replace(/_/g, ' ')})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${stanceBadgeStyles[comment.stance as keyof typeof stanceBadgeStyles] || stanceBadgeStyles.NEUTRAL}`}>
                {stanceLabels[comment.stance as keyof typeof stanceLabels] || stanceLabels.NEUTRAL}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {comment.createdAt}
              </span>
            </div>
          </div>

          {/* Cited Evidence Reference Callout */}
          {comment.citedEvidenceId && (
            <div className="px-3 py-1.5 rounded bg-black/60 border border-gray-800/80 flex items-center gap-2 text-xs font-mono text-gray-300">
              <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-gray-400 hidden sm:inline">CITED ARCHIVAL PROVENANCE:</span>
              <span className="text-cyan-300 font-semibold truncate">{comment.citedEvidenceId}</span>
            </div>
          )}

          {/* Content */}
          <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Comment Media Attachments (Photos / Videos) */}
          {(comment.imageUrl || comment.videoUrl || (comment.attachments && comment.attachments.length > 0)) && (
            <div className="pt-2">
              <MediaAttachmentViewer
                imageUrl={comment.imageUrl}
                videoUrl={comment.videoUrl}
                mediaType={comment.mediaType}
                attachments={comment.attachments}
              />
            </div>
          )}

          {/* Bottom actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-800/60 text-xs font-mono mt-3">
            <button
              onClick={() => {
                setReplyingToComment({ id: comment.id, authorName: comment.authorName });
                sound.click();
              }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-300 transition-colors cursor-pointer bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Reply to @{comment.authorName}</span>
            </button>

            <div className="flex items-center gap-4 bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800">
              <button
                onClick={() => handleVoteReply(comment.id, 'up')}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${comment.userVote === 'up' ? 'text-cyan-300 font-bold' : 'text-gray-400 hover:text-cyan-300'}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{comment.upvotes || 0}</span>
              </button>
              <div className="w-px h-3 bg-gray-800" />
              <button
                onClick={() => handleVoteReply(comment.id, 'down')}
                className="flex items-center gap-1.5 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{comment.downvotes || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Render children recursively */}
        {comment.children && comment.children.length > 0 && (
          <div className="flex flex-col relative z-10">
            {comment.children.map((child: any) => renderCommentNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. THREAD DETAIL VIEW (IF ACTIVE) */}
      {activeThread ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Return Navigation */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <button
              onClick={() => { setActiveThreadId(null); sound.click(); }}
              className="px-3 py-1.5 rounded-lg bg-[#0B0F19] hover:bg-[#121929] border border-gray-800 text-cyan-400 font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO ALL FORUM INQUIRIES</span>
            </button>

            {activeLinkedCase && (
              <button
                onClick={() => onOpenCase(activeLinkedCase.id)}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Examine Dossier: {activeLinkedCase.caseNumber}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Main Original Inquiry Post */}
          <article className="rounded-xl border border-gray-800 bg-[#090D18] p-6 sm:p-7 shadow-xl space-y-5">
            
            {/* Header / Author info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
              <div className="flex items-center gap-3">
                <UserAvatar
                  avatarUrl={activeThread.authorAvatar || activeThread.imageUrl}
                  name={activeThread.authorName}
                  size="md"
                  showBadge
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {activeThread.authorName}
                    </span>
                    {activeThread.authorRole && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-semibold uppercase">
                        {activeThread.authorRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    Rank: <strong className="text-gray-300">{(activeThread.authorRank || 'OBSERVER').replace(/_/g, ' ')}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>{activeThread.createdAt}</span>
                </span>
                {activeThread.isPinned && (
                  <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Pin className="w-3 h-3" /> PINNED INQUIRY
                  </span>
                )}
              </div>
            </div>

            {/* Title & Thesis */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {activeLinkedCase && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
                    <span>REFERENCED DOSSIER:</span>
                    <strong className="text-white">{activeLinkedCase.title}</strong>
                  </div>
                )}
                {(!activeThread.category || activeThread.category === 'THEORY_DEBATES') && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase">
                    THEORY DEBATE
                  </div>
                )}
                {activeThread.category === 'NEW_EVIDENCE' && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase">
                    NEW EVIDENCE
                  </div>
                )}
                {activeThread.category === 'SITE_ANNOUNCEMENTS' && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
                    SITE ANNOUNCEMENT
                  </div>
                )}
                {activeThread.locked && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-yellow-950/60 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-bold uppercase ml-2">
                    <Lock className="w-3.5 h-3.5" /> LOCKED
                  </div>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-black text-white leading-snug">
                {activeThread.title}
              </h1>
            </div>

            {/* Opening Argument Content */}
            <div className="p-4 rounded-lg bg-[#05070D] border border-gray-800 text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
              {activeThread.initialComment}
            </div>

            
            {/* PHASE 2 REFERENCED EVIDENCE */}
            {threadEvidence.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>REFERENCED EVIDENCE</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {threadEvidence.map(ev => (
                    <div 
                      key={ev.id} 
                      onClick={() => setSelectedArchiveEvidence(ev)}
                      className="p-3 bg-[#090D1A] border border-gray-800 rounded-lg hover:border-cyan-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          ev.status === 'VERIFIED' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          'bg-gray-400/10 text-gray-400 border-gray-400/20'
                        }`}>
                          {ev.status}
                        </span>
                        <span className="text-[10px] text-cyan-500 font-bold">{ev.stance}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1 leading-tight line-clamp-1">{ev.title}</h5>
                      <p className="text-xs text-gray-400 line-clamp-1">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ATTACHED PHOTOS & VIDEOS FORUM EXHIBITS */}
            {(activeThread.imageUrl || activeThread.videoUrl || (activeThread.attachments && activeThread.attachments.length > 0)) && (
              <div className="pt-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRIMARY EVIDENCE EXHIBITS & RECORDED FOOTAGE</span>
                </h4>
                <MediaAttachmentViewer
                  imageUrl={activeThread.imageUrl}
                  videoUrl={activeThread.videoUrl}
                  mediaType={activeThread.mediaType}
                  attachments={activeThread.attachments}
                />
              </div>
            )}

            {/* Tags & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80">
              <div className="flex flex-wrap gap-1.5">
                {(activeThread.tags || []).map(t => (
                  <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/50 border border-gray-800 text-cyan-400">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleVoteThread(e, activeThread.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeThread.userVote === 'up'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                      : 'bg-black/40 text-gray-300 border-gray-700 hover:border-cyan-500/40 hover:text-cyan-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeThread.upvotes || 0} Endorsements</span>
                </button>
                {/* Moderation Controls */}
                {(currentUser?.role === 'MODERATOR' || currentUser?.role === 'ADMIN') && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { ApiService } = await import('../services/apiService');
                        if (activeThread.locked) {
                          await ApiService.unlockDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, locked: false } : d));
                        } else {
                          await ApiService.lockDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, locked: true } : d));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-yellow-700 bg-yellow-900/20 text-yellow-300 text-xs font-mono transition-colors hover:bg-yellow-800/40"
                    >
                      {activeThread.locked ? 'Unlock' : 'Lock'}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { ApiService } = await import('../services/apiService');
                        if (activeThread.deletedAt) {
                          await ApiService.restoreDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, deletedAt: null } : d));
                        } else {
                          await ApiService.deleteDiscussion(activeThread.id);
                          setDiscussions(prev => prev.map(d => d.id === activeThread.id ? { ...d, deletedAt: new Date().toISOString() } : d));
                          setActiveThreadId(null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-700 bg-red-900/20 text-red-300 text-xs font-mono transition-colors hover:bg-red-800/40"
                    >
                      {activeThread.deletedAt ? 'Restore' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* 2. REPLIES & PEER REVIEWS SECTION */}
          <section className="space-y-4">
            
            {/* Replies Header and Stance Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
                  PEER EVALUATIONS & REVIEWS ({threadComments.length})
                </h3>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
                {(['ALL', 'SUPPORTING', 'SKEPTICAL', 'NEUTRAL', 'DEVILS_ADVOCATE'] as const).map(stance => (
                  <button
                    key={stance}
                    onClick={() => setReplyStanceFilter(stance)}
                    className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                      replyStanceFilter === stance
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {stance === 'ALL' && 'All Responses'}
                    {stance === 'SUPPORTING' && 'Corroborating'}
                    {stance === 'SKEPTICAL' && 'Skeptical Review'}
                    {stance === 'NEUTRAL' && 'Neutral Audit'}
                    {stance === 'DEVILS_ADVOCATE' && 'Stress-Test'}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Replies */}
            <div className="space-y-3">
              {filteredComments.length === 0 ? (
                <div className="p-8 rounded-xl border border-gray-800/80 bg-[#070A12] text-center text-gray-400 font-mono text-xs">
                  No peer reviews matching the selected filter. Be the first to contribute an evidentiary analysis with photo/video exhibits!
                </div>
              ) : (
                nestedComments.map((comment) => renderCommentNode(comment))
              )}
            </div>

            {/* 3. POST A PEER REVIEW FORM WITH PHOTO/VIDEO UPLOAD */}
            <div className="mt-6 rounded-xl border border-cyan-500/30 bg-[#070A14] p-5 sm:p-6 shadow-xl space-y-4">
              {activeThread.locked ? (
                <div className="text-center py-6 text-yellow-400 font-mono text-sm bg-yellow-950/20 border border-yellow-500/20 rounded-lg">
                  <Lock className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                  This discussion is locked. New replies are disabled.
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    profile={currentUser}
                    size="sm"
                    showBadge
                  />
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                      <span>CONTRIBUTE TO INVESTIGATIVE INQUIRY</span>
                      {replyingToComment && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                          Replying to @{replyingToComment.authorName}
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Posting as {currentUser?.displayName || 'Registered Investigator'}
                    </span>
                  </div>
                </div>

                {replyingToComment && (
                  <button
                    onClick={() => setReplyingToComment(null)}
                    className="text-[11px] font-mono text-gray-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Cancel Reply Context
                  </button>
                )}
              </div>

              <form onSubmit={handlePostReply} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 mb-1 font-semibold">
                      METHODOLOGICAL STANCE:
                    </label>
                    <select
                      value={replyStance}
                      onChange={(e) => setReplyStance(e.target.value as any)}
                      className="w-full bg-[#030509] border border-gray-700 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="SUPPORTING">Supporting (Corroborating Document)</option>
                      <option value="SKEPTICAL">Skeptical (Methodological Counter-Analysis)</option>
                      <option value="NEUTRAL">Neutral (Evidentiary Audit / Cross-Reference)</option>
                      <option value="DEVILS_ADVOCATE">Devil's Advocate (Stress-Test Hypotheses)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 mb-1 font-semibold">
                      CITED ARCHIVAL / FOIA PROVENANCE (OPTIONAL):
                    </label>
                    <input
                      type="text"
                      value={replyCitedSource}
                      onChange={(e) => setReplyCitedSource(e.target.value)}
                      placeholder="e.g. Church Committee Hearings Vol 7, p. 112"
                      className="w-full bg-[#030509] border border-gray-700 rounded-lg p-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-300 mb-1 font-semibold">
                    YOUR FORENSIC ANALYSIS & CITATION *
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Provide your reasoned evidentiary critique, citations, or corroboration..."
                    rows={4}
                    required
                    className="w-full bg-[#030509] border border-gray-700 rounded-lg p-3 text-xs sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                {/* MEDIA ATTACHMENTS BAR FOR REPLY */}
                <div className="p-3 rounded-lg bg-[#04060C] border border-gray-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-gray-400 font-semibold flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ATTACH PRIMARY SCAN OR VIDEO EXHIBIT (OPTIONAL)</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={replyImageInputRef} 
                        onChange={handleReplyImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <input 
                        type="file" 
                        ref={replyVideoInputRef} 
                        onChange={handleReplyVideoUpload} 
                        accept="video/*" 
                        className="hidden" 
                      />

                      <button
                        type="button"
                        onClick={() => replyImageInputRef.current?.click()}
                        disabled={isUploadingReplyMedia}
                        className="px-2.5 py-1 rounded bg-[#090D18] hover:bg-[#121929] border border-gray-700 text-gray-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload Photo/Scan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => replyVideoInputRef.current?.click()}
                        disabled={isUploadingReplyMedia}
                        className="px-2.5 py-1 rounded bg-[#090D18] hover:bg-[#121929] border border-gray-700 text-gray-300 hover:text-rose-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        <span>Upload Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowReplyMediaInput(!showReplyMediaInput)}
                        className="px-2.5 py-1 rounded bg-[#090D18] hover:bg-[#121929] border border-gray-700 text-cyan-400 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Paste URL / YouTube</span>
                      </button>
                    </div>
                  </div>

                  {showReplyMediaInput && (
                    <div className="pt-2 animate-in fade-in duration-150">
                      <input
                        type="url"
                        value={replyMediaUrl}
                        onChange={(e) => setReplyMediaUrl(e.target.value)}
                        placeholder="Paste image URL, YouTube video link (e.g. https://youtu.be/...), or MP4 link..."
                        className="w-full bg-[#020408] border border-gray-700 rounded-lg p-2 text-xs font-mono text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  {/* Reply Media Live Preview */}
                  {(replyUploadedImage || replyUploadedVideo || replyMediaUrl.trim()) && (
                    <div className="relative mt-2 p-2 rounded-lg bg-[#020408] border border-cyan-500/40">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-800 text-[10px] font-mono text-cyan-400 font-bold">
                        <span>ATTACHMENT LIVE PREVIEW:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyUploadedImage(null);
                            setReplyUploadedVideo(null);
                            setReplyMediaUrl('');
                          }}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Remove Exhibit
                        </button>
                      </div>
                      <MediaAttachmentViewer
                        imageUrl={replyUploadedImage || (replyMediaUrl.trim() ? replyMediaUrl.trim() : undefined)}
                        videoUrl={replyUploadedVideo || (replyMediaUrl.trim() ? replyMediaUrl.trim() : undefined)}
                        allowZoom={false}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !replyContent.trim()}
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>PUBLISH PEER REVIEW (+30 XP)</span>
                  </button>
                </div>
              </form>
              </>
              )}
            </div>

          </section>

        </div>
      ) : (
        /* 2. FORUM THREAD DIRECTORY / LIST VIEW */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]"></span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  PRIMARY INVESTIGATIVE DEBATE & AUDIT FLOOR
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                RESEARCH FORUMS & INQUIRIES
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-2xl">
                Rigorous, citation-backed primary evidence analysis, archival declassifications, and methodology debates. Attach photos, scans, and video exhibits.
              </p>
            </div>

            <button
              onClick={() => { setShowCreateModal(true); sound.click(); }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>INITIATE RESEARCH INQUIRY</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-800 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              ALL DISCUSSIONS
            </button>
            <button
              onClick={() => setSelectedCategory('THEORY_DEBATES')}
              className={`px-4 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedCategory === 'THEORY_DEBATES'
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              THEORY DEBATES
            </button>
            <button
              onClick={() => setSelectedCategory('NEW_EVIDENCE')}
              className={`px-4 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedCategory === 'NEW_EVIDENCE'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              NEW EVIDENCE
            </button>
            <button
              onClick={() => setSelectedCategory('SITE_ANNOUNCEMENTS')}
              className={`px-4 py-2.5 text-xs font-mono font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedCategory === 'SITE_ANNOUNCEMENTS'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              SITE ANNOUNCEMENTS
            </button>
          </div>

          {/* Filter, Search, and Sort Bar */}
          <div className="flex flex-col gap-3 bg-[#0A0E18] p-4 rounded-xl border border-gray-800 shadow-inner">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Keyword Search */}
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-[#05070D] border border-gray-700">
                <Search className="w-4 h-4 text-cyan-400/80" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forum inquiries, authors, citations, tags..."
                  className="w-full bg-transparent text-xs font-mono text-white focus:outline-none placeholder-gray-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {/* Document Source Select */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#05070D] border border-gray-700">
                <FileText className="w-4 h-4 text-purple-400/80" />
                <select
                  value={searchSourceId}
                  onChange={(e) => setSearchSourceId(e.target.value)}
                  className="bg-transparent text-xs font-mono text-gray-300 focus:outline-none cursor-pointer w-full md:w-auto"
                >
                  <option value="ALL">All Document Sources</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                  ))}
                </select>
              </div>

              {/* Theory Type Select */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#05070D] border border-gray-700">
                <Tag className="w-4 h-4 text-emerald-400/80" />
                <select
                  value={searchTheoryType}
                  onChange={(e) => setSearchTheoryType(e.target.value)}
                  className="bg-transparent text-xs font-mono text-gray-300 focus:outline-none cursor-pointer w-full md:w-auto"
                >
                  <option value="ALL">All Theory Types</option>
                  <option value="GOVERNMENT_INTELLIGENCE">Govt Intelligence</option>
                  <option value="UFOS_UAP">UFOs & UAP</option>
                  <option value="ANCIENT_MYSTERIES">Ancient Mysteries</option>
                  <option value="UNSOLVED">Unsolved Crimes</option>
                  <option value="MONEY_POWER">Money & Power</option>
                  <option value="GLOBAL_EVENTS">Global Events</option>
                  <option value="PSYCHOLOGY_CONTROL">Psychology & Control</option>
                  <option value="CRYPTIDS">Cryptids</option>
                  <option value="QUANTUM_REALITY">Quantum Reality</option>
                  <option value="SECRET_SOCIETIES">Secret Societies</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-gray-800/50">
              {/* Media Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#05070D] p-1 rounded-lg border border-gray-700 text-xs font-mono w-max">
                <button
                  onClick={() => setMediaFilter('ALL')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${mediaFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-gray-400 hover:text-white'}`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => setMediaFilter('PHOTOS')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${mediaFilter === 'PHOTOS' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-gray-400 hover:text-white'}`}
                >
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  <span>Photos</span>
                </button>
                <button
                  onClick={() => setMediaFilter('VIDEOS')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${mediaFilter === 'VIDEOS' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' : 'text-gray-400 hover:text-white'}`}
                >
                  <Film className="w-3 h-3 text-rose-400" />
                  <span>Videos</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#05070D] border border-gray-700 text-xs font-mono text-gray-300">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                >
                  <option value="recent" className="bg-[#0A0E18] text-white">Latest Activity</option>
                  <option value="active" className="bg-[#0A0E18] text-white">Most Peer Reviews</option>
                  <option value="upvotes" className="bg-[#0A0E18] text-white">Most Endorsed</option>
                </select>
              </div>
            </div>
            </div>
          </div>

          {/* Topics Tag Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === 'ALL' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold' 
                  : 'bg-black/30 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All Topics ({discussions.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTag === tag 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold' 
                    : 'bg-black/30 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 gap-3.5">
            {filteredDiscussions.length === 0 ? (
              <div className="p-12 text-center rounded-xl border border-gray-800 bg-[#070A12] text-gray-400 font-mono text-xs">
                No research inquiries match the current search criteria.
              </div>
            ) : (
              filteredDiscussions.map((disc) => {
                const linkedCase = cases.find(c => c.id === disc.caseId);
                const hasVideo = !!disc.videoUrl || (disc.attachments || []).some(a => a.type === 'video' || a.type === 'youtube');
                const hasPhoto = !!disc.imageUrl || (disc.attachments || []).some(a => a.type === 'image');

                return (
                  <div
                    key={disc.id}
                    onClick={() => {
                      setActiveThreadId(disc.id);
                      sound.click();
                    }}
                    className="cursor-pointer group rounded-xl border border-gray-800 bg-[#090D18] hover:border-cyan-500/50 hover:bg-[#0B1020] p-5 transition-all shadow-md flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Top Row: Case badge, Pin, Author, Date, Media Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            avatarUrl={disc.authorAvatar || disc.imageUrl}
                            name={disc.authorName}
                            size="xs"
                            showBadge
                          />
                          <span className="text-xs font-mono font-bold text-white">
                            {disc.authorName}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            ({(disc.authorRank || 'OBSERVER').replace(/_/g, ' ')})
                          </span>

                          {linkedCase && (
                            <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                              {linkedCase.caseNumber}: {linkedCase.title.slice(0, 24)}...
                            </span>
                          )}

                          {(!disc.category || disc.category === 'THEORY_DEBATES') && (
                            <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                              THEORY DEBATE
                            </span>
                          )}
                          {disc.category === 'NEW_EVIDENCE' && (
                            <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              NEW EVIDENCE
                            </span>
                          )}
                          {disc.category === 'SITE_ANNOUNCEMENTS' && (
                            <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                              ANNOUNCEMENT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                          {hasVideo && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1">
                              <Film className="w-2.5 h-2.5" /> VIDEO FOOTAGE
                            </span>
                          )}
                          {hasPhoto && !hasVideo && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5" /> SCAN EXHIBIT
                            </span>
                          )}
                          {disc.isPinned && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> PINNED
                            </span>
                          )}
                          <span>{disc.createdAt}</span>
                        </div>
                      </div>

                      {/* Thread Title */}
                      <h3 className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                        {disc.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed mb-3">
                        "{disc.initialComment}"
                      </p>

                      {/* Attached Thumbnail preview if present */}
                      {(hasVideo || hasPhoto) && disc.imageUrl && (
                        <div className="mb-3 h-28 w-full rounded-lg overflow-hidden border border-gray-800 bg-black/60 relative">
                          <img 
                            src={disc.imageUrl} 
                            alt={disc.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100" 
                            referrerPolicy="no-referrer"
                          />
                          {hasVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <div className="p-2 rounded-full bg-rose-500/90 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                                <Film className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(disc.tags || []).map(t => (
                          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-gray-800 text-gray-400 group-hover:text-cyan-400/90 transition-colors">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metrics Bar */}
                    <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{disc.upvotes || 0} Endorsements</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                          <span>{disc.commentCount || 0} Reviews</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{disc.viewCount || 1} Views</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform font-bold text-xs">
                        <span>OPEN INQUIRY</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </div>

            {/* Trending Topics Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#090D18] rounded-xl border border-gray-800 p-4 sticky top-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold text-white tracking-wider">TRENDING DEBATES</h3>
                </div>
                <div className="space-y-4">
                  {[...discussions]
                    .sort((a, b) => ((b.commentCount || 0) + (b.upvotes || 0)) - ((a.commentCount || 0) + (a.upvotes || 0)))
                    .slice(0, 5)
                    .map((disc, idx) => (
                    <div 
                      key={disc.id} 
                      onClick={() => { setActiveThreadId(disc.id); sound.click(); }}
                      className="cursor-pointer group flex items-start gap-3"
                    >
                      <span className="text-xl font-black font-mono text-gray-800 group-hover:text-cyan-500/30 transition-colors">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-gray-300 group-hover:text-cyan-300 line-clamp-2 transition-colors">
                          {disc.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-500">
                           <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {disc.commentCount || 0}</span>
                           <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {disc.upvotes || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEW RESEARCH INQUIRY MODAL WITH PHOTO & VIDEO ATTACHMENTS */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-2xl border border-cyan-500/40 bg-[#090D18] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>INITIATE RESEARCH INQUIRY / DEBATE FLOOR</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">
                    ASSOCIATED CASE DOSSIER:
                  </label>
                  <select
                    value={newCaseId}
                    onChange={(e) => setNewCaseId(e.target.value)}
                    className="w-full bg-[#05070D] border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">
                    DISCUSSION CATEGORY:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#05070D] border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="THEORY_DEBATES">Theory Debates</option>
                    <option value="NEW_EVIDENCE">New Evidence</option>
                    <option value="SITE_ANNOUNCEMENTS">Site Announcements</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">
                  INQUIRY THESIS / TOPIC TITLE *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Analysis of Dallas Police Radio Dictabelt Acoustic Artifacts"
                  required
                  className="w-full bg-[#05070D] border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">
                  OPENING ARGUMENT & FORENSIC RATIONALE *
                </label>
                <textarea
                  value={newInitialComment}
                  onChange={(e) => setNewInitialComment(e.target.value)}
                  placeholder="Provide your initial investigative rationale, citations, and questions for peer researchers..."
                  rows={4}
                  required
                  className="w-full bg-[#05070D] border border-gray-700 rounded-lg p-3 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* MEDIA ATTACHMENT SECTION (PHOTO / VIDEO) */}
              <div className="p-3.5 rounded-xl bg-[#04060C] border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                    <Film className="w-4 h-4 text-cyan-400" />
                    <span>Attach Primary Photo Scan or Video Footage</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">OPTIONAL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="file" 
                    ref={threadImageInputRef} 
                    onChange={handleThreadImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <input 
                    type="file" 
                    ref={threadVideoInputRef} 
                    onChange={handleThreadVideoUpload} 
                    accept="video/*" 
                    className="hidden" 
                  />

                  <button
                    type="button"
                    onClick={() => threadImageInputRef.current?.click()}
                    disabled={isUploadingNewMedia}
                    className="p-3 rounded-lg border border-dashed border-gray-700 hover:border-cyan-500/60 bg-[#080B14] flex items-center justify-center gap-2 text-xs font-mono text-gray-300 hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Upload Image Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => threadVideoInputRef.current?.click()}
                    disabled={isUploadingNewMedia}
                    className="p-3 rounded-lg border border-dashed border-gray-700 hover:border-rose-500/60 bg-[#080B14] flex items-center justify-center gap-2 text-xs font-mono text-gray-300 hover:text-rose-300 cursor-pointer transition-colors"
                  >
                    <Video className="w-4 h-4 text-rose-400" />
                    <span>Upload Video Clip</span>
                  </button>
                </div>

                {/* Direct URL or YouTube input */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">
                    OR PASTE PHOTO / VIDEO / YOUTUBE URL:
                  </label>
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://example.com/scan.jpg"
                    className="w-full bg-[#070A14] border border-gray-700 rounded-lg p-2 text-xs font-mono text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Media caption */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">
                    EXHIBIT FORENSIC CAPTION:
                  </label>
                  <input
                    type="text"
                    value={newMediaCaption}
                    onChange={(e) => setNewMediaCaption(e.target.value)}
                    placeholder="e.g. Frame 313 digital stabilization analysis"
                    className="w-full bg-[#070A14] border border-gray-700 rounded-lg p-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Live Preview of Attached Media */}
                {(newUploadedImage || newUploadedVideo || newMediaUrl.trim()) && (
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 text-[10px] font-mono text-cyan-400 font-bold">
                      <span>LIVE ATTACHMENT PREVIEW:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewUploadedImage(null);
                          setNewUploadedVideo(null);
                          setNewMediaUrl('');
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <MediaAttachmentViewer
                      imageUrl={newUploadedImage || (newMediaUrl.trim() ? newMediaUrl.trim() : undefined)}
                      videoUrl={newUploadedVideo || (newMediaUrl.trim() ? newMediaUrl.trim() : undefined)}
                      allowZoom={false}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1 font-semibold">
                  TOPIC TAGS (COMMA SEPARATED):
                </label>
                <input
                  type="text"
                  value={newTagsText}
                  onChange={(e) => setNewTagsText(e.target.value)}
                  placeholder="Forensics, Ballistics, Declassified Records"
                  className="w-full bg-[#05070D] border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs font-mono hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingNewMedia || !newTitle.trim() || !newInitialComment.trim()}
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
                >
                  Publish Inquiry (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {selectedArchiveEvidence && (
        <EvidenceDetailModal
          evidence={selectedArchiveEvidence}
          currentUser={currentUser as any}
          onClose={() => setSelectedArchiveEvidence(null)}
          onUpdate={(updated) => {
            setThreadEvidence(prev => prev.map(item => item.id === updated.id ? updated : item));
            setSelectedArchiveEvidence(updated);
          }}
        />
      )}

    </div>
  );
};
