// scripts/init-db.ts
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Determine environment file path
const envPath = path.resolve(process.cwd(), '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found at:', envPath);
  process.exit(1);
}

// Load environment variables
config({ path: envPath });

// Debug: Log loaded variables
console.log('Loaded environment variables from:', envPath);
console.log('VITE_FIREBASE_PROJECT_ID:', process.env.VITE_FIREBASE_PROJECT_ID ? '***' + process.env.VITE_FIREBASE_PROJECT_ID.slice(-4) : 'MISSING');
console.log('VITE_FIREBASE_DATABASE_URL:', process.env.VITE_FIREBASE_DATABASE_URL || 'MISSING');

// Validate critical variables
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Construct Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

console.log('Firebase configuration loaded successfully');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Database URL:', firebaseConfig.databaseURL);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function initializeDatabase() {
  try {
    // Create root structure
    await set(ref(db, '/'), {
      profiles: {},
      accounts: {},
      positions: {}
    });

    console.log('✅ Database structure initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();