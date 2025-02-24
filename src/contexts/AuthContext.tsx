"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  Auth,
  User,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && window.location.pathname === '/login') {
        console.log('User is authenticated, redirecting to dashboard...');
        router.replace('/dashboard');
      } else if (!user && window.location.pathname === '/dashboard') {
        console.log('User is not authenticated, redirecting to login...');
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  const createSession = async (user: User) => {
    console.log('Creating session for user:', user.email);
    try {
      const idToken = await user.getIdToken();
      console.log('Got ID token, creating session cookie...');
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        console.error('Session creation failed:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Failed to create session');
      }
      
      console.log('Session created successfully!');
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Starting signup process...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created, creating session...');
    await createSession(userCredential.user);
    console.log('Creating user profile in Firestore...');
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      createdAt: new Date().toISOString()
    });
    console.log('Signup process complete!');
  };

  const signIn = async (email: string, password: string) => {
    console.log('Starting signin process...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User authenticated, creating session...');
    await createSession(userCredential.user);
    console.log('Signin process complete!');
  };

  const signInWithGoogle = async () => {
    console.log('Starting Google signin process...');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log('Google auth successful, creating session...');
      await createSession(userCredential.user);
      
      console.log('Creating/updating user profile in Firestore...');
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }, { merge: true });
        console.log('Firestore document created/updated successfully');
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        // Continue even if Firestore fails - user is still authenticated
        console.log('Continuing despite Firestore error...');
      }
      
      console.log('Google signin process complete!');
    } catch (error: any) {
      console.error('Google signin error:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Unable to create user profile. Please try again later.');
      }
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 