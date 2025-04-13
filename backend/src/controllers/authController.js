const { auth, db } = require('../config/firebase');
const { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} = require('firebase/auth');
const { doc, setDoc, getDoc } = require('firebase/firestore');

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    });

    // Get the ID token
    const token = await user.getIdToken();

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.uid,
        email: user.email,
        username
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    // Get the ID token
    const token = await user.getIdToken();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.uid,
        email: user.email,
        username: userData.username,
        role: userData.role
      }
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid credentials', 
      error: error.message 
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    await signOut(auth);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging out', 
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  logout
}; 