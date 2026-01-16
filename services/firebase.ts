import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG } from '../constants/Config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Dynamically import auth to handle different Firebase versions
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  db = getFirestore(app);
  storage = getStorage(app);

  // Enable offline persistence for Firestore
  const { enableIndexedDbPersistence } = require('firebase/firestore');

  enableIndexedDbPersistence(db).catch((err: any) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support persistence.");
    }
  });

  console.log('✅ Firebase initialized successfully with persistence');
} catch (error) {
  console.error('Error initializing Firebase with persistence:', error);

  // Fallback to basic initialization
  try {
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully (basic mode)');
  } catch (fallbackError) {
    console.error('Failed to initialize Firebase:', fallbackError);
    throw new Error('Firebase initialization failed');
  }
}

export { app, auth, db, storage };
