import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth, SUPER_ADMIN_EMAIL } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authorized admin
  const isAuthorizedAdmin = (email: string | null) => {
    return email === SUPER_ADMIN_EMAIL;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(user ? isAuthorizedAdmin(user.email) : false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (!isAuthorizedAdmin(result.user.email)) {
        await signOut(auth);
        throw new Error('Unauthorized: Only the admin can access this area.');
      }
      
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email/password (fallback)
  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (!isAuthorizedAdmin(result.user.email)) {
        await signOut(auth);
        throw new Error('Unauthorized: Only the admin can access this area.');
      }
      
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signOut: signOutUser
  };
};
