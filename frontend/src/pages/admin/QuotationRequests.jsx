import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBarChart2, FiCalendar, FiUsers, FiEye } from 'react-icons/fi';

const QuotationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/quotations/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 className="text-primary mb-4 fw-bold">Quotation Requests</h2>

      {requests.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h4 className="text-muted">No Quotation Requests Yet</h4>
            <p className="text-muted">Create your first quotation request to get started.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate('/admin/create-request')}
            >
              Create Request
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((request) => (
            <div key={request._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-theme">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold text-primary mb-0">{request.title}</h5>
                    <span 
                      className={`badge rounded-pill ${request.status === 'open' ? 'bg-success' : 'bg-secondary'}`}
                    >
                      {request.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <p className="text-muted small flex-grow-1" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {request.description}
                  </p>

                  <div className="d-flex align-items-center text-muted small mb-2">
                    <FiCalendar className="me-2" />
                    <span>Deadline: {formatDate(request.deadline)}</span>
                  </div>

                  <div className="d-flex align-items-center text-muted small mb-3">
                    <FiUsers className="me-2" />
                    <span>Vendors: {request.assignedVendors?.length || 0}</span>
                  </div>

                  <button 
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
                    onClick={() => navigate(`/admin/compare/${request._id}`)}
                  >
                    <FiBarChart2 /> Compare Quotations
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationRequests;