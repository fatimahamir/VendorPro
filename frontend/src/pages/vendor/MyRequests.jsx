import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiDollarSign } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.get(`${API_URL}/quotations/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const requestsWithSubmissions = await Promise.all(
        response.data.requests.map(async (request) => {
          try {
            const res = await axios.get(`${API_URL}/quotations/requests/${request._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const mySubmission = res.data.responses.find(
              (resp) => resp.vendorId?._id?.toString() === user._id
            );
            
            return { ...request, mySubmission: mySubmission || null };
          } catch (err) {
            return { ...request, mySubmission: null };
          }
        })
      );
      
      setRequests(requestsWithSubmissions);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
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
      <h2 className="text-primary mb-4 fw-bold">My Quotation Requests</h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <FiAlertCircle className="me-2" /> {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h4 className="text-muted">No Requests Found</h4>
            <p className="text-muted">You haven't been assigned any quotation requests yet.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Request Title</th>
                  <th>Deadline</th>
                  <th>Request Status</th>
                  <th>Your Amount</th>
                  <th>Your Result</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className="fw-semibold">{req.title}</td>
                    <td>{formatDate(req.deadline)}</td>
                    <td>
                      <span className={`badge rounded-pill ${req.status === 'closed' ? 'bg-secondary' : 'bg-success'}`}>
                        {req.status === 'closed' ? 'Closed' : 'Open'}
                      </span>
                    </td>
                    <td>
                      {req.mySubmission ? (
                        <strong className="text-primary">
                          <FiDollarSign className="me-1" />
                          {req.mySubmission.quotationAmount?.toLocaleString()}
                        </strong>
                      ) : (
                        <span className="text-muted">Not Submitted</span>
                      )}
                    </td>
                    <td>
                      {req.mySubmission?.status === 'approved' && (
                        <span className="badge bg-success rounded-pill px-3 py-2">
                          <FiCheckCircle className="me-1" /> Approved
                        </span>
                      )}
                      {req.mySubmission?.status === 'rejected' && (
                        <span className="badge bg-danger rounded-pill px-3 py-2">
                          <FiXCircle className="me-1" /> Rejected
                        </span>
                      )}
                      {req.mySubmission?.status === 'pending' && (
                        <span className="badge bg-warning rounded-pill px-3 py-2">
                          <FiClock className="me-1" /> Pending
                        </span>
                      )}
                      {!req.mySubmission && (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;