import React from 'react';

const StatsCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div 
      className="card stats-card h-100 fade-in" 
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        borderLeft: `4px solid ${color || '#00b398'}` 
      }}
      onClick={onClick}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted text-uppercase small mb-2">{title}</h6>
            <h2 className="fw-bold mb-0" style={{ color: color || '#00b398' }}>
              {value}
            </h2>
          </div>
          <div 
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: `${color || '#00b398'}20`,
              color: color || '#00b398',
              fontSize: '1.5rem'
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
