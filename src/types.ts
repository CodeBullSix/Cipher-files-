export type EvidenceRating = 
  | 'VERIFIED' 
  | 'DOCUMENTED' 
  | 'ALLEGED' 
  | 'SPECULATIVE' 
  | 'DISPROVEN' 
  | 'CONFIRMED' 
  | 'DISPUTED' 
  | 'UNVERIFIED' 
  | 'DEBUNKED' 
  | 'UNKNOWN';

export interface StatusDefinition {
  rating: EvidenceRating;
  normalized: 'VERIFIED' | 'DOCUMENTED' | 'ALLEGED' | 'SPECULATIVE' | 'DISPROVEN';
  label: string;
  tagline: string;
  definition: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  dotColor: string;
}

export const OFFICIAL_STATUS_DEFINITIONS: Record<'VERIFIED' | 'DOCUMENTED' | 'ALLEGED' | 'SPECULATIVE' | 'DISPROVEN', {
  label: string;
  tagline: string;
  definition: string;
  description: string;
  color: string;
  badgeClass: string;
  dotClass: string;
}> = {
  VERIFIED: {
    label: 'VERIFIED',
    tagline: 'Supported by reliable primary evidence.',
    definition: 'Supported by reliable primary evidence, official declassified documents, or forensic consensus.',
    description: 'The core events, operations, or claims have been unequivocally verified through verified archival records, court filings, congressional testimony, or forensic data.',
    color: '#10B981',
    badgeClass: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
  },
  DOCUMENTED: {
    label: 'DOCUMENTED',
    tagline: 'The event/claim is documented, but interpretation remains disputed.',
    definition: 'The event or claim is documented in official or historical records, but interpretation, causation, or motive remains heavily disputed.',
    description: 'Authentic records exist confirming the occurrence or program, but multiple competing forensic hypotheses, official vs. whistleblower interpretations, or redactions prevent absolute consensus.',
    color: '#F59E0B',
    badgeClass: 'text-amber-400 bg-amber-950/70 border-amber-500/50',
    dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
  },
  ALLEGED: {
    label: 'ALLEGED',
    tagline: 'A claim exists, but evidence is insufficient.',
    definition: 'A claim or testimony exists, but corroborating primary physical or documentary evidence is currently insufficient.',
    description: 'Testimony, insider reports, or secondary accounts allege specific covert activity, but independent physical, forensic, or unredacted documentary verification has not yet met primary evidentiary standards.',
    color: '#00E5FF',
    badgeClass: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/50',
    dotClass: 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.8)]'
  },
  SPECULATIVE: {
    label: 'SPECULATIVE',
    tagline: 'A hypothesis with limited supporting evidence.',
    definition: 'A speculative hypothesis or deductive framework with limited supporting evidence or reliance on circumstantial anomalies.',
    description: 'Theoretical models, deductive conjectures, or community lore based on circumstantial data, mathematical coincidences, or unexplained anomalies that lack direct evidentiary proof.',
    color: '#A855F7',
    badgeClass: 'text-purple-400 bg-purple-950/70 border-purple-500/50',
    dotClass: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
  },
  DISPROVEN: {
    label: 'DISPROVEN',
    tagline: 'Available evidence contradicts the claim.',
    definition: 'Available physical, forensic, or documentary evidence conclusively contradicts the claim.',
    description: 'Rigorous forensic re-examination, declassified chain of custody records, physical impossibility proofs, or confirmed hoaxes have conclusively refuted the claim.',
    color: '#EF4444',
    badgeClass: 'text-rose-400 bg-rose-950/70 border-rose-500/50',
    dotClass: 'bg-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
  }
};

export const CIPHER_FILES_PHILOSOPHY = {
  headline: "Cipher Files does not endorse the theories presented in this dossier.",
  subtext: "We don't tell you what to believe. Here is the evidence. Investigate it yourself.",
  tenets: [
    { title: "Primary Evidence First", desc: "We prioritize original declassified scans, unredacted transcripts, and physical forensic artifacts." },
    { title: "Strict Separation of Fact vs. Hypothesis", desc: "Undisputed chronological records are segregated from unproven claims and theoretical deductions." },
    { title: "Epistemic Humility", desc: "No theory is canon. Community peer-review, counter-evidence submissions, and forensic critique are actively encouraged." }
  ]
};

