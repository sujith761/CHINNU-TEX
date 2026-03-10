import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, Timestamp } from 'firebase/firestore';

// Designated admin emails that are auto-promoted on first login
const ADMIN_EMAILS = ['admin@chinnutex.com'];

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setAdmin({ _id: firebaseUser.uid, name: data.name, email: firebaseUser.email, role: 'admin' });
        } else {
          await signOut(auth);
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    let adminSnap = await getDoc(doc(db, 'admins', cred.user.uid));

    // Auto-create admin doc for designated emails if admins collection is empty or email is whitelisted
    if (!adminSnap.exists() && ADMIN_EMAILS.includes(email.toLowerCase())) {
      const adminsCol = await getDocs(collection(db, 'admins'));
      if (adminsCol.empty || ADMIN_EMAILS.includes(email.toLowerCase())) {
        await setDoc(doc(db, 'admins', cred.user.uid), {
          name: cred.user.displayName || 'Admin',
          email: email,
          role: 'admin',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        adminSnap = await getDoc(doc(db, 'admins', cred.user.uid));
      }
    }

    if (!adminSnap.exists()) {
      await signOut(auth);
      throw new Error('Not authorized as admin');
    }
    const data = adminSnap.data();
    const a = { _id: cred.user.uid, name: data.name, email: cred.user.email, role: 'admin' };
    setAdmin(a);
    return { admin: a };
  };

  const logout = async () => {
    await signOut(auth);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
