import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import api from '../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotModal, setForgotModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    const savedEmail = localStorage.getItem('shlloka_admin_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.adminLogin({ email: email.trim(), password });
      if (res.token) {
        localStorage.setItem('shlloka_admin_token', res.token);
        if (rememberMe) {
          localStorage.setItem('shlloka_admin_remember_email', email.trim());
        } else {
          localStorage.removeItem('shlloka_admin_remember_email');
        }
        navigate(from, { replace: true });
      } else {
        throw new Error('Authentication succeeded but no authorization token was issued.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials or insufficient privileges.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041329] p-4 sm:p-6 text-white font-body relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2F6FED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#071B3A] rounded-2xl p-6 sm:p-10 border border-[#D9E2EF]/20 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2F6FED]/15 border border-[#2F6FED] flex items-center justify-center mx-auto mb-4 text-[#D9A441] shadow-lg shadow-[#2F6FED]/20">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">
            Admin Panel Login
          </h1>
          <p className="text-[#8CA8CC] text-sm mt-1.5 font-body">
            Shloka Yatra 2027 — Authorized Staff & Operations Console
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start gap-3 mb-6 animate-fade-in">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#D9E2EF] uppercase tracking-wider mb-2">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shlloka.com"
                required
                autoComplete="email"
                className="w-full bg-[#041329] border border-[#D9E2EF]/30 focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] text-white rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-[#8CA8CC]/60 transition-colors outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D9E2EF] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-[#041329] border border-[#D9E2EF]/30 focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] text-white rounded-xl pl-11 pr-11 py-3 text-sm placeholder:text-[#8CA8CC]/60 transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] hover:text-white transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1 text-[#8CA8CC]">
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="hidden"
              />
              {rememberMe ? (
                <CheckSquare size={16} className="text-[#2F6FED]" />
              ) : (
                <Square size={16} className="text-[#8CA8CC]" />
              )}
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModal(true)}
              className="text-[#D9A441] hover:text-amber-300 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2F6FED] hover:bg-[#2557c4] disabled:bg-[#2F6FED]/50 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#2F6FED]/30 hover:shadow-[#2F6FED]/50 cursor-pointer disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Back to Site */}
        <div className="mt-8 pt-6 border-t border-[#D9E2EF]/15 text-center">
          <Link
            to="/"
            className="text-xs text-[#8CA8CC] hover:text-[#D9A441] transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Shloka Yatra Public Portal</span>
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-[#071B3A] border border-[#D9E2EF]/20 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-[#D9A441]/15 border border-[#D9A441] flex items-center justify-center mx-auto mb-4 text-[#D9A441]">
              <Lock size={22} />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Password Reset</h3>
            <p className="text-sm text-[#8CA8CC] leading-relaxed mb-6 font-body">
              For security reasons, administrative credentials must be reset directly by the Super Administrator or through the secure deployment environment. Please contact:
              <br />
              <strong className="text-white mt-2 block">admin@shlloka.com</strong>
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 px-4 bg-[#2F6FED] text-white rounded-xl text-sm font-semibold hover:bg-[#2557c4] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
