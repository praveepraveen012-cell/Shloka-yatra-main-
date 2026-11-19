import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calculator, ShieldCheck, Search, HelpCircle, FileText, ArrowRight, Printer } from 'lucide-react';
import { CANCELLATION_POLICY, CANCELLATION_SLABS, CONTRACT_METADATA } from '../data/legalData';

export default function CancellationPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // Interactive Calculator State
  const [calcPackagePrice, setCalcPackagePrice] = useState(350000);
  const [calcDaysBeforeDeparture, setCalcDaysBeforeDeparture] = useState(80);
  const [calcAmountPaid, setCalcAmountPaid] = useState(350000);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute cancellation calculations dynamically
  const calculateRefund = () => {
    let chargePct = 100;
    let slabDesc = 'Fewer than 30 days before departure';
    if (calcDaysBeforeDeparture >= 75) {
      chargePct = 25;
      slabDesc = '75 calendar days or more before departure';
    } else if (calcDaysBeforeDeparture >= 60) {
      chargePct = 50;
      slabDesc = '60 to 74 calendar days before departure';
    } else if (calcDaysBeforeDeparture >= 30) {
      chargePct = 75;
      slabDesc = '30 to 59 calendar days before departure';
    }

    const cancellationCharge = Math.round((calcPackagePrice * chargePct) / 100);
    // Formula per C4: Package Refund = max(0, Package Base Price paid - cancellationCharge)
    const packageRefund = Math.max(0, calcAmountPaid - cancellationCharge);

    return {
      chargePct,
      refundPct: 100 - chargePct,
      slabDesc,
      cancellationCharge,
      packageRefund,
    };
  };

  const calcResult = calculateRefund();

  const filteredClauses = CANCELLATION_POLICY.filter((clause) => {
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
              <ShieldCheck size={14} className="shrink-0" />
              OFFICIAL 2027 CANCELLATION & REFUND POLICY
            </span>
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold">
              17 Authoritative Clauses (C1–C17)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Cancellation, Refund & Force Majeure Policy
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Official commercial terms governing voluntary cancellations, clear percentage slabs, the single refund formula, company cancellation protections, and genuine force majeure events.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          {/* Key Principles Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldCheck size={22} className="text-[#2F6FED] shrink-0" />
                <h3 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A]">
                  Single Refund Formula (Clause C4)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed">
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Package Refund = max(0, Base Price paid - Cancellation Charge)</code>. The company will never double-deduct the registration payment or arbitrary admin penalties.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D9E2EF] shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <AlertTriangle size={22} className="text-amber-600 shrink-0" />
                <h3 className="text-base sm:text-lg font-heading font-semibold text-[#071B3A]">
                  Reciprocal Protection (Clause C7)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed">
                If the Company cancels a departure for reasons within its control, the pilgrim receives a full refund plus reciprocal compensation. Commercial under-enrolment is not force majeure.
              </p>
            </div>
          </div>

          {/* Slabs Table & Interactive Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start mb-8 sm:mb-12 w-full max-w-full box-border">
            {/* Slabs Table */}
            <div className="bg-white rounded-2xl border border-[#D9E2EF] shadow-sm p-4 sm:p-7 w-full max-w-full box-border min-w-0">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-xl font-heading font-bold text-[#071B3A]">
                  Voluntary Cancellation Slabs (Clause C2)
                </h2>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#D9E2EF] text-[#102C52] text-xs font-semibold hover:bg-slate-100"
                >
                  <Printer size={15} />
                  Print Slabs
                </button>
              </div>

              <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full border-collapse text-xs sm:text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-[#071B3A] text-white text-left">
                      <th className="p-3 sm:p-4 rounded-tl-lg font-semibold">Notice Window</th>
                      <th className="p-3 sm:p-4 text-center font-semibold">Cancellation Fee</th>
                      <th className="p-3 sm:p-4 text-center font-semibold">Package Refund</th>
                      <th className="p-3 sm:p-4 rounded-tr-lg font-semibold">Operational Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANCELLATION_SLABS.map((slab, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}
                      >
                        <td className="p-3 sm:p-4 font-semibold text-[#071B3A]">
                          {slab.window}
                        </td>
                        <td className="p-3 sm:p-4 text-center text-red-600 font-bold">
                          {slab.chargePercent}%
                        </td>
                        <td className="p-3 sm:p-4 text-center text-emerald-600 font-bold">
                          {slab.refundPercent}%
                        </td>
                        <td className="p-3 sm:p-4 text-[#475569] text-xs leading-relaxed">
                          {slab.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed">
                <strong>Important Statutory Note:</strong> Per Indian tax regulations, statutory taxes (such as 5% GST and applicable TCS) collected and remitted to the government cannot be refunded directly by the travel operator. Non-refundable third-party flights or official permit costs incurred prior to cancellation notice are excluded.
              </div>
            </div>

            {/* Interactive Refund Calculator Widget */}
            <div className="bg-white rounded-2xl border border-[#2F6FED] shadow-md p-5 sm:p-7 w-full max-w-full box-border min-w-0">
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <Calculator size={22} className="text-[#2F6FED] shrink-0" />
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A]">
                  Live Refund Estimator
                </h3>
              </div>

              <div className="flex flex-col gap-4 mb-5">
                <div>
                  <label className="block text-xs sm:text-sm text-[#3B4E68] font-semibold mb-1.5">
                    Select Route Package Base Price:
                  </label>
                  <select
                    value={calcPackagePrice}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setCalcPackagePrice(p);
                      setCalcAmountPaid(p);
                    }}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-[#D9E2EF] text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED]"
                  >
                    <option value={350000}>Package 1: Bus Both Ways (₹3,50,000)</option>
                    <option value={437000}>Package 2: Fly to Lhasa, Road Return (₹4,37,000)</option>
                    <option value={494000}>Package 3: Fly to Lhasa & Ali/Pulan (₹4,94,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-[#3B4E68] font-semibold mb-1.5">
                    Calendar Days Before Departure: <strong>{calcDaysBeforeDeparture} days</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={calcDaysBeforeDeparture}
                    onChange={(e) => setCalcDaysBeforeDeparture(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-[#8CA8CC] mt-1">
                    <span>0 days</span>
                    <span>30 days</span>
                    <span>60 days</span>
                    <span>75+ days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-[#3B4E68] font-semibold mb-1.5">
                    Amount Actually Paid by Yatri:
                  </label>
                  <input
                    type="number"
                    value={calcAmountPaid}
                    onChange={(e) => setCalcAmountPaid(Number(e.target.value))}
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-[#D9E2EF] text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              {/* Calculator Output */}
              <div className="bg-[#F5F8FC] rounded-xl p-4 border border-[#D9E2EF] flex flex-col gap-2.5">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#3B4E68]">Applicable Notice Slab:</span>
                  <strong className="text-[#071B3A] text-right font-medium">{calcResult.slabDesc}</strong>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-[#3B4E68]">Cancellation Charge ({calcResult.chargePct}%):</span>
                  <strong className="text-red-600">- ₹{calcResult.cancellationCharge.toLocaleString('en-IN')}</strong>
                </div>
                <div className="border-t border-[#D9E2EF] pt-2.5 flex justify-between items-baseline">
                  <span className="text-[#071B3A] font-bold text-xs sm:text-sm">Estimated Refund:</span>
                  <strong className="text-emerald-600 text-lg sm:text-xl font-bold">
                    ₹{calcResult.packageRefund.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Full Clauses Search & List */}
          <div className="mb-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9E2EF] shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
              <div className="relative w-full md:max-w-md min-w-0">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA8CC] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search across all 17 cancellation clauses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#D9E2EF] text-xs sm:text-sm text-[#071B3A] outline-none focus:border-[#2F6FED]"
                />
              </div>
              <span className="text-xs sm:text-sm text-[#3B4E68]">
                Showing {filteredClauses.length} of {CANCELLATION_POLICY.length} clauses
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
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
          </div>
        </div>
      </section>
    </div>
  );
}
