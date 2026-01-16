import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/auth';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      setError(null);
      
      if (authUser) {
        try {
          const data = await AuthService.getCurrentUserData(authUser.uid);
          setUserData(data);
        } catch (err: any) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    const result = await AuthService.signUp(email, password, userData);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    
    return result;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await AuthService.login(email, password);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    return result;
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const result = await AuthService.logout();
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Logout failed');
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    const result = await AuthService.resetPassword(email);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Reset password failed');
    }
    
    return result;
  };

  const demoLogin = async (role: 'doctor' | 'patient') => {
    setLoading(true);
    setError(null);
    const result = await AuthService.demoLogin(role);
    setLoading(false);
    
    if (!result.success) {
      setError(result.error || 'Demo login failed');
    }
    
    return result;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      setError('No user logged in');
      return { success: false, error: 'No user logged in' };
    }
    
    setLoading(true);
    setError(null);
    const result = await AuthService.updateProfile(user.uid, data);
    setLoading(false);
    
    if (result.success && userData) {
      setUserData({ ...userData, ...data });
    } else if (!result.success) {
      setError(result.error || 'Update failed');
    }
    
    return result;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    userData,
    loading,
    error,
    signUp,
    login,
    logout,
    resetPassword,
    demoLogin,
    updateProfile,
    clearError
  };
};

