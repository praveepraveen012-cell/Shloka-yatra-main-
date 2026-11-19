import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock, Search, DollarSign, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminRefunds();
      setRefunds(res.refunds || []);
    } catch (err) {
      console.error('Failed to load refunds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await api.updateAdminRefundStatus(id, { status: newStatus });
      setStatusMsg(`Refund status updated to ${newStatus}`);
      loadRefunds();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Error updating refund status: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRefunds = refunds.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    const q = searchQuery.toLowerCase();
    const ref = (r.booking?.bookingReference || '').toLowerCase();
    const name = (r.booking?.contactName || '').toLowerCase();
    const reason = (r.reason || '').toLowerCase();
    return ref.includes(q) || name.includes(q) || reason.includes(q);
  });

  const totalRefundAmount = refunds
    .filter((r) => r.status === 'APPROVED' || r.status === 'PROCESSED')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <AdminLayout
      title="Cancellation & Refund Management"
      subtitle="Review voluntary cancellations, approve formula-calculated refunds (Clause C4), and track bank disbursements"
    >
      <div style={{ padding: '24px' }}>
        {/* Status Message Banner */}
        {statusMsg && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '10px',
              background: '#064E3B',
              color: '#A7F3D0',
              border: '1px solid #059669',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle size={18} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Financial Overview Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: '#071B3A', padding: '20px', borderRadius: '14px', border: '1px solid rgba(217, 226, 239, 0.15)' }}>
            <span style={{ fontSize: '0.82rem', color: '#8CA8CC', textTransform: 'uppercase' }}>Total Refund Requests</span>
            <strong style={{ display: 'block', fontSize: '1.7rem', color: '#FFFFFF', marginTop: '6px' }}>{refunds.length}</strong>
          </div>
          <div style={{ background: '#071B3A', padding: '20px', borderRadius: '14px', border: '1px solid rgba(217, 226, 239, 0.15)' }}>
            <span style={{ fontSize: '0.82rem', color: '#8CA8CC', textTransform: 'uppercase' }}>Pending Review</span>
            <strong style={{ display: 'block', fontSize: '1.7rem', color: '#F59E0B', marginTop: '6px' }}>
              {refunds.filter((r) => r.status === 'PENDING').length}
            </strong>
          </div>
          <div style={{ background: '#071B3A', padding: '20px', borderRadius: '14px', border: '1px solid rgba(217, 226, 239, 0.15)' }}>
            <span style={{ fontSize: '0.82rem', color: '#8CA8CC', textTransform: 'uppercase' }}>Approved & Disbursed</span>
            <strong style={{ display: 'block', fontSize: '1.7rem', color: '#10B981', marginTop: '6px' }}>
              ₹{totalRefundAmount.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            background: '#071B3A',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(217, 226, 239, 0.15)',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '400px' }}>
            <Search
              size={18}
              color="#8CA8CC"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by booking reference or yatri name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: '8px',
                background: '#041329',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#041329',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
              }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSED">Processed / Paid</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              onClick={loadRefunds}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(47, 111, 237, 0.2)',
                border: '1px solid #2F6FED',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Refunds Table */}
        <div
          style={{
            background: '#071B3A',
            borderRadius: '16px',
            border: '1px solid rgba(217, 226, 239, 0.15)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8CA8CC' }}>
              Loading refund and cancellation requests...
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8CA8CC' }}>
              No refund requests found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#041329', color: '#D9E2EF', borderBottom: '1px solid rgba(217, 226, 239, 0.15)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Booking Reference</th>
                    <th style={{ padding: '16px' }}>Devotee Details</th>
                    <th style={{ padding: '16px' }}>Cancellation Reason</th>
                    <th style={{ padding: '16px' }}>Refund Amount</th>
                    <th style={{ padding: '16px' }}>Requested Date</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund) => {
                    const statusColor =
                      refund.status === 'PROCESSED'
                        ? '#10B981'
                        : refund.status === 'APPROVED'
                        ? '#3B82F6'
                        : refund.status === 'REJECTED'
                        ? '#EF4444'
                        : '#F59E0B';

                    return (
                      <tr
                        key={refund.id}
                        style={{
                          borderBottom: '1px solid rgba(217, 226, 239, 0.1)',
                          transition: 'background 0.2s',
                        }}
                      >
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#60A5FA', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                            {refund.booking?.bookingReference || 'N/A'}
                          </strong>
                        </td>

                        <td style={{ padding: '16px' }}>
                          <strong style={{ display: 'block', color: '#FFFFFF' }}>
                            {refund.booking?.contactName || 'Yatri'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: '#8CA8CC' }}>
                            {refund.booking?.contactEmail}
                          </span>
                        </td>

                        <td style={{ padding: '16px', color: '#E2E8F0', maxWidth: '240px' }}>
                          <span style={{ fontSize: '0.85rem' }}>{refund.reason || 'Voluntary cancellation'}</span>
                        </td>

                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#34D399', fontSize: '1rem' }}>
                            ₹{refund.amount?.toLocaleString('en-IN')}
                          </strong>
                        </td>

                        <td style={{ padding: '16px', color: '#8CA8CC', fontSize: '0.85rem' }}>
                          {new Date(refund.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td style={{ padding: '16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: `${statusColor}22`,
                              color: statusColor,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                            {refund.status}
                          </span>
                        </td>

                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {refund.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(refund.id, 'APPROVED')}
                                disabled={actionLoading === refund.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: '#2563EB',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Approve
                              </button>
                            )}

                            {refund.status === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(refund.id, 'PROCESSED')}
                                disabled={actionLoading === refund.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: '#059669',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Mark Disbursed
                              </button>
                            )}

                            {refund.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(refund.id, 'REJECTED')}
                                disabled={actionLoading === refund.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: '1px solid #EF4444',
                                  color: '#FCA5A5',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
