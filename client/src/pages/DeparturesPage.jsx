import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Moon, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import DepartureSelector from '../components/DepartureSelector';
import api from '../services/api';
import { OFFICIAL_SCHEDULE_DISCLAIMER } from '../data/brochureData';

export default function DeparturesPage() {
  const [departures, setDepartures] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getDepartures().then((res) => setDepartures(res.departures || [])).catch(() => {});
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={{ backgroundColor: '#F5F8FC' }}>
      {/* Hero Header */}
      <section className="page-hero-dark" style={{ background: '#041329', color: '#FFFFFF', padding: '160px 0 90px' }}>
        <div className="wrap">
          <span className="badge-pill" style={{ marginBottom: '16px', background: 'rgba(47, 111, 237, 0.2)', border: '1px solid #2F6FED', color: '#FFFFFF' }}>
            2027 Pilgrimage Calendar
          </span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 300, marginBottom: '20px', color: '#FFFFFF' }}>
            Official 2027 Departure Batches
          </h1>
          <p className="lead" style={{ color: '#D9E2EF', maxWidth: '64ch' }}>
            Eight brochure-published departure batches operating between May and August 2027. Four batches are specifically timed to coincide with sacred Full Moon nights at holy Lake Manasarovar and Mount Kailash.
          </p>
        </div>
        <div className="flags" style={{ marginTop: '70px' }} />
      </section>

      {/* Interactive Batch Selector */}
      <section className="sec sec-dark" style={{ background: '#071B3A' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', color: '#8CA8CC', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Interactive Batch Calendar
            </span>
            <h2 className="t t-center" style={{ color: '#FFFFFF' }}>Select Your 2027 Batch</h2>
          </div>
          <DepartureSelector />
        </div>
      </section>

      {/* Full Tabular Schedule from Brochure */}
      <section className="sec" style={{ background: '#FFFFFF' }}>
        <div className="wrap">
          <div style={{ marginBottom: '32px' }}>
            <span className="eyebrow" style={{ color: '#2F6FED' }}>Brochure Published Dates</span>
            <h2 className="t" style={{ color: '#071B3A' }}>Complete 2027 Departure Schedule Table</h2>
            <p className="lead" style={{ color: '#2A4365' }}>
              Official schedule as published in the Shloka Yatra 2027 brochure.
            </p>
          </div>

          {/* Mobile Responsive Cards (Phone View) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {departures.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-heading font-bold text-base text-[#101D35]">
                      {batch.name}
                    </span>
                    {batch.isFullMoon ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {batch.fullMoonLabel || 'Full Moon'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">Regular Season</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Kathmandu Arrival</span>
                      <strong className="text-slate-800 font-semibold">{formatDate(batch.arrivalDate)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Final Departure</span>
                      <strong className="text-slate-800 font-semibold">{formatDate(batch.departureDate)}</strong>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mt-2">
                    Duration: <strong className="text-[#101D35]">{batch.totalDays} Days</strong>
                  </div>
                </div>

                <Link
                  to={`/book-now?departureId=${batch.id}`}
                  className="w-full bg-[#101D35] hover:bg-[#1C3455] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg text-center shadow transition-all"
                >
                  Book This Batch
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table */}
          <div className="hidden md:block overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table
              style={{
                width: '100%',
                minWidth: '700px',
                borderCollapse: 'separate',
                borderSpacing: 0,
                background: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(7, 27, 58, 0.06)',
                border: '1px solid #D9E2EF',
              }}
            >
              <thead>
                <tr style={{ background: '#071B3A', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Batch</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Kathmandu Arrival</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Final Departure</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Duration</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Full Moon Alignment</th>
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem' }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.92rem', color: '#071B3A' }}>
                {departures.map((batch) => (
                  <tr key={batch.id} style={{ borderBottom: '1px solid #D9E2EF' }}>
                    <td style={{ padding: '18px 20px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#071B3A' }}>{batch.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 20px', color: '#2A4365' }}>{formatDate(batch.arrivalDate)}</td>
                    <td style={{ padding: '18px 20px', color: '#2A4365' }}>{formatDate(batch.departureDate)}</td>
                    <td style={{ padding: '18px 20px', color: '#071B3A', fontWeight: 600 }}>{batch.totalDays} Days</td>
                    <td style={{ padding: '18px 20px' }}>
                      {batch.isFullMoon ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(47, 111, 237, 0.12)',
                            color: '#2F6FED',
                            border: '1px solid #2F6FED',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <span>{batch.fullMoonLabel || 'Full Moon'}</span>
                        </span>
                      ) : (
                        <span style={{ color: '#8CA8CC', fontSize: '0.82rem' }}>Regular Season</span>
                      )}
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <Link
                        to={`/book-now?departureId=${batch.id}`}
                        className="btn btn-go btn-sm"
                        style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                      >
                        Book Batch
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '28px',
              padding: '20px 24px',
              background: '#F5F8FC',
              borderRadius: '14px',
              border: '1px solid #2F6FED',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <Info size={20} color="#2F6FED" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.9rem', color: '#102C52', lineHeight: '1.6', margin: 0 }}>
              <b style={{ color: '#071B3A' }}>Schedule & Permit Notice: </b>
              {OFFICIAL_SCHEDULE_DISCLAIMER}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
