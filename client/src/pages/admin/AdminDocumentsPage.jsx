import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileCheck,
  XCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  FileText,
  Stethoscope,
  ShieldAlert,
  UserCheck,
  Info,
  Calendar,
  X,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSubmitted: 0,
    pendingReview: 0,
    underReview: 0,
    clarificationRequested: 0,
    accepted: 0,
    notAccepted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [docRefFilter, setDocRefFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Active Review Inspection Modal State
  const [reviewModalDoc, setReviewModalDoc] = useState(null);
  const [reviewAction, setReviewAction] = useState('ACCEPT'); // 'RECEIVED' | 'UNDER_REVIEW' | 'ACCEPT' | 'REQUEST_CLARIFICATION' | 'REJECT'
  const [reviewNote, setReviewNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [clinicalObservation, setClinicalObservation] = useState('');
  const [reviewError, setReviewError] = useState('');

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (docRefFilter) params.append('documentRef', docRefFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.getAdminDocuments(params.toString());
      setDocuments(res.documents || []);
      if (res.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [statusFilter, docRefFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDocuments();
  };

  const openReviewModal = (doc) => {
    setReviewModalDoc(doc);
    setReviewAction(
      doc.status === 'ACCEPTED'
        ? 'ACCEPT'
        : doc.status === 'UNDER_REVIEW'
        ? 'UNDER_REVIEW'
        : doc.status === 'CLARIFICATION_REQUIRED'
        ? 'REQUEST_CLARIFICATION'
        : 'UNDER_REVIEW'
    );
    setReviewNote(doc.rejectionReason || doc.reviews?.[0]?.reviewNote || '');
    setInternalNotes('');
    setClinicalObservation('');
    setReviewError('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalDoc) return;

    if (
      ['REQUEST_CLARIFICATION', 'REJECT'].includes(reviewAction) &&
      !reviewNote.trim()
    ) {
      setReviewError('A detailed review note explaining the required clarification or rejection reason is strictly required.');
      return;
    }

    setActionLoading(true);
    setReviewError('');
    try {
      await api.verifyAdminDocument(reviewModalDoc.id, {
        status:
          reviewAction === 'ACCEPT'
            ? 'ACCEPTED'
            : reviewAction === 'UNDER_REVIEW'
            ? 'UNDER_REVIEW'
            : reviewAction === 'REQUEST_CLARIFICATION'
            ? 'CLARIFICATION_REQUIRED'
            : reviewAction === 'REJECT'
            ? 'NOT_ACCEPTED'
            : 'ACCEPTED',
        reviewNote: reviewNote.trim() || undefined,
        action: reviewAction,
      });

      setStatusMsg(`Document review successfully recorded.`);
      setReviewModalDoc(null);
      await loadDocuments();
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
      case 'VERIFIED':
        return { label: 'Verified & Accepted', bg: '#064E3B', text: '#A7F3D0', border: '#059669' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', bg: '#1E3A8A', text: '#BFDBFE', border: '#3B82F6' };
      case 'SUBMITTED':
        return { label: 'Submitted (New)', bg: '#581C87', text: '#E9D5FF', border: '#9333EA' };
      case 'CLARIFICATION_REQUIRED':
      case 'RESUBMISSION_REQUIRED':
        return { label: 'Clarification Requested', bg: '#78350F', text: '#FDE68A', border: '#D97706' };
      case 'NOT_ACCEPTED':
      case 'REJECTED':
        return { label: 'Not Accepted', bg: '#7F1D1D', text: '#FECACA', border: '#DC2626' };
      default:
        return { label: status || 'Pending', bg: '#1E293B', text: '#94A3B8', border: '#475569' };
    }
  };

  return (
    <AdminLayout
      title="Pilgrim Document & Compliance Register"
      subtitle="Comprehensive clinical and legal verification portal for Kailash Mansarovar Parikrama 2027 (SYPL-RISK-2027 & SYPL-MED-2027)"
    >
      <div style={{ padding: '24px' }}>
        {/* Status Message Banner */}
        {statusMsg && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              background: '#064E3B',
              color: '#A7F3D0',
              border: '1px solid #059669',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle size={18} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Real Database Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Card 1: Total */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(217, 226, 239, 0.15)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8CA8CC', display: 'block', fontWeight: 600 }}>
              Total Submissions
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
              {metrics.totalSubmitted}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#8CA8CC' }}>All official documents</span>
          </div>

          {/* Card 2: Pending Review */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(147, 51, 234, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D8B4FE', display: 'block', fontWeight: 600 }}>
              Pending Initial Review
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>
              {metrics.pendingReview}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#A855F7' }}>Newly submitted</span>
          </div>

          {/* Card 3: Under Review */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93C5FD', display: 'block', fontWeight: 600 }}>
              Under Active Review
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60A5FA', marginTop: '4px' }}>
              {metrics.underReview}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#3B82F6' }}>Medical & legal review</span>
          </div>

          {/* Card 4: Clarification Requested */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FCD34D', display: 'block', fontWeight: 600 }}>
              Clarification Requested
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
              {metrics.clarificationRequested}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Action required by yatri</span>
          </div>

          {/* Card 5: Accepted */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6EE7B7', display: 'block', fontWeight: 600 }}>
              Verified & Accepted
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>
              {metrics.accepted}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Cleared for high-altitude</span>
          </div>

          {/* Card 6: Not Accepted */}
          <div
            style={{
              background: '#071B3A',
              padding: '18px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FCA5A5', display: 'block', fontWeight: 600 }}>
              Not Accepted / Rejected
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F87171', marginTop: '4px' }}>
              {metrics.notAccepted}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>Deficient or contraindicated</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
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
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1', minWidth: '260px', maxWidth: '450px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={16}
                color="#8CA8CC"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by devotee, booking ref, passport, or doc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  background: '#041329',
                  border: '1px solid rgba(217, 226, 239, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '0 16px',
                borderRadius: '10px',
                background: '#2F6FED',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#041329',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Review Statuses</option>
              <option value="SUBMITTED">Submitted (New)</option>
              <option value="UNDER_REVIEW">Under Active Review</option>
              <option value="CLARIFICATION_REQUIRED">Clarification Requested</option>
              <option value="ACCEPTED">Verified & Accepted</option>
              <option value="NOT_ACCEPTED">Not Accepted</option>
            </select>

            {/* Document Ref Filter */}
            <select
              value={docRefFilter}
              onChange={(e) => setDocRefFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#041329',
                border: '1px solid rgba(217, 226, 239, 0.2)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Official Documents</option>
              <option value="SYPL-RISK-2027">Risk Declaration (SYPL-RISK-2027)</option>
              <option value="SYPL-MED-2027">Medical Certificate (SYPL-MED-2027)</option>
              <option value="SYPL-INS-2027">Insurance Proof (SYPL-INS-2027)</option>
            </select>

            <button
              onClick={loadDocuments}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(47, 111, 237, 0.2)',
                border: '1px solid #2F6FED',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Document Register Table */}
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
              <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-[#2F6FED]" />
              <div>Loading submitted pilgrimage documents...</div>
            </div>
          ) : documents.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8CA8CC' }}>
              <FileText size={36} className="mx-auto mb-3 opacity-40" />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                No Documents Submitted Yet
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                When pilgrims submit their Risk Declarations or doctor-certified Medical Certificates, they will appear here for review.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#041329', color: '#D9E2EF', borderBottom: '1px solid rgba(217, 226, 239, 0.15)', textAlign: 'left' }}>
                    <th style={{ padding: '14px 16px' }}>Devotee & Contact</th>
                    <th style={{ padding: '14px 16px' }}>Booking Reference</th>
                    <th style={{ padding: '14px 16px' }}>Document Details</th>
                    <th style={{ padding: '14px 16px' }}>Version</th>
                    <th style={{ padding: '14px 16px' }}>Submission Date</th>
                    <th style={{ padding: '14px 16px' }}>Review Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const badge = getStatusBadge(doc.status);
                    const isMedical = doc.documentRef === 'SYPL-MED-2027';
                    const isRisk = doc.documentRef === 'SYPL-RISK-2027';

                    return (
                      <tr
                        key={doc.id}
                        style={{
                          borderBottom: '1px solid rgba(217, 226, 239, 0.08)',
                          transition: 'background 0.2s',
                        }}
                      >
                        {/* Devotee */}
                        <td style={{ padding: '14px 16px' }}>
                          <strong style={{ display: 'block', color: '#FFFFFF' }}>
                            {doc.traveller?.fullName || doc.signerName || 'Primary Devotee'}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#8CA8CC', fontFamily: 'monospace' }}>
                            Passport: {doc.traveller?.passportNumber || 'N/A'}
                          </span>
                        </td>

                        {/* Booking */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ color: '#FCD34D', fontWeight: 700, fontFamily: 'monospace' }}>
                            {doc.booking?.bookingReference || 'N/A'}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.76rem', color: '#8CA8CC' }}>
                            {doc.booking?.departure?.batchName || '2027 Batch'}
                          </span>
                        </td>

                        {/* Document Details */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: isMedical ? 'rgba(59, 130, 246, 0.15)' : isRisk ? 'rgba(217, 119, 6, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isMedical ? '#93C5FD' : isRisk ? '#FCD34D' : '#6EE7B7',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {doc.documentRef || doc.documentType}
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '0.82rem', color: '#FFFFFF', marginTop: '3px' }}>
                            {doc.documentTitle || doc.originalFilename}
                          </span>
                        </td>

                        {/* Version */}
                        <td style={{ padding: '14px 16px', color: '#8CA8CC', fontSize: '0.8rem' }}>
                          <span style={{ display: 'inline-block', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                            {doc.version || 'Draft 1.0'}
                          </span>
                        </td>

                        {/* Submission Date */}
                        <td style={{ padding: '14px 16px', color: '#8CA8CC', fontSize: '0.82rem' }}>
                          {new Date(doc.submittedAt || doc.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Review Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              background: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.text }} />
                            {badge.label}
                          </span>
                          {doc.rejectionReason && (
                            <small style={{ display: 'block', color: '#F87171', fontSize: '0.74rem', marginTop: '4px', maxWidth: '240px' }}>
                              Note: {doc.rejectionReason}
                            </small>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                              onClick={() => openReviewModal(doc)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                background: '#2F6FED',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Eye size={14} />
                              Review & Audit
                            </button>

                            {doc.filePath && (
                              <a
                                href={api.getDocumentDownloadUrl(doc.id)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#FFFFFF',
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                }}
                                title="Download uploaded file"
                              >
                                <Download size={14} />
                              </a>
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

        {/* Comprehensive Document Review Inspector Modal */}
        {reviewModalDoc && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                background: '#071B3A',
                borderRadius: '20px',
                border: '1px solid rgba(217, 226, 239, 0.25)',
                width: '100%',
                maxWidth: '720px',
                color: '#FFFFFF',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '20px 24px',
                  background: '#041329',
                  borderBottom: '1px solid rgba(217, 226, 239, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#D9A441', color: '#071B3A', fontFamily: 'monospace' }}>
                      {reviewModalDoc.documentRef}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8CA8CC' }}>
                      {reviewModalDoc.version}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
                    {reviewModalDoc.documentTitle || 'Compliance Review'}
                  </h3>
                </div>
                <button
                  onClick={() => setReviewModalDoc(null)}
                  style={{ background: 'transparent', border: 'none', color: '#8CA8CC', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleReviewSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 1. Participant & Booking Information */}
                <div style={{ background: '#041329', padding: '16px', borderRadius: '12px', border: '1px solid rgba(217, 226, 239, 0.1)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#8CA8CC', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    Participant & Pilgrimage Context
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#8CA8CC', display: 'block', fontSize: '0.75rem' }}>Devotee Name:</span>
                      <strong>{reviewModalDoc.traveller?.fullName || reviewModalDoc.signerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#8CA8CC', display: 'block', fontSize: '0.75rem' }}>Booking Reference:</span>
                      <strong style={{ color: '#FCD34D', fontFamily: 'monospace' }}>{reviewModalDoc.booking?.bookingReference}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#8CA8CC', display: 'block', fontSize: '0.75rem' }}>Passport Number:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{reviewModalDoc.traveller?.passportNumber || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#8CA8CC', display: 'block', fontSize: '0.75rem' }}>Departure Batch:</span>
                      <span>{reviewModalDoc.booking?.departure?.batchName || 'Confirmed 2027'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Specific Document Content Breakdown */}
                {reviewModalDoc.documentRef === 'SYPL-RISK-2027' && (
                  <div style={{ background: '#041329', padding: '16px', borderRadius: '12px', border: '1px solid rgba(217, 226, 239, 0.1)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#FCD34D', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                      Section 8 Acknowledgements & 5-Page Initials Audit
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      {(reviewModalDoc.pageInitials || ['P1', 'P2', 'P3', 'P4', 'P5']).map((ini, idx) => (
                        <div key={idx} style={{ padding: '6px 10px', background: '#071B3A', borderRadius: '8px', border: '1px solid #2F6FED', fontSize: '0.78rem', textAlign: 'center' }}>
                          <small style={{ display: 'block', color: '#8CA8CC' }}>Page {idx + 1}</small>
                          <strong style={{ color: '#FFFFFF' }}>{ini || '✓'}</strong>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#D9E2EF' }}>
                      <div><strong>Signer Legal Name:</strong> {reviewModalDoc.signerName}</div>
                      <div><strong>Signing Location:</strong> {reviewModalDoc.signaturePlace || 'Kathmandu, Nepal'}</div>
                      <div><strong>Execution Date:</strong> {reviewModalDoc.signatureDate}</div>
                      {reviewModalDoc.witnessName && <div><strong>Witness:</strong> {reviewModalDoc.witnessName} ({reviewModalDoc.witnessPhone})</div>}
                    </div>
                  </div>
                )}

                {reviewModalDoc.documentRef === 'SYPL-MED-2027' && (
                  <div style={{ background: '#041329', padding: '16px', borderRadius: '12px', border: '1px solid rgba(217, 226, 239, 0.1)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#93C5FD', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                      Physician Assessment & Photo Cross-Stamp Verification
                    </span>
                    <div style={{ fontSize: '0.82rem', color: '#D9E2EF', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                      <div><strong>Doctor Name:</strong> {reviewModalDoc.formData?.doctorName || 'Attending Physician'}</div>
                      <div><strong>Registration No:</strong> {reviewModalDoc.formData?.doctorRegistrationNumber || 'MCI Verified'}</div>
                      <div><strong>Clinical Decision:</strong> <span style={{ color: '#34D399', fontWeight: 700 }}>{reviewModalDoc.formData?.medicalClearanceDecision || 'FIT'}</span></div>
                      <div><strong>Hospital / Clinic:</strong> {reviewModalDoc.formData?.doctorClinic || 'Regional Health Center'}</div>
                    </div>
                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(217, 119, 6, 0.15)', borderRadius: '8px', fontSize: '0.78rem', color: '#FCD34D' }}>
                      <strong>Clinical Rule:</strong> Registered physician must have stamped across the photo edge on Page 1. Verify before marking ACCEPTED.
                    </div>
                  </div>
                )}

                {/* Uploaded File Link */}
                {reviewModalDoc.filePath && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#041329', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <FileText size={18} color="#2F6FED" />
                      <span>{reviewModalDoc.originalFilename || 'Uploaded_Document.pdf'}</span>
                    </div>
                    <a
                      href={api.getDocumentDownloadUrl(reviewModalDoc.id)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#2F6FED',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      Download Physical File
                    </a>
                  </div>
                )}

                {/* 3. Review Decision Controls */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#D9E2EF', marginBottom: '8px' }}>
                    Select Administrative Review Outcome *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { action: 'ACCEPT', label: 'Accept', bg: '#064E3B', color: '#A7F3D0' },
                      { action: 'UNDER_REVIEW', label: 'Under Review', bg: '#1E3A8A', color: '#BFDBFE' },
                      { action: 'REQUEST_CLARIFICATION', label: 'Request Clarification', bg: '#78350F', color: '#FDE68A' },
                      { action: 'REJECT', label: 'Not Accepted', bg: '#7F1D1D', color: '#FECACA' },
                    ].map((item) => (
                      <button
                        key={item.action}
                        type="button"
                        onClick={() => setReviewAction(item.action)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          background: reviewAction === item.action ? item.bg : '#041329',
                          border: `1.5px solid ${reviewAction === item.action ? item.color : 'rgba(217, 226, 239, 0.15)'}`,
                          color: reviewAction === item.action ? item.color : '#8CA8CC',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Notes (Required for Clarification & Rejection) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#D9E2EF', marginBottom: '6px' }}>
                    Reviewer Notes {['REQUEST_CLARIFICATION', 'REJECT'].includes(reviewAction) ? '(Required *)' : '(Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter detailed clarification request or reason for rejection visible to the pilgrim..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#041329',
                      border: '1px solid rgba(217, 226, 239, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {reviewError && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#7F1D1D', color: '#FECACA', fontSize: '0.82rem' }}>
                    {reviewError}
                  </div>
                )}

                {/* Footer Submit */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setReviewModalDoc(null)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: 'transparent',
                      border: '1px solid rgba(217, 226, 239, 0.2)',
                      color: '#D9E2EF',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '10px',
                      background: '#059669',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>{actionLoading ? 'Recording Review...' : 'Save & Publish Review'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
