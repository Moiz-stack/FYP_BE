const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const courseController = require('../controllers/courseController');
const reviewController = require('../controllers/reviewController');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(protect);

// Stats route (admin only)
router.get('/stats', authorize('instructor'), statsController.getStats);

// Top courses route (public)
router.get('/TopCourses', courseController.getTopCourses);

// Student reviews route (public)
router.get('/studentReviews', reviewController.getStudentReviews);

// Contact form route (public)
router.post('/contact', contactController.submitContact);

module.exports = router; 


