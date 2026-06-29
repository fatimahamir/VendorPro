import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <>
      {/* Top Navbar (Har jagah show hoga) */}
      <Navbar />
      
      {/* Main Body Area */}
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        
        {/* Left Sidebar (Har jagah show hoga) */}
        <Sidebar />
        
        {/* Right Side: Main Content (Pages yahan render honge) */}
        <div className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
          {/* Outlet ka matlab hai ke yahan App.jsx ke andar wale pages show honge */}
          <Outlet /> 
        </div>
        
      </div>
    </>
  );
};

export default DashboardLayout;