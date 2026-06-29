import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from "./pages/LandingPage";
// Layout Component
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageVendors from './pages/admin/ManageVendors';
import CreateRequest from './pages/admin/CreateRequest';
import QuotationRequests from './pages/admin/QuotationRequests';
import CompareQuotations from './pages/admin/CompareQuotations';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import SubmitQuotation from './pages/vendor/SubmitQuotation';
import MyRequests from './pages/vendor/MyRequests';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Public Routes (Bina Layout ke) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (DashboardLayout ke andar - Navbar & Sidebar ke sath) */}
      <Route element={<DashboardLayout />}>
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/vendors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageVendors />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-request" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateRequest />
          </ProtectedRoute>
        } />
            <Route path="/admin/requests" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <QuotationRequests />
  </ProtectedRoute>
} />
        <Route path="/admin/compare/:requestId" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CompareQuotations />
          </ProtectedRoute>
        } />
    

        {/* Vendor Routes */}
        <Route path="/vendor/dashboard" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/vendor/submit-quotation" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <SubmitQuotation />
          </ProtectedRoute>
        } />
        

<Route path="/vendor/requests" element={
  <ProtectedRoute allowedRoles={['vendor']}>
    <MyRequests />
  </ProtectedRoute>
} />
        
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;