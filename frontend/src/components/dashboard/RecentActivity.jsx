import React from 'react';
import { FiCheckCircle, FiClock, FiXCircle, FiFileText } from 'react-icons/fi';

const RecentActivity = ({ activities = [] }) => {
  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { icon: <FiCheckCircle />, color: '#00b398', label: 'Approved' };
      case 'pending':
        return { icon: <FiClock />, color: '#ffc107', label: 'Pending' };
      case 'rejected':
        return { icon: <FiXCircle />, color: '#dc3545', label: 'Rejected' };
      default:
        return { icon: <FiFileText />, color: '#6c757d', label: 'Submitted' };
    }
  };

  // Format date (e.g., "2 hours ago", "3 days ago")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Empty state
  if (activities.length === 0) {
    return (
      <div className="card fade-in">
        <div className="card-header bg-transparent border-theme">
          <h5 className="mb-0 text-primary">Recent Activities</h5>
        </div>
        <div className="card-body text-center py-5">
          <FiFileText size={48} className="text-muted mb-3" />
          <p className="text-muted mb-0">No recent activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-header bg-transparent border-theme">
        <h5 className="mb-0 text-primary">Recent Activities</h5>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activities.map((activity, index) => {
            const statusInfo = getStatusInfo(activity.status);
            return (
              <div 
                key={activity._id || index} 
                className="list-group-item border-0 px-4 py-3"
                style={{ borderBottom: '1px solid rgba(0, 179, 152, 0.1)' }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-circle d-flex justify-content-center align-items-center me-3 flex-shrink-0"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: `${statusInfo.color}20`,
                      color: statusInfo.color,
                      fontSize: '1.2rem'
                    }}
                  >
                    {statusInfo.icon}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 fw-semibold">
                          {activity.vendorId?.vendorName || 'Unknown Vendor'}
                        </h6>
                        <small className="text-muted">
                          Request: {activity.requestId?.title || 'N/A'}
                        </small>
                      </div>
                      <span 
                        className="badge rounded-pill px-3 py-2"
                        style={{ 
                          backgroundColor: `${statusInfo.color}20`,
                          color: statusInfo.color,
                          fontSize: '0.75rem'
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="fw-bold text-primary">
                        Amount: ${activity.quotationAmount?.toLocaleString() || '0'}
                      </small>
                      <small className="text-muted">
                        {formatDate(activity.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;