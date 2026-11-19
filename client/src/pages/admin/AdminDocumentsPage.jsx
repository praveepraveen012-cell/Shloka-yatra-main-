import React, { useState, useEffect } from 'react';
import { Shield, FileCheck, XCircle, CheckCircle, Clock, Search, Filter, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [rejectModalDoc, setRejectModalDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('documentType', typeFilter);
      const res = await api.getAdminDocuments(params.toString());
      setDocuments(res.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [statusFilter, typeFilter]);

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await api.verifyAdminDocument(id, {
        verificationStatus: 'VERIFIED',
        rejectionReason: null,
      });
      setStatusMsg('Document verified and approved successfully.');
      loadDocuments();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModalDoc) return;
    if (!rejectionReason.trim()) {
      alert('Please specify the reason for document rejection.');
      return;
    }
    setActionLoading(rejectModalDoc.id);
    try {
      await api.verifyAdminDocument(rejectModalDoc.id, {
        verificationStatus: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      });
      setStatusMsg('Document rejected and yatri notified.');
      setRejectModalDoc(null);
      setRejectionReason('');
      loadDocuments();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Rejection error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const docType = (doc.documentType || '').toLowerCase();
    const fileName = (doc.originalFilename || doc.fileName || '').toLowerCase();
    const bookingRef = (doc.traveller?.booking?.bookingReference || '').toLowerCase();
    const travellerName = (doc.traveller?.fullName || '').toLowerCase();
    return (
      docType.includes(q) ||
      fileName.includes(q) ||
      bookingRef.includes(q) ||
      travellerName.includes(q)
    );
  });

  return (
    <AdminLayout
      title="Pilgrim Document Verification"
      subtitle="Review and approve government passports, medical fitness certificates, and high-altitude insurance policies"
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

        {/* Filters Bar */}
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
              placeholder="Search by devotee, booking ref, or filename..."
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

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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
              <option value="">All Verification Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="VERIFIED">Verified & Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#041329',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
              }}
            >
              <option value="">All Document Types</option>
              <option value="PASSPORT">Passport Scan</option>
              <option value="PHOTO">Passport Photo</option>
              <option value="MEDICAL_FITNESS">Medical Fitness Certificate</option>
              <option value="INSURANCE">Travel & Evacuation Insurance</option>
              <option value="OTHER">Other Documents</option>
            </select>

            <button
              onClick={loadDocuments}
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

        {/* Documents Table */}
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
              Loading submitted pilgrimage documents...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8CA8CC' }}>
              No submitted documents matching current criteria.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#041329', color: '#D9E2EF', borderBottom: '1px solid rgba(217, 226, 239, 0.15)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Document Type</th>
                    <th style={{ padding: '16px' }}>Traveller & Booking</th>
                    <th style={{ padding: '16px' }}>File Information</th>
                    <th style={{ padding: '16px' }}>Submitted Date</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const statusColor =
                      doc.verificationStatus === 'VERIFIED'
                        ? '#10B981'
                        : doc.verificationStatus === 'REJECTED'
                        ? '#EF4444'
                        : '#F59E0B';

                    return (
                      <tr
                        key={doc.id}
                        style={{
                          borderBottom: '1px solid rgba(217, 226, 239, 0.1)',
                          transition: 'background 0.2s',
                        }}
                      >
                        <td style={{ padding: '16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: 'rgba(47, 111, 237, 0.15)',
                              color: '#93C5FD',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            {doc.documentType}
                          </span>
                        </td>

                        <td style={{ padding: '16px' }}>
                          <strong style={{ display: 'block', color: '#FFFFFF' }}>
                            {doc.traveller?.fullName || 'Primary Yatri'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: '#8CA8CC' }}>
                            Ref: {doc.traveller?.booking?.bookingReference || 'N/A'}
                          </span>
                        </td>

                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#E2E8F0', wordBreak: 'break-all' }}>
                              {doc.originalFilename || doc.fileName}
                            </span>
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#2F6FED', display: 'inline-flex' }}
                                title="Open document preview"
                              >
                                <ExternalLink size={15} />
                              </a>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : 'PDF / JPG'}
                          </span>
                        </td>

                        <td style={{ padding: '16px', color: '#8CA8CC', fontSize: '0.85rem' }}>
                          {new Date(doc.createdAt).toLocaleDateString('en-IN', {
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
                            {doc.verificationStatus}
                          </span>
                          {doc.rejectionReason && (
                            <small style={{ display: 'block', color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>
                              Reason: {doc.rejectionReason}
                            </small>
                          )}
                        </td>

                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {doc.verificationStatus !== 'VERIFIED' && (
                              <button
                                onClick={() => handleVerify(doc.id)}
                                disabled={actionLoading === doc.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: '#059669',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                            )}

                            {doc.verificationStatus !== 'REJECTED' && (
                              <button
                                onClick={() => {
                                  setRejectModalDoc(doc);
                                  setRejectionReason('');
                                }}
                                disabled={actionLoading === doc.id}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: '1px solid #EF4444',
                                  color: '#FCA5A5',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <XCircle size={14} />
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

        {/* Rejection Modal */}
        {rejectModalDoc && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#071B3A',
                borderRadius: '16px',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                padding: '28px',
                width: '100%',
                maxWidth: '480px',
                color: '#FFFFFF',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#EF4444" />
                Reject Submitted Document
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#D9E2EF', marginBottom: '16px' }}>
                Specify why this document is rejected. The devotee will receive an automated request to upload an amended copy.
              </p>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#8CA8CC', marginBottom: '6px' }}>
                  Rejection Reason:
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Passport scan blurry, less than 6 months validity remaining, missing physician signature..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#041329',
                    border: '1px solid rgba(217, 226, 239, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setRejectModalDoc(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(217, 226, 239, 0.3)',
                    color: '#D9E2EF',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={actionLoading === rejectModalDoc.id}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
