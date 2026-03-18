import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
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
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let profile;
        if (userDoc.exists()) {
          profile = userDoc.data();
        } else {
          // Create user doc for new Google redirect sign-ins
          profile = {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email,
            phone: '',
            address: '',
            company: '',
            role: 'user',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          await setDoc(userDocRef, profile);
        }
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

  const loginWithGoogle = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Fetch the Google OAuth client ID from Firebase project config
        let clientId;
        try {
          const resp = await fetch(
            `https://identitytoolkit.googleapis.com/v1/projects/chinnu-textiles/config?key=AIzaSyBdQk0U8AyccBbqP7L-R2Urxs7T8KDUHmM`
          );
          const data = await resp.json();
          const providers = data.signIn?.idpConfig || [];
          const google = providers.find(p => p.provider === 'GOOGLE');
          if (google?.clientId) {
            clientId = google.clientId;
          }
        } catch { /* ignore */ }
        if (!clientId) {
          try {
            const resp = await fetch(
              `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyBdQk0U8AyccBbqP7L-R2Urxs7T8KDUHmM`
            );
            const data = await resp.json();
            const google = (data.idpConfig || []).find(p => p.provider === 'GOOGLE');
            if (google?.clientId) clientId = google.clientId;
          } catch { /* ignore */ }
        }
        if (!clientId) {
          reject(new Error('Google sign-in is not enabled. Please enable Google in Firebase Console → Authentication → Sign-in method.'));
          return;
        }

        // 2. Load Google Identity Services script
        if (!window.google?.accounts?.oauth2) {
          await new Promise((res, rej) => {
            if (window.google?.accounts?.oauth2) return res();
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => res();
            script.onerror = () => rej(new Error('Failed to load Google sign-in'));
            document.head.appendChild(script);
          });
        }

        // 3. Open Google consent screen and get access token
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error(tokenResponse.error_description || tokenResponse.error));
              return;
            }
            try {
              // 4. Sign in to Firebase with the Google access token
              const credential = GoogleAuthProvider.credential(null, tokenResponse.access_token);
              const result = await signInWithCredential(auth, credential);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          },
          error_callback: (err) => {
            reject(new Error(err?.message || 'Google sign-in was cancelled'));
          }
        });
        tokenClient.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    });
  };

  const forgotPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const completeProfile = async (data) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    await setDoc(doc(db, 'users', uid), {
      phone: data.phone,
      address: data.address,
      updatedAt: Timestamp.now()
    }, { merge: true });
    setUser(prev => ({ ...prev, phone: data.phone, address: data.address }));
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, forgotPassword, logout, loading, updateUser, completeProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
