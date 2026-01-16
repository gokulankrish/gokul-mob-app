import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role?: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  bio?: string;
  phone?: string;
  address?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to safely convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date | undefined => {
  if (!timestamp) return undefined;
  
  // If it's a Firestore Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it's already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a number (milliseconds)
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // If it's a string
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  // If it's an object with seconds/nanoseconds
  if (timestamp.seconds && timestamp.nanoseconds) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  
  return undefined;
};

// Get all users with in-memory filtering (no index needed)
export const getAllUsers = async (excludeUid?: string): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName || data.name || 'User',
        email: data.email || '',
        photoURL: data.photoURL || data.avatar || null,
        role: data.role || 'patient',
        specialty: data.specialty || '',
        bio: data.bio || '',
        phone: data.phone || '',
        address: data.address || '',
        isOnline: data.isOnline || false,
        lastSeen: convertTimestamp(data.lastSeen),
        createdAt: convertTimestamp(data.createdAt) || new Date(),
        updatedAt: convertTimestamp(data.updatedAt) || new Date(),
      } as UserProfile;
    });
    
    // Filter in memory
    if (excludeUid) {
      users = users.filter(user => user.uid !== excludeUid);
    }
    
    // Sort by display name
    users.sort((a, b) => {
      const nameA = (a.displayName || '').toLowerCase();
      const nameB = (b.displayName || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Get users by role with index support
export const getUsersByRole = async (role: string, excludeUid?: string): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role));
    
    const snapshot = await getDocs(q);
    
    let users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName || data.name || 'User',
        email: data.email || '',
        photoURL: data.photoURL || data.avatar || null,
        role: data.role || 'patient',
        specialty: data.specialty || '',
        bio: data.bio || '',
        phone: data.phone || '',
        address: data.address || '',
        isOnline: data.isOnline || false,
        lastSeen: convertTimestamp(data.lastSeen),
        createdAt: convertTimestamp(data.createdAt) || new Date(),
        updatedAt: convertTimestamp(data.updatedAt) || new Date(),
      } as UserProfile;
    });
    
    // Filter in memory
    if (excludeUid) {
      users = users.filter(user => user.uid !== excludeUid);
    }
    
    // Sort by display name
    users.sort((a, b) => {
      const nameA = (a.displayName || '').toLowerCase();
      const nameB = (b.displayName || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid: userSnap.id,
        displayName: data.displayName || data.name || 'User',
        email: data.email || '',
        photoURL: data.photoURL || data.avatar || null,
        role: data.role || 'patient',
        specialty: data.specialty || '',
        bio: data.bio || '',
        phone: data.phone || '',
        address: data.address || '',
        isOnline: data.isOnline || false,
        lastSeen: convertTimestamp(data.lastSeen),
        createdAt: convertTimestamp(data.createdAt) || new Date(),
        updatedAt: convertTimestamp(data.updatedAt) || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const createUserProfile = async (user: any, additionalData?: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        photoURL: user.photoURL || null,
        role: additionalData?.role || 'patient',
        specialty: additionalData?.specialty || '',
        bio: additionalData?.bio || '',
        phone: additionalData?.phone || '',
        address: additionalData?.address || '',
        isOnline: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};