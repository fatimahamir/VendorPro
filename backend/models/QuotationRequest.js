const mongoose = require('mongoose');

const quotationRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quotation title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  assignedVendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuotationRequest', quotationRequestSchema);