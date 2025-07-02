import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updatePassword as fbUpdatePassword,
} from 'firebase/auth';
import { 
  ref, 
  get, 
  set, 
  query, 
  orderByChild, 
  equalTo,
  onValue,
  off
} from 'firebase/database';
import { getFirebaseAuth, getRealtimeDB } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

interface Account {
  id: string;
  user_id: string;
  account_type: 'demo' | 'real';
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  openPositions: number;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: Profile | null;
  accounts: Account[];
  activeAccount: Account | null;
  loading: boolean;
  setActiveAccount: (account: Account | null) => void;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshAccountData: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  resendConfirmation: () => Promise<void>;
  completePasswordReset: (password: string) => Promise<{ error: Error | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getFirebaseAuth();
  const db = getRealtimeDB();
  const { toast } = useToast();

  const checkEmailVerified = useCallback((user: FirebaseUser | null) => {
    const verified = !!user?.emailVerified;
    setIsEmailVerified(verified);
    return verified;
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const profileRef = ref(db, `profiles/${userId}`);
      const profileSnapshot = await get(profileRef);

      let userProfile: Profile;
      
      if (profileSnapshot.exists()) {
        const data = profileSnapshot.val();
        userProfile = {
          uid: userId,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          email_verified: data.email_verified || false,
        };
      } else {
        // Create new profile
        const currentUser = auth.currentUser;
        userProfile = {
          uid: userId,
          first_name: '',
          last_name: '',
          email: currentUser?.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verified: currentUser?.emailVerified || false,
        };
        
        await set(profileRef, userProfile);
      }

      setProfile(userProfile);

      // Fetch accounts
      const accountsRef = ref(db, 'accounts');
      const accountsQuery = query(
        accountsRef,
        orderByChild('user_id'),
        equalTo(userId)
      );
      
      const accountsSnapshot = await get(accountsQuery);
      const userAccounts: Account[] = [];
      
      if (accountsSnapshot.exists()) {
        accountsSnapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          userAccounts.push({
            id: childSnapshot.key as string,
            user_id: data.user_id,
            account_type: data.account_type || 'demo',
            balance: data.balance || 0,
            currency: data.currency || 'USD',
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            openPositions: data.openPositions || 0
          });
        });
      }

      setAccounts(userAccounts);
      
      // Set active account to demo account by default
      if (userAccounts.length) {
        const demoAccount = userAccounts.find(a => a.account_type === 'demo');
        setActiveAccount(demoAccount || userAccounts[0]);
      } else {
        setActiveAccount(null);
      }
      
      return userProfile;
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        toast({
          title: 'Access Denied',
          description: 'You don\'t have permission to access this data',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Data Error',
          description: 'Could not fetch your account data',
          variant: 'destructive',
        });
      }
      
