const Vendor = require('../models/Vendor');
const User = require('../models/User');

// @desc    Get all vendors (with search & filter)
// @route   GET /api/vendors?search=abc
// @access  Private/Admin
const getVendors = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query = {
        $or: [
          { vendorName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const vendors = await Vendor.find(query).populate('userId', 'name email');
    
    res.json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('userId', 'name email');
    
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new vendor
// @route   POST /api/vendors
// @access  Private/Admin
const createVendor = async (req, res) => {
  try {
    const { vendorName, companyName, email, contactNumber, businessAddress } = req.body;

    // Check if vendor already exists
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      res.status(400);
      throw new Error('Vendor with this email already exists');
    }

    // Create a user account for the vendor (with default password)
    const defaultPassword = 'vendor123'; // Vendor baad mein change kar sakta hai
    const user = await User.create({
      name: vendorName,
      email: email,
      password: defaultPassword,
      role: 'vendor'
    });

    // Create vendor
    const vendor = await Vendor.create({
      vendorName,
      companyName,
      email,
      contactNumber,
      businessAddress,
      userId: user._id
    });

    res.status(201).json({
      success: true,
      vendor,
      message: 'Vendor created successfully. Default password: vendor123'
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private/Admin
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      vendor: updatedVendor
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Vendor ka user account bhi delete karein
    await User.findByIdAndDelete(vendor.userId);
    await Vendor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};