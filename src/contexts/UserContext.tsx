// src/contexts/UserContext.tsx
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode 
} from 'react';
import { ref, onValue, off, get, DataSnapshot } from 'firebase/database';
import { getRealtimeDB } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface User {
  name: string;
  email: string;
  uid: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUserProfile: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUserProfile: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const db = getRealtimeDB();

  // Fetch user profile from Realtime DB
  const fetchUserProfile = async (uid: string) => {
    try {
      setLoading(true);
      const profileRef = ref(db, `profiles/${uid}`);
      const snapshot = await get(profileRef);
      
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        setUser({
          uid,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          email: profileData.email || '',
        });
      } else {
        console.warn(`No profile found for user: ${uid}`);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime listener for profile changes
  useEffect(() => {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const profileRef = ref(db, `profiles/${authUser.uid}`);
    
    const handleProfileChange = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        setUser({
          uid: authUser.uid,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          email: profileData.email || '',
        });
      } else {
        setUser(null);
      }
    };

    const listener = onValue(profileRef, handleProfileChange);

    return () => {
      off(profileRef, 'value', listener);
    };
  }, [authUser, db]);

  // Initialize user profile when auth changes
  useEffect(() => {
    if (authUser) {
      fetchUserProfile(authUser.uid);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [authUser]);

  const refreshUserProfile = () => {
    if (authUser) {
      fetchUserProfile(authUser.uid);
    }
  };

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  const contextValue: UserContextType = {
    user,
    setUser: updateUser,
    refreshUserProfile,
    loading,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};