import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  AlertCircle,
  DollarSign,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await api.getAdminDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];
  const recentPayments = data?.recentPayments || [];
  const recentEnquiries = data?.recentEnquiries || [];
  const recentAuditLogs = data?.recentAuditLogs || [];
  const upcomingDepartures = data?.upcomingDepartures || [];

  return (
    <AdminLayout
      title="Pilgrimage Command Dashboard"
      subtitle="Live database metrics for Kailash Mansarovar Yatra 2027 operations"
    >
      <div className="space-y-8 font-body">
        {/* Top Control Bar with Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071B3A] p-4 rounded-xl border border-[#D9E2EF]/15">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8CA8CC]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to Live Production Database • Strictly Calculated Metrics</span>
          </div>
          <button
            onClick={loadDashboard}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#8CA8CC]">
            <div className="inline-block w-8 h-8 border-3 border-[#2F6FED]/30 border-t-[#2F6FED] rounded-full animate-spin mb-3" />
            <p className="text-sm">Calculating real-time database totals...</p>
          </div>
        ) : (
          <>
            {/* 1. Summary Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Total Bookings */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Total Bookings</span>
                  <Calendar size={18} className="text-[#2F6FED]" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {stats.totalBookings || 0}
                </div>
                <div className="mt-2 text-xs text-[#8CA8CC] flex items-center gap-2">
                  <span className="text-amber-400">{stats.newBookings || 0} New</span>
                  <span>•</span>
                  <span className="text-emerald-400">{stats.confirmedBookings || 0} Confirmed</span>
                </div>
              </div>

              {/* Card 2: Registered Devotees */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Registered Devotees</span>
                  <Users size={18} className="text-[#D9A441]" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {stats.totalRegisteredDevotees || 0}
                </div>
                <div className="mt-2 text-xs text-[#8CA8CC]">
                  Across all active booking records
                </div>
              </div>

              {/* Card 3: Confirmed Bookings */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Confirmed Bookings</span>
                  <CheckCircle size={18} className="text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {stats.confirmedBookings || 0}
                </div>
                <div className="mt-2 text-xs text-emerald-400">
                  Deposit or full payment secured
                </div>
              </div>

              {/* Card 4: Pending Bookings */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Pending Bookings</span>
                  <Clock size={18} className="text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {stats.pendingBookings || 0}
                </div>
                <div className="mt-2 text-xs text-amber-300">
                  Awaiting payment / verification
                </div>
              </div>

              {/* Card 5: Amount Collected */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Total Collected</span>
                  <CreditCard size={18} className="text-[#2F6FED]" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  ₹{(stats.totalAmountCollected || 0).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-[#8CA8CC]">
                  Verified gateway & offline receipts
                </div>
              </div>

              {/* Card 6: Pending Balance */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Pending Payments</span>
                  <DollarSign size={18} className="text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  ₹{(stats.pendingPaymentsAmount || 0).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-amber-300">
                  Remaining receivable on active bookings
                </div>
              </div>

              {/* Card 7: Refunds Processed */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Refunds Processed</span>
                  <RotateCcw size={18} className="text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  ₹{(stats.refundsProcessed || 0).toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-[#8CA8CC]">
                  {stats.cancelledBookings || 0} Cancelled Bookings
                </div>
              </div>

              {/* Card 8: Season Seat Occupancy */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8CA8CC] uppercase tracking-wider mb-2">
                  <span>Total Occupancy</span>
                  <TrendingUp size={18} className="text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {stats.occupancyRate || 0}%
                </div>
                <div className="mt-2 text-xs text-[#8CA8CC]">
                  {stats.totalBookedSeats || 0} / {stats.totalCapacity || 0} Seats Reserved
                </div>
              </div>
            </div>

            {/* Empty State Banner if No Bookings */}
            {stats.totalBookings === 0 && (
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-8 text-center max-w-2xl mx-auto my-8">
                <div className="w-14 h-14 rounded-full bg-[#2F6FED]/15 border border-[#2F6FED] flex items-center justify-center mx-auto mb-4 text-[#2F6FED]">
                  <Calendar size={28} />
                </div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">
                  No Bookings Registered Yet
                </h3>
                <p className="text-sm text-[#8CA8CC] leading-relaxed mb-6 font-body">
                  All metrics on this dashboard are dynamically calculated from actual database records. Once a pilgrim submits a booking through the public portal, their booking, payments, documents, and communication logs will appear here in real-time.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/book"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold transition-colors"
                  >
                    Open Public Booking Form
                  </Link>
                  <Link
                    to="/admin/departures"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                  >
                    View 2027 Departure Batches
                  </Link>
                </div>
              </div>
            )}

            {/* 2. Grid Sections: Recent Bookings & Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section A: Recent Bookings */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                      Recent Bookings
                    </h3>
                    <p className="text-xs text-[#8CA8CC]">Latest pilgrim registrations</p>
                  </div>
                  <Link
                    to="/admin/bookings"
                    className="text-xs text-[#2F6FED] hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {recentBookings.length === 0 ? (
                  <div className="text-center py-10 text-[#8CA8CC] text-xs">
                    No bookings recorded in database yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((b) => (
                      <Link
                        key={b.id}
                        to={`/admin/bookings/${b.id}`}
                        className="block bg-[#041329] hover:bg-white/5 border border-[#D9E2EF]/10 rounded-xl p-3.5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">
                                {b.bookingReference}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  b.status === 'CONFIRMED'
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                    : b.status === 'CANCELLED'
                                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <div className="text-xs text-[#D9E2EF] mt-1 font-medium">
                              {b.contactName} ({b.contactPhone})
                            </div>
                            <div className="text-[11px] text-[#8CA8CC] mt-0.5">
                              {b.departure?.name} • {b.totalTravellers} Yatri(s)
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-white">
                              ₹{b.totalAmount.toLocaleString('en-IN')}
                            </div>
                            <span
                              className={`text-[10px] font-semibold mt-1 inline-block ${
                                b.paymentStatus === 'PAID'
                                  ? 'text-emerald-400'
                                  : b.paymentStatus === 'PARTIALLY_PAID'
                                  ? 'text-cyan-400'
                                  : 'text-amber-300'
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Section B: Recent Payments */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                      Recent Payments
                    </h3>
                    <p className="text-xs text-[#8CA8CC]">Online gateways & offline receipts</p>
                  </div>
                  <Link
                    to="/admin/payments"
                    className="text-xs text-[#2F6FED] hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Ledger</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {recentPayments.length === 0 ? (
                  <div className="text-center py-10 text-[#8CA8CC] text-xs">
                    No payment transactions recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPayments.map((p) => (
                      <div
                        key={p.id}
                        className="bg-[#041329] border border-[#D9E2EF]/10 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {p.booking?.bookingReference || 'General Payment'} • {p.booking?.contactName || 'Yatri'}
                          </div>
                          <div className="text-[#8CA8CC] text-[11px] mt-0.5">
                            {p.paymentMethod} {p.referenceNumber ? `• Ref: ${p.referenceNumber}` : ''}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-emerald-400 text-sm">
                            +₹{p.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#8CA8CC] mt-0.5">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Grid Sections: Upcoming Departures & Customer Enquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Departure Batches */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                      Upcoming 2027 Batches
                    </h3>
                    <p className="text-xs text-[#8CA8CC]">Seat capacity and availability status</p>
                  </div>
                  <Link
                    to="/admin/departures"
                    className="text-xs text-[#2F6FED] hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Manage Batches</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingDepartures.map((d) => {
                    const percent = Math.round((d.bookedSeats / d.totalCapacity) * 100);
                    return (
                      <div
                        key={d.id}
                        className="bg-[#041329] border border-[#D9E2EF]/10 rounded-xl p-3.5"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-white">{d.name}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              d.status === 'AVAILABLE'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : d.status === 'FAST_FILLING'
                                ? 'bg-amber-500/15 text-amber-300'
                                : 'bg-red-500/15 text-red-400'
                            }`}
                          >
                            {d.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8CA8CC] mb-2">
                          Dates: {new Date(d.arrivalDate).toLocaleDateString()} – {new Date(d.departureDate).toLocaleDateString()} ({d.totalDays} Days)
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-[#2F6FED] h-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[#8CA8CC] mt-1.5">
                          <span>{d.bookedSeats} / {d.totalCapacity} Seats Booked</span>
                          <span>{percent}% Filled</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Enquiries & Callback Leads */}
              <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                      Customer Enquiries & Leads
                    </h3>
                    <p className="text-xs text-[#8CA8CC]">Inbound pilgrim questions and requests</p>
                  </div>
                  <Link
                    to="/admin/enquiries"
                    className="text-xs text-[#2F6FED] hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {recentEnquiries.length === 0 ? (
                  <div className="text-center py-10 text-[#8CA8CC] text-xs">
                    No enquiries submitted yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEnquiries.map((e) => (
                      <div
                        key={e.id}
                        className="bg-[#041329] border border-[#D9E2EF]/10 rounded-xl p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <b className="text-white font-semibold">{e.name}</b>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              e.status === 'NEW'
                                ? 'bg-[#2F6FED]/20 text-[#2F6FED] border border-[#2F6FED]/40'
                                : 'bg-white/10 text-[#8CA8CC]'
                            }`}
                          >
                            {e.status}
                          </span>
                        </div>
                        <p className="text-[#D9E2EF] text-[11px] line-clamp-1 my-1">
                          {e.message}
                        </p>
                        <div className="text-[10px] text-[#8CA8CC] flex items-center justify-between">
                          <span>{e.phone} • {e.email}</span>
                          <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Audit Log Stream */}
            <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-[#2F6FED]" />
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
                    Administrative Activity Log
                  </h3>
                </div>
                <Link
                  to="/admin/audit-logs"
                  className="text-xs text-[#2F6FED] hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Full Audit Trail</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {recentAuditLogs.length === 0 ? (
                <div className="text-center py-6 text-[#8CA8CC] text-xs">
                  No administrative events recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5 text-xs">
                  {recentAuditLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-[#8CA8CC] text-[11px] ml-2">by {log.userEmail}</span>
                      </div>
                      <span className="text-[#8CA8CC] text-[11px] shrink-0">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
