import { 
  CaseFile, 
  EvidenceItem, 
  DiscussionThread, 
  Comment, 
  TheorySubmission, 
  InvestigatorProfile, 
  InvestigatorRank,
  UserProfile,
  GraphNode,
  GraphLink,
  EvidenceRating
} from '../types';
import { 
  INITIAL_CASES, 
  INITIAL_GRAPH_NODES, 
  INITIAL_GRAPH_LINKS, 
  INITIAL_DISCUSSIONS, 
  INITIAL_COMMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USER_PROFILE 
} from '../data/initialData';
import { sound } from '../utils/audio';

const STORAGE_KEYS = {
  CASES: 'cipher_files_cases_v3',
  GRAPH_NODES: 'cipher_files_graph_nodes_v3',
  GRAPH_LINKS: 'cipher_files_graph_links_v3',
  DISCUSSIONS: 'cipher_files_discussions_v3',
  COMMENTS: 'cipher_files_comments_v3',
  SUBMISSIONS: 'cipher_files_submissions_v3',
  PROFILE: 'cipher_files_profile_v3',
  TRAIL: 'cipher_files_rabbit_trail_v3',
};

export class StorageService {
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save to ${key}`, e);
    }
  }

  // CASES
  public static getCases(): CaseFile[] {
    const saved = this.load<CaseFile[]>(STORAGE_KEYS.CASES, []);
    if (!saved || saved.length === 0) {
      this.save(STORAGE_KEYS.CASES, INITIAL_CASES);
      return INITIAL_CASES;
    }
    const savedIds = new Set(saved.map(c => c.id));
    let changed = false;
    for (const initCase of INITIAL_CASES) {
      if (!savedIds.has(initCase.id)) {
        saved.push(initCase);
        changed = true;
      }
    }
    if (changed) {
      this.save(STORAGE_KEYS.CASES, saved);
    }
    return saved;
  }

  public static getCaseById(id: string): CaseFile | undefined {
    return this.getCases().find(c => c.id === id || c.caseNumber.toLowerCase() === id.toLowerCase());
  }

  public static voteEvidence(caseId: string, evidenceId: string, direction: 'up' | 'down'): { updatedVotes: number, userVoted: 'up' | 'down' | undefined } {
    const cases = this.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) return { updatedVotes: 0, userVoted: undefined };

    const targetCase = cases[caseIndex];
    const evIndex = targetCase.evidenceList.findIndex(e => e.id === evidenceId);
    if (evIndex === -1) return { updatedVotes: 0, userVoted: undefined };

    const evidence = targetCase.evidenceList[evIndex];
    let newVoted: 'up' | 'down' | undefined = direction;

    if (evidence.userVoted === direction) {
      // Toggle off
      evidence.votes += direction === 'up' ? -1 : 1;
      newVoted = undefined;
      evidence.userVoted = undefined;
    } else {
      if (evidence.userVoted) {
        // Switching direction
        evidence.votes += direction === 'up' ? 2 : -2;
      } else {
        evidence.votes += direction === 'up' ? 1 : -1;
      }
      evidence.userVoted = direction;
    }

    cases[caseIndex] = targetCase;
    this.save(STORAGE_KEYS.CASES, cases);
    sound.playClick(600);
    return { updatedVotes: evidence.votes, userVoted: newVoted };
  }

  public static voteCommunityVerdict(caseId: string, rating: 'confirmed' | 'disputed' | 'unverified' | 'debunked'): CaseFile | null {
    const cases = this.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) return null;

    const targetCase = cases[caseIndex];
    if (!targetCase.communityVerdictVote) {
      targetCase.communityVerdictVote = { confirmed: 0, disputed: 0, unverified: 0, debunked: 0 };
    }
    targetCase.communityVerdictVote[rating] = (targetCase.communityVerdictVote[rating] || 0) + 1;
    cases[caseIndex] = targetCase;
    this.save(STORAGE_KEYS.CASES, cases);
    sound.playStamp();
    return targetCase;
  }

  public static toggleBookmark(caseId: string): boolean {
    const profile = this.getProfile();
    const isBookmarked = profile.savedCaseIds.includes(caseId);
    if (isBookmarked) {
      profile.savedCaseIds = profile.savedCaseIds.filter(id => id !== caseId);
    } else {
      profile.savedCaseIds.push(caseId);
    }
    this.save(STORAGE_KEYS.PROFILE, profile);
    sound.playClick(900);
    return !isBookmarked;
  }

  // TRAIL / RECENT RABBIT HOLES
  public static pushTrail(entityName: string, entityId: string, type: string) {
    const trail = this.load<{ name: string, id: string, type: string, time: string }[]>(STORAGE_KEYS.TRAIL, []);
    // avoid adjacent dupes
    if (trail.length > 0 && trail[trail.length - 1].id === entityId) return;
    
    trail.unshift({
      name: entityName,
      id: entityId,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    // Keep last 15
    const pruned = trail.slice(0, 15);
    this.save(STORAGE_KEYS.TRAIL, pruned);
    
    // REP reward for diving
    const profile = this.getProfile();
    profile.rabbitHolesFollowed += 1;
    this.save(STORAGE_KEYS.PROFILE, profile);
  }

  public static getTrail() {
    return this.load<{ name: string, id: string, type: string, time: string }[]>(STORAGE_KEYS.TRAIL, []);
  }

  // DISCUSSIONS & COMMENTS
  public static getDiscussions(caseId?: string): DiscussionThread[] {
    const saved = this.load<DiscussionThread[]>(STORAGE_KEYS.DISCUSSIONS, []);
    let all = saved;
    if (!saved || saved.length === 0) {
      this.save(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
      all = INITIAL_DISCUSSIONS;
    } else {
      const savedIds = new Set(saved.map(d => d.id));
      let changed = false;
      for (const initD of INITIAL_DISCUSSIONS) {
        if (!savedIds.has(initD.id)) {
          saved.push(initD);
          changed = true;
        }
      }
      if (changed) {
        this.save(STORAGE_KEYS.DISCUSSIONS, saved);
      }
      all = saved;
    }
    return caseId ? all.filter(d => d.caseId === caseId) : all;
  }

  public static getDiscussionById(id: string): DiscussionThread | undefined {
    const all = this.getDiscussions();
    return all.find(d => d.id === id);
  }

  public static createDiscussion(
    caseId: string, 
    title: string, 
    initialComment: string, 
    tags: string[],
    authorProfile?: Partial<UserProfile>,
    media?: {
      imageUrl?: string;
      videoUrl?: string;
      mediaType?: 'image' | 'video' | 'youtube' | 'none';
      attachments?: import('../types').MediaAttachment[];
    },
    category: 'THEORY_DEBATES' | 'NEW_EVIDENCE' | 'SITE_ANNOUNCEMENTS' = 'THEORY_DEBATES'
  ): DiscussionThread {
    const discussions = this.load<DiscussionThread[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
    const profile = authorProfile || this.getProfile();
    
    const newThread: DiscussionThread = {
      id: 'disc-' + Date.now(),
      caseId,
      title,
      category,
      authorUid: profile.uid,
      authorName: profile.displayName || profile.callsign || 'Investigator',
      authorCallsign: profile.callsign || 'RESEARCHER',
      authorRank: profile.rank || 'RESEARCHER',
      authorRole: profile.role || 'operative',
      authorAvatar: profile.avatarUrl,
      imageUrl: media?.imageUrl || profile.avatarUrl,
      videoUrl: media?.videoUrl,
      mediaType: media?.mediaType || (media?.videoUrl ? 'video' : media?.imageUrl ? 'image' : 'none'),
      attachments: media?.attachments,
      createdAt: new Date().toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 1,
      upvotes: 1,
      userVote: 'up',
      tags,
      initialComment
    };

    discussions.unshift(newThread);
    this.save(STORAGE_KEYS.DISCUSSIONS, discussions);

    sound.playUnlock();
    return newThread;
  }

  public static voteDiscussion(discussionId: string, direction: 'up' | 'down'): DiscussionThread | null {
    const discussions = this.load<DiscussionThread[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
    const index = discussions.findIndex(d => d.id === discussionId);
    if (index === -1) return null;

    const disc = discussions[index];
    if (disc.userVote === direction) {
      disc.userVote = undefined;
      disc.upvotes = Math.max(0, disc.upvotes - (direction === 'up' ? 1 : -1));
    } else {
      if (disc.userVote) {
        disc.upvotes += direction === 'up' ? 2 : -2;
      } else {
        disc.upvotes += direction === 'up' ? 1 : -1;
      }
      disc.userVote = direction;
    }

    discussions[index] = disc;
    this.save(STORAGE_KEYS.DISCUSSIONS, discussions);
    sound.playClick(750);
    return disc;
  }

  public static getComments(targetId: string): Comment[] {
    const saved = this.load<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    let all = saved;
    if (!saved || saved.length === 0) {
      this.save(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
      all = INITIAL_COMMENTS;
    } else {
      const savedIds = new Set(saved.map(c => c.id));
      let changed = false;
      for (const initC of INITIAL_COMMENTS) {
        if (!savedIds.has(initC.id)) {
          saved.push(initC);
          changed = true;
        }
      }
      if (changed) {
        this.save(STORAGE_KEYS.COMMENTS, saved);
      }
      all = saved;
    }
    return all.filter(c => c.caseId === targetId || (c as any).threadId === targetId);
  }

  public static postComment(
    targetId: string, 
    content: string, 
    stance: 'SUPPORTING' | 'SKEPTICAL' | 'NEUTRAL' | 'DEVILS_ADVOCATE', 
    citedEvidenceId?: string,
    authorProfile?: Partial<UserProfile>,
    isThreadComment?: boolean,
    media?: {
      imageUrl?: string;
      videoUrl?: string;
      mediaType?: 'image' | 'video' | 'youtube' | 'none';
      attachments?: import('../types').MediaAttachment[];
    },
    replyTo?: {
      commentId?: string;
      authorName?: string;
    }
  ): Comment {
    const comments = this.load<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const profile = authorProfile || this.getProfile();

    const newComment: Comment & { threadId?: string } = {
      id: 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      caseId: targetId,
      threadId: isThreadComment ? targetId : undefined,
      replyToCommentId: replyTo?.commentId,
      replyToAuthorName: replyTo?.authorName,
      authorUid: profile.uid,
      authorName: profile.displayName || profile.callsign || 'Researcher',
      authorCallsign: profile.callsign,
      authorRank: profile.rank || 'RESEARCHER',
      authorRole: profile.role || 'operative',
      authorBadge: profile.badges?.[0]?.name || (profile.specialization ? profile.specialization.slice(0, 20) : 'RESEARCHER'),
      authorAvatar: profile.avatarUrl,
      content,
      imageUrl: media?.imageUrl,
      videoUrl: media?.videoUrl,
      mediaType: media?.mediaType || (media?.videoUrl ? 'video' : media?.imageUrl ? 'image' : 'none'),
      attachments: media?.attachments,
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      citedEvidenceId,
      stance
    };

    comments.unshift(newComment);
    this.save(STORAGE_KEYS.COMMENTS, comments);

    // Increment comment count on discussion thread if it's a discussion
    const discussions = this.load<DiscussionThread[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
    const dIdx = discussions.findIndex(d => d.id === targetId);
    if (dIdx !== -1) {
      discussions[dIdx].commentCount = (discussions[dIdx].commentCount || 0) + 1;
      this.save(STORAGE_KEYS.DISCUSSIONS, discussions);
    }

    // Increment comment count on case
    const cases = this.getCases();
    const cIdx = cases.findIndex(c => c.id === targetId);
    if (cIdx !== -1) {
      cases[cIdx].commentCount = (cases[cIdx].commentCount || 0) + 1;
      this.save(STORAGE_KEYS.CASES, cases);
    }

    const repAmount = stance === 'DEVILS_ADVOCATE' ? 40 : 25;
    sound.playClick(1100);
    return newComment;
  }

  public static voteComment(commentId: string, direction: 'up' | 'down'): Comment | null {
    const comments = this.load<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return null;

    const comm = comments[index];
    if (comm.userVote === direction) {
      comm.userVote = undefined;
      if (direction === 'up') comm.upvotes -= 1;
      else comm.downvotes -= 1;
    } else {
      if (comm.userVote === 'up') comm.upvotes -= 1;
      if (comm.userVote === 'down') comm.downvotes -= 1;
      comm.userVote = direction;
      if (direction === 'up') comm.upvotes += 1;
      else comm.downvotes += 1;
    }

    comments[index] = comm;
    this.save(STORAGE_KEYS.COMMENTS, comments);
    sound.playClick(750);
    return comm;
  }

  // SUBMISSIONS & MODERATION
  public static getSubmissions(): TheorySubmission[] {
    return this.load<TheorySubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  }

  public static submitTheory(
    title: string, 
    category: any, 
    claim: string, 
    knownFacts: string[], 
    evidenceText: string, 
    sources: string[], 
    connectedCases: string[],
    suggestedRating: EvidenceRating = 'UNVERIFIED'
  ): TheorySubmission {
    const subs = this.getSubmissions();
    const profile = this.getProfile();
    const nextNum = 'FILE-00' + (subs.length + 44);

    const newSub: TheorySubmission = {
      id: 'sub-' + Date.now(),
      caseNumber: nextNum,
      title,
      category,
      submitterName: profile.codename,
      submitterRank: profile.rank,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      suggestedRating,
      claim,
      knownFacts,
      evidenceText,
      sources,
      connectedCases,
      moderationNotes: 'Awaiting peer-review verification by senior archivists.'
    };

    subs.unshift(newSub);
    this.save(STORAGE_KEYS.SUBMISSIONS, subs);
    sound.playUnlock();
    return newSub;
  }

  public static updateSubmissionStatus(submissionId: string, status: 'PUBLISHED' | 'NEEDS_CHANGES' | 'REJECTED' | 'UNDER_REVIEW', notes?: string, assignedRating?: EvidenceRating): TheorySubmission | null {
    const subs = this.getSubmissions();
    const idx = subs.findIndex(s => s.id === submissionId);
    if (idx === -1) return null;

    const sub = subs[idx];
    sub.status = status;
    if (notes) sub.moderationNotes = notes;
    if (assignedRating) sub.suggestedRating = assignedRating;
    subs[idx] = sub;
    this.save(STORAGE_KEYS.SUBMISSIONS, subs);

    // If published, convert into actual CaseFile!
    if (status === 'PUBLISHED') {
      const cases = this.getCases();
      const existing = cases.find(c => c.caseNumber === sub.caseNumber);
      if (!existing) {
        const newCase: CaseFile = {
          id: sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          caseNumber: sub.caseNumber,
          title: sub.title,
          subtitle: `Community Verified Dossier submitted by ${sub.submitterName}`,
          category: sub.category,
          status: sub.suggestedRating,
          officialVerdict: 'Currently under active community investigation and historical verification.',
          summary: sub.claim,
          claim: sub.claim,
          claimOrigin: `Submitted by Investigator ${sub.submitterName}`,
          whatWeKnow: sub.knownFacts.length ? sub.knownFacts : ['Initial documented premises verified in peer review.'],
          speculations: ['Secondary aspects requiring additional documentation.'],
          evidenceList: [
            {
              id: 'ev-sub-1',
              title: 'Primary Submission Proof & Cited Sources',
              type: 'USER_SUBMISSION',
              rating: sub.suggestedRating,
              isSupporting: true,
              provenance: sub.sources.join('; ') || 'Investigator field research archive',
              authenticity: 'VERIFIED_ORIGINAL',
              summary: sub.evidenceText,
              context: 'Assigned during moderation audit.',
              votes: 24
            }
          ],
          timeline: [
            {
              id: 'tl-sub-1',
              date: sub.submittedAt,
              title: 'Case Formally Cataloged in CIPHER FILES',
              description: 'Dossier passed community moderation and was officially registered into the primary archive.',
              rating: 'CONFIRMED',
              isMilestone: true
            }
          ],
          documents: [],
          entities: sub.connectedCases.map((cc, i) => ({
            id: `ent-sub-${i}`,
            name: cc,
            type: 'CASE',
            role: 'Referenced Cross-Investigation'
          })),
          connectedCaseIds: sub.connectedCases,
          views: 140,
          commentCount: 0,
          bookmarkCount: 12,
          communityVerdictVote: { confirmed: 15, disputed: 4, unverified: 2, debunked: 0 }
        };
        cases.push(newCase);
        this.save(STORAGE_KEYS.CASES, cases);

        // Also add node to Rabbit Hole graph!
        const nodes = this.getGraphNodes();
        const links = this.getGraphLinks();
        nodes.push({
          id: newCase.id,
          label: newCase.title,
          type: 'CASE',
          caseId: newCase.id,
          rating: newCase.status,
          radius: 20,
          category: newCase.category
        });
        sub.connectedCases.forEach(conn => {
          links.push({
            source: newCase.id,
            target: conn,
            relationship: 'Community Cross-Referenced',
            strength: 0.7
          });
        });
        this.save(STORAGE_KEYS.GRAPH_NODES, nodes);
        this.save(STORAGE_KEYS.GRAPH_LINKS, links);
      }
    }

    sound.playStamp();
    return sub;
  }

  // GRAPH DATA
  public static getGraphNodes(): GraphNode[] {
    const saved = this.load<GraphNode[]>(STORAGE_KEYS.GRAPH_NODES, []);
    if (!saved || saved.length === 0) {
      this.save(STORAGE_KEYS.GRAPH_NODES, INITIAL_GRAPH_NODES);
      return INITIAL_GRAPH_NODES;
    }
    const savedIds = new Set(saved.map(n => n.id));
    let changed = false;
    for (const node of INITIAL_GRAPH_NODES) {
      if (!savedIds.has(node.id)) {
        saved.push(node);
        changed = true;
      }
    }
    if (changed) this.save(STORAGE_KEYS.GRAPH_NODES, saved);
    return saved;
  }

  public static getGraphLinks(): GraphLink[] {
    const saved = this.load<GraphLink[]>(STORAGE_KEYS.GRAPH_LINKS, []);
    if (!saved || saved.length === 0) {
      this.save(STORAGE_KEYS.GRAPH_LINKS, INITIAL_GRAPH_LINKS);
      return INITIAL_GRAPH_LINKS;
    }
    const linkKey = (l: GraphLink) => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return `${s}-->${t}`;
    };
    const savedKeys = new Set(saved.map(linkKey));
    let changed = false;
    for (const link of INITIAL_GRAPH_LINKS) {
      if (!savedKeys.has(linkKey(link))) {
        saved.push(link);
        changed = true;
      }
    }
    if (changed) this.save(STORAGE_KEYS.GRAPH_LINKS, saved);
    return saved;
  }

  // INVESTIGATOR PROFILE & REP
  public static getProfile(): InvestigatorProfile {
    return this.load<InvestigatorProfile>(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE);
  }

  public static updateProfile(updates: Partial<InvestigatorProfile>): InvestigatorProfile {
    const current = this.getProfile();
    const updated: InvestigatorProfile = {
      ...current,
      ...updates
    };
    this.save(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  

  // RESET TO DEFAULTS
  public static resetToFactory() {
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.GRAPH_NODES);
    localStorage.removeItem(STORAGE_KEYS.GRAPH_LINKS);
    localStorage.removeItem(STORAGE_KEYS.DISCUSSIONS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TRAIL);
  }
}
