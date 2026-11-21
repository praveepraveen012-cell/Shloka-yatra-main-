import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Check, X, Shield, ArrowRight, Printer, CheckCircle } from 'lucide-react';
import { CONTRACT_METADATA } from '../data/legalData';

export default function ServiceSchedulePage() {
  const [selectedRoute, setSelectedRoute] = useState('bus');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const routeDetails = {
    bus: {
      name: 'Option 1 — Bus Both Ways (Kathmandu - Kerung - Saga - Kailash)',
      duration: '14 Days / 13 Nights',
      priceIndian: '₹3,50,000 + 5% GST',
      priceForeign: '₹4,25,000 + $0 flight supplement',
      maxAltitude: '5,630 metres (Dolma La Pass)',
      sectors: 'Kathmandu -> Syabrubesi/Kerung border -> Saga -> Lake Manasarovar -> Darchen -> Yamdwar -> Parikrama -> Return by overland coach',
      acclimatisation: 'Staged altitude gain via Kerung (2,700m) and Saga (4,450m) prior to Lake Manasarovar (4,590m)',
      accommodation: 'Kathmandu 4/5-star hotel; Kerung/Saga deluxe guest houses with private bath; Mansarovar/Diraphuk/Zuthulphuk dormitory mud-brick pilgrim guest houses (shared facilities)',
      meals: '100% pure vegetarian & satvik meals prepared by accompany Nepali Sherpa kitchen crew with purified boiled water',
      medicalSupport: 'Dedicated medical kit, pulse oximeters, portable emergency oxygen cylinders (Gamow bag on standby with Tibetan tour vehicle)',
    },
    flight_road: {
      name: 'Option 2 — Fly to Lhasa, Continue by Road (Lhasa - Shigatse - Saga - Kailash - Kathmandu)',
      duration: '15 Days / 14 Nights',
      priceIndian: '₹4,37,000 + 5% GST',
      priceForeign: '₹4,25,000 + $600 flight supplement',
      maxAltitude: '5,630 metres (Dolma La Pass)',
      sectors: 'Flight Kathmandu to Lhasa Gonggar -> Lhasa sightseeing -> Shigatse -> Saga -> Lake Manasarovar -> Darchen -> Parikrama -> Overland drive return to Kerung / Kathmandu',
      acclimatisation: '3 full nights gentle acclimatisation in historic Lhasa (3,650m) with Potala Palace & Jokhang Temple prior to ascending to Saga (4,450m)',
      accommodation: 'Kathmandu 5-star hotel; Lhasa 4-star Tibetan boutique hotel; Shigatse & Saga 3/4-star hotels; Mansarovar & Parikrama mountain lodges',
      meals: '100% pure vegetarian breakfasts and dinners, fresh hot lunches en route prepared by mobile kitchen team',
      medicalSupport: 'Medical kit, daily SpO2/pulse logs, portable oxygen cylinders, on-call Lhasa medical emergency liaison',
    },
    flight_ali: {
      name: 'Option 3 — Fly to Lhasa & Fly to Ali/Pulan (Fastest / Lowest Road Fatigue)',
      duration: '13 Days / 12 Nights',
      priceIndian: '₹4,94,000 + 5% GST',
      priceForeign: '₹4,25,000 + $1,200 flight supplement',
      maxAltitude: '5,630 metres (Dolma La Pass)',
      sectors: 'Flight Kathmandu to Lhasa -> Flight Lhasa Gonggar to Ali Gunsa / Pulan Airport -> Direct transfer to Darchen/Mansarovar -> Parikrama -> Return flights via Lhasa',
      acclimatisation: 'Structured acclimatisation in Lhasa prior to high-plateau domestic flight landing in Western Tibet (4,270m)',
      accommodation: 'Premium 5-star in Kathmandu, 4-star in Lhasa, deluxe hotel in Ali/Darchen, pilgrim lodges during 3-day circumambulation',
      meals: 'Comprehensive satvik vegetarian dining, packed energy snacks during high trekking sectors',
      medicalSupport: 'Comprehensive oxygen backup, daily altitude vitals log, hyperbaric oxygen chambers available in regional Ali medical centres',
    },
  };

  const activeRoute = routeDetails[selectedRoute];

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <CheckCircle size={14} className="shrink-0" />
              OFFICIAL 2027 SERVICE SCHEDULE (ANNEX A)
            </span>
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold">
              Annex A Contract Schedule
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Individual Package Service Schedule (Annex A)
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            The binding contractual schedule identifying the exact transport sectors, inclusions, accommodations, meals, medical support, and quotation itemisation that forms part of each participant's Booking Confirmation.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          {/* Priority Notice */}
          <div className="bg-white rounded-2xl border border-[#2F6FED] p-5 sm:p-7 mb-6 sm:mb-8 shadow-sm">
            <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A] mb-2">
              Legal Supremacy of Annex A (Per Clause T2)
            </h3>
            <p className="text-xs sm:text-sm text-[#3B4E68] leading-relaxed">
              Under Terms & Conditions Clause T2, this personalized Service Schedule prevails over general brochure statements or website descriptions regarding the specific services, inclusions, hotels, and prices agreed for your yatra.
            </p>
          </div>

          {/* Route Switcher Tabs */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => setSelectedRoute('bus')}
              className={`px-4 sm:px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors text-center ${
                selectedRoute === 'bus'
                  ? 'bg-[#102C52] text-white border-2 border-[#2F6FED]'
                  : 'bg-white text-[#071B3A] border border-[#D9E2EF] hover:bg-slate-50'
              }`}
            >
              Package 1: Bus Both Ways
            </button>
            <button
              onClick={() => setSelectedRoute('flight_road')}
              className={`px-4 sm:px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors text-center ${
                selectedRoute === 'flight_road'
                  ? 'bg-[#102C52] text-white border-2 border-[#2F6FED]'
                  : 'bg-white text-[#071B3A] border border-[#D9E2EF] hover:bg-slate-50'
              }`}
            >
              Package 2: Fly to Lhasa, Road Return
            </button>
            <button
              onClick={() => setSelectedRoute('flight_ali')}
              className={`px-4 sm:px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-colors text-center ${
                selectedRoute === 'flight_ali'
                  ? 'bg-[#102C52] text-white border-2 border-[#2F6FED]'
                  : 'bg-white text-[#071B3A] border border-[#D9E2EF] hover:bg-slate-50'
              }`}
            >
              Package 3: Fly to Lhasa & Ali/Pulan
            </button>
          </div>

          {/* Schedule Breakdown Card */}
          <div className="bg-white rounded-2xl border border-[#D9E2EF] p-4 sm:p-8 shadow-sm mb-8 w-full max-w-full box-border">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b border-[#E2E8F0] pb-5">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-[#071B3A] break-words">
                  {activeRoute.name}
                </h2>
                <span className="inline-block mt-1 text-[#2F6FED] font-semibold text-xs sm:text-sm">
                  Standard Duration: {activeRoute.duration}
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#D9E2EF] text-[#102C52] text-xs font-semibold hover:bg-slate-100 shrink-0 self-start sm:self-auto"
              >
                <Printer size={15} />
                Print Schedule
              </button>
            </div>

            {/* Field Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B] uppercase font-bold tracking-wider mb-1">
                  Contracting Organiser
                </span>
                <strong className="text-[#0F172A] text-xs sm:text-sm break-words">{CONTRACT_METADATA.companyName}</strong>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B] uppercase font-bold tracking-wider mb-1">
                  Indian Passport Base Price
                </span>
                <strong className="text-[#0F172A] text-sm sm:text-base">{activeRoute.priceIndian}</strong>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B] uppercase font-bold tracking-wider mb-1">
                  Foreign Passport Base Price
                </span>
                <strong className="text-[#0F172A] text-sm sm:text-base">{activeRoute.priceForeign}</strong>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0]">
                <span className="block text-[11px] text-[#64748B] uppercase font-bold tracking-wider mb-1">
                  Peak Altitude Exposure
                </span>
                <strong className="text-red-600 text-xs sm:text-sm">{activeRoute.maxAltitude}</strong>
              </div>
            </div>

            {/* Detailed Service Specifications */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div>
                <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-1">
                  1. Transport Sectors & Vehicle Fleet:
                </h4>
                <p className="text-[#3B4E68] leading-relaxed">
                  {activeRoute.sectors}
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-1">
                  2. Acclimatisation Strategy & Profile:
                </h4>
                <p className="text-[#3B4E68] leading-relaxed">
                  {activeRoute.acclimatisation}
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-1">
                  3. Accommodation Standards & Occupancy:
                </h4>
                <p className="text-[#3B4E68] leading-relaxed">
                  {activeRoute.accommodation}
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-1">
                  4. Pure Satvik Catering & Drinking Water:
                </h4>
                <p className="text-[#3B4E68] leading-relaxed">
                  {activeRoute.meals}
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-1">
                  5. Medical Safety Equipment & Emergency Oxygen:
                </h4>
                <p className="text-[#3B4E68] leading-relaxed">
                  {activeRoute.medicalSupport}
                </p>
              </div>
            </div>
          </div>

          {/* Standard Inclusions & Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-full box-border">
            <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check size={18} className="text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A]">
                  Included in All Package Service Schedules
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#334155]">
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>All Tibet Travel Permits (TTP), Military & Foreign Affairs permits coordination</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Kathmandu hotel stay with twin sharing and pure vegetarian meals</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Trans-Himalayan transportation in air-conditioned deluxe tourist coaches</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Accompanying Nepali Sherpa team & certified English/Tibetan-speaking Tibetan guide</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Daily morning and evening Vedic aarti and Manasarovar holy bath facilitation</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Duffle bag, day pack, down jacket (on returnable basis), and warm thermal cap</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#D9E2EF] p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <X size={18} className="text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#071B3A]">
                  Standard Exclusions (Payable Directly)
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#334155]">
                <li className="flex gap-2.5 items-baseline">
                  <X size={16} className="text-red-600 shrink-0" />
                  <span>Hiring of personal horse / pony or local Tibetan porter during 52 km Parikrama</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <X size={16} className="text-red-600 shrink-0" />
                  <span>Mandatory personal high-altitude travel and emergency medical evacuation insurance</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <X size={16} className="text-red-600 shrink-0" />
                  <span>International airfare to/from Kathmandu from your home country</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <X size={16} className="text-red-600 shrink-0" />
                  <span>Emergency rescue, emergency evacuation flights, hospital bills, or individual medical expenses</span>
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <X size={16} className="text-red-600 shrink-0" />
                  <span>Additional hotel nights in Kathmandu or Tibet caused by weather or flight delays</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
