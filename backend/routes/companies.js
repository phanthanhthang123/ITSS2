const express = require('express');
const router = express.Router();
const {
  getCompanies, getCompany, createCompany, updateCompany, getMyCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCompanies);

// Protected routes (phải đặt /me trước /:id)
router.get('/me', protect, authorize('company'), getMyCompany);
router.get('/:id', getCompany);
router.post('/', protect, authorize('company'), createCompany);
router.put('/:id', protect, authorize('company'), updateCompany);

module.exports = router;
