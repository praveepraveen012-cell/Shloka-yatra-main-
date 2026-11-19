import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, AlertTriangle, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export default function InclusionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const inclusions = [
    'Tibet Travel Permit and Tibet / China group visa fee',
    'Kathmandu sightseeing, Rudra Homam, and special Puja arrangements',
    'Hotel accommodation in Kathmandu and route hotels / guesthouses as per itinerary',
    'Dormitory-style guesthouse accommodation at Diraphuk and Zutulphuk during Kailash Parikrama',
    'Pure vegetarian sattvic meals (breakfast, lunch, dinner) prepared freshly throughout the Yatra',
    'All ground transportation in Nepal and Tibet as specified in the selected itinerary',
    'Professional, English & Hindi-speaking Yatra leader and experienced Nepali support crew',
    'Comprehensive medical support service, pulse oximetry checks, and emergency first aid',
    'Shloka Yatra expedition gear: Heavy-duty duffel bag, water bottle holder, rain poncho, fleece hat, and sun cap',
    'Certified medical oxygen support cylinders throughout high-altitude plateau travel',
    'Drinking water / purified mineral water provided daily during the journey',
    'Applicable Kathmandu–Lhasa and Lhasa–Ali/Pulan flight sectors for Package 2 and Package 3 options',
    'Nandi and Ashtapad Darshan (subject to government regulations; vehicle cost to approved viewing point included)',
  ];

  const exclusions = [
    'International and domestic flights to/from Kathmandu (other than sectors specifically included in selected Package)',
    'Nepal entry visa fee (applicable for foreign passport holders; free / not required for Indian citizens)',
    'Mandatory medical and travel insurance (must explicitly cover high-altitude emergency air/land evacuation up to 6,000 m)',
    'Personal medical treatment, hospitalization, or specialized clinical expenses',
    'Pony/horse and personal porter hiring charges during the 3-day Kailash Parikrama (paid directly to local Tibetan horsemen)',
    'Extra hotel nights in Kathmandu due to early arrival, delayed flight departures, or trip shortening',
    'Hotel accommodation at Darchen if a yatri elects not to continue Parikrama and returns from Diraphuk early',
    'Vehicle evacuation cost if taken from any point during the Parikrama to exit the circuit before completion',
    'Personal expenses of any nature (telephone calls, laundry, beverages, tips for Tibetan drivers/guides)',
    'Emergency helicopter rescue costs if separately required',
    'Additional unforeseen expenses arising from natural calamities, landslides, political closures, flight cancellations, or border delays',
  ];

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
            Transparent Policies
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Inclusions & Exclusions
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            We believe in complete transparency. Review the exhaustive breakdown of what is covered under your Yatra fee and what personal expenditures remain separate.
          </p>
        </div>
      </section>

      {/* Side-by-Side Breakdown */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {/* Inclusions Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-[#D9E2EF] border-t-4 border-t-[#2F6FED]">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2F6FED]/15 flex items-center justify-center shrink-0">
                  <Check size={22} className="text-[#2F6FED]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-[#071B3A]">
                    What the Yatra Cost Includes
                  </h2>
                  <small className="text-xs sm:text-sm text-[#3B4E68]">Provided comprehensively by Shloka Yatra</small>
                </div>
              </div>

              <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-[#102C52] font-body">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={18} className="text-[#2F6FED] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm border border-[#D9E2EF] border-t-4 border-t-red-600">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <X size={22} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-[#071B3A]">
                    What the Yatra Cost Does Not Include
                  </h2>
                  <small className="text-xs sm:text-sm text-[#3B4E68]">Payable separately or personal responsibility</small>
                </div>
              </div>

              <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-[#102C52] font-body">
                {exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important Participation Notes */}
          <div className="bg-[#071B3A] rounded-2xl p-6 sm:p-8 md:p-10 text-white border border-[#102C52] mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <AlertTriangle size={24} className="text-[#D9A441] shrink-0" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-white">
                Important Participation Notes
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-[#D9E2EF] leading-relaxed">
              <p>
                <strong className="text-white block mb-1">Remote Religious Context:</strong> Travel in remote Western Tibet requires spiritual patience and adaptability. Unpredictable mountain weather, local authority directions, permit processing queues, or border gate schedules may require proactive operational adjustments.
              </p>
              <p>
                <strong className="text-white block mb-1">Inherent Terrain Factors:</strong> The pilgrimage involves high altitude (up to 5,630 m), demanding trekking, and remote logistics. Participants must consult their personal physicians and complete the recommended 12-week preparation.
              </p>
              <p>
                <strong className="text-white block mb-1">Evacuation Insurance Mandate:</strong> Every yatri must hold comprehensive travel and emergency medical insurance valid for Tibet/China covering emergency high-altitude evacuation.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg transition-colors"
            >
              <span>Ready to Book? Proceed to Registration</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
