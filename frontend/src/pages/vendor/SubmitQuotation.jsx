import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign, FiFileText, FiSend, FiCheckCircle, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SubmitQuotation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const requestId = location.state?.requestId || ''; 
  
  const [formData, setFormData] = useState({
    requestId: requestId,
    quotationAmount: '',
    proposalDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/quotations/responses`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/vendor/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="d-flex justify-content-center align-items-center fade-in" style={{ minHeight: '60vh' }}>
        <div className="card text-center p-5 shadow-sm" style={{ maxWidth: '450px' }}>
          <div 
            className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
            style={{ width: '80px', height: '80px', backgroundColor: '#00b398', color: '#fff' }}
          >
            <FiCheckCircle size={40} />
          </div>
          <h3 className="text-primary fw-bold mb-2">Quotation Submitted!</h3>
          <p className="text-muted mb-4">Your proposal has been sent successfully. Redirecting to dashboard...</p>
          <button className="btn btn-outline-primary" onClick={() => navigate('/vendor/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button 
          className="btn btn-outline-primary rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: '40px', height: '40px' }}
          onClick={() => navigate('/vendor/dashboard')}
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-primary mb-0 fw-bold">Submit Quotation</h2>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FiAlertCircle className="me-2" /> {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-bold">Quotation Request ID</label>
              <input 
                type="text" 
                className="form-control bg-light" 
                name="requestId"
                value={formData.requestId}
                onChange={handleChange}
                placeholder="Enter Request ID"
                required
                readOnly
              />
              <small className="text-muted">
                Yeh ID automatically fill ho jayegi agar aap Dashboard se aaye hain.
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">
                <FiDollarSign className="me-1" /> Quotation Amount
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">Rs.</span>
                <input 
                  type="number" 
                  className="form-control border-start-0 ps-0" 
                  name="quotationAmount"
                  value={formData.quotationAmount}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">
                <FiFileText className="me-1" /> Proposal Details & Terms
              </label>
              <textarea 
                className="form-control" 
                name="proposalDetails"
                value={formData.proposalDetails}
                onChange={handleChange}
                rows="6"
                placeholder="Describe your proposal, delivery time, payment terms, and any other relevant details..."
                required
              ></textarea>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary flex-grow-1 py-2"
                onClick={() => navigate('/vendor/dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex-grow-1 py-2 d-flex justify-content-center align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend /> Submit Quotation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuotation;