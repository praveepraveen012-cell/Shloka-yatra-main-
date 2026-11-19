import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email address or registered mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.memberLogin({ identifier: identifier.trim(), password, rememberMe });

      // Store member session
      localStorage.setItem('shlloka_member_token', data.token);
      localStorage.setItem('shlloka_member_user', JSON.stringify(data.member));

      navigate('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F8FC', minHeight: '90vh', paddingTop: '110px', paddingBottom: '90px' }}>
      <div className="wrap" style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(28px, 6vw, 44px)',
            boxShadow: '0 12px 36px rgba(7, 27, 58, 0.08)',
            border: '1px solid #D9E2EF',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="eyebrow" style={{ color: '#2F6FED' }}>Member Portal</span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: '#071B3A', marginBottom: '8px' }}>
              Sign In to Your Account
            </h1>
            <p style={{ color: '#2A4365', fontSize: '0.96rem' }}>
              Access your Shloka Yatra membership details and travel preferences.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                padding: '13px 18px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                marginBottom: '24px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Identifier (Email or Mobile) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label light" htmlFor="identifier" style={{ color: '#071B3A' }}>
                Email Address or Registered Mobile
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="identifier"
                  type="text"
                  className="form-input light"
                  placeholder="e.g. name@example.com or +919876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label light" htmlFor="password" style={{ margin: 0, color: '#071B3A' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: '0.85rem',
                    color: '#2F6FED',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input light"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#4A607A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#2F6FED',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="rememberMe"
                style={{ fontSize: '0.9rem', color: '#071B3A', cursor: 'pointer' }}
              >
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-go"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.02rem',
                marginTop: '10px',
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                justifyContent: 'center',
              }}
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>

          {/* Registration Link */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #D9E2EF',
              textAlign: 'center',
              fontSize: '0.94rem',
              color: '#4A607A',
            }}
          >
            Not a registered member yet?{' '}
            <Link
              to="/membership/register"
              style={{
                color: '#2F6FED',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Become a Member →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
