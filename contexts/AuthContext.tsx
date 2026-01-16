import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserProfile, createUserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  loading: true 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Try to get existing user profile
          let profile = await getUserProfile(currentUser.uid);
          
          // If profile doesn't exist, create it
          if (!profile) {
            console.log('Creating new user profile for:', currentUser.uid);
            await createUserProfile(currentUser);
            profile = await getUserProfile(currentUser.uid);
          }
          
          setUserData(profile);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Set minimal user data if profile fetch fails
          setUserData({
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            role: 'patient',
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};