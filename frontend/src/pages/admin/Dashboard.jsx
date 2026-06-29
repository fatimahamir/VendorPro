import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { FiUsers, FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeQuotations: 0,
    pendingQuotations: 0,
    approvedQuotations: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/quotations/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setActivities(response.data.recentActivities);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-primary mb-4 fw-bold">Admin Dashboard</h2>
      
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatsCard 
            title="Total Vendors" 
            value={stats.totalVendors} 
            icon={<FiUsers />} 
            color="#00b398"
            onClick={() => navigate('/admin/vendors')}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard 
            title="Active Requests" 
            value={stats.activeQuotations} 
            icon={<FiFileText />} 
            color="#0d6efd"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard 
            title="Pending Quotes" 
            value={stats.pendingQuotations} 
            icon={<FiClock />} 
            color="#ffc107"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard 
            title="Approved" 
            value={stats.approvedQuotations} 
            icon={<FiCheckCircle />} 
            color="#198754"
          />
        </div>
      </div>

      <RecentActivity activities={activities} />
    </div>
  );
};

export default Dashboard;