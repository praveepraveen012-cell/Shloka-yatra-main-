import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Activity,
  Plus,
  Lock,
  UserX,
  User,
  Shield,
  Eye,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [statusMsg, setStatusMsg] = useState('');

  // Member Detail Modal State
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [memberBookings, setMemberBookings] = useState([]);
  const [memberPayments, setMemberPayments] = useState([]);
  const [memberAuditLogs, setMemberAuditLogs] = useState([]);
  const [newAdminNote, setNewAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    let params = [];
    if (statusFilter !== 'ALL') params.push(`status=${statusFilter}`);
    if (verificationFilter !== 'ALL') params.push(`verification=${verificationFilter}`);
    if (searchTerm.trim()) params.push(`search=${encodeURIComponent(searchTerm.trim())}`);

    api.getAdminMembers(params.join('&'))
      .then((data) => {
        setMembers(data.members || []);
      })
      .catch((err) => {
        console.error('Failed to load member records', err);
        setMembers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, verificationFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  // Open Member Detail Modal
  const handleOpenDetail = (memberId) => {
    setDetailLoading(true);
    api.getAdminMemberDetail(memberId)
      .then((data) => {
        setSelectedMember(data.member);
        setMemberBookings(data.bookings || []);
        setMemberPayments(data.payments || []);
        setMemberAuditLogs(data.auditLogs || []);
      })
      .catch((err) => {
        alert(err.message || 'Failed to load member details');
      })
      .finally(() => setDetailLoading(false));
  };

  // Status Change (Activate / Suspend)
  const handleStatusChange = async (memberId, newStatus) => {
    try {
      const res = await api.updateAdminMemberStatus(memberId, { status: newStatus });
      setStatusMsg(`Member status successfully updated to ${newStatus}`);
      setTimeout(() => setStatusMsg(''), 4000);

      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember((prev) => ({ ...prev, status: newStatus }));
      }
      fetchMembers();
    } catch (err) {
      alert(err.message || 'Failed to update member status');
    }
  };

  // Add Internal Admin Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newAdminNote.trim() || !selectedMember) return;

    setSavingNote(true);
    try {
      const res = await api.addAdminMemberNote(selectedMember.id, newAdminNote.trim());
      if (res.member) {
        setSelectedMember((prev) => ({ ...prev, internalNotes: res.member.internalNotes }));
        setNewAdminNote('');
      }
    } catch (err) {
      alert(err.message || 'Failed to save admin note');
    } finally {
      setSavingNote(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (members.length === 0) return alert('No member records to export.');

    const headers = [
      'Reference',
      'First Name',
      'Last Name',
      'Email',
      'Mobile',
      'Gender',
      'City',
      'Country',
      'Verified',
      'Status',
      'Registered At',
    ];
    const rows = [
      headers,
      ...members.map((m) => [
        m.membershipReference,
        m.firstName,
        m.lastName,
        m.email,
        m.mobile,
        m.gender || 'N/A',
        m.city || 'N/A',
        m.country || 'N/A',
        m.isVerified ? 'VERIFIED' : 'UNVERIFIED',
        m.status,
        m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shloka_registered_members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics
  const totalCount = members.length;
  const verifiedCount = members.filter((m) => m.isVerified).length;
  const activeCount = members.filter((m) => m.status === 'ACTIVE').length;
  const suspendedCount = members.filter((m) => m.status === 'SUSPENDED').length;

  return (
    <AdminLayout
      title="Member Registrations"
      subtitle="Complete registry of verified pilgrimage sangha accounts, mobile OTP states, and associated bookings."
    >
      {/* Status Notice */}
      {statusMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#071B3A] p-4 rounded-xl border border-white/10">
          <span className="text-slate-400 text-xs block mb-1">Total Members</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-white">{totalCount}</span>
        </div>
        <div className="bg-[#071B3A] p-4 rounded-xl border border-white/10">
          <span className="text-slate-400 text-xs block mb-1">Active Accounts</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">{activeCount}</span>
        </div>
        <div className="bg-[#071B3A] p-4 rounded-xl border border-white/10">
          <span className="text-slate-400 text-xs block mb-1">Mobile Verified</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-blue-400">{verifiedCount}</span>
        </div>
        <div className="bg-[#071B3A] p-4 rounded-xl border border-white/10">
          <span className="text-slate-400 text-xs block mb-1">Suspended</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{suspendedCount}</span>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="bg-[#071B3A] p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, mobile, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D9A441]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D9A441]"
          >
            <option value="ALL" className="bg-[#071B3A]">All Statuses</option>
            <option value="ACTIVE" className="bg-[#071B3A]">Active</option>
            <option value="PENDING" className="bg-[#071B3A]">Pending</option>
            <option value="SUSPENDED" className="bg-[#071B3A]">Suspended</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            aria-label="Filter by Verification"
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D9A441]"
          >
            <option value="ALL" className="bg-[#071B3A]">All Verification</option>
            <option value="VERIFIED" className="bg-[#071B3A]">Mobile Verified</option>
            <option value="UNVERIFIED" className="bg-[#071B3A]">Unverified OTP</option>
          </select>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-[#071B3A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px] font-bold bg-white/5">
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Mobile & Country</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Mobile OTP</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <RefreshCw size={20} className="animate-spin mx-auto text-[#D9A441] mb-2" />
                    <span>Loading registered members...</span>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    No registered members found matching your search.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#D9A441]">{m.membershipReference}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {m.mobile}
                      <span className="block text-[10px] text-slate-500">{m.country || 'India'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{m.email}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {m.isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : m.status === 'SUSPENDED'
                            ? 'bg-red-500/15 text-red-300'
                            : 'bg-blue-500/15 text-blue-300'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-center text-white">
                      {m._count?.bookings ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(m.id)}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all cursor-pointer"
                        >
                          Details
                        </button>

                        {m.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, 'SUSPENDED')}
                            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-[11px] transition-all cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(m.id, 'ACTIVE')}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-all cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MEMBER DETAILS SLIDE-OVER / MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#071B3A] border border-white/20 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-white">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-full bg-white/5 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/40 flex items-center justify-center font-bold text-xl">
                ॐ
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <span className="font-mono text-xs text-[#D9A441] font-bold">
                  {selectedMember.membershipReference}
                </span>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              {/* Member Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Mobile</span>
                  <span className="font-semibold text-white">{selectedMember.mobile}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    {selectedMember.isVerified ? '✓ OTP Verified' : '⚠ Pending OTP'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Email</span>
                  <span className="font-semibold text-white">{selectedMember.email}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Account Status</span>
                  <span className="font-bold text-emerald-400">{selectedMember.status}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Gender</span>
                  <span className="text-slate-300">{selectedMember.gender || 'Not specified'}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Date of Birth</span>
                  <span className="text-slate-300">{selectedMember.dateOfBirth || 'Not specified'}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Location</span>
                  <span className="text-slate-300">
                    {[selectedMember.city, selectedMember.country].filter(Boolean).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Associated Bookings */}
              <div>
                <h4 className="font-bold text-sm text-[#D9A441] uppercase tracking-wider mb-2">
                  Associated Pilgrimage Bookings ({memberBookings.length})
                </h4>
                {memberBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 bg-white/5 p-3 rounded-xl">No active bookings yet.</p>
                ) : (
                  <div className="space-y-2">
                    {memberBookings.map((b) => (
                      <div key={b.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono font-bold text-white block">{b.bookingReference}</span>
                          <span className="text-slate-400">{b.route?.name} • {b.departure?.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400">{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Administrative Notes */}
              <div>
                <h4 className="font-bold text-sm text-[#D9A441] uppercase tracking-wider mb-2">
                  Internal Administrative Notes
                </h4>
                {selectedMember.internalNotes ? (
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs text-slate-300 whitespace-pre-wrap mb-3 font-mono">
                    {selectedMember.internalNotes}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mb-2 italic">No notes recorded yet.</p>
                )}

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal note about this member..."
                    value={newAdminNote}
                    onChange={(e) => setNewAdminNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D9A441]"
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !newAdminNote.trim()}
                    className="px-4 py-2 rounded-xl bg-[#D9A441] text-[#101D35] font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
                  >
                    {savingNote ? 'Saving...' : 'Add Note'}
                  </button>
                </form>
              </div>

              {/* Account Audit History */}
              {memberAuditLogs.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-[#D9A441] uppercase tracking-wider mb-2">
                    Account Activity Trail
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {memberAuditLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-white/5 rounded-lg text-[11px] flex justify-between text-slate-400">
                        <span className="font-semibold text-white">{log.action}</span>
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                {selectedMember.status === 'ACTIVE' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMember.id, 'SUSPENDED')}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Suspend Member Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMember.id, 'ACTIVE')}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Activate Member Account
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
