import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        color: "#ffffff"
      }}
    >
      
      {/* NAVBAR - Pure Black */}
      <div 
        style={{
          backgroundColor: "#000000",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Logo - Left Side */}
        <a href="#" style={{ 
          color: "#00b398", 
          fontSize: "2rem", 
          fontWeight: "700",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i className="bi bi-boxes"></i>
          VendorPro
        </a>

        {/* Right side buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Login Button */}
          <button
            style={{
              backgroundColor: "#ffffff",
              border: "2px solid #00b398",
              color: "#000000",
              fontWeight: "600",
              fontSize: "15px",
              padding: "8px 24px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00b398";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-box-arrow-in-right"></i>
            Login
          </button>

          {/* Signup Button */}
          <button
            style={{
              backgroundColor: "#00b398",
              border: "2px solid #00b398",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "15px",
              padding: "8px 24px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#009e86";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 179, 152, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00b398";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => navigate("/register")}
          >
            <i className="bi bi-person-plus"></i>
            Signup
          </button>
        </div>
      </div>

      {/* HERO BANNER with Full Background Image - Scrollable */}
      <div 
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
          // REMOVED: backgroundAttachment: "fixed" - Now image scrolls with page
        }}
      >
        {/* Dark Overlay */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            zIndex: 1
          }}
        ></div>
        
        {/* Content - Centered */}
        <div style={{ 
          position: "relative", 
          zIndex: 2,
          textAlign: "center",
          padding: "20px"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h1 style={{ 
              fontSize: "4rem", 
              fontWeight: "700", 
              color: "#ffffff",
              marginBottom: "20px",
              textShadow: "0 2px 30px rgba(0,0,0,0.5)"
            }}>
              Smart <span style={{ color: "#00b398" }}>Vendor & Quotation  </span>Management Platform
            </h1>
            <p style={{ 
              fontSize: "1.5rem", 
              color: "#ffffff",
              marginBottom: "40px",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)"
            }}>
              Manage vendors, send quotation requests, compare proposals, and make faster procurement decisions — all in one platform.
            </p>
            <button
              style={{
                backgroundColor: "#00b398",
                border: "2px solid #00b398",
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: "600",
                padding: "12px 48px",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#009e86";
                e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 179, 152, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00b398";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
              }}
              onClick={() => navigate("/register")}
            >
              Get Started <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div 
        style={{
          backgroundColor: "#000000",
          borderTop: "1px solid #1a1a1a",
          padding: "16px 0",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <p style={{ 
            margin: 0, 
            color: "#888888", 
            fontSize: "14px"
          }}>
            © 2026 <span style={{ color: "#00b398", fontWeight: "600" }}>VendorPro</span> - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;