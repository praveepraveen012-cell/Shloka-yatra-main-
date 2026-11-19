import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Check, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import api from '../services/api';
import assetUrl from '../utils/assets';
import { routeImages } from '../data/imageManifest';

export default function RouteFlightLhasaPage() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoute('flight-to-lhasa').then((res) => setRoute(res.route)).catch(() => {});
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
            <span className="badge-gold">Package 2 • Most Popular</span>
            <span style={{ color: '#E3DFD5', fontSize: '0.88rem', fontWeight: 600 }}>
              Cultural Immersion + Scenic Drive
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
            Fly to Lhasa, Drive to Kailash (15 Days)
          </h1>
          <p style={{ color: '#E3DFD5', fontSize: '1.15rem', maxWidth: '680px', lineHeight: 1.6, marginBottom: '32px' }}>
            Fly straight over the Himalayas from Kathmandu to Lhasa Gonggar. Experience the cultural soul of Tibet,
            visit Potala Palace and Jokhang Temple, acclimatise in 4-star comfort, and drive westward to Kailash.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/book?package=option-2-flight-lhasa" className="btn btn-gold" style={{ padding: '14px 32px', borderRadius: '999px' }}>
              <span>Book Package 2</span>
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
            <span className="eyebrow">Cultural Depth & Gentle Adaptation</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#101D35', marginTop: '10px', marginBottom: '20px' }}>
              A Smoother Ascent with Lhasa Heritage
            </h2>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Package 2 eliminates the steep initial road ascent from the Nepal border by flying directly across the
              Himalayas into Lhasa Gonggar Airport.
            </p>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Lhasa sits at 3,650 meters with modern medical facilities, comfortable hotels, and rich spiritual heritage.
              Spending two full days acclimatising in Lhasa while exploring Potala Palace and Jokhang Temple provides our
              yatris with both spiritual enrichment and physiological adaptation.
            </p>

            <div className="card-premium" style={{ padding: '28px' }}>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#101D35' }}>Route Pathway</h4>
              <p style={{ fontSize: '0.92rem', color: '#5A6B82', lineHeight: 1.8, margin: 0 }}>
                Kathmandu → Flight to Lhasa (3,650 m) → Potala Palace & Jokhang Temple → Shigatse (3,840 m) →
                Saga → Lake Manasarovar → Darchen → Yam Dwar → Dirapuk → Dolma La Pass (5,630m) → Zuthulpuk →
                Darchen → Saga → Kerung → Kathmandu
              </p>
            </div>
          </div>

          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', height: '220px', boxShadow: '0 8px 24px rgba(16, 29, 53, 0.08)' }}>
              <img
                src={assetUrl(routeImages.option2_lhasa.src)}
                alt={routeImages.option2_lhasa.alt}
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
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0 20px', color: '#FFFFFF' }}>Package 2 Inclusions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', color: '#E3DFD5' }}>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 15 Days / 14 Nights journey</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> International flight KTM to Lhasa</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Guided entry to Potala Palace & Jokhang Temple</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 4-star twin sharing hotel in Lhasa & Shigatse</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Lake Manasarovar snan & 52-km Kailash Parikrama</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Maharaj satvik kitchen crew & Sherpa support</li>
              </ul>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '24px', marginTop: '28px' }}>
                <span style={{ fontSize: '0.8rem', color: '#BAC7D5', textTransform: 'uppercase' }}>Price per person</span>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                  ₹4,37,000 <small style={{ fontSize: '0.9rem', color: '#D9A441' }}>+ 5% GST</small>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#BAC7D5' }}>Foreign / NRI Passports: ₹4,25,000 + US$ 600</span>
              </div>

              <Link
                to="/book?package=option-2-flight-lhasa"
                className="btn btn-gold"
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center', borderRadius: '12px', padding: '14px' }}
              >
                <span>Reserve Package 2 Departure</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
