import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ UPDATED: Direct role-based navigation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(formData.name, formData.email, formData.password, formData.role);

    if (result.success) {
      // ✅ Check role and redirect directly to correct dashboard
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center fade-in" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-5">
          
          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{ width: '70px', height: '70px', backgroundColor: '#00b398', color: '#fff' }}
            >
              <FiUserPlus size={32} />
            </div>
            <h2 className="fw-bold text-primary mb-1">Create Account</h2>
            <p className="text-muted">Join the Vendor Management System</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2">
              <FiAlertCircle className="me-2 flex-shrink-0" />
              <small>{error}</small>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FiUser />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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

            <div className="mb-3">
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
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Register As</label>
              <select 
                className="form-select" 
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="vendor">Vendor</option>
                <option value="admin">Administrator</option>
              </select>
              <small className="text-muted mt-1 d-block">
                * Select 'Administrator' to create the first admin account.
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus /> Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;