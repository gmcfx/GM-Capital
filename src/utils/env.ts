// src/utils/env.ts
type EnvKeys = 
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID'
  | 'VITE_FIREBASE_MEASUREMENT_ID'
  | 'VITE_FIREBASE_DATABASE_URL';

export function getEnv(key: EnvKeys): string {
  // Client-side (browser)
  if (typeof window !== 'undefined') {
    return import.meta.env[key] || '';
  }
  
  // Server-side (Node.js)
  return process.env[key] || '';
}