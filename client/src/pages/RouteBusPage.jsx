import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Check, Clock, Calendar, ArrowRight, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';
import api from '../services/api';
import assetUrl from '../utils/assets';
import { routeImages } from '../data/imageManifest';

export default function RouteBusPage() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoute('bus-both-ways').then((res) => setRoute(res.route)).catch(() => {});
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
            <span className="badge-gold">Package 1</span>
            <span style={{ color: '#E3DFD5', fontSize: '0.88rem', fontWeight: 600 }}>
              The Classic Overland Pilgrimage
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
            Overland Bus Both Ways (14 Days)
          </h1>
          <p style={{ color: '#E3DFD5', fontSize: '1.15rem', maxWidth: '680px', lineHeight: 1.6, marginBottom: '32px' }}>
            The traditional overland pilgrimage from Kathmandu to Kailash and back by road across the southern
            Tibetan plateau. Time-tested, deeply scenic, and ideal for natural acclimatisation.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/book?package=option-1-bus" className="btn btn-gold" style={{ padding: '14px 32px', borderRadius: '999px' }}>
              <span>Book Package 1</span>
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
            <span className="eyebrow">Natural Acclimatisation</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#101D35', marginTop: '10px', marginBottom: '20px' }}>
              The Classic Himalayan Overland Journey
            </h2>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Package 1 is the most popular choice among yatris who wish to experience the gradual transition of
              landscapes from the lush hills of Nepal into the high windswept Tibetan plateau.
            </p>
            <p style={{ color: '#5A6B82', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Traveling overland allows the human body to adapt naturally to increasing altitudes as we stage our
              ascent through Kerung border (2,700 m) and Saga (4,450 m) before reaching Lake Manasarovar and Mount Kailash.
            </p>

            <div className="card-premium" style={{ padding: '28px' }}>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#101D35' }}>Route Pathway</h4>
              <p style={{ fontSize: '0.92rem', color: '#5A6B82', lineHeight: 1.8, margin: 0 }}>
                Kathmandu → Pashupatinath Darshan → Kerung Border (Acclimatisation) → Saga → Lake Manasarovar →
                Darchen → Yam Dwar → Dirapuk → Dolma La Pass (5,630m) → Zuthulpuk → Darchen → Saga → Kerung → Kathmandu
              </p>
            </div>
          </div>

          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', height: '220px', boxShadow: '0 8px 24px rgba(16, 29, 53, 0.08)' }}>
              <img
                src={assetUrl(routeImages.option1_bus.src)}
                alt={routeImages.option1_bus.alt}
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
              <h3 style={{ fontSize: '1.5rem', margin: '8px 0 20px', color: '#FFFFFF' }}>Package 1 Inclusions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', color: '#E3DFD5' }}>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 14 Days / 13 Nights complete pilgrimage</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Rudrabhishek & darshan at Pashupatinath Temple</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Gradual altitude adaptation in Kerung & Saga</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> Lake Manasarovar Parikrama & sacred puja</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 52-km Kailash Parikrama with Sherpa support</li>
                <li style={{ display: 'flex', gap: '10px' }}><Check size={18} color="#D9A441" /> 100% Satvik pure vegetarian kitchen team</li>
              </ul>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '24px', marginTop: '28px' }}>
                <span style={{ fontSize: '0.8rem', color: '#BAC7D5', textTransform: 'uppercase' }}>Price per person</span>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                  ₹3,50,000 <small style={{ fontSize: '0.9rem', color: '#D9A441' }}>+ 5% GST</small>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#BAC7D5' }}>Foreign / NRI Passports: ₹4,25,000</span>
              </div>

              <Link
                to="/book?package=option-1-bus"
                className="btn btn-gold"
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center', borderRadius: '12px', padding: '14px' }}
              >
                <span>Reserve Package 1 Departure</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
