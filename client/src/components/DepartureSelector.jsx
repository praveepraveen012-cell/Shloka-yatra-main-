import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Moon, ArrowRight, ShieldCheck, Info, Check, Sparkles } from 'lucide-react';
import api from '../services/api';
import { OFFICIAL_SCHEDULE_DISCLAIMER } from '../data/brochureData';

export default function DepartureSelector({ initialSelectedBatch = 1 }) {
  const [departures, setDepartures] = useState([]);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDepartures() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getDepartures();
        const list = data.departures || [];
        setDepartures(list);

        if (initialSelectedBatch && list.length > 0) {
          const idx = list.findIndex(
            (d) => d.batchNumber === initialSelectedBatch || d.id === initialSelectedBatch
          );
          if (idx !== -1) setSelectedBatchIndex(idx);
        }
      } catch (err) {
        setError(err.message || 'Unable to load departure batches.');
      } finally {
        setLoading(false);
      }
    }
    loadDepartures();
  }, [initialSelectedBatch]);

  // Format human-readable date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const months = [
    { key: 'ALL', label: 'All 8 Batches' },
    { key: '2027-05', label: 'May 2027' },
    { key: '2027-06', label: 'June 2027' },
    { key: '2027-07', label: 'July 2027' },
    { key: '2027-08', label: 'August 2027' },
  ];

  const filteredDepartures =
    selectedMonth === 'ALL'
      ? departures
      : departures.filter((d) => d.monthKey === selectedMonth || (d.arrivalDate && d.arrivalDate.startsWith(selectedMonth)));

  const activeBatch = departures[selectedBatchIndex] || departures[0] || null;

  const handleSelectPackage = (routeCode) => {
    if (!activeBatch) return;
    navigate(`/book?departureId=${activeBatch.id}&routeCode=${routeCode}`);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-300">
        <div className="inline-block w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-base text-white">
          Loading 2027 departure schedule...
        </p>
      </div>
    );
  }

  if (error && departures.length === 0) {
    return (
      <div
        style={{
          padding: '36px',
          background: 'rgba(7, 27, 58, 0.85)',
          border: '1px solid #2F6FED',
          borderRadius: '16px',
          color: '#FFFFFF',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>
          Notice regarding departures
        </p>
        <p style={{ fontSize: '0.92rem', color: '#D9E2EF' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Month Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {months.map((m) => {
          const isSelected = selectedMonth === m.key;
          return (
            <button
              key={m.key}
              onClick={() => {
                setSelectedMonth(m.key);
                if (m.key !== 'ALL') {
                  const firstMatch = departures.findIndex(
                    (d) => d.monthKey === m.key || (d.arrivalDate && d.arrivalDate.startsWith(m.key))
                  );
                  if (firstMatch !== -1) setSelectedBatchIndex(firstMatch);
                }
              }}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                border: isSelected ? '1.5px solid #2F6FED' : '1px solid rgba(217, 226, 239, 0.25)',
                background: isSelected ? '#2F6FED' : '#102C52',
                color: '#FFFFFF',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Batches on Left, Selected Batch Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Column: Batches List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredDepartures.map((batch) => {
            const indexInAll = departures.findIndex((d) => d.id === batch.id);
            const isSelected = indexInAll === selectedBatchIndex;
            const arrivalFormatted = formatDate(batch.arrivalDate);
            const departureFormatted = formatDate(batch.departureDate);

            return (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchIndex(indexInAll)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: isSelected ? '#102C52' : '#071B3A',
                  border: isSelected ? '1.5px solid #2F6FED' : '1px solid rgba(217, 226, 239, 0.15)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 8px 24px rgba(4, 19, 41, 0.45)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(47, 111, 237, 0.6)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(217, 226, 239, 0.15)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : '#8CA8CC',
                    }}
                  >
                    {String(batch.batchNumber).padStart(2, '0')}
                  </span>
                  <div>
                    <b
                      style={{
                        display: 'block',
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                      }}
                    >
                      {batch.name}
                    </b>
                    <small style={{ display: 'block', fontSize: '0.8rem', color: '#D9E2EF', marginTop: '2px' }}>
                      {arrivalFormatted} – {departureFormatted}
                    </small>
                  </div>
                </div>

                {/* Full Moon Badge */}
                {batch.isFullMoon && (
                  <span
                    title={batch.fullMoonLabel || 'Full Moon Batch'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(47, 111, 237, 0.25)',
                      color: '#FFFFFF',
                      border: '1px solid #2F6FED',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>Full Moon</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Batch Details Card */}
        {activeBatch && (
          <div
            style={{
              background: '#071B3A',
              border: '1.5px solid rgba(47, 111, 237, 0.35)',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 20px 50px rgba(4, 19, 41, 0.45)',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#8CA8CC',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 600,
                  }}
                >
                  BATCH {activeBatch.batchNumber} OF 8 • {activeBatch.monthLabel || '2027 SEASON'}
                </span>
                <h3 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#FFFFFF', fontWeight: 400 }}>
                  {activeBatch.name}
                </h3>
              </div>

              {activeBatch.isFullMoon && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(47, 111, 237, 0.25)',
                    color: '#FFFFFF',
                    border: '1px solid #2F6FED',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <span>{activeBatch.fullMoonLabel || 'Sacred Full Moon Alignment'}</span>
                </div>
              )}
            </div>

            {/* Date & Duration Summary Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                padding: '22px',
                background: '#041329',
                borderRadius: '16px',
                border: '1px solid rgba(217, 226, 239, 0.12)',
                marginBottom: '26px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#8CA8CC',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  KATHMANDU ARRIVAL
                </span>
                <strong style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 600 }}>
                  {formatDate(activeBatch.arrivalDate)}
                </strong>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#8CA8CC',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  FINAL DEPARTURE
                </span>
                <strong style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 600 }}>
                  {formatDate(activeBatch.departureDate)}
                </strong>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#8CA8CC',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  STATED DURATION
                </span>
                <strong style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700 }}>
                  {activeBatch.totalDays} Days
                </strong>
              </div>
            </div>

            {/* Batch Description & Brochure Note */}
            <p style={{ color: '#D9E2EF', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '30px' }}>
              {activeBatch.description}
            </p>

            {/* Three Travel Packages for this Batch */}
            <div style={{ marginBottom: '28px' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#8CA8CC',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Choose Package for this Batch:
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Package 1 */}
                <div
                  style={{
                    background: '#041329',
                    border: '1px solid rgba(217, 226, 239, 0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#8CA8CC', fontWeight: 700, textTransform: 'uppercase' }}>
                      Package 1
                    </span>
                    <h5 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '4px 0 6px', fontWeight: 600 }}>
                      Classic Overland
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#D9E2EF', marginBottom: '14px' }}>
                      By Bus Both Ways via Nyalam & Saga
                    </p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                      ₹3,50,000
                    </div>
                    <small style={{ fontSize: '0.74rem', color: '#8CA8CC', display: 'block', marginBottom: '16px' }}>
                      + 5% GST (Indian) • ₹4,25,000 (Foreign)
                    </small>
                  </div>
                  <button
                    onClick={() => handleSelectPackage('bus-both-ways')}
                    className="btn btn-login-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Select Package 1
                  </button>
                </div>

                {/* Package 2 */}
                <div
                  style={{
                    background: '#102C52',
                    border: '1.5px solid #2F6FED',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  <div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '16px',
                        background: '#2F6FED',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Featured
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase' }}>
                      Package 2
                    </span>
                    <h5 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '4px 0 6px', fontWeight: 600 }}>
                      Fly to Lhasa + Road
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#D9E2EF', marginBottom: '14px' }}>
                      KTM to Lhasa Flight + Plateau Overland
                    </p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                      ₹4,37,000
                    </div>
                    <small style={{ fontSize: '0.74rem', color: '#D9E2EF', display: 'block', marginBottom: '16px' }}>
                      + 5% GST (Indian) • +$600 flight (Foreign)
                    </small>
                  </div>
                  <button
                    onClick={() => handleSelectPackage('flight-to-lhasa')}
                    className="btn btn-go btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Select Package 2
                  </button>
                </div>

                {/* Package 3 */}
                <div
                  style={{
                    background: '#041329',
                    border: '1px solid rgba(217, 226, 239, 0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#8CA8CC', fontWeight: 700, textTransform: 'uppercase' }}>
                      Package 3
                    </span>
                    <h5 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '4px 0 6px', fontWeight: 600 }}>
                      Fly Lhasa & Ali/Pulan
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#D9E2EF', marginBottom: '14px' }}>
                      Dual Flight Sectors for Maximum Comfort
                    </p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                      ₹4,94,000
                    </div>
                    <small style={{ fontSize: '0.74rem', color: '#8CA8CC', display: 'block', marginBottom: '16px' }}>
                      + 5% GST (Indian) • +$1,200 flights (Foreign)
                    </small>
                  </div>
                  <button
                    onClick={() => handleSelectPackage('lhasa-ali-pulan')}
                    className="btn btn-login-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Select Package 3
                  </button>
                </div>
              </div>
            </div>

            {/* Official Brochure Disclaimer Banner */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '14px 18px',
                background: 'rgba(4, 19, 41, 0.85)',
                border: '1px solid rgba(47, 111, 237, 0.3)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#D9E2EF',
                lineHeight: '1.6',
              }}
            >
              <Info size={16} color="#2F6FED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Published Brochure Schedule: </strong>
                {OFFICIAL_SCHEDULE_DISCLAIMER}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
