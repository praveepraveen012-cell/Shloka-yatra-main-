import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('shlloka_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const res = await api.getAdminProfile();
        const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'TRAVEL_OPS', 'SUPPORT'];
        if (res.user && allowedRoles.includes(res.user.role)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        localStorage.removeItem('shlloka_admin_token');
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }

    verifyAuth();
  }, [location.pathname]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#041329', color: '#D9E2EF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(47, 111, 237, 0.25)', borderTopColor: '#2F6FED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '16px' }}>Verifying administrative security credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
