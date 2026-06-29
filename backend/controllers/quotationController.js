const QuotationRequest = require('../models/QuotationRequest');
const QuotationResponse = require('../models/QuotationResponse');
const Vendor = require('../models/Vendor');


// @desc    Create quotation request (Admin)
// @route   POST /api/quotations/requests
// @access  Private/Admin
const createQuotationRequest = async (req, res) => {
  try {
    const { title, description, deadline, assignedVendors } = req.body;

    const quotationRequest = await QuotationRequest.create({

      title,
      description,
      deadline,
      assignedVendors: assignedVendors || [],
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      quotationRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all quotation requests
// @route   GET /api/quotations/requests
// @access  Private
const getQuotationRequests = async (req, res) => {
  try {
    let requests;
    
    if (req.user.role === 'admin') {
      requests = await QuotationRequest.find()
        .populate('assignedVendors', 'vendorName companyName')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      const vendor = await Vendor.findOne({ userId: req.user._id });
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor profile not found' });
      }
      requests = await QuotationRequest.find({ assignedVendors: vendor._id })
        .populate('assignedVendors', 'vendorName companyName')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single quotation request with responses
// @route   GET /api/quotations/requests/:id
// @access  Private
const getQuotationRequestById = async (req, res) => {
  try {
    const request = await QuotationRequest.findById(req.params.id)
      .populate('assignedVendors', 'vendorName companyName email')
      .populate('createdBy', 'name');

    if (!request) {
      res.status(404);
      throw new Error('Quotation request not found');
    }

    // ✅ Responses ko populate karein with vendor details
    const responses = await QuotationResponse.find({ requestId: req.params.id })
      .populate('vendorId', 'vendorName companyName userId')  // ✅ Yeh important hai
      .lean();  // Plain JavaScript objects return karein

    // Har response mein vendor ka user ID add karein
    const responsesWithUserInfo = responses.map(response => ({
      ...response,
      vendorUserId: response.vendorId?.userId || response.vendorId?._id
    }));

    res.json({
      success: true,
      request,
      responses: responsesWithUserInfo
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit quotation response (Vendor)
// @route   POST /api/quotations/responses
// @access  Private/Vendor
const submitQuotationResponse = async (req, res) => {
  try {
    const { requestId, quotationAmount, proposalDetails } = req.body;

    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor profile not found');
    }

    const request = await QuotationRequest.findById(requestId);
    if (!request) {
      res.status(404);
      throw new Error('Quotation request not found');
    }

    if (!request.assignedVendors.includes(vendor._id)) {
      res.status(403);
      throw new Error('You are not assigned to this quotation request');
    }

    const existingResponse = await QuotationResponse.findOne({ 
      requestId, 
      vendorId: vendor._id 
    });
    if (existingResponse) {
      res.status(400);
      throw new Error('You have already submitted a quotation for this request');
    }

    const response = await QuotationResponse.create({
      requestId,
      vendorId: vendor._id,
      quotationAmount,
      proposalDetails
    });

    res.status(201).json({
      success: true,
      response
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update quotation response status (Admin)
// @route   PUT /api/quotations/responses/:id/status
// @access  Private/Admin
const updateResponseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Response update karein
    const response = await QuotationResponse.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('vendorId', 'vendorName companyName');

    if (!response) {
      res.status(404);
      throw new Error('Quotation response not found');
    }

    // ✅ Jab koi quotation approve ho, toh request ko automatically close karein
    if (status === 'approved') {
      await QuotationRequest.findByIdAndUpdate(
        response.requestId,
        { status: 'closed' }
      );
      
      console.log(`✅ Request ${response.requestId} automatically closed`);
    }

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Compare quotations for a request (Admin)
// @route   GET /api/quotations/compare/:requestId
// @access  Private/Admin
const compareQuotations = async (req, res) => {
  try {
    const responses = await QuotationResponse.find({ requestId: req.params.requestId })
      .populate('vendorId', 'vendorName companyName email contactNumber')
      .sort({ quotationAmount: 1 });

    if (responses.length === 0) {
      return res.json({
        success: true,
        message: 'No quotations submitted yet',
        responses: [],
        cheapest: null
      });
    }

    const cheapest = responses.reduce((min, curr) => 
      curr.quotationAmount < min.quotationAmount ? curr : min
    , responses[0]);

    res.json({
      success: true,
      responses,
      cheapest,
      totalSubmissions: responses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/quotations/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const activeQuotations = await QuotationRequest.countDocuments({ status: 'open' });
    const pendingQuotations = await QuotationResponse.countDocuments({ status: 'pending' });
    const approvedQuotations = await QuotationResponse.countDocuments({ status: 'approved' });

    const recentActivities = await QuotationResponse.find()
      .populate('vendorId', 'vendorName companyName')
      .populate('requestId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalVendors,
        activeQuotations,
        pendingQuotations,
        approvedQuotations
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Zaroori: Saare functions ko export karein
module.exports = {
  createQuotationRequest,
  getQuotationRequests,
  getQuotationRequestById,
  submitQuotationResponse,
  updateResponseStatus,
  compareQuotations,
  getDashboardStats
};