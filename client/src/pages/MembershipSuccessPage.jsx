import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, User, Compass, Calendar } from 'lucide-react';

export default function MembershipSuccessPage() {
  const location = useLocation();
  const state = location.state || {};
  const memberReference = state.memberReference || localStorage.getItem('shlloka_member_ref') || 'SHL-MEM-2027-1042';
  const member = state.member || JSON.parse(localStorage.getItem('shlloka_member_user') || '{}');

  return (
    <div style={{ backgroundColor: '#F5F8FC', minHeight: '90vh', paddingTop: '110px', paddingBottom: '90px' }}>
      <div className="wrap" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(32px, 6vw, 52px)',
            boxShadow: '0 12px 36px rgba(7, 27, 58, 0.08)',
            border: '1px solid #D9E2EF',
            textAlign: 'center',
          }}
        >
          {/* Blue Check Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(47, 111, 237, 0.12)',
              border: '2px solid #2F6FED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle2 size={44} color="#2F6FED" />
          </div>

          <span className="eyebrow" style={{ color: '#2F6FED' }}>Welcome to Shloka Yatra</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#071B3A', marginBottom: '12px' }}>
            Registration Successful!
          </h1>
          <p style={{ color: '#2A4365', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '32px' }}>
            {member?.firstName ? `Dear ${member.firstName}, your` : 'Your'} official Shloka Yatra membership record has been successfully registered in our secure database.
          </p>

          {/* Membership Reference Card */}
          <div
            style={{
              background: '#071B3A',
              border: '1.5px dashed #2F6FED',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#8CA8CC',
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              Unique Membership Reference ID
            </span>
            <b
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                color: '#FFFFFF',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              {memberReference}
            </b>
            <span
              style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#D9E2EF',
                marginTop: '8px',
              }}
            >
              Save this reference ID for expedited communication with our volunteer desk.
            </span>
          </div>

          {/* Important Distinction Banner */}
          <div
            style={{
              background: '#F5F8FC',
              border: '1px solid #D9E2EF',
              borderRadius: '14px',
              padding: '20px 24px',
              marginBottom: '32px',
              textAlign: 'left',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldCheck size={24} color="#2F6FED" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <b style={{ color: '#071B3A', display: 'block', fontSize: '0.98rem', marginBottom: '4px' }}>
                Important: Membership vs. Yatra Seat Confirmation
              </b>
              <p style={{ color: '#2A4365', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                Membership registers your profile and interest with priority batch notifications. A confirmed seat on a 2027 Kailash departure batch requires formal documentation checks and payment of the ₹25,000 per person registration deposit via our booking flow.
              </p>
            </div>
          </div>

          {/* Next Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/account"
              className="btn btn-go"
              style={{ padding: '14px 28px', fontSize: '0.96rem' }}
            >
              <User size={16} />
              <span>Go to Member Account</span>
            </Link>

            <Link
              to="/book"
              className="btn btn-out"
              style={{ padding: '14px 28px', fontSize: '0.96rem', color: '#071B3A', borderColor: '#D9E2EF' }}
            >
              <Calendar size={16} />
              <span>Book 2027 Yatra Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
