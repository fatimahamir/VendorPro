const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Configuration (Single, Clean)
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://vendorpro-frontend.vercel.app'  // ✅ Baad mein apna Vercel frontend URL add karein
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Vendor Management System API is running' 
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));

// Error Handling Middleware (must be at the end)
app.use(notFound);
app.use(errorHandler);

// ✅ Vercel Compatibility
const PORT = process.env.PORT || 5000;

// Sirf local development mein server start karein
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
  });
}

// ✅ Vercel ke liye app export karein
module.exports = app;