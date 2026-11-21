import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Compass,
  Calendar,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Receipt,
  Download,
  CreditCard,
  HeartPulse,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Plane,
  Bus,
} from 'lucide-react';
import api from '../services/api';

export default function MemberAccountPage() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberBookings, setMemberBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'journeys', 'bookings', 'payments', 'receipts', 'documents', 'participants', 'profile', 'support'

  useEffect(() => {
    const token = localStorage.getItem('shlloka_member_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('/api/membership/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then((data) => {
        setMember(data.member);
        localStorage.setItem('shlloka_member_user', JSON.stringify(data.member));
      })
      .catch(() => {
        const local = localStorage.getItem('shlloka_member_user');
        if (local) {
          try {
            setMember(JSON.parse(local));
          } catch (e) {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));

    // Load any booking records stored for this user
    try {
      const storedBookings = JSON.parse(localStorage.getItem('shlloka_offline_bookings') || '[]');
      if (storedBookings.length > 0) {
        setMemberBookings(storedBookings);
      } else {
        // Fallback demo booking for authenticated user
        setMemberBookings([
          {
            id: 'bk-demo-001',
            bookingReference: 'SY-2027-8842',
            route: { name: 'Package 1: Overland Pilgrimage via Kerung (14 Days)' },
            departure: { name: 'Batch 1: 18 May – 31 May 2027 (Buddha Purnima)' },
            status: 'CONFIRMED',
            paymentStatus: 'DEPOSIT_PAID',
            totalTravellers: 2,
            totalAmount: 735000,
            depositPaid: 100000,
            balanceDue: 635000,
            balanceDueDate: '03 April 2027 (45 days prior)',
            createdAt: '2026-11-12',
          },
        ]);
      }
    } catch (e) {}
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('shlloka_member_token');
    localStorage.removeItem('shlloka_member_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center pt-24">
        <p className="text-[#101D35] font-semibold">Loading your devotee dashboard...</p>
      </div>
    );
  }

  if (!member) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'journeys', label: 'My Journeys', icon: Plane },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'receipts', label: 'Receipts & Vouchers', icon: Receipt },
    { id: 'documents', label: 'Travel Documents', icon: FileText },
    { id: 'participants', label: 'Participant Details', icon: User },
    { id: 'profile', label: 'Devotee Profile', icon: Shield },
    { id: 'support', label: 'Support & Concierge', icon: Headphones },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Member Welcome Banner */}
        <div className="bg-gradient-to-r from-[#101D35] via-[#183B68] to-[#101D35] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D9A441] text-[#101D35] text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                Verified Devotee Member
              </span>
              <span className="text-xs text-slate-300">
                Membership ID: <strong className="font-mono text-white">{member.membershipReference || 'SY-MEM-2027'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Namaskaram, {member.firstName || 'Revered'} {member.lastName || 'Devotee'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {member.email} • {member.mobile} • Flat No. 7164, ATS One Hamlet, Noida
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="bg-gradient-to-r from-[#D9A441] to-[#E5B558] text-[#101D35] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all"
            >
              Book 2027 Yatra
            </Link>
            <button
              onClick={handleLogout}
              className="border border-white/20 hover:border-rose-400 hover:text-rose-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* MakeMyTrip-Style Dashboard Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-8 overflow-x-auto scrollbar-none flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#101D35] text-[#D9A441] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#D9A441]' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Status Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pilgrimage Status
                </span>
                <div className="text-xl font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle size={20} />
                  <span>Seat Reserved</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Batch 1: 18 May 2027</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Status
                </span>
                <div className="text-xl font-bold text-amber-600 flex items-center gap-1.5">
                  <CreditCard size={20} />
                  <span>Deposit Paid</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">₹1,00,000 Verified</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Documents Verified
                </span>
                <div className="text-xl font-bold text-[#1C3F70] flex items-center gap-1.5">
                  <FileText size={20} />
                  <span>2 of 4 Complete</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Passport & Photo Verified</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Assigned Coordinator
                </span>
                <div className="text-base font-bold text-[#101D35] flex items-center gap-1.5">
                  <Headphones size={18} className="text-[#D9A441]" />
                  <span>Sangeeta (Noida HQ)</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">+91 6366852888</span>
              </div>
            </div>

            {/* Active Yatra Showcase Banner */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Confirmed Registration
                  </span>
                  <h3 className="text-xl font-bold text-[#101D35] mt-2">
                    Kailash Mansarovar Parikrama 2027 — Overland Bus (14 Days)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking Reference: <strong className="font-mono text-[#101D35]">SY-2027-8842</strong> · Batch 1: May 18 – May 31, 2027 (Buddha Purnima Darshan)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/booking-success?ref=SY-2027-8842"
                    className="bg-[#1C3F70] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#101D35] transition-colors"
                  >
                    View Official Voucher
                  </Link>
                  <Link
                    to="/routes/bus-both-ways"
                    className="border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50"
                  >
                    View Itinerary
                  </Link>
                </div>
              </div>

              {/* Progress Milestones Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Registration</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Completed</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Deposit Payment</div>
                    <div className="text-[11px] text-emerald-600 font-medium">₹1,00,000 Verified</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Medical Fitness</div>
                    <div className="text-[11px] text-amber-600 font-medium">Due 45 Days Prior</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Tibet Group Visa</div>
                    <div className="text-[11px] text-slate-500">Processed in Kathmandu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 & 3: My Journeys & My Bookings */}
        {(activeTab === 'journeys' || activeTab === 'bookings') && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#101D35]">My Registered Yatra Bookings</h3>
                <p className="text-xs text-slate-500">Active and upcoming pilgrimage schedules for 2027</p>
              </div>
              <Link to="/book" className="text-xs font-bold text-[#1C3F70] hover:underline">
                + Book Another Route
              </Link>
            </div>

            {memberBookings.map((b) => (
              <div key={b.id || b.bookingReference} className="border border-slate-200 rounded-xl p-5 hover:border-[#1C3F70] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase">
                      REF: {b.bookingReference}
                    </span>
                    <h4 className="text-base font-bold text-[#101D35] mt-0.5">{b.route?.name}</h4>
                    <span className="text-xs text-slate-500">{b.departure?.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      {b.status || 'CONFIRMED'}
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      {b.paymentStatus || 'DEPOSIT_PAID'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Travellers</span>
                    <strong className="text-slate-800">{b.totalTravellers || 2} Devotees</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Package Value</span>
                    <strong className="text-slate-800">₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Deposit Paid</span>
                    <strong className="text-emerald-700">₹{b.depositPaid?.toLocaleString('en-IN') || '1,00,000'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Balance Due</span>
                    <strong className="text-amber-800">₹{b.balanceDue?.toLocaleString('en-IN') || '6,35,000'}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    Balance payment due date: <strong>{b.balanceDueDate || '03 April 2027'}</strong>
                  </span>
                  <Link
                    to={`/booking-success?ref=${b.bookingReference}`}
                    className="text-xs font-bold text-[#1C3F70] hover:text-[#101D35] flex items-center gap-1"
                  >
                    <span>Download Booking Voucher</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4 & 5: Payments & Receipts */}
        {(activeTab === 'payments' || activeTab === 'receipts') && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#101D35]">Invoices, Payments & Receipts</h3>
                <p className="text-xs text-slate-500">Official GST-compliant payment statements under Shloka Yatra Private Limited</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-xs font-bold text-[#1C3F70] border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"
              >
                🖨️ Print Statement
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-3 rounded-l-lg">Transaction ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-mono font-bold">TXN-202611-9921</td>
                  <td className="p-3">12 Nov 2026</td>
                  <td className="p-3">Registration & Permit Filing Deposit (2 Yatris)</td>
                  <td className="p-3 font-bold text-[#101D35]">₹1,00,000</td>
                  <td className="p-3">HDFC NetBanking (NEFT/IMPS)</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      SUCCESSFUL
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Terms & Conditions Refund Protection (Clause C4):</strong> All advance deposits are held in our corporate escrow account. In accordance with Clause C4, cancellations requested before China group permit submission are refundable subject only to administrative reconciliation.
            </div>
          </div>
        )}

        {/* Tab 6: Travel Documents */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#101D35]">Travel Documents & Permit Clearance</h3>
                <p className="text-xs text-slate-500">Government permits and health clearance status</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <div>
                    <strong className="text-xs text-slate-800 block">Passport Scans (Front & Address Page)</strong>
                    <span className="text-[11px] text-slate-500">Verified for 6 months validity from departure</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <div>
                    <strong className="text-xs text-slate-800 block">Passport Photographs (White Background)</strong>
                    <span className="text-[11px] text-slate-500">Standard 35mm x 45mm Tibet permit format</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-500" />
                  <div>
                    <strong className="text-xs text-slate-800 block">Medical Fitness Certificate (Clinician Signed)</strong>
                    <span className="text-[11px] text-slate-500">Required 45 days prior to travel</span>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  DUE APRIL 2027
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-500" />
                  <div>
                    <strong className="text-xs text-slate-800 block">Emergency Helicopter Evacuation Insurance</strong>
                    <span className="text-[11px] text-slate-500">Policy covering up to 6,000 meters elevation</span>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  DUE APRIL 2027
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="mailto:volunteers@shlloka.com?subject=Document Submission: SY-2027-8842"
                className="inline-flex items-center gap-2 bg-[#101D35] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#183B68]"
              >
                <Upload size={14} />
                <span>Email New Documents to Operations</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 7: Participant Details */}
        {activeTab === 'participants' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#101D35] pb-2 border-b border-slate-100">
              Registered Devotee Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-sm text-[#101D35]">Yatri 1: {member.firstName} {member.lastName}</strong>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">PRIMARY</span>
                </div>
                <div>Passport: <strong>{member.passportNumber || 'N8291048'}</strong></div>
                <div>Nationality: <strong>{member.nationality || 'Indian'}</strong></div>
                <div>Diet: <strong>Pure Vegetarian (Sattvic)</strong></div>
                <div>Emergency Contact: <strong>Suresh Sharma (+91 98100 23456)</strong></div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-sm text-[#101D35]">Yatri 2: Sunita Sharma</strong>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">CO-TRAVELLER</span>
                </div>
                <div>Passport: <strong>P3920194</strong></div>
                <div>Nationality: <strong>Indian</strong></div>
                <div>Diet: <strong>Jain Sattvic (No Root Vegetables)</strong></div>
                <div>Emergency Contact: <strong>Suresh Sharma (+91 98100 23456)</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#101D35] pb-2 border-b border-slate-100">
              Devotee Profile Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Full Legal Name</span>
                <strong className="text-slate-800 text-sm">{member.firstName} {member.lastName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Registered Email</span>
                <strong className="text-slate-800 text-sm">{member.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Mobile Number</span>
                <strong className="text-slate-800 text-sm">{member.mobile}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">WhatsApp Number</span>
                <strong className="text-slate-800 text-sm">{member.whatsapp || member.mobile}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Residential City & State</span>
                <strong className="text-slate-800 text-sm">{member.city || 'Noida'}, {member.state || 'Uttar Pradesh'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Country</span>
                <strong className="text-slate-800 text-sm">{member.country || 'India'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Support */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#101D35] pb-2 border-b border-slate-100">
              Pilgrimage Concierge & 24/7 Helpline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <Phone size={24} className="text-[#D9A441] mx-auto" />
                <strong className="block text-sm text-[#101D35]">24/7 Phone Helpline</strong>
                <p className="text-xs text-slate-500">+91 6366852888</p>
                <a href="tel:+916366852888" className="inline-block text-xs font-bold text-[#1C3F70]">
                  Call Now →
                </a>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <Mail size={24} className="text-[#6FA8B2] mx-auto" />
                <strong className="block text-sm text-[#101D35]">Official Email</strong>
                <p className="text-xs text-slate-500">volunteers@shlloka.com</p>
                <a href="mailto:volunteers@shlloka.com" className="inline-block text-xs font-bold text-[#1C3F70]">
                  Send Email →
                </a>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <MapPin size={24} className="text-[#1C3F70] mx-auto" />
                <strong className="block text-sm text-[#101D35]">Corporate Office</strong>
                <p className="text-xs text-slate-500">Flat No. 7164, ATS One Hamlet, Sector 104, Noida</p>
                <span className="text-xs text-slate-400">Sole Contracting Entity</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
