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
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, bookingsRes, enquiriesRes] = await Promise.all([
          api.getAdminDashboardStats(),
          api.getAdminBookings('take=5'),
          api.getAdminEnquiries(),
        ]);
        setStats(statsRes.stats);
        setRecentBookings((bookingsRes.bookings || []).slice(0, 5));
        setRecentEnquiries((enquiriesRes.enquiries || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <AdminLayout title="Pilgrimage Operations Command" subtitle="Real-time 2027 season departure occupancy, bookings, and enquiry metrics">
      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading dashboard metrics...</p>
      ) : (
        <div>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            {/* Stat 1 */}
            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#D9E2EF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bookings</span>
                <Users size={20} color="#2F6FED" />
              </div>
              <b style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>{stats?.totalBookings || 0}</b>
              <small style={{ display: 'block', color: '#D9E2EF', fontSize: '0.8rem', marginTop: '4px' }}>
                {stats?.confirmedBookings || 0} Confirmed • {stats?.pendingBookings || 0} Pending
              </small>
            </div>

            {/* Stat 2 */}
            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#D9E2EF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seat Occupancy</span>
                <Calendar size={20} color="#2F6FED" />
              </div>
              <b style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>{stats?.occupancyRate || 0}%</b>
              <small style={{ display: 'block', color: '#D9E2EF', fontSize: '0.8rem', marginTop: '4px' }}>
                {stats?.totalBookedSeats || 0} / {stats?.totalCapacity || 0} Total Season Seats
              </small>
            </div>

            {/* Stat 3 */}
            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#D9E2EF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Collections</span>
                <CreditCard size={20} color="#2F6FED" />
              </div>
              <b style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>
                ₹{((stats?.totalRevenueInr || 0) / 100000).toFixed(2)}L
              </b>
              <small style={{ display: 'block', color: '#D9E2EF', fontSize: '0.8rem', marginTop: '4px' }}>
                Authoritative verified deposits
              </small>
            </div>

            {/* Stat 4 */}
            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#D9E2EF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enquiries & Leads</span>
                <MessageSquare size={20} color="#2F6FED" />
              </div>
              <b style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>{stats?.totalEnquiries || 0}</b>
              <small style={{ display: 'block', color: '#2F6FED', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>
                {stats?.newEnquiries || 0} Awaiting callback
              </small>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-7 mb-8 sm:mb-9">
            {/* Recent Bookings */}
            <div style={{ background: '#071B3A', borderRadius: '18px', padding: '28px', border: '1px solid #102C52' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>Recent Pilgrimage Bookings</h3>
                <Link to="/admin/bookings" style={{ color: '#2F6FED', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
              </div>

              {recentBookings.length === 0 ? (
                <p style={{ color: '#D9E2EF' }}>No bookings created yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        background: '#102C52',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div>
                        <b style={{ color: '#FFFFFF', display: 'block' }}>{b.bookingReference} — {b.contactName}</b>
                        <span style={{ color: '#D9E2EF', fontSize: '0.8rem' }}>{b.departure?.name} • {b.totalTravellers} Yatris</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: b.status === 'CONFIRMED' ? '#2F6FED' : '#071B3A',
                            color: '#FFFFFF',
                            border: '1px solid #2F6FED',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            fontWeight: 600,
                          }}
                        >
                          {b.status}
                        </span>
                        <span style={{ display: 'block', color: '#FFFFFF', fontSize: '0.82rem', marginTop: '3px', fontWeight: 600 }}>
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Enquiries */}
            <div style={{ background: '#071B3A', borderRadius: '18px', padding: '28px', border: '1px solid #102C52' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>Recent Enquiries</h3>
                <Link to="/admin/enquiries" style={{ color: '#2F6FED', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <p style={{ color: '#D9E2EF' }}>No customer enquiries yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentEnquiries.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        background: '#102C52',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <b style={{ color: '#FFFFFF' }}>{e.name}</b>
                        <span style={{ fontSize: '0.75rem', color: e.status === 'NEW' ? '#2F6FED' : '#D9E2EF', fontWeight: 600 }}>
                          {e.status}
                        </span>
                      </div>
                      <p style={{ color: '#D9E2EF', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '4px 0' }}>
                        {e.message}
                      </p>
                      <small style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{e.phone} • {e.email}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
