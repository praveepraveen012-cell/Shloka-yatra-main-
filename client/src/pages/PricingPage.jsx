import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, DollarSign, Building2, HelpCircle, ArrowRight } from 'lucide-react';
import PricingTable from '../components/PricingTable';
import api from '../services/api';

export default function PricingPage() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoutes().then((res) => setRoutes(res.routes || [])).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F8FC' }}>
      {/* Header */}
      <section style={{ background: '#041329', color: '#FFFFFF', padding: '160px 0 90px' }}>
        <div className="wrap">
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              background: '#102C52',
              color: '#FFFFFF',
              border: '1px solid #2F6FED',
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            Pricing & Payment Policy
          </span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 300, marginBottom: '20px', color: '#FFFFFF' }}>
            Transparent Pilgrimage Pricing
          </h1>
          <p className="lead" style={{ color: '#D9E2EF', maxWidth: '64ch' }}>
            Clear pricing structures for Indian passport holders (in INR with 5% GST) and Foreign / NRI passport holders (with flight supplements). No hidden fees.
          </p>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="sec" style={{ backgroundColor: '#F5F8FC' }}>
        <div className="wrap">
          <PricingTable routes={routes} />
        </div>
      </section>

      {/* Detailed Payment Terms & Registration Guidelines */}
      <section style={{ background: '#041329', padding: '80px 0', color: '#FFFFFF' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.85rem', color: '#2F6FED', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Payment Milestones
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', margin: '8px 0 12px' }}>
              Registration & Payment Timelines
            </h2>
            <p className="lead" style={{ margin: '0 auto', textAlign: 'center', color: '#D9E2EF' }}>
              How your booking is secured and staged from registration to final departure.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '18px', padding: '32px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#2F6FED',
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                Stage 1
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '10px' }}>Initial Registration</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '14px' }}>
                Secure your slot in your chosen 2027 batch by paying the initial registration deposit of <b>INR 25,000</b> (or USD 250).
              </p>
              <small style={{ color: '#2F6FED', fontWeight: 600 }}>* Non-refundable deposit, adjusted in final billing.</small>
            </div>

            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '18px', padding: '32px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#2F6FED',
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                Stage 2
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '10px' }}>Confirmation (50%)</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '14px' }}>
                50% payment confirms your Yatra seat. This triggers the initiation of your Tibet Group Permit and visa applications with the authorities.
              </p>
              <small style={{ color: '#D9E2EF' }}>* Due upon document submission.</small>
            </div>

            <div style={{ background: '#071B3A', border: '1px solid #102C52', borderRadius: '18px', padding: '32px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#2F6FED',
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                Stage 3
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '10px' }}>Final Balance (50%)</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '14px' }}>
                The remaining 50% balance is payable 30 days after your first payment, ensuring all sector flight tickets and hotel bookings are finalized.
              </p>
              <small style={{ color: '#D9E2EF' }}>* Full clearance prior to Kathmandu arrival.</small>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/book"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                borderRadius: '999px',
                background: '#2F6FED',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(47, 111, 237, 0.35)',
              }}
            >
              <span>Proceed to Booking Portal</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
