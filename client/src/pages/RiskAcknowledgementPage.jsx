import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, HeartPulse, ShieldAlert, Search, Printer, ArrowRight, CheckSquare, CheckCircle } from 'lucide-react';
import { RISK_ACKNOWLEDGEMENT, CONTRACT_METADATA } from '../data/legalData';

export default function RiskAcknowledgementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredClauses = RISK_ACKNOWLEDGEMENT.filter((clause) => {
    const q = searchQuery.toLowerCase();
    return (
      clause.id.toLowerCase().includes(q) ||
      clause.title.toLowerCase().includes(q) ||
      clause.body.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <CheckCircle size={14} className="shrink-0" />
              OFFICIAL 2027 HIGH-ALTITUDE RISK DISCLOSURE
            </span>
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold">
              Part IV: 12 Clauses (R1–R12)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            High-Altitude Risk Acknowledgement & Emergency Medical Authorisation
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Mandatory contractual acknowledgement of inherent extreme-altitude risks (up to 5,630 m at Dolma La Pass), informed assumption of risk, compulsory high-altitude evacuation insurance, and emergency medical proxy protocols.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          {/* Key Medical Directives Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <HeartPulse size={24} className="text-red-600 shrink-0" />
                <h3 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A]">
                  High Altitude Physiology (Clause R3)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed">
                Recognises the inherent hazards of atmospheric pressure drops, severe hypoxemia, AMS, High Altitude Pulmonary Edema (HAPE), and High Altitude Cerebral Edema (HACE) at elevations up to 5,630 metres.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldAlert size={24} className="text-[#2F6FED] shrink-0" />
                <h3 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A]">
                  Emergency Medical Authorisation (Clause R7)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed">
                Authorises accompanying leaders and clinical personnel to seek urgent medical care, administer emergency oxygen, contact designated emergency proxies, and arrange immediate evacuation when a yatri is incapacitated.
              </p>
            </div>
          </div>

          {/* Clauses List */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start w-full max-w-full box-border">
            <div className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
              {filteredClauses.map((clause) => (
                <article
                  key={clause.id}
                  id={clause.id}
                  className="bg-white rounded-2xl border border-[#D9E2EF] shadow-sm p-4 sm:p-7 w-full max-w-full box-border"
                >
                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                    <span className="inline-block bg-red-600 text-white font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono shrink-0">
                      {clause.id}
                    </span>
                    <h2 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A] break-words">
                      {clause.title}
                    </h2>
                  </div>

                  <div className="text-[#102C52] text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line break-words font-body">
                    {clause.body}
                  </div>
                </article>
              ))}
            </div>

            {/* Sidebar with Guidance & Booking Link */}
            <aside className="lg:sticky lg:top-28 flex flex-col gap-6 w-full min-w-0">
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-3">
                  Mandatory Preparation Protocol
                </h3>
                <ul className="text-xs sm:text-sm text-[#3B4E68] pl-5 flex flex-col gap-2.5 leading-relaxed list-disc">
                  <li>
                    <strong>Medical Certificate:</strong> Yatris must submit a certified clinical fitness certificate signed by a physician.
                  </li>
                  <li>
                    <strong>Mandatory Insurance:</strong> Must cover international emergency medical evacuation up to 5,630 metres.
                  </li>
                  <li>
                    <strong>On-Ground Decisive Authority:</strong> Accompanying expedition leader possesses absolute safety authority to command descent or discontinuation.
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#071B3A] to-[#102C52] rounded-2xl p-5 sm:p-6 text-white text-center">
                <h4 className="text-base sm:text-lg font-heading font-bold text-white mb-2">Ready to Register?</h4>
                <p className="text-xs sm:text-sm text-[#D9E2EF] mb-4 leading-relaxed">
                  Affirmative acceptance of this document is required during Step 7 of the official booking workflow.
                </p>
                <Link
                  to="/book"
                  className="block w-full py-3 px-4 rounded-xl bg-[#2F6FED] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors text-center"
                >
                  Proceed to Booking Form
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
