import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CompareCard from '../../components/quotations/CompareCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CompareQuotations = () => {
  const { requestId } = useParams();
  const [quotations, setQuotations] = useState([]);
  const [cheapestId, setCheapestId] = useState(null);

  useEffect(() => {
    fetchComparisons();
  }, [requestId]);

  const fetchComparisons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/quotations/compare/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuotations(response.data.responses);
      if (response.data.cheapest) {
        setCheapestId(response.data.cheapest._id);
      }
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    }
  };

  const handleStatusUpdate = async (responseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/quotations/responses/${responseId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComparisons();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2 className="text-primary mb-4">Compare Quotations</h2>
      <div className="row g-4">
        {quotations.map((quote) => (
          <div key={quote._id} className="col-md-6 col-lg-4">
            <CompareCard 
              quotation={quote} 
              isCheapest={quote._id === cheapestId}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareQuotations;