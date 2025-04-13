const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { body } = require('express-validator');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required'),
];

// Routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', authenticateUser, logout);

module.exports = router; 