      return null;
    }
  }, [auth, db, toast]);

  useEffect(() => {
    if (!user) return;
    
    // Profile listener
    const profileRef = ref(db, `profiles/${user.uid}`);
    const profileListener = onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updatedProfile = {
          uid: user.uid,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          email_verified: data.email_verified || false,
        };
        setProfile(updatedProfile);
      }
    });
    
    // Accounts listener
    const accountsQuery = query(
      ref(db, 'accounts'),
      orderByChild('user_id'),
      equalTo(user.uid)
    );
    
    const accountsListener = onValue(accountsQuery, (snapshot) => {
      const userAccounts: Account[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          userAccounts.push({
            id: childSnapshot.key as string,
            user_id: data.user_id,
            account_type: data.account_type || 'demo',
            balance: data.balance || 0,
            currency: data.currency || 'USD',
            created_at: data.created_at || '',
            updated_at: data.updated_at || '',
            openPositions: data.openPositions || 0
          });
        });
      }
      setAccounts(userAccounts);
      
      // Update active account if needed
      if (activeAccount && !userAccounts.some(a => a.id === activeAccount.id)) {
        const demoAccount = userAccounts.find(a => a.account_type === 'demo');
        setActiveAccount(demoAccount || userAccounts[0] || null);
      }
    });
    
    return () => {
      off(profileRef, 'value', profileListener);
      off(accountsQuery, 'value', accountsListener);
    };
  }, [user, db, activeAccount]);

  // Auth state handler
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!isMounted) return;
        
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Update email verification status
          const verified = checkEmailVerified(firebaseUser);
          setIsEmailVerified(verified);
          
          // Fetch user data
          await fetchUserData(firebaseUser.uid);
        } else {
          // User signed out
          setProfile(null);
          setAccounts([]);
          setActiveAccount(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to process authentication state',
          variant: 'destructive',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, checkEmailVerified, fetchUserData, toast, db]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      
      toast({ 
        title: 'Sign In Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      return { error: new Error(errorMessage) };
    }
  }, [auth, toast]);

  // Sign up new user
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      const { email, password, firstName, lastName } = data;
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      const uid = userCredential.user.uid;
      
      // Create user profile
      const userProfile: Profile = {
        uid: uid,
        first_name: firstName,
        last_name: lastName,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: false,
      };
      
      await set(ref(db, `profiles/${uid}`), userProfile);
      
      // Create DEMO account with $50,000
      const demoAccount: Account = {
        id: `demo_${Date.now()}`,
        user_id: uid,
        account_type: 'demo',
        balance: 50000,
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        openPositions: 0
      };
      
      // Create REAL account with $0
      const realAccount: Account = {
        id: `real_${Date.now()}`,
        user_id: uid,
        account_type: 'real',
        balance: 0,
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        openPositions: 0
      };
      
      // Save accounts to database
      await set(ref(db, `accounts/${demoAccount.id}`), demoAccount);
      await set(ref(db, `accounts/${realAccount.id}`), realAccount);
      
      // Update state
      setAccounts([demoAccount, realAccount]);
      setActiveAccount(demoAccount); // Set demo as default
      
      // Send verification email
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email`
      });
      
      toast({ 
        title: 'Account Created', 
        description: 'Your demo account with $50,000 has been created. Please verify your email.' 
      });
      
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'Account creation failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      
      toast({ 
        title: 'Sign Up Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      return { error: new Error(errorMessage) };
    }
  }, [auth, db, toast]);

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setProfile(null);
      setAccounts([]);
      setActiveAccount(null);
    } catch (error: any) {
      toast({ 
        title: 'Sign Out Failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  }, [auth, toast]);

  // Refresh account data
  const refreshAccountData = useCallback(async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  }, [fetchUserData, user]);

  // Send password reset email
  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`
      });
      
      toast({ 
        title: 'Password Reset Email Sent', 
        description: 'Check your inbox for the link.' 
      });
      
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      }
      
      toast({ 
        title: 'Password Reset Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      return { error: new Error(errorMessage) };
    }
  }, [auth, toast]);

  // Resend email confirmation
  const resendConfirmation = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      await sendEmailVerification(currentUser, {
        url: `${window.location.origin}/verify-email`
      });
      
      toast({ 
        title: 'Confirmation Sent', 
        description: 'Check your inbox.' 
      });
    } catch (error: any) {
      toast({ 
        title: 'Resend Failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  }, [auth, toast]);

  // Update password
  const completePasswordReset = useCallback(async (password: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      await fbUpdatePassword(currentUser, password);
      
      toast({ 
        title: 'Password Updated', 
        description: 'Your password has been changed.' 
      });
      
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'Password update failed. Please try again.';
      
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please reauthenticate before changing password.';
      }
      
      toast({
        title: 'Password Update Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      return { error: new Error(errorMessage) };
    }
  }, [auth, toast]);

  const contextValue: AuthContextType = {
    user,
    profile,
    accounts,
    activeAccount,
    loading,
    setActiveAccount,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    refreshAccountData,
    resetPassword,
    resendConfirmation,
    completePasswordReset,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};