
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup as firebaseSignIn, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getSampleTransactions, getSampleGoals } from "../utils/mockData";

const isFirebaseKey = (key: any) => typeof key === 'string' && key.startsWith('AIza') && key.length > 20;

const firebaseConfig = {
  apiKey: isFirebaseKey(process.env.API_KEY) ? process.env.API_KEY : "AIzaSyD4VAngCT1Cxya66dg4IoWKaFXuaWlgRns",
  authDomain: "wiseupai-fcb16.firebaseapp.com",
  projectId: "wiseupai-fcb16",
  storageBucket: "wiseupai-fcb16.firebasestorage.app",
  messagingSenderId: "30995932232",
  appId: "1:30995932232:web:16e51fbf656fcdb9f8e47d",
  measurementId: "G-X9V141QH5M"
};

let app: any;
let auth: any;
let db: any;
let isRealFirebase = false;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  isRealFirebase = true;
} catch (e) {
  console.warn("Firebase initialization skipped. Operating in Local mode.");
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (localStorage.getItem('wiseup_force_mock') === 'true') {
    return mockLogin();
  }

  if (isRealFirebase && auth) {
    try {
      return await firebaseSignIn(auth, googleProvider);
    } catch (e: any) {
      console.error("Firebase Auth Error:", e.code);
      // Auto-fallback for common domain/config errors
      if (['auth/unauthorized-domain', 'auth/operation-not-allowed', 'auth/invalid-api-key'].includes(e.code)) {
        return mockLogin();
      }
      throw e;
    }
  }
  return mockLogin();
};

export const mockLogin = (customEmail?: string, customName?: string) => {
  const emailVal = customEmail || "demo@wiseup.ai";
  const nameVal = customName || (emailVal === "user@example.com" ? "Jay Sonar" : "Demo user");
  const avatarVal = "/default-avatar.png";

  const mockUser = {
    uid: "demo-user-session",
    displayName: nameVal, 
    photoURL: avatarVal, 
    email: emailVal
  };
  localStorage.setItem('wiseup_mock_user', JSON.stringify(mockUser));
  window.dispatchEvent(new Event('auth-change'));
  return { user: mockUser };
};

export const signOut = async () => {
  if (isRealFirebase && auth) {
    try { await firebaseSignOut(auth); } catch(e) {}
  }
  localStorage.removeItem('wiseup_mock_user');
  localStorage.removeItem('wiseup_force_mock');
  window.dispatchEvent(new Event('auth-change'));
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  const checkState = (fbUser: any = null) => {
    const mock = localStorage.getItem('wiseup_mock_user');
    if (mock) {
      try {
        callback(JSON.parse(mock));
        return;
      } catch(e) {
        localStorage.removeItem('wiseup_mock_user');
      }
    }
    callback(fbUser || null);
  };

  const handleLocal = () => checkState();
  window.addEventListener('auth-change', handleLocal);

  let unsubFb = () => {};
  if (isRealFirebase && auth) {
    unsubFb = firebaseOnAuth(auth, (user) => checkState(user));
  } else {
    checkState();
  }

  return () => {
    window.removeEventListener('auth-change', handleLocal);
    unsubFb();
  };
};

export const saveUserData = async (uid: string, data: any) => {
  localStorage.setItem(`wiseup_data_${uid}`, JSON.stringify(data));
  if (isRealFirebase && db && !uid.includes('demo')) {
    try {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, data, { merge: true });
    } catch (e) {}
  }
};

export const loadUserData = async (uid: string) => {
  if (isRealFirebase && db && !uid.includes('demo')) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) return userDoc.data();
    } catch (e) {}
  }
  const localData = localStorage.getItem(`wiseup_data_${uid}`);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {}
  }

  // Provide initial dataset for demo user
  if (uid.includes('demo')) {
    const defaultData = {
      monthlyAllowance: 15000,
      goals: getSampleGoals(),
      transactions: getSampleTransactions()
    };
    localStorage.setItem(`wiseup_data_${uid}`, JSON.stringify(defaultData));
    return defaultData;
  }

  return null;
};
