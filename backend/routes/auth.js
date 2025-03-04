const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js');

// Middleware to wrap controller functions for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(async (req, res, next) => {
  console.log('Received registration data:', req.body);

  try {
    await authController.register(req, res); // Delegate to controller
    console.log('Registration completed successfully');
  } catch (err) {
    console.error('Registration route error:', err.name, err.message);
    // Handle known error types
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    next(err); // Pass unhandled errors to middleware
  }
}));

router.post('/login', asyncHandler(async (req, res, next) => {
  console.log('Received login data:', req.body);

  try {
    await authController.login(req, res); // Delegate to controller
    console.log('Login completed successfully');
  } catch (err) {
    console.error('Login route error:', err.name, err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    next(err); // Pass unhandled errors to middleware
  }
}));

// Export the router
module.exports = router;