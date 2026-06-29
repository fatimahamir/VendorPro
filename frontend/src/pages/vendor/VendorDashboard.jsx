import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBriefcase, FiCalendar, FiSend, FiCheckCircle, FiClock, FiAlertCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VendorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNavigateToSubmit = (requestId) => {
    navigate('/vendor/submit-quotation', { state: { requestId } });
  };

  useEffect(() => {
    fetchVendorRequests();
  }, []);

  const fetchVendorRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const currentUserId = user._id.toString();
      
      const response = await axios.get(`${API_URL}/quotations/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const requestsWithSubmissions = await Promise.all(
        response.data.requests.map(async (request) => {
          try {
            const res = await axios.get(`${API_URL}/quotations/requests/${request._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const mySubmission = res.data.responses.find((resp) => {
              const vendorIdStr = resp.vendorId?._id?.toString();
              const vendorUserIdStr = resp.vendorId?.userId?.toString();
              const directVendorId = typeof resp.vendorId === 'string' ? resp.vendorId : null;
              
              const matches = 
                vendorIdStr === currentUserId || 
                vendorUserIdStr === currentUserId ||
                directVendorId === currentUserId;
              
              return matches;
            });
            
            return {
              ...request,
              mySubmission: mySubmission || null
            };
          } catch (err) {
            console.error('❌ Error:', err);
            return { ...request, mySubmission: null };
          }
        })
      );
      
      setRequests(requestsWithSubmissions);
    } catch (err) {
      setError('Failed to fetch requests.');
      console.error('❌ Fetch error:', err);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0 fw-bold">My Quotation Requests</h2>
        <span className="badge bg-primary px-3 py-2">
          Total: {requests.length}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FiAlertCircle className="me-2" /> {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <FiBriefcase size={48} className="text-muted mb-3" />
            <h4 className="text-muted">No Requests Assigned</h4>
            <p className="text-muted">You don't have any quotation requests at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => {
            const isRequestClosed = req.status === 'closed';
            const hasSubmitted = !!req.mySubmission;
            
            let statusBadge = null;
            let statusMessage = '';
            let statusColor = '';
            
            if (hasSubmitted) {
              if (req.mySubmission.status === 'approved') {
                statusBadge = { icon: <FiCheckCircle />, text: 'APPROVED', color: '#198754', bg: 'rgba(25, 135, 84, 0.1)' };
                statusMessage = '✅ Congratulations! Your quotation has been accepted.';
                statusColor = '#198754';
              } else if (req.mySubmission.status === 'rejected') {
                statusBadge = { icon: <FiXCircle />, text: 'REJECTED', color: '#dc3545', bg: 'rgba(220, 53, 69, 0.1)' };
                statusMessage = '❌ Your quotation was not selected this time.';
                statusColor = '#dc3545';
              } else {
                statusBadge = { icon: <FiClock />, text: 'PENDING', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' };
                statusMessage = '⏳ Your quotation is under review.';
                statusColor = '#ffc107';
              }
            }

            return (
              <div key={req._id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-theme">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-primary mb-0">{req.title}</h5>
                      <span className={`badge rounded-pill ${isRequestClosed ? 'bg-secondary' : 'bg-success'}`}>
                        {isRequestClosed ? 'Closed' : 'Open'}
                      </span>
                    </div>
                    
                    <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                      {req.description?.substring(0, 100)}...
                    </p>

                    <div className="d-flex align-items-center text-muted small mb-3">
                      <FiCalendar className="me-2" />
                      <span>Deadline: {formatDate(req.deadline)}</span>
                    </div>

                    {hasSubmitted && statusBadge && (
                      <div 
                        className="rounded p-3 mb-3 text-center"
                        style={{ 
                          backgroundColor: statusBadge.bg,
                          border: `2px solid ${statusBadge.color}`
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                          <span style={{ fontSize: '1.5rem', color: statusBadge.color }}>
                            {statusBadge.icon}
                          </span>
                          <h4 className="fw-bold mb-0" style={{ color: statusBadge.color }}>
                            {statusBadge.text}
                          </h4>
                        </div>
                        <p className="mb-2 small" style={{ color: statusBadge.color }}>
                          {statusMessage}
                        </p>
                        <div className="border-top pt-2 mt-2" style={{ borderColor: `${statusBadge.color}30` }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">Your Amount:</small>
                            <strong className="text-primary">
                              ${req.mySubmission.quotationAmount?.toLocaleString()}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-1">
                            <small className="text-muted">Submitted:</small>
                            <small className="text-muted">{formatDate(req.mySubmission.createdAt)}</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {hasSubmitted ? (
                      <button 
                        className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                        disabled
                      >
                        <FiCheckCircle /> Quotation Submitted
                      </button>
                    ) : (
                      <button 
                        className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
                          isRequestClosed ? 'btn-secondary' : 'btn-primary'
                        }`}
                        disabled={isRequestClosed}
                        onClick={() => handleNavigateToSubmit(req._id)}
                      >
                        {isRequestClosed ? (
                          <> <FiXCircle /> Request Closed </>
                        ) : (
                          <> <FiSend /> Submit Quotation </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;