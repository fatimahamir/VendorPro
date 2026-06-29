import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', deadline: '', assignedVendors: []
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/vendors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendors(res.data.vendors);
    } catch (err) {
      console.error('Fetch vendors error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVendorToggle = (vendorId) => {
    setFormData(prev => {
      const assigned = prev.assignedVendors.includes(vendorId)
        ? prev.assignedVendors.filter(id => id !== vendorId)
        : [...prev.assignedVendors, vendorId];
      return { ...prev, assignedVendors: assigned };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/quotations/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Quotation request created successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-primary mb-4 fw-bold">Create Quotation Request</h2>
      
      <div className="card">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold"><FiFileText className="me-2" />Request Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Office Supplies Q3" required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Describe requirements, specifications, delivery terms..." required></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold"><FiCalendar className="me-2" />Submission Deadline</label>
              <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold mb-3"><FiUsers className="me-2" />Assign Vendors</label>
              <div className="row g-2">
                {vendors.map(vendor => (
                  <div className="col-md-6" key={vendor._id}>
                    <div 
                      className={`p-3 border rounded d-flex align-items-center justify-content-between cursor-pointer ${formData.assignedVendors.includes(vendor._id) ? 'border-primary bg-theme-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleVendorToggle(vendor._id)}
                    >
                      <div>
                        <div className="fw-semibold">{vendor.vendorName}</div>
                        <small className="text-muted">{vendor.companyName}</small>
                      </div>
                      {formData.assignedVendors.includes(vendor._id) && <FiCheck className="text-primary" size={20} />}
                    </div>
                  </div>
                ))}
              </div>
              {vendors.length === 0 && <p className="text-muted mt-2">No vendors available. Please add vendors first.</p>}
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary flex-grow-1" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading || vendors.length === 0}>
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;