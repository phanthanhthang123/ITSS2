const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getMyProfile, getProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/', protect, authorize('student'), createOrUpdateProfile);
router.get('/me', protect, getMyProfile);
router.get('/:userId', protect, getProfile);

module.exports = router;
