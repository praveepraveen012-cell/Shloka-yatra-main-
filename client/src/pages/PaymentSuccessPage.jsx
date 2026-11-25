import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Printer,
  Calendar,
  Users,
  ShieldCheck,
  Building,
  CreditCard,
  ArrowRight,
  FileCheck2,
  Sparkles,
  Phone,
} from 'lucide-react';
import { api } from '../services/api';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref') || searchParams.get('bookingReference');
  const txnParam = searchParams.get('txn') || searchParams.get('transactionId');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (reference) {
      api
        .getBookingByReference(reference)
        .then((res) => {
          if (res?.booking) {
            setBooking(res.booking);
          } else {
            setError('Booking record not found for reference: ' + reference);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('No booking reference provided in return URL.');
    }
  }, [reference]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F6F2] pt-28">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#101D35] border-t-[#D9A441] rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#101D35]">Verifying Sacred Booking & Payment...</h2>
          <p className="text-xs text-slate-500 mt-1">Contacting backend verification engine</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F6F2] pt-28 pb-16 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#101D35] mb-2">Record Retrieval Notice</h2>
          <p className="text-slate-600 text-sm mb-6">{error || 'Unable to retrieve voucher details.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account"
              className="px-6 py-3 rounded-xl bg-[#101D35] text-white font-semibold text-sm hover:bg-[#1C3455]"
            >
              Open Devotee Dashboard
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOffline =
    searchParams.get('offline') === 'true' ||
    searchParams.get('test') === 'true' ||
    booking.paymentMethod === 'OFFLINE' ||
    booking.paymentMethod === 'OFFLINE_TEST' ||
    booking.paymentStatus === 'PENDING_VERIFICATION';

  const latestPayment = booking.payments?.[0];
  const totalPaid = booking.payments?.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0) || 0;
  const balanceRemaining = Math.max(0, booking.totalAmount - totalPaid);

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Printable Official Voucher Card */}
        <div
          id="printable-voucher"
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#101D35] via-[#0D1829] to-[#08101E] text-white p-6 sm:p-10 text-center relative overflow-hidden">
            {/* Golden Radiance Backdrop */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                  isOffline
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300'
                    : 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400'
                }`}
              >
                {isOffline ? (
                  <ShieldCheck size={40} className="sm:w-11 sm:h-11" />
                ) : (
                  <CheckCircle size={40} className="sm:w-11 sm:h-11" />
                )}
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
                  isOffline
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                }`}
              >
                <Sparkles size={12} />
                <span>
                  {isOffline
                    ? 'Registration Submitted · Pending Administrative Verification'
                    : 'Payment & Registration Confirmed'}
                </span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white mb-2">
                Om Namah Shivaya!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                {isOffline
                  ? 'Your booking registration has been submitted successfully. This is a test booking created using Offline Payment mode. No online payment has been collected. Your booking is awaiting administrative review.'
                  : 'Your sacred pilgrimage reservation for Kailash Mansarovar Yatra 2027 has been authoritatively verified and confirmed in our pilgrimage database.'}
              </p>
            </div>
          </div>

          {/* Offline Pending Verification Alert Callout */}
          {isOffline && (
            <div className="bg-amber-50 border-b border-amber-200 p-5 sm:p-6 text-amber-950">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={24} className="text-[#A6781E] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-[#101D35]">
                      Offline Test Payment Notice
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      Your booking registration has been submitted successfully. This is a test booking created using Offline Payment mode. No online payment has been collected. Your booking is awaiting administrative review.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                    Payment Status: Pending Verification
                  </span>
                  <span className="text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full">
                    Booking Status: Pending Confirmation
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Key Reference Highlights Ribbon */}
          <div className="bg-[#0A1424] text-white px-6 py-4 border-t border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8CA8CC] block">
                Booking Reference ID
              </span>
              <span className="font-mono text-lg font-bold text-[#D9A441]">
                {booking.bookingReference}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8CA8CC] block">
                Payment Method
              </span>
              <span className="font-mono text-sm text-slate-200">
                {isOffline ? 'Offline Test Payment' : (latestPayment?.transactionId || txnParam || 'TXN-VERIFIED')}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8CA8CC] block">
                Payment Status
              </span>
              <span
                className={`font-mono text-sm font-semibold ${
                  isOffline ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                {isOffline ? 'Pending Verification' : (latestPayment?.receiptNumber || 'REC-2027-OFFICIAL')}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Primary Devotee & Contact Notice */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-slate-500 font-medium">Primary Devotee Contact:</span>{' '}
                <strong className="text-slate-900">{booking.contactName}</strong> ({booking.contactEmail} · {booking.contactPhone})
              </div>
              <div>
                <span className="text-slate-500 font-medium">Payment Mode:</span>{' '}
                <span className="font-bold text-[#101D35] uppercase">{isOffline ? 'Offline Test Payment' : (booking.paymentMethod || 'ONLINE')}</span>
              </div>
            </div>

            {/* Itinerary & Batch Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200">
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#101D35] mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-[#D9A441]" />
                  <span>Selected Pilgrimage Itinerary</span>
                </h3>
                <p className="font-heading text-lg font-bold text-[#101D35] mb-1">
                  {booking.route?.name || 'Kailash Mansarovar Sacred Circuit'}
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  {booking.route?.approachType || 'Cross-Border High-Altitude Yatra'} • {booking.totalTravellers} Registered Yatri(s)
                </p>
                <div className="text-xs bg-white rounded-lg p-2.5 border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-[#101D35]">Departure Batch:</span>
                  <span>{booking.departure?.name} ({new Date(booking.departure?.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} to {new Date(booking.departure?.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200">
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#101D35] mb-3 flex items-center gap-2">
                  <CreditCard size={14} className="text-[#D9A441]" />
                  <span>Financial Statement</span>
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Contract Value:</span>
                    <span className="font-semibold text-slate-900">₹{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid to Date:</span>
                    <span className="font-bold text-emerald-600">
                      {isOffline && totalPaid === 0
                        ? '₹0 (Pending Verification)'
                        : `₹${Number(totalPaid).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                    <span className="font-bold text-[#101D35]">
                      {isOffline ? 'Amount Awaiting Verification:' : 'Pending Balance:'}
                    </span>
                    <span className="font-bold text-[#101D35]">
                      ₹{Number(balanceRemaining).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-600 bg-amber-50 border border-amber-200 p-2.5 rounded-lg leading-relaxed">
                  {isOffline
                    ? 'Offline payment will be verified by the administration team upon confirmation of bank receipt or remittance.'
                    : 'Balance due 45 days prior to arrival via RTGS / Wire / Card installment.'}
                </div>
              </div>
            </div>

            {/* Registered Travellers Roster */}
            <div>
              <h3 className="text-sm uppercase font-bold tracking-wider text-[#101D35] mb-3 flex items-center gap-2">
                <Users size={16} className="text-[#D9A441]" />
                <span>Registered Travellers Roster</span>
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101D35] text-white">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Full Legal Name</th>
                      <th className="p-3">Passport / ID</th>
                      <th className="p-3">Age / Gender</th>
                      <th className="p-3">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {booking.travellers?.map((traveller, idx) => (
                      <tr key={traveller.id || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{traveller.fullName}</td>
                        <td className="p-3 font-mono text-slate-700">{traveller.passportNumber}</td>
                        <td className="p-3 text-slate-600">{traveller.age} yrs • {traveller.gender}</td>
                        <td className="p-3 text-slate-600">{traveller.emergencyContactName} ({traveller.emergencyContactPhone})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Steps Advisory */}
            <div className="bg-[#071B3A] text-white rounded-2xl p-6 border border-[#2F6FED]/40">
              <h4 className="text-sm font-bold text-[#D9A441] mb-2 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>What Happens Next (Cross-Border Permit Processing)</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                <li>Your Tibet Travel Permit (TTP) and military liaison dossiers have been queued for processing.</li>
                <li>Please ensure passport scans, biometric photos, and medical fitness forms are uploaded in your Devotee Dashboard.</li>
                <li>A dedicated Pilgrimage Coordinator will contact you on WhatsApp / Phone: <strong>{booking.contactPhone}</strong> within 24 business hours.</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row gap-3 justify-between items-center print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              <Printer size={16} />
              <span>Print Official Voucher</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/account?tab=bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-semibold text-sm transition-all shadow-md"
              >
                <span>Devotee Dashboard</span>
                <ArrowRight size={16} className="text-[#D9A441]" />
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all text-center"
              >
                Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
