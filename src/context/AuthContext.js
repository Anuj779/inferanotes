'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, hasApiKey } from '@/lib/firebase';
import { createUser } from '@/lib/firestore';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKey) {
      if (localStorage.getItem('demo_user')) {
        setUser({
          uid: 'demo-12345',
          email: 'student@demo.app',
          displayName: 'Demo Student',
          photoURL: '',
          plan: 'free'
        });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Create/update user in Firestore
        try {
          await createUser(firebaseUser.uid, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } catch (err) {
          console.error('Error creating user:', err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!hasApiKey) {
      const mockUser = {
        uid: 'demo-12345',
        email: 'student@demo.app',
        displayName: 'Demo Student',
        photoURL: '',
        plan: 'free'
      };
      setUser(mockUser);
      localStorage.setItem('demo_user', 'true');
      return mockUser;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!hasApiKey) {
      setUser(null);
      localStorage.removeItem('demo_user');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
