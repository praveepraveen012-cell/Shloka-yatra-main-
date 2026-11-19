import React, { useState, useEffect } from 'react';
import { Search, Download, UserCheck, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchMembers = () => {
    setLoading(true);
    const token = localStorage.getItem('shlloka_admin_token');
    let url = `/api/admin/members?status=${statusFilter}`;
    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load member records');
        return res.json();
      })
      .then((data) => {
        setMembers(data.members || []);
      })
      .catch((err) => {
        // Fallback to localStorage registered members if static demo
        try {
          const localUsers = JSON.parse(localStorage.getItem('shlloka_registered_members') || '[]');
          let filtered = localUsers;
          if (statusFilter !== 'ALL') {
            filtered = filtered.filter((u) => u.status === statusFilter);
          }
          if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((u) =>
              (u.firstName + ' ' + u.lastName + ' ' + u.email + ' ' + (u.membershipReference || '')).toLowerCase().includes(term)
            );
          }
          setMembers(filtered);
        } catch {
          setMembers([]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleStatusChange = async (memberId, newStatus) => {
    const token = localStorage.getItem('shlloka_admin_token');
    try {
      const res = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMsg(`Member ${data.member.membershipReference} status changed to ${newStatus}`);
      } else {
        // Fallback for localStorage
        const localUsers = JSON.parse(localStorage.getItem('shlloka_registered_members') || '[]');
        const updated = localUsers.map((u) => u.id === memberId ? { ...u, status: newStatus } : u);
        localStorage.setItem('shlloka_registered_members', JSON.stringify(updated));
        setStatusMsg(`Member status changed to ${newStatus}`);
      }
      setTimeout(() => setStatusMsg(''), 4000);
      fetchMembers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    if (members.length === 0) return alert('No member records to export.');

    const headers = ['Reference', 'First Name', 'Last Name', 'Email', 'Mobile', 'City', 'Country', 'Status', 'Registered At'];
    const rows = [
      headers,
      ...members.map((m) => [
        m.membershipReference,
        m.firstName,
        m.lastName,
        m.email,
        m.mobile,
        m.city,
        m.country,
        m.status,
        new Date(m.createdAt).toLocaleString(),
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((row) => row.map((val) => `"${String(val || '').replace(/"/g, '""')}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shlloka_members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Member Registrations" subtitle="Review registered community members, verify contact info, and manage statuses">
      {statusMsg && (
        <div
          style={{
            background: 'rgba(47, 111, 237, 0.15)',
            border: '1px solid #2F6FED',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} color="#2F6FED" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Control Bar: Search, Filters, CSV Export */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name, email, mobile, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#071B3A',
                color: '#FFFFFF',
                padding: '10px 16px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #102C52',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <Search size={16} color="#D9E2EF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              background: '#2F6FED',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#071B3A',
              color: '#FFFFFF',
              border: '1px solid #102C52',
              fontSize: '0.88rem',
              padding: '10px 14px',
              borderRadius: '8px',
              outline: 'none',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>

          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: '#2F6FED',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading member records...</p>
      ) : members.length === 0 ? (
        <div style={{ background: '#071B3A', borderRadius: '18px', padding: '40px', textAlign: 'center', border: '1px solid #102C52' }}>
          <p style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '8px' }}>No member records match your query.</p>
          <small style={{ color: '#D9E2EF' }}>Try adjusting your search keywords or status filter.</small>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#071B3A', borderRadius: '18px', border: '1px solid #102C52' }}>
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', fontSize: '0.88rem', color: '#FFFFFF' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #102C52', background: '#041329', color: '#D9E2EF', textAlign: 'left' }}>
                <th style={{ padding: '16px 20px' }}>Reference</th>
                <th style={{ padding: '16px 20px' }}>Member Name</th>
                <th style={{ padding: '16px 20px' }}>Contact Info</th>
                <th style={{ padding: '16px 20px' }}>Location</th>
                <th style={{ padding: '16px 20px' }}>Yatra Interest</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #102C52' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#2F6FED', fontWeight: 600 }}>
                    {m.membershipReference}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <b>{m.firstName} {m.lastName}</b>
                    <small style={{ display: 'block', color: '#D9E2EF', fontSize: '0.78rem' }}>
                      Registered: {new Date(m.createdAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>{m.email}</div>
                    <small style={{ color: '#D9E2EF' }}>{m.mobile}</small>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#D9E2EF' }}>
                    {m.city}, {m.country}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ color: '#FFFFFF' }}>{m.preferredBatch || 'Flexible'}</span>
                    <small style={{ display: 'block', color: '#D9E2EF', fontSize: '0.78rem' }}>
                      {m.preferredPackage || 'Package 1'}
                    </small>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: m.status === 'ACTIVE' ? '#2F6FED' : '#DC2626',
                        color: '#FFFFFF',
                      }}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {m.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(m.id, 'SUSPENDED')}
                        style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px', background: '#DC2626', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(m.id, 'ACTIVE')}
                        style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px', background: '#2F6FED', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
