import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, UserRole, InvestigatorTier } from '../types';
import { StorageService } from './storage';

export const ADMIN_BOOTSTRAP_EMAIL = 'ajsteptoe123@gmail.com';

const LOCAL_GUEST_USER: UserProfile = {
  uid: 'guest-operative',
  email: 'operative@cipherfiles.local',
  displayName: 'Guest Operative',
  callsign: 'CIPHER-GUEST-01',
  role: 'operative',
  tier: 'FREE',
  xp: 150,
  rank: 'OBSERVER',
  clearanceLevel: 'LEVEL 1 // PUBLIC ARCHIVES',
  contributionsCount: 0,
  debunkCount: 0,
  sourcesDiscovered: 0,
  rabbitHolesFollowed: 3,
  badges: [],
  savedCaseIds: ['jfk-assassination', 'roswell-incident-1947'],
  createdAt: new Date().toISOString()
};

export class AuthService {
  private static currentUserProfile: UserProfile | null = null;
  private static listeners: ((profile: UserProfile | null) => void)[] = [];

  public static subscribe(callback: (profile: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUserProfile);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public static subscribeToAuthState(callback: (profile: UserProfile | null) => void) {
    return this.subscribe(callback);
  }

  private static notify() {
    this.listeners.forEach(cb => cb(this.currentUserProfile));
  }

  public static getCurrentProfile(): UserProfile | null {
    return this.currentUserProfile;
  }

  public static initAuthListener() {
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const profile = await this.syncUserProfile(user);
          this.currentUserProfile = profile;
        } catch (e) {
          console.error('Failed to sync user profile:', e);
          this.currentUserProfile = this.createFallbackProfile(user);
        }
      } else {
        this.currentUserProfile = null;
      }
      this.notify();
    });
  }

  private static createFallbackProfile(user: User): UserProfile {
    const isAdmin = user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
    return {
      uid: user.uid,
      email: user.email || 'unknown@cipherfiles.org',
      displayName: user.displayName || 'Anonymous Investigator',
      callsign: `AGENT-${user.uid.substring(0, 5).toUpperCase()}`,
      avatarUrl: user.photoURL || undefined,
      role: isAdmin ? 'admin' : 'operative',
      tier: isAdmin ? 'VIP_MAJESTIC' : 'FREE',
      xp: 250,
      rank: isAdmin ? 'MAJESTIC_CHIEF' : 'RESEARCHER',
      clearanceLevel: isAdmin ? 'LEVEL 5 // MAJESTIC ARCHIVIST' : 'LEVEL 2 // CLASSIFIED FIELD',
      contributionsCount: 1,
      debunkCount: 0,
      sourcesDiscovered: 2,
      rabbitHolesFollowed: 12,
      badges: [{ id: 'b-init', name: 'Field Clearance', icon: '🛡️', description: 'Activated declassified investigator terminal.' }],
      savedCaseIds: ['jfk-assassination', 'roswell-incident-1947', 'operation-northwoods'],
      createdAt: new Date().toISOString()
    };
  }

  public static async syncUserProfile(user: User): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', user.uid);
    let docSnap;
    try {
      docSnap = await getDoc(userDocRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    }

    const isAdmin = user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

    if (docSnap && docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      // Guarantee bootstrap admin privileges
      if (isAdmin && data.role !== 'admin') {
        data.role = 'admin';
        data.tier = 'VIP_MAJESTIC';
        data.clearanceLevel = 'LEVEL 5 // MAJESTIC ARCHIVIST';
        await setDoc(userDocRef, data, { merge: true });
        await setDoc(doc(db, 'admins', user.uid), { uid: user.uid, email: user.email, addedAt: new Date().toISOString() });
      }
      return data;
    }

    // Create new profile
    const callsign = `AGENT-${(user.displayName?.split(' ')[0] || 'CIPHER').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || 'unknown@cipherfiles.org',
      displayName: user.displayName || 'Field Investigator',
      callsign,
      avatarUrl: user.photoURL || undefined,
      role: isAdmin ? 'admin' : 'operative',
      tier: isAdmin ? 'VIP_MAJESTIC' : 'FREE',
      xp: 250,
      rank: isAdmin ? 'MAJESTIC_CHIEF' : 'RESEARCHER',
      clearanceLevel: isAdmin ? 'LEVEL 5 // MAJESTIC ARCHIVIST' : 'LEVEL 2 // CLASSIFIED FIELD',
      contributionsCount: 0,
      debunkCount: 0,
      sourcesDiscovered: 0,
      rabbitHolesFollowed: 5,
      badges: [{ id: 'b-init', name: 'Field Clearance', icon: '🛡️', description: 'Activated declassified investigator terminal.' }],
      savedCaseIds: ['jfk-assassination', 'roswell-incident-1947'],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(userDocRef, newProfile);
      if (isAdmin) {
        await setDoc(doc(db, 'admins', user.uid), { uid: user.uid, email: user.email, addedAt: new Date().toISOString() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }

    return newProfile;
  }

  public static async loginWithGoogle(): Promise<UserProfile | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await this.syncUserProfile(result.user);
      this.currentUserProfile = profile;
      this.notify();
      return profile;
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/user-cancelled' ||
        error?.message?.includes('popup-closed-by-user')
      ) {
        // User intentionally closed the popup before finishing sign-in
        return null;
      }
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  }

  public static async logout(): Promise<void> {
    await signOut(auth);
    this.currentUserProfile = null;
    this.notify();
  }

  public static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.currentUserProfile || StorageService.getProfile();
    const updated: UserProfile = { ...current, ...updates };

    this.currentUserProfile = updated;
    StorageService.updateProfile(updates as any);
    this.notify();

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', uid);
      try {
        await setDoc(userDocRef, updates, { merge: true });
      } catch (error) {
        console.warn('Firestore user profile sync note (saved locally):', error);
      }
    }

    return updated;
  }

  public static async upgradeTier(tier: InvestigatorTier): Promise<UserProfile> {
    return this.updateProfile({
      tier,
      clearanceLevel: tier === 'VIP_MAJESTIC' 
        ? 'LEVEL 5 // MAJESTIC ARCHIVIST' 
        : tier === 'BENEFACTOR' 
          ? 'LEVEL 6 // BLACK VAULT BENEFACTOR' 
          : 'LEVEL 2 // CLASSIFIED FIELD'
    });
  }

  // Admin Management Functions
  public static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(d => d.data() as UserProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  }

  public static async setUserRole(targetUid: string, targetEmail: string, newRole: UserRole): Promise<void> {
    const userDocRef = doc(db, 'users', targetUid);
    try {
      await updateDoc(userDocRef, { role: newRole });

      // Synchronize /admins or /moderators collections
      if (newRole === 'admin') {
        await setDoc(doc(db, 'admins', targetUid), { uid: targetUid, email: targetEmail, addedAt: new Date().toISOString() });
      } else {
        try { await deleteDoc(doc(db, 'admins', targetUid)); } catch {}
      }

      if (newRole === 'moderator' || newRole === 'admin') {
        await setDoc(doc(db, 'moderators', targetUid), { uid: targetUid, email: targetEmail, addedAt: new Date().toISOString() });
      } else {
        try { await deleteDoc(doc(db, 'moderators', targetUid)); } catch {}
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUid}`);
    }
  }

  public static async toggleUserBan(targetUid: string, isBanned: boolean): Promise<void> {
    const userDocRef = doc(db, 'users', targetUid);
    try {
      await updateDoc(userDocRef, { isBanned });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUid}`);
    }
  }
}
