import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, Clock, MapPin } from 'lucide-react';
import { assetUrl } from '../utils/assets';

export default function YatrasPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F8FC' }}>
      {/* Header */}
      <section className="page-hero-dark" style={{ background: '#041329', color: '#FFFFFF', padding: '160px 0 90px' }}>
        <div className="wrap">
          <span className="badge-pill" style={{ marginBottom: '16px', background: 'rgba(47, 111, 237, 0.2)', border: '1px solid #2F6FED', color: '#FFFFFF' }}>
            Sacred Pilgrimages
          </span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 300, marginBottom: '20px', color: '#FFFFFF' }}>
            Journeys of Spiritual Transformation
          </h1>
          <p className="lead" style={{ color: '#D9E2EF', maxWidth: '60ch' }}>
            Begin where your heart is drawn. Explore our flagship Kailash Manasarovar expedition and forthcoming Himalayan pilgrimages.
          </p>
        </div>
        <div className="flags" style={{ marginTop: '70px' }} />
      </section>

      {/* Flagship Yatra */}
      <section className="sec" style={{ background: '#F5F8FC' }}>
        <div className="wrap">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-[#2F6FED]/40 bg-[#071B3A] text-white shadow-2xl"
          >
            <div className="relative min-h-[340px] lg:min-h-[380px]">
              <img
                src={assetUrl('/assets/shlloka-yatra/images/sy_img_066.jpg')}
                alt="Holy Lake Manasarovar and Mount Kailash"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-5 left-5 bg-[#041329]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#2F6FED] text-white text-xs font-semibold">
                ★ Flagship Pilgrimage 2027
              </div>
            </div>

            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8CA8CC', display: 'block', marginBottom: '8px' }}>
                Tibet • Trans-Himalaya
              </span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 400, color: '#FFFFFF' }}>
                Kailash Manasarovar
              </h2>
              <p style={{ color: '#D9E2EF', fontSize: '1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                The sacred circumambulation of Mount Kailash (6,638 m) and holy rituals at Lake Manasarovar. Multiple travel options: overland bus or flight-assisted via Lhasa and Ali.
              </p>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', fontSize: '0.9rem', color: '#D9E2EF' }}>
                <div>
                  <small style={{ display: 'block', color: '#8CA8CC' }}>Duration</small>
                  <b style={{ color: '#FFFFFF' }}>13 to 16 Days</b>
                </div>
                <div>
                  <small style={{ display: 'block', color: '#8CA8CC' }}>Departures</small>
                  <b style={{ color: '#FFFFFF' }}>8 Fixed Batches (May–Aug)</b>
                </div>
                <div>
                  <small style={{ display: 'block', color: '#8CA8CC' }}>Starting from</small>
                  <b style={{ color: '#FFFFFF' }}>INR 3,50,000 + GST</b>
                </div>
              </div>

              <div className="btns">
                <Link to="/kailash-mansarovar" className="btn btn-go">
                  <span>Explore Pilgrimage</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/kailash-mansarovar-yatra-2027" className="btn btn-out" style={{ color: '#FFFFFF', borderColor: 'rgba(217, 226, 239, 0.4)' }}>
                  <span>2027 Dedicated Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forthcoming Sacred Journeys */}
      <section className="sec sec-dark" style={{ background: '#041329', color: '#FFFFFF' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="t t-center" style={{ color: '#FFFFFF' }}>Expanding Spiritual Horizons</h2>
            <p className="lead" style={{ margin: '0 auto', textAlign: 'center', color: '#D9E2EF' }}>
              A growing collection of sacred Himalayan journeys curated with the same devotion, care, and attention to detail.
            </p>
          </div>

          <div className="grid-2">
            <div style={{ background: '#071B3A', padding: '36px', borderRadius: '20px', border: '1.5px dashed rgba(217, 226, 239, 0.3)' }}>
              <span className="badge-pill" style={{ marginBottom: '16px', background: 'rgba(47, 111, 237, 0.2)', border: '1px solid #2F6FED', color: '#FFFFFF' }}>Coming Soon</span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#FFFFFF' }}>Muktinath & Damodar Kund</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                Sacred journey to Muktinath (Lord Vishnu) in the Mustang region of Nepal, and the glacial origins of the Gandaki River at holy Damodar Kund.
              </p>
              <span style={{ fontSize: '0.85rem', color: '#8CA8CC' }}>Announcements scheduled for late 2027</span>
            </div>

            <div style={{ background: '#071B3A', padding: '36px', borderRadius: '20px', border: '1.5px dashed rgba(217, 226, 239, 0.3)' }}>
              <span className="badge-pill" style={{ marginBottom: '16px', background: 'rgba(47, 111, 237, 0.2)', border: '1px solid #2F6FED', color: '#FFFFFF' }}>Coming Soon</span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#FFFFFF' }}>Other Sacred Journeys</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                Spiritual paths across high-altitude monasteries and sacred shrines designed around purpose, presence, and respectful community travel.
              </p>
              <span style={{ fontSize: '0.85rem', color: '#8CA8CC' }}>Announcements scheduled for late 2027</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
