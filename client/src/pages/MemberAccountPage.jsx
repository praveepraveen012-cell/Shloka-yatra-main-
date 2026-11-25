import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useClerkAuth } from '../context/ClerkAuthProvider';
import {
  User,
  Shield,
  Compass,
  Calendar,
  Phone,
  Mail,
  MapPin,
  LogOut,
  CheckCircle2,
  FileText,
  CreditCard,
  Lock,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Download,
  UploadCloud,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import RiskDeclarationModal from '../components/RiskDeclarationModal';
import MedicalCertificateUploadModal from '../components/MedicalCertificateUploadModal';
import InsuranceProofUploadModal from '../components/InsuranceProofUploadModal';
import { SYPL_RISK_DOCUMENT, SYPL_MEDICAL_DOCUMENT } from '../data/officialDocuments';

export default function MemberAccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout: clerkLogout } = useClerkAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docBookings, setDocBookings] = useState([]);
  const [activeDocModal, setActiveDocModal] = useState(null); // { type: 'RISK' | 'MED' | 'INS', booking, traveller, card }
  const [dataLoading, setDataLoading] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load Member Data
  useEffect(() => {
    const token = localStorage.getItem('shlloka_member_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    api.getMemberProfile()
      .then((res) => {
        if (res?.member) {
          setMember(res.member);
          localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
          setProfileFormData({
            firstName: res.member.firstName || '',
            lastName: res.member.lastName || '',
            gender: res.member.gender || 'PREFER_NOT_TO_SAY',
            dateOfBirth: res.member.dateOfBirth || '',
            nationality: res.member.nationality || 'Indian',
            country: res.member.country || 'India',
            state: res.member.state || '',
            city: res.member.city || '',
            whatsapp: res.member.whatsapp || res.member.mobile || '',
          });
        } else {
          throw new Error('No member profile');
        }
      })
      .catch(() => {
        const local = localStorage.getItem('shlloka_member_user');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setMember(parsed);
            setProfileFormData({
              firstName: parsed.firstName || '',
              lastName: parsed.lastName || '',
              gender: parsed.gender || 'PREFER_NOT_TO_SAY',
              dateOfBirth: parsed.dateOfBirth || '',
              nationality: parsed.nationality || 'Indian',
              country: parsed.country || 'India',
              state: parsed.state || '',
              city: parsed.city || '',
              whatsapp: parsed.whatsapp || parsed.mobile || '',
            });
          } catch {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Load Tab Specific Data (Bookings, Payments, Documents)
  useEffect(() => {
    if (!member) return;

    if (activeTab === 'bookings' || activeTab === 'overview') {
      setDataLoading(true);
      api.getMemberBookings()
        .then((res) => setBookings(res.bookings || []))
        .catch(() => setBookings([]))
        .finally(() => setDataLoading(false));
    }

    if (activeTab === 'payments') {
      setDataLoading(true);
      api.getMemberPayments()
        .then((res) => setPayments(res.payments || []))
        .catch(() => setPayments([]))
        .finally(() => setDataLoading(false));
    }

    if (activeTab === 'documents') {
      setDataLoading(true);
      api.getMemberMyDocuments()
        .then((res) => {
          setDocBookings(res.bookings || []);
          setDocuments(res.bookings || []);
        })
        .catch(() => {
          setDocBookings([]);
          setDocuments([]);
        })
        .finally(() => setDataLoading(false));
    }
  }, [activeTab, member]);

  const handleLogout = () => {
    localStorage.removeItem('shlloka_member_token');
    localStorage.removeItem('shlloka_member_user');
    if (clerkLogout) {
      clerkLogout();
    } else {
      navigate('/login');
    }
  };

  // Save Profile Form
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    try {
      const res = await api.updateMemberProfile(profileFormData);
      if (res.success && res.member) {
        setMember((prev) => ({ ...prev, ...res.member }));
        localStorage.setItem('shlloka_member_user', JSON.stringify({ ...member, ...res.member }));
        setProfileSuccessMsg('Profile details updated successfully.');
        setIsEditingProfile(false);
      } else {
        setProfileErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileErrorMsg(err.message || 'Error updating profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setPasswordSaving(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await api.changeMemberPassword(passwordForm);
      if (res.success) {
        setPasswordSuccess('Your account password has been updated successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(res.error || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F6F2] min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#101D35] font-semibold text-sm">
          <RefreshCw size={20} className="animate-spin text-[#D9A441]" />
          <span>Loading Member Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'payments', label: 'My Payments', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Account Security', icon: Lock },
  ];

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Member Header Banner */}
        <div className="bg-[#101D35] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#1C3455] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
              ॐ
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white">
                  {member.firstName} {member.lastName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>{member.isVerified ? 'Verified Member' : 'Pending Verification'}</span>
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
                  {member.status || 'ACTIVE'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-1.5 flex-wrap">
                <span className="font-mono text-[#D9A441]">ID: {member.membershipReference}</span>
                <span>•</span>
                <span>{member.email}</span>
                <span>•</span>
                <span>{member.mobile}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-xl bg-[#D9A441] hover:bg-amber-400 text-[#101D35] font-bold text-xs uppercase tracking-wider transition-all shadow"
            >
              Book 2027 Yatra
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#101D35] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#D9A441]' : 'text-slate-400'} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Membership Status</span>
                <span className="text-lg font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={18} />
                  <span>{member.status || 'Active'}</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Tier: {member.membershipType || 'Standard'}</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Mobile Verification</span>
                <span className="text-lg font-bold text-blue-600 flex items-center gap-1.5">
                  <ShieldCheck size={18} />
                  <span>{member.isVerified ? 'Verified OTP' : 'Pending OTP'}</span>
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">{member.mobile}</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Active Bookings</span>
                <span className="text-lg font-bold text-[#101D35]">{bookings.length}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Kailash Yatra 2027 Batches</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Registered Since</span>
                <span className="text-base font-bold text-slate-800">
                  {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'November 2026'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Sangha Devotee ID</span>
              </div>
            </div>

            {/* Recent Bookings or Empty State */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-[#101D35]">
                    Your Pilgrimage Bookings
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Live bookings associated with your registered email and mobile number.
                  </p>
                </div>
                {bookings.length > 0 && (
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-[#1C3455] hover:text-[#2F6FED]"
                  >
                    View All ({bookings.length})
                  </button>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Compass size={40} className="mx-auto text-slate-400 mb-3" />
                  <h4 className="text-base font-bold text-[#101D35] mb-1">No Active Bookings Found</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                    You have not reserved a 2027 departure batch yet. As a registered member, your quota is protected and eligible for Full Moon batch selection.
                  </p>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-bold text-xs uppercase tracking-wider shadow"
                  >
                    <span>Reserve a 2027 Departure</span>
                    <ArrowRight size={14} className="text-[#D9A441]" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-[#101D35]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#101D35]">
                            {b.bookingReference}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : b.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {b.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            b.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : b.paymentStatus === 'PENDING_VERIFICATION'
                              ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                              : 'text-slate-500'
                          }`}>
                            Payment: {b.paymentStatus.replace('_', ' ')}
                          </span>
                          {(b.paymentMethod === 'OFFLINE' || b.paymentMethod === 'OFFLINE_TEST') && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              TEST OFFLINE
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-[#101D35]">
                          {b.route?.name || 'Kailash Mansarovar Pilgrimage'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {b.departure?.name} • {b.totalTravellers} Devotee{b.totalTravellers > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs text-slate-400 block">Total Amount</span>
                        <span className="text-base font-bold text-[#101D35]">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                        {b.balanceDue > 0 && (
                          <span className="text-xs text-amber-700 block font-medium">
                            Balance Due: ₹{b.balanceDue?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h3 className="text-xl font-heading font-bold text-[#101D35]">
                  Personal & Pilgrimage Profile
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Review and update your personal details used for pilgrimage permits and documentation.
                </p>
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {profileSuccessMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileFormData.firstName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileFormData.lastName}
                      onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={profileFormData.gender}
                      onChange={(e) => setProfileFormData({ ...profileFormData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                    >
                      <option value="MALE">Male (पुरुष)</option>
                      <option value="FEMALE">Female (महिला)</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileFormData.dateOfBirth}
                      onChange={(e) => setProfileFormData({ ...profileFormData, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileFormData.city}
                      onChange={(e) => setProfileFormData({ ...profileFormData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={profileFormData.state}
                      onChange={(e) => setProfileFormData({ ...profileFormData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileFormData.country}
                      onChange={(e) => setProfileFormData({ ...profileFormData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? <RefreshCw size={14} className="animate-spin text-[#D9A441]" /> : <Save size={14} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Full Legal Name</span>
                  <p className="font-semibold text-[#101D35]">{member.firstName} {member.lastName}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Gender</span>
                  <p className="font-semibold text-[#101D35]">{member.gender || 'Not specified'}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Registered Email</span>
                  <p className="font-semibold text-[#101D35]">{member.email}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Registered Mobile</span>
                  <p className="font-semibold text-[#101D35]">{member.mobile}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Date of Birth</span>
                  <p className="font-semibold text-[#101D35]">{member.dateOfBirth || 'Not specified'}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Nationality</span>
                  <p className="font-semibold text-[#101D35]">{member.nationality || 'Indian'}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Location</span>
                  <p className="font-semibold text-[#101D35]">
                    {[member.city, member.state, member.country].filter(Boolean).join(', ') || 'Not specified'}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Membership Reference</span>
                  <p className="font-mono font-bold text-[#D9A441]">{member.membershipReference}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-heading font-bold text-[#101D35] mb-1">
              Pilgrimage Bookings
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Official records of booked 2027 Kailash Mansarovar departure batches and participant reservations.
            </p>

            {dataLoading ? (
              <div className="py-12 text-center text-slate-400">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Compass size={36} className="mx-auto text-slate-400 mb-2" />
                <h4 className="text-base font-bold text-[#101D35] mb-1">No Bookings Found</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                  You have not registered for an official 2027 yatra departure yet.
                </p>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <span>Browse Departure Batches</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#101D35]">
                            {b.bookingReference}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : b.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {b.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            b.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : b.paymentStatus === 'PENDING_VERIFICATION'
                              ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                              : 'text-slate-500'
                          }`}>
                            Payment: {b.paymentStatus.replace('_', ' ')}
                          </span>
                          {(b.paymentMethod === 'OFFLINE' || b.paymentMethod === 'OFFLINE_TEST') && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              TEST OFFLINE
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-[#101D35]">
                          {b.route?.name || 'Pilgrimage Route'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {b.departure?.name} • Booked on {new Date(b.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">Total Package Value</span>
                        <span className="text-lg font-bold text-[#101D35]">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                        {b.depositPaid > 0 && (
                          <span className="text-xs text-emerald-600 font-semibold block">
                            Paid: ₹{b.depositPaid?.toLocaleString('en-IN')}
                          </span>
                        )}
                        {b.balanceDue > 0 && (
                          <span className="text-xs text-amber-700 font-semibold block">
                            Balance Due: ₹{b.balanceDue?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Travellers on this booking */}
                    {b.travellers && b.travellers.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Registered Yatris ({b.travellers.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {b.travellers.map((tr) => (
                            <div key={tr.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                              <p className="font-bold text-slate-800">{tr.fullName}</p>
                              <p className="text-slate-500 text-[11px]">
                                {tr.gender} • Age {tr.age} • {tr.nationality}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-heading font-bold text-[#101D35] mb-1">
              Payment & Transaction History
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Verified receipts and deposit records for your pilgrimage reservations.
            </p>

            {dataLoading ? (
              <div className="py-12 text-center text-slate-400">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CreditCard size={36} className="mx-auto text-slate-400 mb-2" />
                <h4 className="text-base font-bold text-[#101D35] mb-1">No Payment Records</h4>
                <p className="text-xs text-slate-500">
                  Payments made through the online gateway or bank transfer will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Booking Reference</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 font-mono text-slate-700">{p.transactionId}</td>
                        <td className="py-3 font-mono font-bold text-[#101D35]">
                          {p.booking?.bookingReference || 'N/A'}
                        </td>
                        <td className="py-3 text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-slate-600">{p.paymentMethod}</td>
                        <td className="py-3 font-bold text-slate-900">₹{p.amount?.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MY DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#071B3A] text-amber-300 font-mono">
                      COMPLIANCE & RISK CLEARANCE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Draft 1.0 – 23 Nov 2026
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#101D35]">
                    My Pilgrimage Documents
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    Mandatory official risk declarations, medical fitness certificates, and high-altitude travel insurance records associated with your confirmed 2027 yatras.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={SYPL_RISK_DOCUMENT.downloadUrl}
                    download="Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
                    title="Download official Risk Declaration PDF"
                  >
                    <Download size={14} className="text-[#2F6FED]" />
                    <span>Risk PDF</span>
                  </a>
                  <a
                    href={SYPL_MEDICAL_DOCUMENT.downloadUrl}
                    download="Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
                    title="Download official Medical Certificate Form PDF"
                  >
                    <Download size={14} className="text-[#2F6FED]" />
                    <span>Medical PDF</span>
                  </a>
                </div>
              </div>

              {/* Draft Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-6">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Official Documents Status (Draft 1.0):</strong> The Medical Fitness Certificate (<code>SYPL-MED-2027</code>) and Risk Declaration (<code>SYPL-RISK-2027</code>) are currently in Draft 1.0 review status. Both forms must be completed per participant. Final clearance is subject to formal verification by Shloka Yatra operations.
                </div>
              </div>

              {dataLoading ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#2F6FED]" />
                  <span>Loading your document compliance register...</span>
                </div>
              ) : docBookings.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-lg mx-auto">
                  <FileText size={40} className="mx-auto text-slate-400 mb-3" />
                  <h4 className="text-base font-bold text-[#101D35] mb-1">No Pilgrimage Bookings Found</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    Once you book a Kailash Mansarovar pilgrimage package, your document requirements and clearance cards will appear here.
                  </p>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071B3A] text-amber-300 font-bold text-xs sm:text-sm hover:bg-slate-900 transition-colors shadow-sm"
                  >
                    <span>Explore Packages & Book Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {docBookings.map((b) => (
                    <div key={b.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      {/* Booking Header */}
                      <div className="bg-[#071B3A] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-300">
                              {b.bookingReference}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                              {b.batchName}
                            </span>
                          </div>
                          <h4 className="text-base font-bold font-heading text-white mt-1">
                            {b.routeName}
                          </h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-300 block">
                            {b.travellersCount} Devotee{b.travellersCount > 1 ? 's' : ''} • Departure: {b.departureDate ? new Date(b.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed 2027'}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-400">
                            Booking Status: {b.status}
                          </span>
                        </div>
                      </div>

                      {/* Travellers and Document Cards */}
                      <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
                        {b.travellers.map((traveller) => (
                          <div key={traveller.travellerId} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#071B3A] text-white text-xs font-bold flex items-center justify-center">
                                  {traveller.fullName.charAt(0)}
                                </span>
                                <div>
                                  <h5 className="text-sm sm:text-base font-bold text-[#101D35] flex items-center gap-2">
                                    <span>{traveller.fullName}</span>
                                    {traveller.isPrimary && (
                                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2F6FED] border border-blue-200">
                                        Primary Devotee
                                      </span>
                                    )}
                                  </h5>
                                  <span className="text-xs text-slate-500 font-mono">
                                    Passport / ID: {traveller.passportNumber}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 3 Document Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {traveller.cards.map((card) => {
                                const isRisk = card.type === 'RISK_DECLARATION';
                                const isMed = card.type === 'MEDICAL_CERTIFICATE';
                                const isIns = card.type === 'INSURANCE_PROOF';

                                const getStatusBadge = (status) => {
                                  switch (status) {
                                    case 'ACCEPTED':
                                      return 'bg-emerald-50 text-emerald-700 border-emerald-300';
                                    case 'UNDER_REVIEW':
                                      return 'bg-blue-50 text-blue-700 border-blue-300';
                                    case 'SUBMITTED':
                                      return 'bg-purple-50 text-purple-700 border-purple-300';
                                    case 'CLARIFICATION_REQUIRED':
                                    case 'RESUBMISSION_REQUIRED':
                                      return 'bg-amber-50 text-amber-800 border-amber-300';
                                    case 'NOT_ACCEPTED':
                                      return 'bg-red-50 text-red-700 border-red-300';
                                    default:
                                      return 'bg-slate-100 text-slate-600 border-slate-300';
                                  }
                                };

                                return (
                                  <div
                                    key={card.id}
                                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors shadow-2xs"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                          {card.documentRef}
                                        </span>
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                                            card.status
                                          )}`}
                                        >
                                          {card.status.replace(/_/g, ' ')}
                                        </span>
                                      </div>

                                      <h6 className="text-xs sm:text-sm font-bold text-[#101D35] leading-snug">
                                        {card.title}
                                      </h6>
                                      <span className="text-[11px] text-slate-400 block mt-0.5">
                                        Version: {card.version}
                                      </span>

                                      {/* Clarification or review notes */}
                                      {card.reviewNote && (
                                        <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-800 space-y-0.5">
                                          <strong className="block font-bold">Admin Clarification Note:</strong>
                                          <p>{card.reviewNote}</p>
                                        </div>
                                      )}

                                      {/* Sub-details for Insurance */}
                                      {isIns && card.provider && (
                                        <div className="mt-2 p-2 rounded bg-slate-50 text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
                                          <div><strong>Provider:</strong> {card.provider}</div>
                                          <div><strong>Policy:</strong> {card.policyNumber || 'Recorded'}</div>
                                        </div>
                                      )}

                                      {/* Sub-details for Medical */}
                                      {isMed && (
                                        <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                                          Requires certified clinical examination by registered physician with photo cross-stamp.
                                        </p>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-slate-100 space-y-2">
                                      {/* Primary action per card type */}
                                      {isRisk && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setActiveDocModal({
                                              type: 'RISK',
                                              booking: b,
                                              traveller,
                                              card,
                                            })
                                          }
                                          className="w-full py-2 px-3 rounded-lg bg-[#071B3A] hover:bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <ShieldCheck size={13} />
                                          <span>
                                            {card.status === 'ACCEPTED'
                                              ? 'View Signed Record'
                                              : card.status === 'SUBMITTED'
                                              ? 'Review Submission'
                                              : 'Open & Execute Declaration'}
                                          </span>
                                        </button>
                                      )}

                                      {isMed && (
                                        <div className="flex flex-col gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActiveDocModal({
                                                type: 'MED',
                                                booking: b,
                                                traveller,
                                                card,
                                              })
                                            }
                                            className="w-full py-2 px-3 rounded-lg bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                          >
                                            <UploadCloud size={13} />
                                            <span>
                                              {card.status === 'ACCEPTED'
                                                ? 'Replace Certificate'
                                                : card.status === 'SUBMITTED'
                                                ? 'Re-upload Certificate'
                                                : 'Upload Doctor Certificate'}
                                            </span>
                                          </button>
                                        </div>
                                      )}

                                      {isIns && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setActiveDocModal({
                                              type: 'INS',
                                              booking: b,
                                              traveller,
                                              card,
                                            })
                                          }
                                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <UploadCloud size={13} />
                                          <span>
                                            {card.hasFile ? 'Update Insurance Proof' : 'Upload Insurance Proof'}
                                          </span>
                                        </button>
                                      )}

                                      {/* Secondary: Download File if submitted */}
                                      {card.submissionId && card.hasFile && (
                                        <a
                                          href={api.getDocumentDownloadUrl(card.submissionId)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                          <ExternalLink size={12} className="text-[#2F6FED]" />
                                          <span>View Uploaded File</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ACCOUNT SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-xl">
            <h3 className="text-xl font-heading font-bold text-[#101D35] mb-1">
              Account Security & Password
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Update your account password or review session details.
            </p>

            {passwordSuccess && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#101D35] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full py-3 px-6 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white text-xs font-bold uppercase tracking-wider shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordSaving ? <RefreshCw size={14} className="animate-spin text-[#D9A441]" /> : <Lock size={14} />}
                  <span>Update Account Password</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 1. Risk Declaration Modal */}
      {activeDocModal?.type === 'RISK' && (
        <RiskDeclarationModal
          isOpen={true}
          onClose={() => setActiveDocModal(null)}
          participantData={{
            fullName: activeDocModal.traveller?.fullName,
            passportNumber: activeDocModal.traveller?.passportNumber,
            city: activeDocModal.booking?.contactCity || 'Kathmandu, Nepal',
            emergencyContactName: activeDocModal.traveller?.emergencyContactName,
            emergencyContactPhone: activeDocModal.traveller?.emergencyContactPhone,
          }}
          onDeclarationSigned={async (signedData) => {
            try {
              await api.submitRiskDeclaration({
                bookingId: activeDocModal.booking.id,
                travellerId: activeDocModal.traveller.id || activeDocModal.traveller.travellerId,
                ...signedData,
              });
              setActiveDocModal(null);
              // Refresh document state
              api.getMemberMyDocuments().then((res) => {
                setDocBookings(res.bookings || []);
                setDocuments(res.bookings || []);
              });
            } catch (err) {
              alert(err.message || 'Failed to submit Risk Declaration');
            }
          }}
        />
      )}

      {/* 2. Medical Fitness Certificate Upload Modal */}
      {activeDocModal?.type === 'MED' && (
        <MedicalCertificateUploadModal
          isOpen={true}
          onClose={() => setActiveDocModal(null)}
          booking={activeDocModal.booking}
          traveller={activeDocModal.traveller}
          onSuccess={() => {
            api.getMemberMyDocuments().then((res) => {
              setDocBookings(res.bookings || []);
              setDocuments(res.bookings || []);
            });
          }}
        />
      )}

      {/* 3. Insurance Proof Upload Modal */}
      {activeDocModal?.type === 'INS' && (
        <InsuranceProofUploadModal
          isOpen={true}
          onClose={() => setActiveDocModal(null)}
          booking={activeDocModal.booking}
          traveller={activeDocModal.traveller}
          onSuccess={() => {
            api.getMemberMyDocuments().then((res) => {
              setDocBookings(res.bookings || []);
              setDocuments(res.bookings || []);
            });
          }}
        />
      )}
    </div>
  );
}
