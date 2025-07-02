// src/lib/auth.ts
import { 
  getFirebaseAuth, 
  getFirestoreDB 
} from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword as fbUpdatePassword,
  User,
  type UserCredential
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const auth = getFirebaseAuth();
const db = getFirestoreDB();

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function signUp({
  email, 
  password, 
  firstName, 
  lastName
}: SignUpParams): Promise<User> {
  try {
    console.log('[Auth] Starting signup for:', email);
    
    // 1. Create auth user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const user = userCredential.user;
    console.log('[Auth] Auth user created:', user.uid);
    
    // 2. Send email verification
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`
      });
      console.log('[Auth] Verification email sent');
    } catch (emailError) {
      console.warn('[Auth] Failed to send verification email:', emailError);
      // Continue even if email fails
    }
    
    // 3. Create user profile in Firestore
    console.log('[Auth] Creating profile for:', user.uid);
    const userProfile = {
      uid: user.uid,
      email: email,
      first_name: firstName,
      last_name: lastName,
      created_at: new Date(),
      updated_at: new Date(),
      email_verified: false
    };
    
    await setDoc(doc(db, 'profiles', user.uid), userProfile);
    console.log('[Auth] Profile created successfully');
    
    return user;
  } catch (error: any) {
    console.error('[Auth] Signup process failed:', {
      error: error.message,
      email,
      timestamp: new Date().toISOString()
    });
    throw new Error(`Signup failed: ${error.message}`);
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { 
      user: userCredential.user, 
      error: null 
    };
  } catch (error: any) {
    return { 
      user: null, 
      error: error.message 
    };
  }
}

export async function signOut() {
  try {
    await fbSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user found');
    }
    
    await fbUpdatePassword(auth.currentUser, newPassword);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Additional Firebase auth utilities
export async function resendVerificationEmail() {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    
    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/verify-email`
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}