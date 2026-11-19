import React, { useEffect, useState } from 'react';
import { MessageSquare, Phone, Mail, CheckCircle2, Clock, Check, Download, Filter } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadEnquiries = async () => {
    try {
      const res = await api.getAdminEnquiries();
      setEnquiries(res.enquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.updateAdminEnquiryStatus(id, { status });
      loadEnquiries();
    } catch (err) {
      alert('Error updating enquiry: ' + err.message);
    }
  };

  const filteredEnquiries = statusFilter
    ? enquiries.filter((e) => e.status === statusFilter)
    : enquiries;

  const handleExportCsv = () => {
    if (filteredEnquiries.length === 0) return alert('No enquiries to export.');

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Type',
      'Status',
      'Preferred Batch',
      'Preferred Route',
      'Travellers Count',
      'Created At',
      'Message',
    ];

    const rows = [
      headers,
      ...filteredEnquiries.map((e) => [
        e.name,
        e.email,
        e.phone,
        e.type || 'GENERAL',
        e.status,
        e.preferredBatch || '',
        e.preferredRoute || '',
        e.travellersCount || 1,
        new Date(e.createdAt).toLocaleString(),
        e.message,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows
        .map((row) =>
          row
            .map((val) => {
              const str = val === null || val === undefined ? '' : String(val);
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shlloka_yatra_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Enquiries & Leads Desk" subtitle="Review prospective yatri queries and coordinate advisor callbacks">
      {/* Control Bar: Filter Tabs & CSV Export */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          background: '#071B3A',
          padding: '16px 20px',
          borderRadius: '14px',
          border: '1px solid #102C52',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'NEW', 'CONTACTED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: statusFilter === st ? '1px solid #2F6FED' : '1px solid #102C52',
                background: statusFilter === st ? '#2F6FED' : 'transparent',
                color: statusFilter === st ? '#FFFFFF' : '#D9E2EF',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {st === '' ? 'All Enquiries' : st}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCsv}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            padding: '8px 18px',
            borderRadius: '999px',
            background: '#2F6FED',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          <span>Export Enquiries to CSV</span>
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading enquiries...</p>
      ) : filteredEnquiries.length === 0 ? (
        <div style={{ background: '#071B3A', padding: '40px', borderRadius: '16px', textAlign: 'center', color: '#D9E2EF', border: '1px solid #102C52' }}>
          No customer enquiries found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEnquiries.map((e) => (
            <div
              key={e.id}
              style={{
                background: '#071B3A',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #102C52',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <b style={{ color: '#FFFFFF', fontSize: '1.15rem' }}>{e.name}</b>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: e.status === 'NEW' ? '#2F6FED' : e.status === 'CONTACTED' ? '#102C52' : '#041329',
                      color: '#FFFFFF',
                      border: e.status === 'CONTACTED' ? '1px solid #2F6FED' : '1px solid #102C52',
                    }}
                  >
                    {e.status}
                  </span>
                  <small style={{ color: '#D9E2EF' }}>{new Date(e.createdAt).toLocaleString()}</small>
                </div>

                <div style={{ display: 'flex', gap: '20px', color: '#D9E2EF', fontSize: '0.88rem', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#2F6FED" /> {e.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#2F6FED" /> {e.email}
                  </span>
                </div>

                <p style={{ color: '#FFFFFF', fontSize: '0.94rem', lineHeight: '1.6', background: '#102C52', padding: '14px 18px', borderRadius: '10px', margin: '8px 0' }}>
                  "{e.message}"
                </p>

                {(e.preferredBatch || e.preferredRoute) && (
                  <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#D9E2EF' }}>
                    Interest: <b>{e.preferredBatch || 'Any Batch'}</b> • <b>{e.preferredRoute || 'Any Route'}</b> • <b>{e.travellersCount || 1} Yatri(s)</b>
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleStatus(e.id, 'CONTACTED')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#102C52',
                    color: '#FFFFFF',
                    border: '1px solid #2F6FED',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleStatus(e.id, 'RESOLVED')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#2F6FED',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleStatus(e.id, 'NEW')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: 'transparent',
                    color: '#D9E2EF',
                    border: '1px solid #102C52',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reset to New
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
