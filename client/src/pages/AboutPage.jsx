import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Compass, Users, Sparkles, Award, ArrowRight, MapPin, Phone, Mail, Building, Check } from 'lucide-react';
import assetUrl from '../utils/assets';
import { destinationImages } from '../data/imageManifest';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen w-full max-w-full overflow-x-hidden font-body">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-[#101D35] to-[#1C3F70] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4">
            About Shloka Yatra Private Limited
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 sm:mb-4 leading-tight">
            Faithful Journeys. Higher Horizons.
          </h1>
          <p className="text-[#E3DFD5] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Shloka Yatra Private Limited was founded on a simple conviction: sacred pilgrimages are not
            commercial tour packages. They demand deep reverent context, uncompromised high-altitude safety,
            and personal spiritual care.
          </p>
        </div>
      </section>

      {/* Philosophy & Purpose */}
      <section className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6 w-full box-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full max-w-full box-border">
          <div>
            <span className="eyebrow">Our Foundation</span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-[#101D35] mt-2 mb-4 leading-tight">
              Pilgrimage • People • Purpose
            </h2>
            <p className="text-[#5A6B82] text-xs sm:text-sm md:text-base leading-relaxed mb-4">
              At Shloka Yatra, we view every participant not as a tourist, but as a revered yatri. Whether
              stepping into the sanctum of Pashupatinath in Kathmandu or traversing the rigorous 5,630-meter
              Dolma La Pass under the watchful gaze of Mount Kailash, you are supported at every step.
            </p>
            <p className="text-[#5A6B82] text-xs sm:text-sm md:text-base leading-relaxed mb-6">
              We bridge timeless spiritual traditions with modern expedition standards. From comprehensive
              oxygen backups and continuous pulse-oximetry monitoring to pure satvik vegetarian food prepared
              by our dedicated kitchen crew, our mission is to ensure every yatri completes their sacred
              circumambulation safely, healthfully, and joyfully.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link to="/routes" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101D35] text-white font-semibold text-xs sm:text-sm hover:bg-[#1a2e54] transition-colors">
                <span>Explore Travel Routes</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden mb-6 shadow-md h-48 sm:h-56 w-full">
              <img
                src={assetUrl(destinationImages.manasarovarShores.src)}
                alt={destinationImages.manasarovarShores.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#D9E2EF] shadow-sm">
              <h3 className="text-base sm:text-xl font-heading font-bold text-[#101D35] mb-5">
                The Shloka Yatra Commitment
              </h3>
              <ul className="flex flex-col gap-4 text-xs sm:text-sm">
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D9A441]/15 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} className="text-[#D9A441]" />
                  </div>
                  <div>
                    <strong className="text-[#101D35] block font-semibold mb-0.5">
                      Uncompromised Altitude Safety
                    </strong>
                    <span className="text-[#5A6B82] leading-relaxed block">
                      Scheduled acclimatisation rest days, Gamow hyperbaric bag, medical oxygen cylinders, and daily SpO2 logging.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6FA8B2]/15 flex items-center justify-center shrink-0">
                    <Heart size={18} className="text-[#6FA8B2]" />
                  </div>
                  <div>
                    <strong className="text-[#101D35] block font-semibold mb-0.5">
                      Pure Satvik Vegetarian Catering
                    </strong>
                    <span className="text-[#5A6B82] leading-relaxed block">
                      Accompanying महाराज (Maharaj) kitchen staff preparing hygienic pure vegetarian meals (Jain / no onion-garlic options available).
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1C3F70]/15 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-[#1C3F70]" />
                  </div>
                  <div>
                    <strong className="text-[#101D35] block font-semibold mb-0.5">
                      1:3 Veteran Sherpa Support
                    </strong>
                    <span className="text-[#5A6B82] leading-relaxed block">
                      Experienced Sherpa guides with dozens of Kailash Parikramas, assisting with daypacks and pacing at high passes.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate & Legal Registry Info */}
      <section className="bg-white py-8 sm:py-16 px-4 sm:px-6 border-y border-[#E3DFD5] w-full box-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="eyebrow">Legal & Governance Standards</span>
            <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#101D35] mt-2 mb-3 leading-tight">
              Corporate & Operational Integrity
            </h2>
            <p className="text-[#5A6B82] text-xs sm:text-sm md:text-base leading-relaxed">
              Operating under full legal compliance with Indian corporate law, Nepal tourism authorities, and
              the Tibet Tourism Bureau (TTB).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full box-border">
            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <Building size={20} className="text-[#101D35]" />
                <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35]">Registered Corporate Entity</h4>
              </div>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed mb-4">
                <strong>Shloka Yatra Private Limited</strong> is an incorporated pilgrimage management enterprise.
              </p>
              <div className="text-xs text-[#202A36] bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-[#D9A441] shrink-0 mt-0.5" />
                  <span className="break-words">Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, Uttar Pradesh 201304</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <Award size={20} className="text-[#D9A441]" />
                <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35]">Official Banking Channel</h4>
              </div>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed mb-4">
                All transactions are settled through authorized corporate bank accounts with statutory GST invoices and complete fiscal compliance.
              </p>
              <div className="text-xs text-[#202A36] bg-white p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                <div><strong>Bank:</strong> IndusInd Bank Ltd</div>
                <div><strong>A/c Number:</strong> 201037169009</div>
                <div><strong>Tax Compliance:</strong> Full GST Invoicing Provided</div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <Phone size={20} className="text-[#6FA8B2]" />
                <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35]">Pilgrimage Advisory Cell</h4>
              </div>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed mb-4">
                Dedicated yatra advisors and grievance officer available to guide your document submission, medical approvals, and itinerary selection.
              </p>
              <div className="text-xs text-[#202A36] bg-white p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                <div><strong>Phone / Helpline:</strong> +91 6366852888</div>
                <div className="break-words"><strong>Email:</strong> volunteers@shlloka.com</div>
                <div><strong>Grievance Officer:</strong> Sangeeta (Noida Corporate Office)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Callout */}
      <section style={{ padding: '90px 24px', textAlign: 'center', background: '#101D35', color: '#FFFFFF' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#FFFFFF', marginBottom: '16px', fontFamily: 'var(--serif)' }}>
            Begin Your Sacred Pilgrimage With Us
          </h2>
          <p style={{ color: '#E3DFD5', fontSize: '1.1rem', margin: '0 auto 36px', maxWidth: '600px' }}>
            Explore our 2027 departures and find the travel route tailored to your devotion, comfort, and schedule.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn btn-gold" style={{ padding: '16px 36px', borderRadius: '999px', fontSize: '1.05rem' }}>
              <span>Book Your 2027 Journey</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline-white" style={{ padding: '16px 32px', borderRadius: '999px', fontSize: '1.05rem' }}>
              <span>Contact Pilgrimage Desk</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
