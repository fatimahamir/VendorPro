import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ UPDATED: Direct role-based navigation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // ✅ Check role and redirect directly to correct dashboard
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } else {
      setError(result.message);
      setLoading(false); // Only set loading false on error
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center fade-in" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          
          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{ width: '70px', height: '70px', backgroundColor: '#00b398', color: '#fff' }}
            >
              <FiLogIn size={32} />
            </div>
            <h2 className="fw-bold text-primary mb-1">Welcome Back!</h2>
            <p className="text-muted">Sign in to Vendor Management System</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2">
              <FiAlertCircle className="me-2 flex-shrink-0" />
              <small>{error}</small>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FiMail />
                </span>
                <input 
                  type="email" 
                  className="form-control border-start-0 ps-0" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FiLock />
                </span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-0" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Register here</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;