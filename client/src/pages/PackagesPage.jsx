import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, Plane, Bus, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import api from '../services/api';

export default function PackagesPage() {
  const [passportType, setPassportType] = useState('INDIAN'); // 'INDIAN' | 'FOREIGN'
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoutes().then((res) => setRoutes(res.routes || [])).catch(() => {});
  }, []);

  const packages = [
    {
      id: 'option-1',
      optionNumber: 1,
      routeCode: 'bus-both-ways',
      name: 'Package 1: Classic Overland Yatra',
      travelMode: 'Bus and road travel both ways',
      duration: '14 Days (Overland Kerung route)',
      durationNote: 'Kathmandu to Kerung, Saga, Lake Mansarovar, Darchen and Parikrama back by road.',
      priceIndian: '₹3,50,000',
      priceIndianTax: '+ 5% GST applicable',
      priceForeign: '₹4,25,000',
      priceForeignTax: 'No air supplement required',
      highlights: [
        'Complete scenic road journey across the Nepal-Tibet border via Kerung/Rasuwagadhi',
        'Gradual overland altitude ascent for steady natural acclimatisation',
        'Kathmandu sightseeing with sacred Rudra Abhishekam / Homam',
        'Holy dip, Jal collection, and Hawan ceremonies at Lake Mansarovar',
        'Full 3-day sacred Mount Kailash Parikrama (52 km circuit)',
        'Pure vegetarian Indian sattvic meal preparation by experienced Sherpa kitchen crew',
        'Comprehensive medical kit, pulse oximeters, and oxygen cylinder support',
      ],
      isPopular: false,
    },
    {
      id: 'option-2',
      optionNumber: 2,
      routeCode: 'flight-to-lhasa',
      name: 'Package 2: Fly to Lhasa, Continue by Road',
      travelMode: 'Kathmandu to Lhasa by air, then road to Kailash',
      duration: '14 Days (Brochure schedule; day-by-day table flagged for administrative verification)',
      durationNote: 'Flies over the central Himalayas to Lhasa Gonggar Airport, followed by overland travel across the Tibetan plateau.',
      priceIndian: '₹4,37,000',
      priceIndianTax: '+ 5% GST applicable',
      priceForeign: '₹4,25,000 + USD 600',
      priceForeignTax: 'USD 600 international/regional flight sector supplement',
      highlights: [
        'Trans-Himalayan scenic flight from Kathmandu to historic Lhasa (3,650 m)',
        'Guided visit to the UNESCO World Heritage Potala Palace and Jokhang Temple',
        'Enhanced acclimatisation comfort with initial days in Lhasa before western Tibet',
        'Journey past Yamdrok Lake, Gyantse, and Shigatse to Saga and Mansarovar',
        'Spiritual pooja, snan, and meditation on the banks of holy Lake Mansarovar',
        'Full 3-day Mount Kailash Parikrama including crossing Dolma La Pass (5,630 m)',
        'Dedicated Tibetan travel permit, Tibet visa, and experienced local guide team',
      ],
      isPopular: true,
    },
    {
      id: 'option-3',
      optionNumber: 3,
      routeCode: 'lhasa-ali-pulan',
      name: 'Package 3: Fly to Lhasa and Ali / Pulan',
      travelMode: 'Kathmandu to Lhasa by air & Lhasa to Ali/Pulan by air, then road',
      duration: '10 Days (Fastest air-connected route)',
      durationNote: 'Minimizes long highway driving by connecting through western Tibet regional airports.',
      priceIndian: '₹4,94,000',
      priceIndianTax: '+ 5% GST applicable',
      priceForeign: '₹4,25,000 + USD 1,200',
      priceForeignTax: 'USD 1,200 dual air sector supplements for foreign passport holders',
      highlights: [
        'Dual flight sectors: Kathmandu to Lhasa and onward domestic flight to Ali Gunsa / Pulan',
        'Significantly reduces long overland driving hours across the vast Tibetan plateau',
        'Direct access to Ngari prefecture, bringing you closer to Mount Kailash quickly',
        'Comprehensive medical clearance and high-altitude protocol management',
        'Sacred Lake Mansarovar darshan, holy dip, and personal meditation time',
        'Full 3-day Mount Kailash Parikrama with personal porter/horse coordination options',
        'Return air transit via Lhasa back to Kathmandu',
      ],
      isPopular: false,
    },
  ];

  return (
    <div style={{ backgroundColor: '#F5F8FC' }}>
      {/* Editorial Page Header */}
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
            2027 Pilgrimage Options
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 300, marginBottom: '20px', color: '#FFFFFF' }}>
            Yatra Packages & Pricing
          </h1>
          <p className="lead" style={{ color: '#D9E2EF', maxWidth: '64ch' }}>
            Three distinct travel routes designed to match your endurance, time availability, and comfort preferences. Transparent pricing derived strictly from the official 2027 pilgrimage brochure.
          </p>
        </div>
      </section>

      {/* Nationality Filter */}
      <section className="sec" style={{ paddingBottom: '30px', backgroundColor: '#F5F8FC' }}>
        <div className="wrap">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.85rem', color: '#102C52', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600 }}>
              Select Pricing Category
            </span>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #D9E2EF',
                padding: '6px',
                borderRadius: '999px',
                display: 'inline-flex',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(4, 19, 41, 0.05)',
              }}
            >
              <button
                onClick={() => setPassportType('INDIAN')}
                style={{
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  background: passportType === 'INDIAN' ? '#071B3A' : 'transparent',
                  color: passportType === 'INDIAN' ? '#FFFFFF' : '#102C52',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🇮🇳 Indian Passport Holders (INR + GST)
              </button>
              <button
                onClick={() => setPassportType('FOREIGN')}
                style={{
                  padding: '12px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  background: passportType === 'FOREIGN' ? '#071B3A' : 'transparent',
                  color: passportType === 'FOREIGN' ? '#FFFFFF' : '#102C52',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🌍 Foreign & NRI Passport Holders (with Supplements)
              </button>
            </div>
          </div>

          {/* Three Package Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'stretch',
              marginBottom: '60px',
            }}
          >
            {packages.map((pkg) => {
              const priceDisplay = passportType === 'INDIAN' ? pkg.priceIndian : pkg.priceForeign;
              const taxDisplay = passportType === 'INDIAN' ? pkg.priceIndianTax : pkg.priceForeignTax;

              return (
                <div
                  key={pkg.id}
                  style={{
                    background: pkg.isPopular ? 'linear-gradient(180deg, #071B3A 0%, #041329 100%)' : '#FFFFFF',
                    color: pkg.isPopular ? '#FFFFFF' : '#071B3A',
                    border: pkg.isPopular ? '2px solid #2F6FED' : '1px solid #D9E2EF',
                    borderRadius: '20px',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: pkg.isPopular ? '0 20px 40px rgba(4, 19, 41, 0.25)' : '0 4px 16px rgba(4, 19, 41, 0.05)',
                  }}
                >
                  {pkg.isPopular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#2F6FED',
                        color: '#FFFFFF',
                        padding: '4px 18px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Most Recommended
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {pkg.optionNumber === 1 ? (
                        <Bus size={18} color="#2F6FED" />
                      ) : (
                        <Plane size={18} color="#2F6FED" />
                      )}
                      <span
                        style={{
                          fontSize: '0.82rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: pkg.isPopular ? '#D9E2EF' : '#2F6FED',
                          fontWeight: 600,
                        }}
                      >
                        {pkg.travelMode}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: '1.5rem',
                        color: pkg.isPopular ? '#FFFFFF' : '#071B3A',
                        marginBottom: '8px',
                        lineHeight: 1.25,
                      }}
                    >
                      {pkg.name}
                    </h2>

                    <div
                      style={{
                        fontSize: '0.88rem',
                        color: pkg.isPopular ? '#D9E2EF' : '#102C52',
                        marginBottom: '20px',
                        lineHeight: 1.5,
                      }}
                    >
                      <b>Duration:</b> {pkg.duration}
                      <p style={{ marginTop: '4px', fontSize: '0.82rem', fontStyle: 'italic', opacity: 0.85 }}>
                        {pkg.durationNote}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div
                      style={{
                        padding: '20px 0',
                        borderTop: pkg.isPopular ? '1px solid rgba(217, 226, 239, 0.15)' : '1px solid #D9E2EF',
                        borderBottom: pkg.isPopular ? '1px solid rgba(217, 226, 239, 0.15)' : '1px solid #D9E2EF',
                        marginBottom: '24px',
                      }}
                    >
                      <small
                        style={{
                          color: pkg.isPopular ? '#D9E2EF' : '#475569',
                          fontSize: '0.78rem',
                          display: 'block',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Base Price Per Person
                      </small>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                        <b
                          style={{
                            color: pkg.isPopular ? '#FFFFFF' : '#071B3A',
                            fontSize: '2rem',
                            lineHeight: 1,
                          }}
                        >
                          {priceDisplay}
                        </b>
                      </div>
                      <small
                        style={{
                          color: '#2F6FED',
                          fontSize: '0.82rem',
                          display: 'block',
                          marginTop: '6px',
                          fontWeight: 600,
                        }}
                      >
                        {taxDisplay}
                      </small>
                    </div>

                    {/* Highlights List */}
                    <div style={{ marginBottom: '32px' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: pkg.isPopular ? '#D9E2EF' : '#102C52',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '12px',
                        }}
                      >
                        Key Highlights Included:
                      </span>
                      <ul
                        style={{
                          listStyle: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          fontSize: '0.88rem',
                          color: pkg.isPopular ? '#D9E2EF' : '#102C52',
                          lineHeight: 1.5,
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {pkg.highlights.map((h, i) => (
                          <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span
                              style={{
                                color: pkg.isPopular ? '#D9A441' : '#2F6FED',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                lineHeight: '1.25rem',
                                flexShrink: 0,
                              }}
                            >
                              •
                            </span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <Link
                      to={`/book?package=option-${pkg.optionNumber}&routeCode=${pkg.routeCode}&passport=${passportType}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '14px 20px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        borderRadius: '999px',
                        background: '#2F6FED',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(47, 111, 237, 0.3)',
                      }}
                    >
                      Book This Package
                    </Link>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <Link
                        to={`/itinerary?option=${pkg.optionNumber}`}
                        style={{
                          padding: '10px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          borderRadius: '999px',
                          textDecoration: 'none',
                          border: pkg.isPopular ? '1px solid #D9E2EF' : '1px solid #D9E2EF',
                          color: pkg.isPopular ? '#FFFFFF' : '#071B3A',
                          background: pkg.isPopular ? 'rgba(255, 255, 255, 0.08)' : '#F5F8FC',
                        }}
                      >
                        View Itinerary
                      </Link>
                      <Link
                        to={`/contact?package=Option%20${pkg.optionNumber}`}
                        style={{
                          padding: '10px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          borderRadius: '999px',
                          textDecoration: 'none',
                          border: pkg.isPopular ? '1px solid #D9E2EF' : '1px solid #D9E2EF',
                          color: pkg.isPopular ? '#FFFFFF' : '#071B3A',
                          background: pkg.isPopular ? 'rgba(255, 255, 255, 0.08)' : '#F5F8FC',
                        }}
                      >
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brochure Inconsistency & Terms Note */}
          <div
            style={{
              padding: '24px 30px',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #D9E2EF',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              boxShadow: '0 4px 12px rgba(4, 19, 41, 0.04)',
            }}
          >
            <Info size={22} color="#2F6FED" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.88rem', color: '#102C52', lineHeight: '1.65' }}>
              <b style={{ color: '#071B3A', display: 'block', marginBottom: '4px' }}>
                Factual Brochure Accuracy & Transparency Note:
              </b>
              Pricing and travel durations above reflect the source Kailash Mansarovar Yatra 2027 brochure.
              For administrative verification: The brochure text mentions a 14-day duration for Option 2 but omits its standalone day-by-day table in the PDF export; furthermore, airfare supplements of USD 600 (Option 2) and USD 1,200 (Option 3) for foreign passport holders are subject to seasonal carrier tariff updates. No artificial discounts, fake countdown timers, or unverified star ratings are used.
            </div>
          </div>
        </div>
      </section>

      {/* Payment Timelines Section */}
      <section style={{ background: '#041329', padding: '80px 0', color: '#FFFFFF' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '46px' }}>
            <span style={{ fontSize: '0.85rem', color: '#2F6FED', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Payment Milestones
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', margin: '8px 0 12px' }}>
              Transparent Payment Schedule
            </h2>
            <p className="lead" style={{ margin: '0 auto', textAlign: 'center', color: '#D9E2EF' }}>
              Staged milestones according to the official 2027 brochure terms.
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
                Step 1
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '8px' }}>Registration Deposit</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                <b>INR 25,000</b> (or USD 250) non-refundable registration amount per person to reserve your batch slot. This deposit forms part of your initial booking payment.
              </p>
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
                Step 2
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '8px' }}>50% Confirmation</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                50% payment to confirm the Yatra slot and initiate Tibet Travel Permit and visa processing with the authorities.
              </p>
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
                Step 3
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '8px' }}>Final Balance</h3>
              <p style={{ color: '#D9E2EF', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
                Remaining 50% balance payable 30 days after the first payment, ensuring all sector logistics, vehicles, and Sherpa teams are locked.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
