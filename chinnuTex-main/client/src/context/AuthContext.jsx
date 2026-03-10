import { createContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = userDoc.exists() ? userDoc.data() : {};
        setUser({
          _id: firebaseUser.uid,
          name: profile.name || firebaseUser.displayName || '',
          email: firebaseUser.email,
          phone: profile.phone || '',
          address: profile.address || '',
          company: profile.company || '',
          role: profile.role || 'user'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    const profile = userDoc.exists() ? userDoc.data() : {};
    const u = {
      _id: cred.user.uid,
      name: profile.name || cred.user.displayName || '',
      email: cred.user.email,
      phone: profile.phone || '',
      address: profile.address || '',
      company: profile.company || '',
      role: profile.role || 'user'
    };
    setUser(u);
    return { user: u };
  };

  const register = async (data) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(cred.user, { displayName: data.name });
    const profile = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      company: data.company || '',
      role: 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    const u = { _id: cred.user.uid, ...profile };
    setUser(u);
    return { user: u };
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    let profile;
    if (userDoc.exists()) {
      profile = userDoc.data();
    } else {
      profile = {
        name: result.user.displayName || '',
        email: result.user.email,
        phone: '',
        address: '',
        company: '',
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      await setDoc(doc(db, 'users', result.user.uid), profile);
    }
    const u = { _id: result.user.uid, ...profile };
    setUser(u);
    return { user: u };
  };

  const forgotPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, forgotPassword, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
