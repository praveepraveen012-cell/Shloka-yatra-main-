import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { api } from '../services/api';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (भारत)' },
  { code: '+1', country: 'USA / Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+61', country: 'Australia' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+977', country: 'Nepal' },
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Workflow steps:
  // 1: Enter Registered Mobile
  // 2: Enter & Verify OTP
  // 3: Set New Password
  // 4: Success Confirmation
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Mobile
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [fullMobile, setFullMobile] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // 1. Request Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = mobileNumber.replace(/\D/g, '');
    if (!clean || clean.length < 7) {
      setErrorMsg('Please enter a valid mobile number with country code.');
      return;
    }

    const combinedMobile = `${countryCode} ${clean}`;
    setLoading(true);
    try {
      const res = await api.requestForgotMobileOtp({ mobile: combinedMobile });
      if (res.success) {
        setFullMobile(res.mobile || combinedMobile);
        setMaskedMobile(res.maskedMobile);
        setResendCooldown(res.resendCooldown || 60);
        setStep(2);
      } else {
        setErrorMsg(res.error || 'Failed to request reset OTP.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 2. OTP Input Handler
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const targetIdx = Math.min(pasted.length, 5);
    const targetInput = document.getElementById(`forgot-otp-${targetIdx}`);
    if (targetInput) targetInput.focus();
  };

  // 3. Verify Reset OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyForgotMobileOtp({
        mobile: fullMobile,
        otp: otpCode,
      });

      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3); // Go to Set New Password
      } else {
        setErrorMsg(res.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to verify OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Reset OTP
  const handleResendResetOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.requestForgotMobileOtp({ mobile: fullMobile });
      if (res.success) {
        setResendCooldown(res.resendCooldown || 60);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save New Password
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPasswordWithToken({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setStep(4); // Success screen
      } else {
        setErrorMsg(res.error || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative">
          {/* Back link */}
          {step < 4 && (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Member Login</span>
            </Link>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Registered Mobile Number */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#1C3455] flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <KeyRound size={26} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35] mb-2">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Enter your registered mobile number. We will send an OTP to verify your account identity.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country Code"
                      className="w-28 px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:border-[#101D35] shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/10"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1.5 block">
                    A secure 6-digit verification code will be sent to this number.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight size={16} className="text-[#D9A441]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Verify Mobile OTP */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Phone size={26} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#101D35] mb-1">
                  Enter Recovery OTP
                </h2>
                <p className="text-xs text-slate-600">
                  We've sent a 6-digit one-time password to:
                </p>
                <p className="text-base font-mono font-bold text-[#101D35] mt-1 tracking-wider">
                  {maskedMobile || fullMobile}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                    6-Digit Security Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`forgot-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl sm:text-2xl text-slate-900 border-2 border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/15 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} className="text-[#D9A441]" />
                        <span>Verify OTP Code</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Change Number
                    </button>

                    <button
                      type="button"
                      onClick={handleResendResetOtp}
                      disabled={resendCooldown > 0 || loading}
                      className={`text-xs font-bold transition-colors ${
                        resendCooldown > 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-[#1C3455] hover:text-[#2F6FED] cursor-pointer'
                      }`}
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Lock size={26} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#101D35] mb-1">
                  Create New Password
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Mobile identity verified. Please choose a strong new password for your account.
                </p>
              </div>

              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#101D35] focus:ring-2 focus:ring-[#101D35]/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Save New Password</span>
                        <ArrowRight size={16} className="text-[#D9A441]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-[#101D35] mb-2">
                Password Reset Complete
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Your password has been changed successfully. You can now log in using your new password.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Member Login</span>
                <ArrowRight size={16} className="text-[#D9A441]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