export type Category = 
  | 'GOVERNMENT_INTELLIGENCE'
  | 'UFOS_UAP'
  | 'ANCIENT_MYSTERIES'
  | 'UNSOLVED'
  | 'MONEY_POWER'
  | 'GLOBAL_EVENTS'
  | 'PSYCHOLOGY_CONTROL'
  | 'CRYPTIDS'
  | 'QUANTUM_REALITY'
  | 'SECRET_SOCIETIES';

export type UserRole = 'admin' | 'moderator' | 'archivist' | 'operative';
export type InvestigatorTier = 'FREE' | 'VIP_MAJESTIC' | 'BENEFACTOR';

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'GOVERNMENT_DOC' | 'COURT_RECORD' | 'ACADEMIC_RESEARCH' | 'JOURNALISM' | 'PHOTOGRAPH' | 'AUDIO_VIDEO' | 'TESTIMONY' | 'LEAKED_DOC' | 'USER_SUBMISSION';
  rating: EvidenceRating;
  isSupporting: boolean; // true = supports conspiracy/theory, false = counter-evidence / supports official/alternative explanation
  provenance: string; // e.g. "Church Committee Hearings 1975, Record Group 233, Box 14"
  authenticity: 'VERIFIED_ORIGINAL' | 'DEBATED_AUTHENTICITY' | 'UNPROVEN' | 'VERIFIED_FABRICATION';
  summary: string;
  context: string;
  counterAnalysis?: string;
  sourceUrl?: string;
  date?: string;
  votes: number;
  imageUrl?: string;
  userVoted?: 'up' | 'down';
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  rating: EvidenceRating;
  sourceReference?: string;
  location?: string;
  isMilestone?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  classificationLevel: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'DECLASSIFIED' | 'PUBLIC RECORD';
  originAgency: string;
  dateCreated: string;
  dateDeclassified?: string;
  fileReference: string;
  summary: string;
  fullExcerpt: string;
  redactedExcerpt?: string;
  authenticityNote: string;
  pageCount: number;
  downloadable?: boolean;
}

export interface RelatedEntity {
  id: string;
  name: string;
  type: 'PERSON' | 'AGENCY' | 'ORGANIZATION' | 'LOCATION' | 'EVENT' | 'CASE';
  role: string;
  targetCaseId?: string;
}

export interface CaseFile {
  id: string;
  caseNumber: string; // e.g. "FILE-0001"
  title: string;
  subtitle: string;
  category: Category;
  status: EvidenceRating;
  officialVerdict: string;
  coverImage?: string;
  summary: string;
  claim: string;
  claimOrigin: string;
  whatWeKnow: string[]; // Documented points
  speculations: string[]; // Theory & lore points
  evidenceList: EvidenceItem[];
  timeline: TimelineEvent[];
  documents: DocumentItem[];
  entities: RelatedEntity[];
  connectedCaseIds: string[];
  views: number;
  commentCount: number;
  bookmarkCount: number;
  isFeatured?: boolean;
  isDailyMystery?: boolean;
  isOfficialDossier?: boolean;
  isVipExclusive?: boolean;
  authorUid?: string;
  authorName?: string;
  authorCallsign?: string;
  authorRole?: UserRole;
  upvotes?: number;
  downvotes?: number;
  mindblownCount?: number;
  skepticCount?: number;
  beliefScore?: number; // 0 - 100 percentage
  tags?: string[];
  createdAt?: string;
  userVotedReaction?: 'up' | 'down' | 'mindblown' | 'skeptic';
  communityVerdictVote?: {
    confirmed: number;
    disputed: number;
    unverified: number;
    debunked: number;
  };
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  title?: string;
  caption?: string;
  thumbnailUrl?: string;
}

