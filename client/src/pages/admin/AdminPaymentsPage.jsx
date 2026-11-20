import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Search,
  Download,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  // Offline Modal
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineBookingId, setOfflineBookingId] = useState('');
  const [offlineAmount, setOfflineAmount] = useState('');
  const [offlineMode, setOfflineMode] = useState('BANK_TRANSFER');
  const [offlineRef, setOfflineRef] = useState('');
  const [offlineType, setOfflineType] = useState('REGISTRATION');
  const [offlineNotes, setOfflineNotes] = useState('');
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (modeFilter !== 'ALL') params.append('paymentMode', modeFilter);

      const res = await api.getAdminPayments(params.toString());
      setPayments(res.payments || []);
      setTotalCollected(res.totalCollected || 0);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [statusFilter, modeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPayments();
  };

  const handleRecordOfflinePayment = async (e) => {
    e.preventDefault();
    const amountNum = parseInt(offlineAmount, 10);
    if (!offlineBookingId.trim() || isNaN(amountNum) || amountNum <= 0 || !offlineRef.trim()) {
      alert('Please fill all required fields: Booking ID, valid positive Amount, and Reference Number.');
      return;
    }

    try {
      setOfflineSubmitting(true);
      await api.recordAdminOfflinePayment({
        bookingId: offlineBookingId.trim(),
        amount: amountNum,
        paymentMode: offlineMode,
        referenceNumber: offlineRef.trim(),
        installmentType: offlineType,
        adminNotes: offlineNotes.trim() || undefined,
      });

      setOfflineModalOpen(false);
      setOfflineBookingId('');
      setOfflineAmount('');
      setOfflineRef('');
      setOfflineNotes('');
      setSuccessMsg(`Offline payment of ₹${amountNum.toLocaleString('en-IN')} recorded successfully.`);
      await loadPayments();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    } finally {
      setOfflineSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Payments & Revenue Ledger"
      subtitle="Authoritative transaction registry for verified online & offline pilgrim receipts"
    >
      <div className="space-y-6 font-body">
        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Top Summary Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5">
            <div className="text-xs text-[#8CA8CC] uppercase font-semibold">Total Verified Revenue</div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400 mt-1">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#8CA8CC] mt-1">Sum of all successful transactions</div>
          </div>

          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5">
            <div className="text-xs text-[#8CA8CC] uppercase font-semibold">Total Transactions</div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
              {payments.length}
            </div>
            <div className="text-[11px] text-[#8CA8CC] mt-1">Matching current filters</div>
          </div>

          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-xs text-[#8CA8CC] uppercase font-semibold">Quick Actions</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setOfflineModalOpen(true)}
                className="flex-1 py-2 px-3 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Record Offline Payment</span>
              </button>
              <a
                href={api.getAdminReportCsvUrl('payments')}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={14} />
                <span>CSV</span>
              </a>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#071B3A] p-4 rounded-2xl border border-[#D9E2EF]/15 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt number, booking ref, devotee name, or UTR..."
              className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#2F6FED]"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl px-3 py-2 text-xs outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl px-3 py-2 text-xs outline-none"
            >
              <option value="ALL">All Modes</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-4">Receipt / Txn ID</th>
                  <th className="py-3 px-4">Booking Reference</th>
                  <th className="py-3 px-4">Devotee</th>
                  <th className="py-3 px-4">Method / Mode</th>
                  <th className="py-3 px-4">Reference / UTR</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[#8CA8CC]">
                      {loading ? 'Loading payment records...' : 'No payment transactions found in database.'}
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-mono">{p.receiptNumber || 'N/A'}</div>
                        <div className="text-[10px] text-[#8CA8CC] font-mono">{p.transactionId}</div>
                      </td>
                      <td className="py-3 px-4">
                        {p.booking ? (
                          <Link
                            to={`/admin/bookings/${p.booking.id}`}
                            className="text-[#2F6FED] hover:underline font-bold font-mono"
                          >
                            {p.booking.bookingReference}
                          </Link>
                        ) : (
                          <span className="text-[#8CA8CC] font-mono">Unlinked</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{p.booking?.contactName || '—'}</div>
                        <div className="text-[10px] text-[#8CA8CC]">{p.booking?.contactPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-[#D9E2EF]">
                        {p.paymentMode || p.paymentMethod}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#D9E2EF]">
                        {p.referenceNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[#8CA8CC] whitespace-nowrap">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Offline Payment Modal */}
      {offlineModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <form
            onSubmit={handleRecordOfflinePayment}
            className="bg-[#071B3A] border border-[#D9E2EF]/20 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#2F6FED]">
                <CreditCard size={20} />
                <h3 className="font-heading font-bold text-base text-white">
                  Record Offline Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOfflineModalOpen(false)}
                className="text-[#8CA8CC] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Booking ID (SHY-...) or UUID *
              </label>
              <input
                type="text"
                value={offlineBookingId}
                onChange={(e) => setOfflineBookingId(e.target.value)}
                placeholder="Paste Booking ID"
                required
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Amount (INR) *
              </label>
              <input
                type="number"
                value={offlineAmount}
                onChange={(e) => setOfflineAmount(e.target.value)}
                placeholder="e.g. 25000"
                required
                min="1"
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-sm font-mono outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#8CA8CC] font-semibold mb-1">Payment Mode *</label>
                <select
                  value={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8CA8CC] font-semibold mb-1">Installment Type</label>
                <select
                  value={offlineType}
                  onChange={(e) => setOfflineType(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none"
                >
                  <option value="REGISTRATION">Deposit</option>
                  <option value="FIRST_INSTALLMENT">First 50%</option>
                  <option value="FINAL_BALANCE">Balance</option>
                  <option value="FULL">Full</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Transaction / UTR Ref *
              </label>
              <input
                type="text"
                value={offlineRef}
                onChange={(e) => setOfflineRef(e.target.value)}
                placeholder="UTR / Slip No"
                required
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Admin Verification Notes
              </label>
              <input
                type="text"
                value={offlineNotes}
                onChange={(e) => setOfflineNotes(e.target.value)}
                placeholder="e.g. Verified in ICICI Bank account"
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setOfflineModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={offlineSubmitting}
                className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2557c4] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {offlineSubmitting ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
