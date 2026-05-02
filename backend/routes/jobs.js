const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, createJob, updateJob, getMyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);

// Protected routes
router.get('/my-jobs', protect, authorize('company'), getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('company'), createJob);
router.put('/:id', protect, authorize('company'), updateJob);

module.exports = router;
