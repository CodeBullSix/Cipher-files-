import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { StorageService } from './storage';
import { CaseFile, Comment, Conversation, DirectMessage, UserProfile, SupporterRecord, DiscussionThread } from '../types';
import { INITIAL_CASES, INITIAL_SUPPORTERS, INITIAL_DISCUSSIONS, INITIAL_COMMENTS } from '../data/initialData';
import { TacticalCrypto } from '../utils/crypto';

export class FirestoreService {
  private static isSeeding = false;

  // Initialize and Seed Default Archive if Database is Fresh
  public static async checkAndSeedDatabase() {
    if (this.isSeeding) return;
    this.isSeeding = true;
    try {
      const snap = await getDocs(collection(db, 'cases'));
      if (snap.empty) {
        console.log('Database fresh. Seeding default CIPHER FILES dossiers into Firestore...');
        for (const c of INITIAL_CASES) {
          const caseRef = doc(db, 'cases', c.id);
          await setDoc(caseRef, {
            ...c,
            authorUid: 'system-archive',
            authorName: 'Chief Archivist',
            authorCallsign: 'MAJESTIC-01',
            isOfficialDossier: true,
            beliefScore: c.status === 'CONFIRMED' ? 95 : c.status === 'DISPUTED' ? 68 : 42,
            upvotes: Math.floor(200 + Math.random() * 800),
            downvotes: Math.floor(10 + Math.random() * 80),
            mindblownCount: Math.floor(50 + Math.random() * 250),
            skepticCount: Math.floor(15 + Math.random() * 70),
            createdAt: new Date().toISOString()
          });
        }
      }

      // Seed initial discussions if empty
      const discSnap = await getDocs(collection(db, 'discussions'));
      if (discSnap.empty) {
        for (const disc of INITIAL_DISCUSSIONS) {
          await setDoc(doc(db, 'discussions', disc.id), disc);
        }
      }

      // Seed initial supporters if empty
      const supSnap = await getDocs(collection(db, 'supporters'));
      if (supSnap.empty) {
        for (const sup of INITIAL_SUPPORTERS) {
          await setDoc(doc(db, 'supporters', sup.id), sup);
        }
      }
    } catch (e) {
      console.warn('Seeding check completed (or offline fallback):', e);
    } finally {
      this.isSeeding = false;
    }
  }

  // --- CASES / THEORIES ---
  public static listenCases(callback: (cases: CaseFile[]) => void) {
    const casesCol = collection(db, 'cases');
    return onSnapshot(casesCol, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to full initial local dossiers archive
        callback(INITIAL_CASES);
      } else {
        const firestoreCases = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CaseFile));

        const firestoreMap = new Map<string, CaseFile>();
        firestoreCases.forEach(fc => {
          if (fc && fc.id) firestoreMap.set(fc.id, fc);
        });

        // Always preserve all rich built-in dossiers while applying any live updates
        const mergedList = INITIAL_CASES.map(initCase => {
          if (firestoreMap.has(initCase.id)) {
            const fsData = firestoreMap.get(initCase.id)!;
            firestoreMap.delete(initCase.id);
            return {
              ...initCase,
              ...fsData,
              // Protect rich array data against null/empty overrides
              evidenceList: (fsData.evidenceList && fsData.evidenceList.length > 0) ? fsData.evidenceList : initCase.evidenceList,
              documents: (fsData.documents && fsData.documents.length > 0) ? fsData.documents : initCase.documents,
              whatWeKnow: (fsData.whatWeKnow && fsData.whatWeKnow.length > 0) ? fsData.whatWeKnow : initCase.whatWeKnow,
              speculations: (fsData.speculations && fsData.speculations.length > 0) ? fsData.speculations : initCase.speculations,
              entities: (fsData.entities && fsData.entities.length > 0) ? fsData.entities : initCase.entities,
              coverImage: fsData.coverImage || initCase.coverImage
            };
          }
          return initCase;
        });

        // Prepend any community-submitted cases that are not in initial cases
        firestoreMap.forEach(customCase => {
          mergedList.unshift(customCase);
        });

