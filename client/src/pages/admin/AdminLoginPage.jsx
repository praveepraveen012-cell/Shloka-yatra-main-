import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Sparkles,
  KeyRound,
  LockKeyhole,
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

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
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        throw new Error('Please enter both administrative email and password.');
      }

      const res = await api.adminLogin({ email: trimmedEmail, password });
      if (res && res.token) {
        localStorage.setItem('shlloka_admin_token', res.token);
        if (res.user) {
          localStorage.setItem('shlloka_admin_user', JSON.stringify(res.user));
        }
        if (rememberMe) {
          localStorage.setItem('shlloka_admin_remember_email', trimmedEmail);
        } else {
          localStorage.removeItem('shlloka_admin_remember_email');
        }
        navigate(from, { replace: true });
      } else {
        throw new Error('Login failed: Server did not issue an authorization session token.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials or insufficient authorization.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await api.forgotPassword({ email: forgotEmail });
      setForgotSubmitted(true);
    } catch (err) {
      setForgotSubmitted(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030914] p-4 sm:p-6 text-white font-body relative overflow-hidden selection:bg-[#D9A441] selection:text-[#0A1628]">
      {/* Radiant Cosmic Backdrops & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-tr from-[#2F6FED]/15 via-[#D9A441]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1C3455]/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Himalayan Grid Contour */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(217, 164, 65, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Main Card with Glassmorphic Gradient Surface */}
        <div className="bg-[#071830]/90 backdrop-blur-2xl rounded-3xl border border-[#D9A441]/35 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 hover:border-[#D9A441]/55">
          {/* Saffron & Teal Accent Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#D9A441] via-[#1C3455] to-[#6FA8B2]" />

          <div className="p-6 sm:p-10">
            {/* Header: Sacred Om Talisman & Branding */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#102445] to-[#061124] border border-[#D9A441]/50 flex items-center justify-center shadow-xl shadow-[#D9A441]/10 relative group">
                  <span className="text-3xl text-[#D9A441] leading-none select-none font-bold">
                    ॐ
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#071830] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#D9A441] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">
                <Sparkles size={12} />
                <span>PILGRIMAGE COMMAND SYSTEM 2027</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wider mt-1">
                Shloka Yatra 2027 – Admin Portal
              </h1>
              <p className="text-[#8CA8CC] text-xs sm:text-sm mt-1.5 font-body leading-relaxed max-w-sm mx-auto">
                Secure administrative access to manage Shloka Yatra bookings, payments, customers and pilgrimage operations.
              </p>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <div className="bg-red-500/15 border border-red-500/40 text-red-200 px-4 py-3.5 rounded-2xl text-xs sm:text-sm flex items-start gap-3 mb-6 animate-fade-in shadow-inner">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1 leading-snug">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email / Username Input Field */}
              <div>
                <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2 font-body">
                  Admin Email / Username
                </label>
                <div className="relative group flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#041021] border border-white/5 flex items-center justify-center text-[#8CA8CC] group-focus-within:text-[#D9A441] group-focus-within:border-[#D9A441]/40 transition-colors pointer-events-none z-10">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email or username"
                    required
                    autoComplete="username"
                    style={{ paddingLeft: '56px', paddingRight: '16px' }}
                    className="w-full bg-[#041021]/80 border border-[#D9E2EF]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 text-white rounded-xl py-3.5 text-sm placeholder:text-[#8CA8CC]/60 transition-all outline-none font-body shadow-inner box-border"
                  />
                </div>
              </div>

              {/* Password Input Field with Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#D3DDEB] uppercase tracking-wider mb-2 font-body">
                  Password
                </label>
                <div className="relative group flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#041021] border border-white/5 flex items-center justify-center text-[#8CA8CC] group-focus-within:text-[#D9A441] group-focus-within:border-[#D9A441]/40 transition-colors pointer-events-none z-10">
                    <LockKeyhole size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoComplete="current-password"
                    style={{ paddingLeft: '56px', paddingRight: '48px' }}
                    className="w-full bg-[#041021]/80 border border-[#D9E2EF]/20 focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20 text-white rounded-xl py-3.5 text-sm placeholder:text-[#8CA8CC]/60 transition-all outline-none font-body shadow-inner box-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] hover:text-[#D9A441] transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer z-10"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-0.5 text-[#8CA8CC]">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden"
                  />
                  {rememberMe ? (
                    <CheckSquare size={16} className="text-[#D9A441]" />
                  ) : (
                    <Square size={16} className="text-[#8CA8CC]" />
                  )}
                  <span className="font-medium">Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotSubmitted(false);
                    setForgotModal(true);
                  }}
                  className="text-[#D9A441] hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#E5B558] to-[#C99331] hover:from-[#E5B558] hover:to-[#D9A441] disabled:opacity-60 text-[#071322] font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-[#D9A441]/25 hover:shadow-[#D9A441]/40 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#071322] border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-6 p-3.5 rounded-2xl bg-[#040F1E] border border-[#D9A441]/25 text-left text-xs">
              <span className="text-[#D9A441] font-semibold block mb-1">
                Authorized Admin Credentials:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#8CA8CC] gap-1 font-mono text-[11px]">
                <span>User: <strong className="text-white">admin@shloka.com</strong></span>
                <span>Pass: <strong className="text-white">ShlokaAdmin@2027</strong></span>
              </div>
            </div>

            {/* Return to Public Portal */}
            <div className="mt-8 pt-5 border-t border-white/10 text-center">
              <Link
                to="/"
                className="text-xs text-[#8CA8CC] hover:text-[#D9A441] transition-colors inline-flex items-center gap-1.5 font-medium"
              >
                <span>← Return to Shloka Yatra Public Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Strip */}
        <div className="mt-6 text-center text-[11px] text-[#8CA8CC] flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <Shield size={13} className="text-[#D9A441]" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span>•</span>
          <span>DPDP Act 2023 Compliant</span>
          <span>•</span>
          <span>Shloka Yatra Command 2027</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-[#071830] border border-[#D9A441]/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-[#D9A441]/15 border border-[#D9A441] flex items-center justify-center mx-auto mb-4 text-[#D9A441] shadow-lg shadow-[#D9A441]/20">
              <KeyRound size={26} />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Reset Password</h3>

            {forgotSubmitted ? (
              <div className="space-y-4">
                <p className="text-xs text-emerald-300 leading-relaxed font-body">
                  If this email is registered as an administrator, password recovery instructions have been initiated.
                </p>
                <button
                  onClick={() => setForgotModal(false)}
                  className="w-full py-3 px-4 bg-[#D9A441] text-[#071322] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer font-heading"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-[#D3DDEB] leading-relaxed font-body">
                  Enter your registered administrator email to receive secure recovery instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@shloka.com"
                  required
                  className="w-full bg-[#041021] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#D9A441] outline-none"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#D9A441] to-[#C99331] text-[#071322] rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer font-heading"
                >
                  {forgotLoading ? 'Submitting...' : 'Send Recovery Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="block w-full text-center text-xs text-[#8CA8CC] hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
