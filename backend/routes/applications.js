const express = require('express');
const router = express.Router();
const { apply, getApplications, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Tất cả routes đều cần auth
router.post('/', protect, authorize('student'), apply);
router.get('/', protect, getApplications);
router.patch('/:id', protect, authorize('company'), updateStatus);

module.exports = router;