        callback(mergedList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cases');
      callback(INITIAL_CASES);
    });
  }

  public static async createCase(caseFile: CaseFile): Promise<void> {
    const path = `cases/${caseFile.id}`;
    try {
      await setDoc(doc(db, 'cases', caseFile.id), {
        ...caseFile,
        upvotes: caseFile.upvotes || 1,
        downvotes: caseFile.downvotes || 0,
        mindblownCount: caseFile.mindblownCount || 1,
        skepticCount: caseFile.skepticCount || 0,
        beliefScore: caseFile.beliefScore || 50,
        commentCount: caseFile.commentCount || 0,
        views: caseFile.views || 1,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  public static async deleteCase(caseId: string): Promise<void> {
    const path = `cases/${caseId}`;
    try {
      await deleteDoc(doc(db, 'cases', caseId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  public static async voteCaseReaction(
    caseId: string, 
    reaction: 'up' | 'down' | 'mindblown' | 'skeptic'
  ): Promise<void> {
    const path = `cases/${caseId}`;
    const fieldMap: Record<string, string> = {
      up: 'upvotes',
      down: 'downvotes',
      mindblown: 'mindblownCount',
      skeptic: 'skepticCount'
    };
    const field = fieldMap[reaction];
    try {
      await updateDoc(doc(db, 'cases', caseId), {
        [field]: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  public static async updateBeliefScore(caseId: string, newScore: number): Promise<void> {
    const path = `cases/${caseId}`;
    try {
      await updateDoc(doc(db, 'cases', caseId), {
        beliefScore: Math.max(0, Math.min(100, newScore))
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  // --- CASE COMMENTS / DEBATES ---
  public static listenComments(caseId: string, callback: (comments: Comment[]) => void) {
    const path = `cases/${caseId}/comments`;
    const commentsCol = collection(db, 'cases', caseId, 'comments');
    
    // First, emit local stored comments immediately
    const localComments = StorageService.getComments(caseId);
    callback(localComments);

    return onSnapshot(commentsCol, (snapshot) => {
      if (snapshot.empty) {
        callback(StorageService.getComments(caseId));
      } else {
        const firestoreList = snapshot.docs.map(doc => doc.data() as Comment);
        // Merge with local list to preserve any locally saved or initial comments
        const localList = StorageService.getComments(caseId);
        const map = new Map<string, Comment>();
        for (const c of localList) map.set(c.id, c);
        for (const c of firestoreList) map.set(c.id, c);
        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(merged);
      }
    }, (error) => {
      console.warn('Firestore comments read error, using local fallback:', error);
      callback(StorageService.getComments(caseId));
    });
  }

  public static async addComment(caseId: string, comment: Comment): Promise<void> {
    // 1. Always persist to StorageService
    StorageService.postComment(
      caseId,
      comment.content,
      comment.stance,
      comment.citedEvidenceId,
      {
        uid: comment.authorUid,
        displayName: comment.authorName,
        callsign: comment.authorCallsign,
        avatarUrl: comment.authorAvatar,
        role: comment.authorRole as any,
        rank: comment.authorRank as any
      },
      false,
      {
        imageUrl: comment.imageUrl,
        videoUrl: comment.videoUrl,
        mediaType: comment.mediaType,
        attachments: comment.attachments
      },
      comment.replyToCommentId ? { commentId: comment.replyToCommentId, authorName: comment.replyToAuthorName } : undefined
    );

    // 2. Sync to Firestore
    const path = `cases/${caseId}/comments/${comment.id}`;
    try {
      await setDoc(doc(db, 'cases', caseId, 'comments', comment.id), comment);
      // Increment parent case comment count
      try {
        await updateDoc(doc(db, 'cases', caseId), {
          commentCount: increment(1)
        });
      } catch (err) {
        console.warn('Could not increment case commentCount:', err);
      }
    } catch (error) {
      console.warn('Firestore write warning (saved locally):', error);
    }
  }

  public static async deleteComment(caseId: string, commentId: string): Promise<void> {
    const path = `cases/${caseId}/comments/${commentId}`;
    try {
      await deleteDoc(doc(db, 'cases', caseId, 'comments', commentId));
      await updateDoc(doc(db, 'cases', caseId), {
        commentCount: increment(-1)
      });
    } catch (error) {
      console.warn('Firestore delete warning:', error);
    }
  }

  public static async voteComment(caseId: string, commentId: string, direction: 'up' | 'down'): Promise<void> {
    const path = `cases/${caseId}/comments/${commentId}`;
    const field = direction === 'up' ? 'upvotes' : 'downvotes';
    try {
      await updateDoc(doc(db, 'cases', caseId, 'comments', commentId), {
        [field]: increment(1)
      });
    } catch (error) {
      console.warn('Firestore vote warning:', error);
    }
  }

  // --- DIRECT MESSAGING ---
  public static listenConversations(userUid: string, callback: (convs: Conversation[]) => void) {
    const path = 'conversations';
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userUid));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as Conversation);
      list.sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime());
      callback(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      callback([]);
    });
  }

  public static listenMessages(conversationId: string, callback: (msgs: DirectMessage[]) => void) {
    const path = `conversations/${conversationId}/messages`;
    const q = query(collection(db, 'conversations', conversationId, 'messages'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as DirectMessage);
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      callback(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      callback([]);
    });
  }

  public static async getOrCreateConversation(
    currentProfile: UserProfile, 
    recipient: UserProfile
  ): Promise<Conversation> {
    const convId = [currentProfile.uid, recipient.uid].sort().join('_');
    const convRef = doc(db, 'conversations', convId);
    
    try {
      const snap = await getDoc(convRef);
      if (snap.exists()) {
        return snap.data() as Conversation;
      }

      const newConv: Conversation = {
        id: convId,
        participants: [currentProfile.uid, recipient.uid],
        participantNames: {
          [currentProfile.uid]: currentProfile.displayName,
          [recipient.uid]: recipient.displayName
        },
        participantCallsigns: {
          [currentProfile.uid]: currentProfile.callsign,
          [recipient.uid]: recipient.callsign
        },
        participantRoles: {
          [currentProfile.uid]: currentProfile.role,
          [recipient.uid]: recipient.role
        },
        lastMessage: 'Classified channel established.',
        lastSenderUid: currentProfile.uid,
        lastTimestamp: new Date().toISOString(),
        isEncrypted: true
      };

      await setDoc(convRef, newConv);
      return newConv;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `conversations/${convId}`);
      throw error;
    }
  }

  public static async sendDirectMessage(
    conversationId: string,
    message: DirectMessage
  ): Promise<void> {
    const path = `conversations/${conversationId}/messages/${message.id}`;
    try {
      await setDoc(doc(db, 'conversations', conversationId, 'messages', message.id), message);
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: message.isEncrypted ? '🔐 [ENCRYPTED DATA PACKET]' : message.content.substring(0, 80),
        lastSenderUid: message.senderUid,
        lastTimestamp: message.createdAt
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  // --- SUPPORTERS & DONORS ---
  public static listenSupporters(callback: (supporters: SupporterRecord[]) => void) {
    const path = 'supporters';
    const colRef = collection(db, 'supporters');
    return onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_SUPPORTERS);
      } else {
        const list = snapshot.docs.map(d => d.data() as SupporterRecord);
        // Sort descending by amount
        list.sort((a, b) => b.amount - a.amount);
        // Mark the highest donator
        if (list.length > 0) {
          list[0].isTopDonor = true;
          list[0].badge = '👑 #1 HIGHEST DONATOR';
        }
        callback(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      callback(INITIAL_SUPPORTERS);
    });
  }

  public static async addSupporter(supporter: SupporterRecord): Promise<void> {
    const path = `supporters/${supporter.id}`;
    try {
      await setDoc(doc(db, 'supporters', supporter.id), supporter);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  // --- FORUMS / RESEARCH INQUIRIES & DISCUSSIONS ---
  public static listenDiscussions(callback: (discussions: DiscussionThread[]) => void) {
    const path = 'discussions';
    const colRef = collection(db, 'discussions');
    
    // First emit local discussions immediately
    const localDiscs = StorageService.getDiscussions();
    callback(localDiscs);

    return onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) {
        callback(StorageService.getDiscussions());
      } else {
        const firestoreList = snapshot.docs.map(doc => doc.data() as DiscussionThread);
        const localList = StorageService.getDiscussions();
        const map = new Map<string, DiscussionThread>();
        for (const d of localList) map.set(d.id, d);
        for (const d of firestoreList) map.set(d.id, d);
        const merged = Array.from(map.values());
        merged.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        callback(merged);
      }
    }, (error) => {
      console.warn('Firestore discussions read error, using local fallback:', error);
      callback(StorageService.getDiscussions());
    });
  }

  public static async createDiscussion(discussion: DiscussionThread): Promise<void> {
    const path = `discussions/${discussion.id}`;
    try {
      await setDoc(doc(db, 'discussions', discussion.id), {
        ...discussion,
        upvotes: discussion.upvotes || 1,
        commentCount: discussion.commentCount || 0,
        viewCount: discussion.viewCount || 1,
        createdAt: discussion.createdAt || new Date().toISOString()
      });
    } catch (error) {
      console.warn('Firestore create discussion warning:', error);
    }
  }

  public static async voteDiscussion(discussionId: string, direction: 'up' | 'down'): Promise<void> {
    StorageService.voteDiscussion(discussionId, direction);
    const path = `discussions/${discussionId}`;
    try {
      await updateDoc(doc(db, 'discussions', discussionId), {
        upvotes: increment(direction === 'up' ? 1 : -1)
      });
    } catch (error) {
      console.warn('Firestore vote discussion warning:', error);
    }
  }

  public static listenDiscussionComments(threadId: string, callback: (comments: Comment[]) => void) {
    const path = `discussions/${threadId}/comments`;
    const commentsCol = collection(db, 'discussions', threadId, 'comments');
    
    // First emit local comments immediately
    const localComments = StorageService.getComments(threadId);
    callback(localComments);

    return onSnapshot(commentsCol, (snapshot) => {
      if (snapshot.empty) {
        callback(StorageService.getComments(threadId));
      } else {
        const firestoreList = snapshot.docs.map(doc => doc.data() as Comment);
        const localList = StorageService.getComments(threadId);
        const map = new Map<string, Comment>();
        for (const c of localList) map.set(c.id, c);
        for (const c of firestoreList) map.set(c.id, c);
        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        callback(merged);
      }
    }, (error) => {
      console.warn('Firestore thread comments read error, using local fallback:', error);
      callback(StorageService.getComments(threadId));
    });
  }

  public static async addDiscussionComment(threadId: string, comment: Comment): Promise<void> {
    // 1. Always save to StorageService first
    StorageService.postComment(
      threadId,
      comment.content,
      comment.stance,
      comment.citedEvidenceId,
      {
        uid: comment.authorUid,
        displayName: comment.authorName,
        callsign: comment.authorCallsign,
        avatarUrl: comment.authorAvatar,
        role: comment.authorRole as any,
        rank: comment.authorRank as any
      },
      true,
      {
        imageUrl: comment.imageUrl,
        videoUrl: comment.videoUrl,
        mediaType: comment.mediaType,
        attachments: comment.attachments
      },
      comment.replyToCommentId ? { commentId: comment.replyToCommentId, authorName: comment.replyToAuthorName } : undefined
    );

    // 2. Sync to Firestore
    const path = `discussions/${threadId}/comments/${comment.id}`;
    try {
      await setDoc(doc(db, 'discussions', threadId, 'comments', comment.id), comment);
      try {
        await updateDoc(doc(db, 'discussions', threadId), {
          commentCount: increment(1)
        });
      } catch (err) {
        console.warn('Could not increment thread commentCount in Firestore:', err);
      }
    } catch (error) {
      console.warn('Firestore add discussion comment warning (saved locally):', error);
    }
  }

  public static async voteDiscussionComment(threadId: string, commentId: string, direction: 'up' | 'down'): Promise<void> {
    StorageService.voteComment(commentId, direction);
    const path = `discussions/${threadId}/comments/${commentId}`;
    const field = direction === 'up' ? 'upvotes' : 'downvotes';
    try {
      await updateDoc(doc(db, 'discussions', threadId, 'comments', commentId), {
        [field]: increment(1)
      });
    } catch (error) {
      console.warn('Firestore vote comment warning:', error);
    }
  }
}
