import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS, USER_ROLES, DEMO_ACCOUNTS, DOCTOR_IDS } from '../constants/Config';
import { User } from '../types';

export const AuthService = {
  // Get available doctors for patients
  async getAvailableDoctors() {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('role', '==', USER_ROLES.DOCTOR)
      );
      
      const querySnapshot = await getDocs(q);
      const doctors: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        doctors.push(userData);
      });
      
      return { success: true, doctors };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get random demo account
  getRandomDemoAccount(role: 'doctor' | 'patient') {
    const accounts = role === 'doctor' ? DEMO_ACCOUNTS.DOCTORS : DEMO_ACCOUNTS.PATIENTS;
    const randomIndex = Math.floor(Math.random() * accounts.length);
    return accounts[randomIndex];
  },

  // Get all demo accounts
  getAllDemoAccounts() {
    return {
      doctors: DEMO_ACCOUNTS.DOCTORS,
      patients: DEMO_ACCOUNTS.PATIENTS
    };
  },

  // Sign up new user
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Use provided UID for doctors, otherwise use Firebase UID
      const uid = userData.uid || user.uid;
      
      // Update auth profile display name
      if (userData.name) {
        await updateAuthProfile(user, { displayName: userData.name });
      }
      
      // Store user data in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        uid: uid,
        email: user.email,
        name: userData.name || '',
        role: userData.role || USER_ROLES.PATIENT,
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        avatarColor: userData.avatarColor || '#3498db',
        specialty: userData.specialty || '',
        experience: userData.experience || '',
        dob: userData.dob || '',
        medicalHistory: userData.medicalHistory || '',
        isDemo: userData.isDemo || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, user: { ...user, uid } };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code || error.message) 
      };
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code || error.message) 
      };
    }
  },

  // Demo login with random account
  async demoLogin(role: 'doctor' | 'patient') {
    const account = this.getRandomDemoAccount(role);
    return await this.login(account.email, account.password);
  },

  // Login with specific demo account
  async demoLoginSpecific(email: string, password: string) {
    return await this.login(email, password);
  },

  // Create all demo users
  async createAllDemoUsers() {
    console.log('Creating demo users...');
    const createdUsers = [];
    
    // Create doctors with specific IDs
    for (const doctor of DEMO_ACCOUNTS.DOCTORS) {
      try {
        const result = await this.signUp(doctor.email, doctor.password, {
          uid: doctor.uid,
          name: doctor.name,
          role: USER_ROLES.DOCTOR,
          phone: doctor.phone,
          specialty: doctor.specialty,
          avatarColor: doctor.avatarColor,
          isDemo: true
        });
        
        if (result.success) {
          createdUsers.push({ role: 'doctor', email: doctor.email });
          console.log(`✅ Created doctor: ${doctor.name}`);
        } else {
          console.log(`⚠️ Doctor ${doctor.email} may already exist`);
        }
      } catch (error) {
        console.log(`⚠️ Doctor ${doctor.email} may already exist`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create patients
    for (const patient of DEMO_ACCOUNTS.PATIENTS) {
      try {
        const result = await this.signUp(patient.email, patient.password, {
          name: patient.name,
          role: USER_ROLES.PATIENT,
          phone: patient.phone,
          dob: patient.dob,
          avatarColor: patient.avatarColor,
          isDemo: true
        });
        
        if (result.success) {
          createdUsers.push({ role: 'patient', email: patient.email });
          console.log(`✅ Created patient: ${patient.name}`);
        } else {
          console.log(`⚠️ Patient ${patient.email} may already exist`);
        }
      } catch (error) {
        console.log(`⚠️ Patient ${patient.email} may already exist`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return createdUsers;
  },

  // Get all users (for doctors to see patients)
  async getAllUsers(currentUserId: string, currentUserRole: string) {
    try {
      let q;
      
      if (currentUserRole === USER_ROLES.DOCTOR) {
        // Doctors can see all patients
        q = query(
          collection(db, COLLECTIONS.USERS),
          where('role', '==', USER_ROLES.PATIENT)
        );
      } else {
        // Patients can only see doctors
        q = query(
          collection(db, COLLECTIONS.USERS),
          where('role', '==', USER_ROLES.DOCTOR)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.uid !== currentUserId) {
          users.push(userData);
        }
      });
      
      return { success: true, users };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user data from Firestore
  async getCurrentUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: data.uid,
          email: data.email,
          name: data.name,
          role: data.role,
          phone: data.phone || '',
          avatar: data.avatar || '',
          avatarColor: data.avatarColor || '#3498db',
          specialty: data.specialty || '',
          experience: data.experience || '',
          dob: data.dob || '',
          medicalHistory: data.medicalHistory || '',
          isDemo: data.isDemo || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: error.message || 'Logout failed' 
      };
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code || error.message) 
      };
    }
  },

  // Update user profile
  async updateProfile(uid: string, data: Partial<User>) {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update profile' 
      };
    }
  },

  // Get error message from Firebase error code
  getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password sign-in is not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};