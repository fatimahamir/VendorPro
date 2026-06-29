const mongoose = require('mongoose');

const quotationResponseSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuotationRequest',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quotationAmount: {
    type: Number,
    required: [true, 'Quotation amount is required']
  },
  proposalDetails: {
    type: String,
    required: [true, 'Proposal details are required'],
    trim: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuotationResponse', quotationResponseSchema);