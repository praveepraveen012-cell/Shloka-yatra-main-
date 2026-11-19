import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, FileText, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Printer, ArrowRight } from 'lucide-react';
import { MASTER_TERMS, CONTRACT_METADATA } from '../data/legalData';

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClause, setExpandedClause] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredClauses = MASTER_TERMS.filter((clause) => {
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
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <CheckCircle size={14} className="shrink-0" />
              OFFICIAL 2027 MASTER CONTRACT PACKAGE
            </span>
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold">
              35 Master Clauses (T1–T35)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Master Terms & Conditions
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Authoritative contractual terms governing registration, booking confirmation, permit compliance, high-altitude safety, and travel coordination for Kailash Mansarovar Parikrama Yatra 2027.
          </p>

          {/* Quick Notice Banner */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-[#102C52]/70 border border-[#2F6FED]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-[#D9E2EF]">
            <div className="min-w-0">
              <strong className="text-white block mb-1">Sole Contracting Organiser:</strong>
              <span className="break-words">{CONTRACT_METADATA.companyName}</span>
            </div>
            <div className="min-w-0">
              <strong className="text-white block mb-1">Registered Office:</strong>
              <span className="break-words">{CONTRACT_METADATA.registeredOffice}</span>
            </div>
            <div className="min-w-0">
              <strong className="text-white block mb-1">Grievance Officer:</strong>
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
                placeholder="Search across all 35 clauses (e.g., refund, permits)..."
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
                Print Terms
              </button>
              <span className="text-xs sm:text-sm text-[#3B4E68]">
                Showing {filteredClauses.length} of {MASTER_TERMS.length} clauses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start w-full max-w-full box-border">
            {/* Clauses List */}
            <div className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
              {filteredClauses.map((clause) => {
                const isExpanded = expandedClause === clause.id;
                return (
                  <article
                    key={clause.id}
                    id={clause.id}
                    className="bg-white rounded-2xl border border-[#D9E2EF] shadow-sm p-4 sm:p-7 transition-colors hover:border-[#2F6FED]/40 w-full max-w-full box-border"
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
                );
              })}

              {filteredClauses.length === 0 && (
                <div className="bg-white p-8 sm:p-12 rounded-2xl text-center border border-[#D9E2EF]">
                  <p className="text-[#3B4E68] text-sm sm:text-base mb-4">
                    No clauses matched your search query "{searchQuery}".
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
              {/* Hierarchy and Priority Card */}
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-3">
                  Priority of Contract Documents
                </h3>
                <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed mb-4">
                  Per Clause T2, in the event of any interpretive inconsistency:
                </p>
                <ol className="text-xs sm:text-sm text-[#102C52] pl-5 flex flex-col gap-2.5 leading-relaxed list-decimal">
                  <li>
                    <strong>Package Service Schedule (Annex A):</strong> Prevails for specific confirmed route, sectors, and price.
                  </li>
                  <li>
                    <strong>Cancellation & Refund Policy:</strong> Prevails for all refund formulas, cancellation charges, and force majeure calculations.
                  </li>
                  <li>
                    <strong>Master Terms (T1–T35):</strong> Governs general obligations, conduct, permits, and liabilities.
                  </li>
                  <li>
                    <strong>Indian Statutory Law:</strong> Non-excludable statutory consumer rights prevail in every instance.
                  </li>
                </ol>
              </div>

              {/* Related Legal Documents Links */}
              <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-4">
                  Associated Legal Documents
                </h3>
                <div className="flex flex-col gap-2.5">
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

                  <Link
                    to="/privacy-policy"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] text-[#071B3A] text-xs sm:text-sm font-semibold hover:bg-[#EEF3F9] transition-colors"
                  >
                    <span>Privacy & Data Protection Notice</span>
                    <ArrowRight size={16} className="text-[#2F6FED] shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Ready to Book CTA */}
              <div className="bg-gradient-to-br from-[#071B3A] to-[#102C52] rounded-2xl p-5 sm:p-6 text-white text-center">
                <h4 className="text-base sm:text-lg font-heading font-bold text-white mb-2">Ready to Begin?</h4>
                <p className="text-xs sm:text-sm text-[#D9E2EF] mb-4 leading-relaxed">
                  Register online for 2027 departure batches across our 3 pilgrimage options.
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
    </div>
  );
}
