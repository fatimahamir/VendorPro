import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiPlusCircle, 
  FiBarChart2, 
  FiSend 
} from 'react-icons/fi';

const Sidebar = () => {
  const { isAdmin, isVendor } = useAuth();

  // Admin Links
  const adminLinks = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/vendors', icon: <FiUsers />, label: 'Manage Vendors' },
    { path: '/admin/create-request', icon: <FiPlusCircle />, label: 'Create Request' },
    { path: '/admin/requests', icon: <FiBarChart2 />, label: 'View Requests' }, // ✅ Yeh line update karein
  ];

  // Vendor Links
  const vendorLinks = [
    { path: '/vendor/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/vendor/requests', icon: <FiFileText />, label: 'My Requests' },
    { path: '/vendor/submit-quotation', icon: <FiSend />, label: 'Submit Quotation' },
  ];

  const links = isAdmin ? adminLinks : vendorLinks;

  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: '250px', minHeight: 'calc(100vh - 70px)' }}>
      <h6 className="text-uppercase text-muted small fw-bold mb-3 px-2">
        {isAdmin ? 'Admin Menu' : 'Vendor Menu'}
      </h6>
      
      <ul className="nav flex-column">
        {links.map((link) => (
          <li className="nav-item mb-1" key={link.path}>
            <NavLink 
              to={link.path} 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
              }
            >
              <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
              <span className="fw-medium">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;