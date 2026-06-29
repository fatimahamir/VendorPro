import React from 'react';
import { FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle, FiAward, FiClock } from 'react-icons/fi';

const CompareCard = ({ quotation, isCheapest, onStatusUpdate }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return { bg: '#198754', color: '#fff', label: 'Approved' };
      case 'rejected': return { bg: '#dc3545', color: '#fff', label: 'Rejected' };
      default: return { bg: '#ffc107', color: '#000', label: 'Pending' };
    }
  };

  const statusInfo = getStatusStyle(quotation.status);

  return (
    <div 
      className={`card h-100 fade-in ${isCheapest ? 'border-2' : ''}`}
      style={{ 
        borderColor: isCheapest ? '#00b398' : 'rgba(0, 179, 152, 0.2)',
        boxShadow: isCheapest ? '0 8px 20px rgba(0, 179, 152, 0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* "Most Cost-Effective" Badge */}
      {isCheapest && (
        <div 
          className="position-absolute top-0 end-0 px-3 py-1 text-white fw-bold"
          style={{ 
            backgroundColor: '#00b398', 
            borderBottomLeftRadius: '10px',
            fontSize: '0.75rem'
          }}
        >
          <FiAward className="me-1" /> Best Price
        </div>
      )}

      <div className="card-body d-flex flex-column">
        {/* Vendor Info */}
        <div className="mb-3">
          <h5 className="fw-bold mb-1 text-primary">
            {quotation.vendorId?.vendorName || 'Unknown Vendor'}
          </h5>
          <small className="text-muted">
            {quotation.vendorId?.companyName || 'No Company'}
          </small>
        </div>

        {/* Quotation Amount */}
        <div 
          className="rounded p-3 mb-3 d-flex align-items-center justify-content-between"
          style={{ backgroundColor: 'rgba(0, 179, 152, 0.1)' }}
        >
          <span className="text-muted small fw-bold">QUOTATION AMOUNT</span>
          <h3 className="fw-bold mb-0 text-primary d-flex align-items-center">
            <FiDollarSign className="me-1" />
            {quotation.quotationAmount?.toLocaleString() || '0'}
          </h3>
        </div>

        {/* Proposal Details */}
        <div className="mb-3 flex-grow-1">
          <h6 className="text-muted small fw-bold mb-2">PROPOSAL DETAILS</h6>
          <p className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {quotation.proposalDetails || 'No details provided.'}
          </p>
        </div>

        {/* Submission Date */}
        <div className="d-flex align-items-center text-muted small mb-3">
          <FiCalendar className="me-2" />
          <span>Submitted: {formatDate(quotation.submissionDate || quotation.createdAt)}</span>
        </div>

        {/* Status & Actions */}
        <div className="mt-auto">
          {quotation.status !== 'pending' ? (
            <div 
              className="badge rounded-pill px-3 py-2 w-100 text-center"
              style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, fontSize: '0.85rem' }}
            >
              {quotation.status === 'approved' ? <FiCheckCircle className="me-1" /> : <FiXCircle className="me-1" />}
              {statusInfo.label}
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-success flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                onClick={() => onStatusUpdate(quotation._id, 'approved')}
              >
                <FiCheckCircle /> Approve
              </button>
              <button 
                className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                onClick={() => onStatusUpdate(quotation._id, 'rejected')}
              >
                <FiXCircle /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareCard;