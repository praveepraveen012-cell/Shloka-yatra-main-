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
  ArrowLeft,
} from 'lucide-react';
import { api } from '../services/api';
import { heroImages } from '../data/imageManifest';
import { assetUrl } from '../utils/assets';

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

  // Multi-step state: 1: Details Form, 2: Mobile OTP Verification, 3: Success
  const [step, setStep] = useState(1);
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

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [maskedMobile, setMaskedMobile] = useState('');
  const [fullMobile, setFullMobile] = useState('');
  const [memberId, setMemberId] = useState('');
  const [membershipRef, setMembershipRef] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [smsNotice, setSmsNotice] = useState('');

  // Scroll to top on mount
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

  // Validate Step 1 Form
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

  // Submit Step 1: Initiates Member Registration and Dispatches OTP
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
      };

      const res = await api.registerMember(payload);

      if (res.success) {
        setMemberId(res.memberId);
        setMembershipRef(res.membershipReference);
        setMaskedMobile(res.maskedMobile);
        setFullMobile(res.mobile);
        setResendCooldown(res.resendCooldown || 60);
        setSmsNotice(res.smsDeliveryNotice || '');
        setStep(2); // Advance to OTP verification
      } else {
        setErrorMsg(res.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Digits Change Handler
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
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
    const targetInput = document.getElementById(`otp-box-${targetIdx}`);
    if (targetInput) targetInput.focus();
  };

  // Submit Step 2: Verify Mobile OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyRegistrationOtp({
        mobile: fullMobile,
        otp: otpCode,
        purpose: 'REGISTRATION',
        memberId,
      });

      if (res.success) {
        // Save authenticated session
        if (res.token) {
          localStorage.setItem('shlloka_member_token', res.token);
        }
        if (res.member) {
          localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
        }
        setStep(3); // Success Screen
      } else {
        setErrorMsg(res.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.resendMemberOtp({
        mobile: fullMobile,
        purpose: 'REGISTRATION',
      });
      if (res.success) {
        setResendCooldown(res.resendCooldown || 60);
        setSmsNotice(res.smsDeliveryNotice || '');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step 3: Registration Success Screen */}
        {step === 3 ? (
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
              Your mobile number has been verified and your official pilgrimage membership account is active.
            </p>

            <div className="bg-[#071B3A] text-white rounded-2xl p-6 border border-[#2F6FED]/40 mb-8 text-center">
              <span className="text-xs uppercase tracking-wider text-[#8CA8CC] block mb-1">
                Your Official Membership ID
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-[#D9A441] block">
                {membershipRef}
              </span>
              <span className="text-xs text-slate-300 mt-2 block">
                Quote this reference ID for priority coordination on permits, batch allocation, and WhatsApp alerts.
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

                  {/* Curated Pilgrimage Image */}
                  <div className="rounded-2xl overflow-hidden border border-white/15 shadow-inner mb-6 relative h-48 sm:h-56">
                    <img
                      src={assetUrl(heroImages.lakeManasarovar.src)}
                      alt="Mount Kailash & Lake Manasarovar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101D35] via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 drop-shadow">
                      Lake Manasarovar & Mount Kailash Shoreline
                    </span>
                  </div>

                  {/* Verified Membership Privileges */}
                  <div className="space-y-4">
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
                {/* Stepper Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35]">
                      {step === 1 ? 'Become a Member' : 'Verify Mobile OTP'}
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      {step === 1
                        ? 'Fill in your details to create an official pilgrimage membership record.'
                        : `Enter the 6-digit OTP sent to your registered mobile number.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[#D9A441]' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-bold text-slate-700">Step {step} of 2</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* STEP 1: Personal & Contact Information */}
                {step === 1 && (
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

                    {/* Registered Mobile with Country Code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Registered Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange('countryCode', e.target.value)}
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
                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#101D35]/10 ${
                              fieldErrors.mobile ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#101D35]'
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        We will send a 6-digit SMS verification code to this mobile number.
                      </span>
                      {fieldErrors.mobile && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.mobile}</p>
                      )}
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

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                            <span>Verifying & Sending OTP...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Mobile Verification OTP</span>
                            <ArrowRight size={16} className="text-[#D9A441]" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: Mobile OTP Verification */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#1C3455] flex items-center justify-center mx-auto mb-3">
                        <Phone size={22} />
                      </div>
                      <h3 className="text-base font-bold text-[#101D35] mb-1">
                        Enter 6-Digit OTP Code
                      </h3>
                      <p className="text-xs text-slate-600">
                        We have dispatched a one-time verification password to:
                      </p>
                      <p className="text-base font-mono font-bold text-[#101D35] mt-1 tracking-wider">
                        {maskedMobile || fullMobile}
                      </p>

                      {smsNotice && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 mt-3 border border-amber-200 text-left">
                          <strong>Notice:</strong> {smsNotice}
                        </p>
                      )}
                    </div>

                    {/* 6-Digit Numeric Boxes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                        Verification Code
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
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

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <RefreshCw size={18} className="animate-spin text-[#D9A441]" />
                            <span>Verifying Code...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={18} className="text-[#D9A441]" />
                            <span>Verify OTP & Activate Membership</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <ArrowLeft size={14} />
                          <span>Edit Details / Number</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendCooldown > 0 || loading}
                          className={`text-xs font-bold transition-colors ${
                            resendCooldown > 0
                              ? 'text-slate-400 cursor-not-allowed'
                              : 'text-[#1C3455] hover:text-[#2F6FED] cursor-pointer'
                          }`}
                        >
                          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
