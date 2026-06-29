const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token verify karne ka middleware
const protect = async (req, res, next) => {
  let token;

  // Authorization header se token nikalna
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer <token>" mein se token alag karna
      token = req.headers.authorization.split(' ')[1];
      
      // Token verify karna
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // User ko database se dhundna (password ko exclude karke)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }
};

// Admin role check karne ka middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admins only.' 
    });
  }
};

// Vendor role check karne ka middleware
const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Vendors only.' 
    });
  }
};

module.exports = { protect, adminOnly, vendorOnly };