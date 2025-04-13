import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userData: any;
  register: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkExistingUser = async (email: string, username: string) => {
    // Check for existing email
    const emailQuery = query(collection(db, 'users'), where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);
    
    if (!emailSnapshot.empty) {
      throw new Error('An account with this email already exists');
    }

    // Check for existing username
    const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
      throw new Error('This username is already taken');
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting registration process...');
      
      // Create Firebase Auth account first
      console.log('Creating Firebase Auth account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Firebase Auth account created:', user.uid);

      // Create user document in Firestore
      console.log('Creating Firestore document...');
      try {
        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
        console.log('Firestore document created successfully');
      } catch (firestoreError: any) {
        console.error('Firestore Error:', firestoreError);
        // If Firestore fails, we should clean up the auth user
        await user.delete();
        throw firestoreError;
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // For Firebase auth errors, provide more user-friendly messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 