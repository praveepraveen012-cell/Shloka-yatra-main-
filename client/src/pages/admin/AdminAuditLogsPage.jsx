import React, { useEffect, useState } from 'react';
import { Activity, Shield, Clock, FileText } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAuditLogs()
      .then((res) => setLogs(res.logs || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="System Audit Trail & History" subtitle="Immutable operational log of administrative actions, pricing edits, and booking state transitions">
      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading audit records...</p>
      ) : logs.length === 0 ? (
        <div style={{ background: '#071B3A', padding: '40px', borderRadius: '16px', textAlign: 'center', color: '#D9E2EF', border: '1px solid #102C52' }}>
          No audit entries recorded yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#071B3A', borderRadius: '18px', border: '1px solid #102C52' }}>
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.88rem', color: '#FFFFFF' }}>
            <thead>
              <tr style={{ background: '#041329', borderBottom: '1px solid #102C52', color: '#D9E2EF', textAlign: 'left' }}>
                <th style={{ padding: '16px 20px' }}>Timestamp</th>
                <th style={{ padding: '16px 20px' }}>Action</th>
                <th style={{ padding: '16px 20px' }}>Entity</th>
                <th style={{ padding: '16px 20px' }}>User / Actor</th>
                <th style={{ padding: '16px 20px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #102C52' }}>
                  <td style={{ padding: '14px 20px', color: '#D9E2EF', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#102C52',
                        color: '#FFFFFF',
                        border: '1px solid #2F6FED',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#2F6FED', fontWeight: 600 }}>
                    {log.entity} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ''}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#FFFFFF' }}>
                    {log.userEmail || 'System / Public'}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#D9E2EF', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {log.details || '-'}
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
