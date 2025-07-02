// src/lib/firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { getDatabase, type Database } from 'firebase/database';

// Define the FirebaseConfig type
type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
};

//  Firebase config from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Enhanced validation
const validateConfig = () => {
  const required: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId'
  ];
  
  const missing = required.filter(key => !firebaseConfig[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Firebase config: ${missing.join(', ')}`);
  }

  console.debug('Firebase Config:', {
    ...firebaseConfig,
    apiKey: '***' + firebaseConfig.apiKey?.slice(-5)
  });
};

try {
  validateConfig();
} catch (error) {
  console.error('Firebase configuration error:', error);
  throw error;
}

const isClient = typeof window !== 'undefined';

let app: FirebaseApp;
export let auth: Auth;
export let db: Firestore;
let rtdb: Database;
let analytics: Analytics | null = null;

export const initializeFirebase = (): void => {
  if (app) return;

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    auth.languageCode = 'en'; // Set auth language
    
    db = getFirestore(app);
    rtdb = getDatabase(app);
    
    console.log('✅ Firebase services initialized');
  } catch (error) {
    console.error('Firebase initialization failed', error);
    throw new Error('Firebase initialization error. Check your configuration.');
  }
};

export const initializeAnalytics = async (): Promise<void> => {
  if (!isClient || analytics) return;
  
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      setAnalyticsCollectionEnabled(analytics, import.meta.env.PROD);
      console.log(`📈 Analytics ${import.meta.env.PROD ? 'enabled' : 'disabled'}`);
    }
  } catch (error) {
    console.warn('Analytics initialization skipped:', error);
  }
};

export const getFirebaseApp = (): FirebaseApp => app;
export const getFirebaseAuth = (): Auth => auth;
export const getFirestoreDB = (): Firestore => db;
export const getRealtimeDB = (): Database => rtdb;
export const getAnalyticsInstance = (): Analytics | null => analytics;

// Initialize immediately
initializeFirebase();

// Initialize Analytics after page load
if (isClient) {
  window.addEventListener('load', initializeAnalytics);
}