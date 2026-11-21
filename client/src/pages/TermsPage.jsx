import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { MASTER_TERMS, CONTRACT_METADATA } from '../data/legalData';

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Terms & Conditions
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
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9E2EF] shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto">
            <div className="relative w-full sm:max-w-md min-w-0">
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

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-xs sm:text-sm text-[#3B4E68] font-medium">
                Showing {filteredClauses.length} of {MASTER_TERMS.length} clauses
              </span>
            </div>
          </div>

          {/* Clean Full-Width Clauses Container */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
            {filteredClauses.map((clause) => (
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
            ))}

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
        </div>
      </section>
    </div>
  );
}
