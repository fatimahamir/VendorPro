const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/vendors
router.get('/', protect, adminOnly, getVendors);

// @route   GET /api/vendors/:id
router.get('/:id', protect, getVendorById);

// @route   POST /api/vendors
router.post('/', protect, adminOnly, createVendor);

// @route   PUT /api/vendors/:id
router.put('/:id', protect, adminOnly, updateVendor);

// @route   DELETE /api/vendors/:id
router.delete('/:id', protect, adminOnly, deleteVendor);

module.exports = router;