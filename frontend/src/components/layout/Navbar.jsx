import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm">
      <div className="container-fluid px-4">
        {/* Brand Name */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <span className="text-primary me-2">
            <i className="bi bi-briefcase-fill"></i> {/* Ya koi bhi icon */}
          </span>
          <span className="text-primary">VendorPro</span>
        </Link>

        {/* Right Side Items */}
        <div className="d-flex align-items-center gap-3">
          
          {/* Theme Toggle Button */}
          <button 
            className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {/* User Info & Logout (Only if logged in) */}
          {user && (
            <>
              <div className="d-flex align-items-center gap-2 border-start ps-3 border-secondary">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '35px', 
                    height: '35px', 
                    backgroundColor: '#00b398', 
                    color: '#fff' 
                  }}
                >
                  <FiUser size={18} />
                </div>
                <div className="d-none d-md-block">
                  <small className="d-block fw-semibold" style={{ lineHeight: '1.2' }}>
                    {user.name}
                  </small>
                  <small className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>
                    {user.role}
                  </small>
                </div>
              </div>

              <button 
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <FiLogOut size={16} />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;