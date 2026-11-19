import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Printer, ArrowRight, Lock, CheckCircle, FileText, ArrowUp } from 'lucide-react';
import { PRIVACY_POLICY, CONTRACT_METADATA } from '../data/legalData';

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredClauses = PRIVACY_POLICY.filter((clause) => {
    const q = searchQuery.toLowerCase();
    return (
      clause.id.toLowerCase().includes(q) ||
      clause.title.toLowerCase().includes(q) ||
      clause.body.toLowerCase().includes(q)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <CheckCircle size={14} className="shrink-0" />
              DPDP ACT 2023 COMPLIANT
            </span>
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold">
              17 Statutory Clauses (P1–P17)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Pilgrimage Privacy & Data Protection Notice
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Official privacy disclosure under India's Digital Personal Data Protection Act, 2023 governing pilgrim identity records, passport verification, cross-border Tibet Travel Permits (TTP), and emergency high-altitude medical declarations.
          </p>

          {/* Quick Notice Banner */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-[#102C52]/70 border border-[#2F6FED]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-[#D9E2EF]">
            <div className="min-w-0">
              <strong className="text-white block mb-1">Data Fiduciary:</strong>
              <span className="break-words">{CONTRACT_METADATA.companyName}</span>
            </div>
            <div className="min-w-0">
              <strong className="text-white block mb-1">Registered Office:</strong>
              <span className="break-words">{CONTRACT_METADATA.registeredOffice}</span>
            </div>
            <div className="min-w-0">
              <strong className="text-white block mb-1">Grievance & Privacy Officer:</strong>
              <span className="break-words">{CONTRACT_METADATA.grievanceOfficer} ({CONTRACT_METADATA.officialEmail})</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9E2EF] shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 sm:mb-8">
            <div className="relative w-full md:max-w-md min-w-0">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search privacy clauses (e.g. passport, medical, retention)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#D9E2EF] text-sm sm:text-base outline-none text-[#071B3A] focus:border-[#2F6FED] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#F5F8FC] border border-[#D9E2EF] text-[#102C52] text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                <Printer size={16} />
                Print Privacy Policy
              </button>
              <span className="text-xs sm:text-sm text-[#3B4E68]">
                Showing {filteredClauses.length} of {PRIVACY_POLICY.length} clauses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start w-full max-w-full box-border">
            {/* Clauses List */}
            <div className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
              {filteredClauses.map((clause) => (
                <article
                  key={clause.id}
                  id={clause.id}
                  className="bg-white rounded-2xl border border-[#D9E2EF] shadow-sm p-4 sm:p-7 transition-colors hover:border-[#2F6FED]/40 w-full max-w-full box-border scroll-mt-24"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                      <span className="inline-block bg-[#102C52] text-white font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono shrink-0">
                        {clause.id}
                      </span>
                      <h2 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A] break-words">
                        {clause.title}
                      </h2>
                    </div>
                  </div>

                  <div className="text-[#102C52] text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line break-words font-body">
                    {clause.body}
                  </div>
                </article>
              ))}

              {filteredClauses.length === 0 && (
                <div className="bg-white p-8 sm:p-12 rounded-2xl text-center border border-[#D9E2EF]">
                  <p className="text-[#3B4E68] text-sm sm:text-base mb-4">
                    No privacy clauses matched your search query "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-5 py-2 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Sticky Sidebar Navigation */}
            <aside className="lg:sticky lg:top-28 flex flex-col gap-6 w-full min-w-0">
              {/* Quick Table of Contents Card */}
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-[#D9E2EF]/60 pb-3">
                  <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A]">
                    Table of Contents
                  </h3>
                  <span className="text-xs bg-[#F5F8FC] text-[#2F6FED] font-semibold px-2 py-0.5 rounded-full border border-[#D9E2EF]">
                    P1–P17
                  </span>
                </div>
                <nav className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
                  {PRIVACY_POLICY.map((clause) => (
                    <a
                      key={clause.id}
                      href={`#${clause.id}`}
                      className="text-xs text-[#3B4E68] hover:text-[#2F6FED] hover:bg-[#F5F8FC] py-1 px-2 rounded-lg transition-colors flex items-center gap-2 truncate"
                    >
                      <span className="font-mono font-bold text-[#102C52] shrink-0">{clause.id}</span>
                      <span className="truncate">{clause.title}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Data Protection Core Principles Card */}
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={20} className="text-[#2F6FED] shrink-0" />
                  <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A]">
                    Key Safeguards
                  </h3>
                </div>
                <ul className="text-xs sm:text-sm text-[#102C52] flex flex-col gap-2.5 leading-relaxed">
                  <li>
                    <strong>Purpose Limitation (P4):</strong> Data is utilized solely for official travel permits, visas, safety, and ticketing.
                  </li>
                  <li>
                    <strong>No Data Monetisation (P5):</strong> We never sell, rent, or commercialize pilgrim personal records.
                  </li>
                  <li>
                    <strong>Medical Confidentiality (P6):</strong> Health declarations are restricted exclusively to emergency medical personnel.
                  </li>
                  <li>
                    <strong>Grievance Resolution (P16):</strong> Formal statutory acknowledgement within 48 hours and resolution within 30 days.
                  </li>
                </ul>
              </div>

              {/* Associated Legal Documents Links */}
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-4">
                  Associated Legal Documents
                </h3>
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/terms"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] text-[#071B3A] text-xs sm:text-sm font-semibold hover:bg-[#EEF3F9] transition-colors"
                  >
                    <span>Master Terms (T1–T35)</span>
                    <ArrowRight size={16} className="text-[#2F6FED] shrink-0" />
                  </Link>

                  <Link
                    to="/cancellation-policy"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] text-[#071B3A] text-xs sm:text-sm font-semibold hover:bg-[#EEF3F9] transition-colors"
                  >
                    <span>Cancellation & Refund Policy</span>
                    <ArrowRight size={16} className="text-[#2F6FED] shrink-0" />
                  </Link>

                  <Link
                    to="/risk-acknowledgement"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] text-[#071B3A] text-xs sm:text-sm font-semibold hover:bg-[#EEF3F9] transition-colors"
                  >
                    <span>Risk Acknowledgement (R1–R12)</span>
                    <ArrowRight size={16} className="text-[#2F6FED] shrink-0" />
                  </Link>

                  <Link
                    to="/service-schedule"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] text-[#071B3A] text-xs sm:text-sm font-semibold hover:bg-[#EEF3F9] transition-colors"
                  >
                    <span>Service Schedule (Annex A)</span>
                    <ArrowRight size={16} className="text-[#2F6FED] shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Ready to Book CTA */}
              <div className="bg-gradient-to-br from-[#071B3A] to-[#102C52] rounded-2xl p-5 sm:p-6 text-white text-center">
                <h4 className="text-base sm:text-lg font-heading font-bold text-white mb-2">Ready to Journey?</h4>
                <p className="text-xs sm:text-sm text-[#D9E2EF] mb-4 leading-relaxed">
                  Join our official 2027 Kailash Mansarovar departure batches with verified permit coordination.
                </p>
                <Link
                  to="/book"
                  className="block w-full py-3 px-4 rounded-xl bg-[#2F6FED] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors text-center"
                >
                  Proceed to Booking Portal
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Back to top floating button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-20 right-6 z-30 p-3 rounded-full bg-[#102C52] text-white shadow-lg border border-[#2F6FED]/40 hover:bg-[#2F6FED] transition-all cursor-pointer"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
