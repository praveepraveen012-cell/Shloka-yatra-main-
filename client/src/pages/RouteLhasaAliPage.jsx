import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Check, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import api from '../services/api';
import assetUrl from '../utils/assets';
import { routeImages } from '../data/imageManifest';

export default function RouteLhasaAliPage() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoute('lhasa-ali-pulan').then((res) => setRoute(res.route)).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Hero Header */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, #101D35 0%, #1C3F70 100%)',
          color: '#FFFFFF',
          padding: '160px 24px 100px',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="badge-gold">Package 3 • Fastest Route</span>
            <span style={{ color: '#E3DFD5', fontSize: '0.88rem', fontWeight: 600 }}>
              Direct Flight Access to Western Tibet
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 400,
              marginBottom: '20px',
              color: '#FFFFFF',
            }}
          >
            Fly to Lhasa & Ali (Fastest Route) (11 Days)
          </h1>
          <p style={{ color: '#E3DFD5', fontSize: '1.15rem', maxWidth: '680px', lineHeight: 1.6, marginBottom: '32px' }}>
            The premier approach with dual flight sectors minimizing long overland road travel. Direct access to
            Western Tibet via Ngari Gunsa Airport (Ali), ideal for seniors, busy executives, and yatris seeking maximum comfort.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/book?package=option-3-lhasa-ali" className="btn btn-gold" style={{ padding: '14px 32px', borderRadius: '999px' }}>
              <span>Book Package 3</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/departures" className="btn btn-outline-white" style={{ padding: '14px 28px', borderRadius: '999px' }}>
              <span>View 2027 Batches</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview & Key Stats */}
      <section style={{ maxWidth: '1440px', margin: '80px auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <span className="eyebrow">Maximum Comfort & Efficiency</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#101D35', marginTop: '10px', marginBottom: '20px' }}>
              Minimum Road Travel, Maximum Pilgrimage Focus
            </h2>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Package 3 is specifically designed for pilgrims who wish to avoid arduous multi-day journeys on high-altitude
              plateau highways.
            </p>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
              By connecting a trans-Himalayan flight to Lhasa with a domestic flight directly to Ngari Gunsa (Ali Airport),
              yatris arrive fresh and energized right at the doorstep of Lake Manasarovar and Mount Kailash. This route provides
              the highest comfort for senior citizens.
            </p>

            <div className="card-premium" style={{ padding: '28px' }}>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#101D35' }}>Route Pathway</h4>
              <p style={{ fontSize: '0.92rem', color: '#5A6B82', lineHeight: 1.8, margin: 0 }}>
                Kathmandu → Flight to Lhasa → Potala Palace & Jokhang Temple → Flight to Ali Gunsa (Ngari) →
                Lake Manasarovar → Darchen → Yam Dwar → Dirapuk → Dolma La Pass (5,630m) → Zuthulpuk →
                Darchen → Ali Flight to Lhasa → Kathmandu
              </p>
            </div>
          </div>

          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', height: '220px', boxShadow: '0 8px 24px rgba(16, 29, 53, 0.08)' }}>
              <img
                src={assetUrl(routeImages.option3_ali.src)}
                alt={routeImages.option3_ali.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                background: '#101D35',
                borderRadius: '20px',
                padding: '36px',
                color: '#FFFFFF',
                boxShadow: '0 16px 40px rgba(16, 29, 53, 0.14)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#D9A441', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Package Overview
              </span>
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0 20px', color: '#FFFFFF' }}>Package 3 Inclusions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', color: '#E3DFD5' }}>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 11 Days / 10 Nights (Shortest duration)</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Dual flight sectors: KTM-LXA and LXA-Ali</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Potala Palace & Jokhang guided pilgrimage</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> VIP luxury coach & vehicle escort in Tibet</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 52-km Kailash Parikrama & Manasarovar snan</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Continuous personal Sherpa guidance</li>
              </ul>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '24px', marginTop: '28px' }}>
                <span style={{ fontSize: '0.8rem', color: '#BAC7D5', textTransform: 'uppercase' }}>Price per person</span>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                  ₹4,94,000 <small style={{ fontSize: '0.9rem', color: '#D9A441' }}>+ 5% GST</small>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#BAC7D5' }}>Foreign / NRI Passports: ₹4,25,000 + US$ 1,200</span>
              </div>

              <Link
                to="/book?package=option-3-lhasa-ali"
                className="btn btn-gold"
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center', borderRadius: '12px', padding: '14px' }}
              >
                <span>Reserve Package 3 Departure</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
