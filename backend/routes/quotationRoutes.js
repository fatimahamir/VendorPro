const express = require('express');
const router = express.Router();
const {
  createQuotationRequest,
  getQuotationRequests,
  getQuotationRequestById,
  submitQuotationResponse,
  updateResponseStatus,
  compareQuotations,
  getDashboardStats
} = require('../controllers/quotationController');
const { protect, adminOnly, vendorOnly } = require('../middleware/authMiddleware');

// Dashboard stats (Admin only)
router.get('/dashboard', protect, adminOnly, getDashboardStats);

// Quotation Requests
router.post('/requests', protect, adminOnly, createQuotationRequest);
router.get('/requests', protect, getQuotationRequests);
router.get('/requests/:id', protect, getQuotationRequestById);

// Compare quotations (Admin only)
router.get('/compare/:requestId', protect, adminOnly, compareQuotations);

// Quotation Responses
router.post('/responses', protect, vendorOnly, submitQuotationResponse);
router.put('/responses/:id/status', protect, adminOnly, updateResponseStatus);

module.exports = router;