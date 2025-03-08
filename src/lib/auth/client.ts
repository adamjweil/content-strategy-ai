import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '../firebase/client';

export const auth = getAuth(app);

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function checkAuthStatus(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
} 