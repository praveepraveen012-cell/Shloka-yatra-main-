import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Phone,
  Mail,
  User,
  Lock,
  Calendar,
  Globe,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { heroImages } from '../data/imageManifest';
import { assetUrl } from '../utils/assets';
import GoogleSignInButton from '../components/GoogleSignInButton';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (भारत)', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

export default function MembershipRegisterPage() {
  const navigate = useNavigate();

  // Registration View State: false = Form, true = Success Confirmation
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    mobile: '',
    gender: 'PREFER_NOT_TO_SAY',
    dateOfBirth: '',
    nationality: 'Indian',
    country: 'India',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  // Inline Mobile OTP State (at the place of mobile number)
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showInlineOtp, setShowInlineOtp] = useState(false);
  const [inlineOtpCode, setInlineOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [inlineOtpMsg, setInlineOtpMsg] = useState(null); // { text, type: 'error' | 'success' }
  const [resendCooldown, setResendCooldown] = useState(0);
  const [smsNotice, setSmsNotice] = useState('');

  // Registered Member Summary for Success View
  const [createdMember, setCreatedMember] = useState(null);

  // Scroll to top on mount or success
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSuccess]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
    setErrorMsg('');
  };

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

  const passwordStrength = getPasswordStrength(formData.password);

  // Validate Form Fields
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    const cleanMobileDigits = formData.mobile.replace(/\D/g, '');
    if (!cleanMobileDigits || cleanMobileDigits.length < 7 || cleanMobileDigits.length > 15) {
      errors.mobile = 'Please enter a valid mobile phone number';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms & Conditions';
    }

    if (!formData.acceptPrivacy) {
      errors.acceptPrivacy = 'You must accept the Privacy Policy';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Send Inline Mobile OTP
  const handleSendInlineOtp = async () => {
    const cleanMobileDigits = formData.mobile.replace(/\D/g, '');
    if (!cleanMobileDigits || cleanMobileDigits.length < 7) {
      setFieldErrors((prev) => ({ ...prev, mobile: 'Please enter a valid mobile number first' }));
      return;
    }

    setOtpSending(true);
    setInlineOtpMsg(null);
    try {
      const res = await api.requestMobileOtp({
        mobile: formData.mobile.trim(),
        countryCode: formData.countryCode,
      });

      if (res.success) {
        setShowInlineOtp(true);
        setResendCooldown(res.resendCooldown || 60);
        setSmsNotice(res.smsDeliveryNotice || '');
        setInlineOtpMsg({
          text: `Verification code sent to ${res.maskedMobile || formData.mobile}`,
          type: 'success',
        });
      } else {
        setInlineOtpMsg({ text: res.error || 'Failed to send verification code.', type: 'error' });
      }
    } catch (err) {
      setInlineOtpMsg({ text: err.message || 'Could not dispatch OTP code.', type: 'error' });
    } finally {
      setOtpSending(false);
    }
  };

  // Verify Inline Mobile OTP
  const handleVerifyInlineOtp = async () => {
    if (!inlineOtpCode || inlineOtpCode.length !== 6) {
      setInlineOtpMsg({ text: 'Please enter the complete 6-digit verification code.', type: 'error' });
      return;
    }

    setOtpVerifying(true);
    setInlineOtpMsg(null);
    try {
      const res = await api.verifyInlineOtp({
        mobile: formData.mobile.trim(),
        otp: inlineOtpCode,
        countryCode: formData.countryCode,
      });

      if (res.success) {
        setIsMobileVerified(true);
        setShowInlineOtp(false);
        setInlineOtpMsg({ text: '✓ Mobile number verified successfully!', type: 'success' });
      } else {
        setInlineOtpMsg({ text: res.error || 'Invalid code. Please try again.', type: 'error' });
      }
    } catch (err) {
      setInlineOtpMsg({ text: err.message || 'Verification failed. Please re-enter the code.', type: 'error' });
    } finally {
      setOtpVerifying(false);
    }
  };

  // Form Submit: Creates Pilgrimage Membership Record Directly
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        countryCode: formData.countryCode,
        mobile: `${formData.countryCode} ${formData.mobile.trim()}`,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        nationality: formData.nationality.trim(),
        country: formData.country.trim(),
        state: formData.state.trim() || null,
        city: formData.city.trim() || null,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: true,
        acceptPrivacy: true,
        isMobileVerified,
      };

      const res = await api.registerMember(payload);

      if (res.success) {
        // Store session tokens immediately
        if (res.token) {
          localStorage.setItem('shlloka_member_token', res.token);
        }
        if (res.member) {
          localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
        }

        setCreatedMember({
          membershipReference: res.membershipReference || res.member?.membershipReference || 'SHL-MEM-2027',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: `${formData.countryCode} ${formData.mobile}`,
          isVerified: isMobileVerified || res.member?.isVerified || true,
        });

        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Registration Success Screen */}
        {isSuccess ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441] block mb-2">
              Membership Activated
            </span>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#101D35] mb-3">
              Welcome to Shloka Yatra 2027
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Your official pilgrimage membership account is now registered and active in our database.
            </p>

            <div className="bg-[#071B3A] text-white rounded-2xl p-6 border border-[#2F6FED]/40 mb-8 text-center">
              <span className="text-xs uppercase tracking-wider text-[#8CA8CC] block mb-1">
                Your Official Membership Reference ID
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-[#D9A441] block">
                {createdMember?.membershipReference}
              </span>
              <span className="text-xs text-slate-300 mt-2 block">
                Quote this reference ID for priority permit processing, batch allocations, and advisor assistance.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/account"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#101D35] text-white hover:bg-[#1C3455] font-semibold text-sm transition-all shadow-md"
              >
                <span>Open Member Dashboard</span>
                <ArrowRight size={16} className="text-[#D9A441]" />
              </Link>
              <Link
                to="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
              >
                <span>Explore 2027 Routes</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Desktop Two-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Section: Branding & Benefits */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#101D35] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#1C3455]">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles size={13} />
                    <span>Official 2027 Sangha</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3 leading-tight">
                    Shloka Yatra 2027 Membership
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                    Register once to reserve sacred Full Moon darshan batches, submit cross-border permits, and manage your high-altitude pilgrimage details.
                  </p>

                  {/* Curated Collection Image */}
                  <div className="rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg relative h-48 sm:h-56">
                    <img
                      src={assetUrl(heroImages.lakeManasarovar.src)}
                      alt={heroImages.lakeManasarovar.alt}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101D35]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-[#D9A441] bg-[#101D35]/80 px-2.5 py-1 rounded-md backdrop-blur-xs border border-[#D9A441]/30">
                      Lake Manasarovar & Mount Kailash Range
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Priority Batch Allocation</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Direct reservation access across 5 sacred Full Moon darshan batches before public release.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                        <Globe size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Tibet Permit & Visa Concierge</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Dedicated documentation desk for China group visas, Tibet Travel Permits (TTP), and border passes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#D9A441] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Medical & Senior Advisory</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Physician-reviewed high-altitude acclimatization schedules, oximeter guidelines, and dietary support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Already registered prompt */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <span className="text-xs text-slate-600 block mb-2">Already have a registered member account?</span>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1C3455] hover:text-[#2F6FED] transition-colors"
                >
                  <span>Sign In to Member Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Section: Registration Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative">
                {/* Header */}
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35]">
                    Become a Member
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Fill in your details below to create your official pilgrimage membership account.
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
                        Or register with email / mobile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Ramesh"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                            fieldErrors.firstName ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                          }`}
                        />
                      </div>
                      {fieldErrors.firstName && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                          fieldErrors.lastName ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. devotee@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                          fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* REGISTERED MOBILE NUMBER with INLINE OTP AUTHENTICATION */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Registered Mobile Number <span className="text-red-500">*</span>
                      </label>
                      {isMobileVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          OTP verification optional
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => {
                          handleInputChange('countryCode', e.target.value);
                          setIsMobileVerified(false);
                          setShowInlineOtp(false);
                        }}
                        aria-label="Country Code"
                        className="w-32 px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:border-[#101D35] shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.flag})
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={formData.mobile}
                          onChange={(e) => {
                            handleInputChange('mobile', e.target.value);
                            setIsMobileVerified(false);
                            setShowInlineOtp(false);
                          }}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                            isMobileVerified
                              ? 'border-emerald-500 bg-emerald-50/20'
                              : fieldErrors.mobile
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-slate-300 focus:border-[#101D35]'
                          }`}
                        />
                      </div>

                      {/* Inline OTP Trigger Button */}
                      {!isMobileVerified ? (
                        <button
                          type="button"
                          onClick={handleSendInlineOtp}
                          disabled={otpSending || !formData.mobile.trim()}
                          className="px-3 sm:px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#A6781E] border border-amber-300/60 text-xs font-bold transition-all shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                          title="Verify mobile number via SMS OTP (optional)"
                        >
                          {otpSending ? (
                            <>
                              <RefreshCw size={14} className="animate-spin text-[#A6781E]" />
                              <span className="hidden sm:inline">Sending...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={14} />
                              <span>{showInlineOtp ? 'Resend' : 'Verify Mobile'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="hidden sm:inline">Verified</span>
                        </div>
                      )}
                    </div>

                    {fieldErrors.mobile && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.mobile}</p>
                    )}

                    {/* Inline OTP Authentication Box */}
                    {showInlineOtp && !isMobileVerified && (
                      <div className="mt-2.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-slate-700">
                            Enter 6-digit SMS code sent to {formData.countryCode} {formData.mobile}:
                          </span>
                          {resendCooldown > 0 ? (
                            <span className="text-slate-400 font-mono text-[11px]">
                              Resend in {resendCooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendInlineOtp}
                              className="text-[#D9A441] font-bold hover:underline cursor-pointer"
                            >
                              Resend code
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            value={inlineOtpCode}
                            onChange={(e) => setInlineOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-32 tracking-[0.4em] text-center font-mono font-bold text-base px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#101D35]"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyInlineOtp}
                            disabled={otpVerifying || inlineOtpCode.length !== 6}
                            className="px-4 py-2 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            {otpVerifying ? (
                              <>
                                <RefreshCw size={13} className="animate-spin text-[#D9A441]" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <span>Verify OTP</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowInlineOtp(false)}
                            className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                        {inlineOtpMsg && (
                          <p className={`text-xs ${inlineOtpMsg.type === 'error' ? 'text-red-600 font-medium' : 'text-emerald-700 font-semibold'}`}>
                            {inlineOtpMsg.text}
                          </p>
                        )}

                        {smsNotice && (
                          <p className="text-[11px] text-amber-700 leading-tight">
                            {smsNotice}
                          </p>
                        )}
                      </div>
                    )}

                    <span className="text-[11px] text-slate-500 mt-1 block">
                      SMS verification is optional. You may verify with OTP now, or proceed directly with registration.
                    </span>
                  </div>

                  {/* Gender & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        aria-label="Gender"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#101D35]"
                      >
                        <option value="MALE">Male (पुरुष)</option>
                        <option value="FEMALE">Female (महिला)</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Date of Birth <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#101D35]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nationality & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nationality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Indian"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#101D35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City of Residence
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Mumbai, London"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#101D35]"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Create Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 characters"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                            fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.password && (
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
                      {fieldErrors.password && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-type password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                            fieldErrors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="pt-2 space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="mt-0.5 accent-[#101D35] w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="text-[#1C3455] font-bold underline">
                          Terms & Conditions
                        </Link>{' '}
                        governing Kailash Mansarovar Parikrama Yatra 2027.
                      </span>
                    </label>
                    {fieldErrors.acceptTerms && (
                      <p className="text-xs text-red-600 ml-6">{fieldErrors.acceptTerms}</p>
                    )}

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.acceptPrivacy}
                        onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                        className="mt-0.5 accent-[#101D35] w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I consent to the{' '}
                        <Link to="/privacy-policy" target="_blank" className="text-[#1C3455] font-bold underline">
                          Privacy & Data Protection Notice
                        </Link>{' '}
                        under India's DPDP Act, 2023 for travel permits and health verification.
                      </span>
                    </label>
                    {fieldErrors.acceptPrivacy && (
                      <p className="text-xs text-red-600 ml-6">{fieldErrors.acceptPrivacy}</p>
                    )}
                  </div>

                  {/* Complete Registration Action Button at Bottom */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#101D35]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                          <span>Creating Your Pilgrimage Membership...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Pilgrimage Registration</span>
                          <ArrowRight size={16} className="text-[#D9A441]" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-2.5">
                      Your pilgrimage account will be created immediately with instant dashboard access.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
