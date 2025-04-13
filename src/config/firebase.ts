import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSgeVSetRU0eJT5ZzldFl2oHAVZ2flv_A",
  authDomain: "crib-beta.firebaseapp.com",
  databaseURL: "https://crib-beta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "crib-beta",
  storageBucket: "crib-beta.firebasestorage.app",
  messagingSenderId: "169244644214",
  appId: "1:169244644214:web:0d9be8f1c3ff757bb22057"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 