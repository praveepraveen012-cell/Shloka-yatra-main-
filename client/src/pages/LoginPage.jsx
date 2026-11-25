import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Unverified state modal / inline prompt
  const [unverifiedState, setUnverifiedState] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setUnverifiedState(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.memberLogin({
        identifier: identifier.trim(),
        password,
        rememberMe,
      });

      if (data.token) {
        localStorage.setItem('shlloka_member_token', data.token);
        if (data.member) {
          localStorage.setItem('shlloka_member_user', JSON.stringify(data.member));
        }
        navigate('/account');
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      // Check if unverified mobile
      if (err.message && err.message.toLowerCase().includes('not yet verified')) {
        setUnverifiedState({
          mobile: identifier.trim(),
        });
      } else {
        setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPendingOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP.');
      return;
    }

    setOtpLoading(true);
    setErrorMsg('');
    try {
      const res = await api.verifyRegistrationOtp({
        mobile: unverifiedState.mobile,
        otp: otpCode,
        purpose: 'REGISTRATION',
      });

      if (res.token) {
        localStorage.setItem('shlloka_member_token', res.token);
        if (res.member) {
          localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
        }
        navigate('/account');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please re-enter the code.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#101D35] text-[#D9A441] border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-3 shadow-md text-2xl font-bold">
              ॐ
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441] block mb-1">
              Member Sign In
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35] mb-2">
              Pilgrim Portal Access
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Sign in to manage your 2027 Kailash Mansarovar bookings, permit updates, and payments.
            </p>
          </div>

          {/* Professional Google Sign-In */}
          <div className="mb-6">
            <GoogleSignInButton text="Continue with Google" redirectTo="/account" />
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  Or continue with email / mobile
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Unverified Mobile Prompt */}
          {unverifiedState ? (
            <form onSubmit={handleVerifyPendingOtp} className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-800">
                <p className="font-bold mb-1">Mobile Verification Required</p>
                <p>An OTP code has been dispatched to your mobile number. Enter the 6-digit code to activate your account and log in.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-xl border border-slate-300 focus:border-[#101D35] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? <RefreshCw size={18} className="animate-spin text-[#D9A441]" /> : <ShieldCheck size={18} className="text-[#D9A441]" />}
                <span>Verify OTP & Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setUnverifiedState(null)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1"
              >
                Return to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="member-identifier">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="member-identifier"
                    type="text"
                    placeholder="e.g. devotee@example.com or +919876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="member-password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#1C3455] hover:text-[#2F6FED] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="member-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#101D35] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Member Portal</span>
                      <ArrowRight size={16} className="text-[#D9A441]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Register Link */}
          <div className="border-t border-slate-100 pt-6 mt-6 text-center">
            <span className="text-xs text-slate-500 block mb-2">New to Shloka Yatra 2027?</span>
            <Link
              to="/membership/register"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all"
            >
              <Sparkles size={14} className="text-[#D9A441]" />
              <span>Become a Member (Register)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
