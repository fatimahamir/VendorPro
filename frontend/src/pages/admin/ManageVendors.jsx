import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    vendorName: '', companyName: '', email: '', contactNumber: '', businessAddress: ''
  });

  useEffect(() => {
    fetchVendors();
  }, [search]);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/vendors?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendors(res.data.vendors);
    } catch (err) {
      console.error('Fetch vendors error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingVendor 
        ? `${API_URL}/vendors/${editingVendor._id}`
        : `${API_URL}/vendors`;
      
      const method = editingVendor ? 'put' : 'post';
      await axios[method](url, formData, { headers: { Authorization: `Bearer ${token}` } });
      
      setShowModal(false);
      setEditingVendor(null);
      setFormData({ vendorName: '', companyName: '', email: '', contactNumber: '', businessAddress: '' });
      fetchVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      vendorName: vendor.vendorName,
      companyName: vendor.companyName,
      email: vendor.email,
      contactNumber: vendor.contactNumber,
      businessAddress: vendor.businessAddress
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/vendors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVendors();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0 fw-bold">Manage Vendors</h2>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Vendor
        </button>
      </div>

      <div className="input-group mb-4" style={{ maxWidth: '400px' }}>
        <span className="input-group-text bg-white border-end-0"><FiSearch className="text-muted" /></span>
        <input 
          type="text" 
          className="form-control border-start-0 ps-0" 
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Contact</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No vendors found</td></tr>
              ) : (
                vendors.map(v => (
                  <tr key={v._id}>
                    <td className="fw-semibold">{v.vendorName}</td>
                    <td>{v.companyName}</td>
                    <td>{v.email}</td>
                    <td>{v.contactNumber}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(v)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v._id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-primary">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Vendor Name</label>
                    <input type="text" className="form-control" name="vendorName" value={formData.vendorName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Company Name</label>
                    <input type="text" className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Contact Number</label>
                    <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-bold">Business Address</label>
                    <textarea className="form-control" name="businessAddress" rows="2" value={formData.businessAddress} onChange={handleChange} required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingVendor ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;