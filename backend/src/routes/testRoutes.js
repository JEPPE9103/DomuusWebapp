const express = require('express');
const { db } = require('../config/firebase');
const { doc, setDoc, getDoc } = require('firebase/firestore');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Test Firebase connection
router.get('/test', async (req, res) => {
  try {
    // Try to write to the database
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, {
      timestamp: new Date().toISOString(),
      status: 'connected'
    });

    // Try to read from the database
    const docSnap = await getDoc(testRef);
    const data = docSnap.data();

    res.json({
      message: 'Firebase connection successful',
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Firebase connection failed',
      error: error.message
    });
  }
});

// Protected test route
router.get('/user-data', authenticateUser, async (req, res) => {
  try {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', req.user.uid));
    const userData = userDoc.data();

    res.json({
      message: 'Firebase connection working',
      user: userData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Error fetching user data',
      error: error.message
    });
  }
});

module.exports = router; 