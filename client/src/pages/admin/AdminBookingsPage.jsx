import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Download,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [departureFilter, setDepartureFilter] = useState('ALL');
  const [routeFilter, setRouteFilter] = useState('ALL');

  const [departures, setDepartures] = useState([]);
  const [routes, setRoutes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [depRes, routeRes] = await Promise.all([
          api.getDepartures(),
          api.getRoutes(),
        ]);
        setDepartures(depRes.departures || []);
        setRoutes(routeRes.routes || []);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    }
    loadMetadata();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (paymentFilter !== 'ALL') params.append('paymentStatus', paymentFilter);
      if (departureFilter !== 'ALL') params.append('departureId', departureFilter);
      if (routeFilter !== 'ALL') params.append('routeId', routeFilter);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const res = await api.getAdminBookings(params.toString());
      setBookings(res.bookings || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [page, statusFilter, paymentFilter, departureFilter, routeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadBookings();
  };

  const handleExportCsv = () => {
    window.open(api.getAdminReportCsvUrl('bookings'), '_blank');
  };

  return (
    <AdminLayout
      title="Booking Management System"
      subtitle="Search, verify, inspect financial ledgers, and manage 2027 pilgrimage bookings"
    >
      <div className="space-y-6 font-body">
        {/* Top Control Bar: Search & Actions */}
        <div className="bg-[#071B3A] p-4 sm:p-5 rounded-2xl border border-[#D9E2EF]/15 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Booking ID (SHY-...), Devotee Name, Phone, Email, or Yatri Name..."
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] text-white rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-[#8CA8CC]/60 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Search Records</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </form>

          {/* Filter Dropdowns Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
            <div>
              <label className="block text-[#8CA8CC] font-medium mb-1">Booking Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg px-2.5 py-1.5 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8CA8CC] font-medium mb-1">Payment Status</label>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg px-2.5 py-1.5 outline-none"
              >
                <option value="ALL">All Payments</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="PAID">Fully Paid</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8CA8CC] font-medium mb-1">Departure Batch</label>
              <select
                value={departureFilter}
                onChange={(e) => {
                  setDepartureFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg px-2.5 py-1.5 outline-none truncate"
              >
                <option value="ALL">All Batches (2027)</option>
                {departures.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#8CA8CC] font-medium mb-1">Route Package</label>
              <select
                value={routeFilter}
                onChange={(e) => {
                  setRouteFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg px-2.5 py-1.5 outline-none truncate"
              >
                <option value="ALL">All Routes</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-[#8CA8CC] px-1">
          <span>
            Showing <strong className="text-white">{bookings.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total database records
          </span>
          {loading && <span className="text-[#2F6FED]">Refreshing table...</span>}
        </div>

        {/* Table of Bookings */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase tracking-wider font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Devotee Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Batch & Route</th>
                  <th className="py-3.5 px-4 text-center">Yatris</th>
                  <th className="py-3.5 px-4 text-right">Financials</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[#8CA8CC]">
                      {loading ? (
                        <span>Loading bookings...</span>
                      ) : (
                        <div className="max-w-md mx-auto">
                          <p className="font-semibold text-white mb-1">No Bookings Found</p>
                          <p className="text-xs">
                            No database records match your active search or filter criteria. New bookings made on the website will appear here in real-time.
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => {
                    const totalPaid = (b.payments || [])
                      .filter((p) => p.status === 'SUCCESS')
                      .reduce((sum, p) => sum + p.amount, 0);
                    const balance = Math.max(0, b.totalAmount - totalPaid);

                    return (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        {/* Booking ID & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Link
                            to={`/admin/bookings/${b.id}`}
                            className="font-bold text-[#2F6FED] hover:underline block font-mono text-xs"
                          >
                            {b.bookingReference}
                          </Link>
                          <span className="text-[11px] text-[#8CA8CC]">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Devotee Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{b.contactName}</div>
                          <div className="text-[10px] text-[#8CA8CC]">
                            Passport: {b.passportType}
                          </div>
                        </td>

                        {/* Contact details */}
                        <td className="py-3.5 px-4">
                          <div className="text-white">{b.contactPhone}</div>
                          <div className="text-[11px] text-[#8CA8CC] truncate max-w-[160px]">
                            {b.contactEmail}
                          </div>
                        </td>

                        {/* Batch & Route */}
                        <td className="py-3.5 px-4 max-w-[220px]">
                          <div className="text-white font-medium truncate">
                            {b.departure?.name}
                          </div>
                          <div className="text-[11px] text-[#8CA8CC] truncate">
                            {b.route?.name}
                          </div>
                        </td>

                        {/* Number of Yatris */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white font-bold text-xs">
                            {b.totalTravellers}
                          </span>
                        </td>

                        {/* Financials: Total, Paid, Balance */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-white">
                            ₹{b.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-emerald-400">
                            Paid: ₹{totalPaid.toLocaleString('en-IN')}
                          </div>
                          {balance > 0 && (
                            <div className="text-[10px] text-amber-300">
                              Bal: ₹{balance.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Status Badges */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap space-y-1">
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : b.status === 'CANCELLED'
                                ? 'bg-red-500/15 border-red-500/40 text-red-400'
                                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            {b.status}
                          </span>
                          <div>
                            <span
                              className={`text-[9px] uppercase font-semibold ${
                                b.paymentStatus === 'PAID'
                                  ? 'text-emerald-400'
                                  : b.paymentStatus === 'PARTIALLY_PAID'
                                  ? 'text-cyan-400'
                                  : 'text-amber-300'
                              }`}
                            >
                              {(b.paymentStatus || 'UNPAID').replace('_', ' ')}
                            </span>
                          </div>
                        </td>

                        {/* Action Link */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            to={`/admin/bookings/${b.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F6FED]/20 hover:bg-[#2F6FED]/35 text-[#2F6FED] hover:text-white border border-[#2F6FED]/40 font-semibold text-xs transition-colors"
                          >
                            <Eye size={13} />
                            <span>Manage</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-[#041329] border-t border-[#D9E2EF]/15 flex items-center justify-between text-xs text-[#8CA8CC]">
              <div>
                Page <strong className="text-white">{page}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