export interface Comment {
  id: string;
  caseId: string;
  threadId?: string;
  replyToCommentId?: string;
  replyToAuthorName?: string;
  authorUid?: string;
  authorName: string;
  authorCallsign?: string;
  authorRank: InvestigatorRank;
  authorRole?: UserRole;
  authorBadge?: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'none';
  attachments?: MediaAttachment[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  citedEvidenceId?: string;
  stance: 'SUPPORTING' | 'SKEPTICAL' | 'NEUTRAL' | 'DEVILS_ADVOCATE';
  replies?: Comment[];
}

export interface DiscussionThread {
  id: string;
  caseId: string;
  title: string;
  authorUid?: string;
  authorName: string;
  authorCallsign?: string;
  authorRank: InvestigatorRank;
  authorRole?: UserRole;
  authorAvatar?: string;
  createdAt: string;
  commentCount: number;
  viewCount: number;
  upvotes: number;
  userVote?: 'up' | 'down';
  isPinned?: boolean;
  tags: string[];
  initialComment: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'none';
  attachments?: MediaAttachment[];
  category?: 'THEORY_DEBATES' | 'NEW_EVIDENCE' | 'SITE_ANNOUNCEMENTS';
}

export type SubmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'PUBLISHED' | 'NEEDS_CHANGES' | 'REJECTED';

export interface TheorySubmission {
  id: string;
  caseNumber: string;
  title: string;
  category: Category;
  submitterUid?: string;
  submitterName: string;
  submitterCallsign?: string;
  submitterRank: InvestigatorRank;
  submittedAt: string;
  status: SubmissionStatus;
  suggestedRating: EvidenceRating;
  claim: string;
  knownFacts: string[];
  evidenceText: string;
  sources: string[];
  connectedCases: string[];
  coverImage?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'none';
  attachments?: MediaAttachment[];
  moderationNotes?: string;
  moderatorScore?: number;
}

export type InvestigatorRank = 
  | 'OBSERVER'
  | 'RESEARCHER'
  | 'ARCHIVIST'
  | 'ANALYST'
  | 'INVESTIGATOR'
  | 'SENIOR_INVESTIGATOR'
  | 'MAJESTIC_CHIEF';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface UserProfile {
  uid: string;
  id?: string; // legacy fallback for uid
  email: string;
  displayName: string;
  username?: string; // Custom unique @handle chosen by user
  callsign: string;
  codename?: string; // legacy fallback for callsign
  avatarUrl?: string;
  avatarPreset?: string; // Preset tactical insignia ID or emoji
  specialization?: string; // Custom tactical role/specialization (e.g. "FOIA Declassification Analyst")
  bio?: string; // Investigator field dossier bio / briefing
  stationLocation?: string; // Operative base station / post (e.g. "Station 04 - Groom Lake")
  themeAccent?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky';
  bannerUrl?: string;
  role: UserRole;
  tier: InvestigatorTier;
  xp: number;
  nextRankXp?: number;
  rank: InvestigatorRank;
  clearanceLevel: string; // e.g. "LEVEL 5 (MAJESTIC ARCHIVIST)"
  isBanned?: boolean;
  contributionsCount: number;
  debunkCount: number;
  sourcesDiscovered: number;
  rabbitHolesFollowed: number;
  badges: Badge[];
  savedCaseIds: string[];
  recentActivity?: Array<{
    id: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
  createdAt: string;
}

// Backward compatibility alias
export type InvestigatorProfile = UserProfile;

// Direct Messaging Types
export interface DirectMessage {
  id: string;
  conversationId: string;
  senderUid: string;
  senderName: string;
  senderCallsign?: string;
  senderAvatar?: string;
  senderRole?: UserRole;
  content: string;
  ciphertext?: string;
  isEncrypted: boolean;
  encryptionKeyFingerprint?: string;
  attachmentUrl?: string;
  createdAt: string;
  readBy?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantCallsigns?: Record<string, string>;
  participantAvatars?: Record<string, string>;
  participantRoles?: Record<string, UserRole>;
  lastMessage: string;
  lastSenderUid: string;
  lastTimestamp: string;
  isEncrypted?: boolean;
  unreadCount?: number;
}

// Graph Data Structure for Rabbit Hole Engine
export interface GraphNode {
  id: string;
  label: string;
  type: 'CASE' | 'PERSON' | 'AGENCY' | 'LOCATION' | 'DOCUMENT' | 'EVENT';
  caseId?: string;
  rating?: EvidenceRating;
  radius?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  category?: Category;
  description?: string;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  relationship: string;
  strength?: number;
  verified?: boolean;
}

export interface RabbitHoleNetwork {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SupporterRecord {
  id: string;
  donorName: string;
  callsign: string;
  amount: number;
  tierName: string; // e.g. "Bronze Operative", "Silver Archivist", "Gold Benefactor", "Majestic Titan"
  message?: string;
  timestamp: string;
  badge?: string;
  isTopDonor?: boolean;
}

