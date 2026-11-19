import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Bus, Plane, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function RoutesComparePage() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoutes().then((data) => setRoutes(data.routes || [])).catch(() => {});
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen w-full max-w-full overflow-x-hidden font-body">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#101D35] to-[#1C3F70] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4">
            Curated Pilgrimage Itineraries
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 sm:mb-4 leading-tight">
            Compare All Three Routes
          </h1>
          <p className="text-[#E3DFD5] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Every yatri travels at their own pace and comfort level. Review our 3 distinct approaches to Mount Kailash
            and Lake Manasarovar to choose your ideal sacred journey.
          </p>
        </div>
      </section>

      {/* Comparison Matrix Section */}
      <section className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6 w-full box-border">
        {/* Mobile Swipe Cue */}
        <div className="block lg:hidden bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-2.5 mb-4 text-xs font-semibold text-center shadow-sm">
          👉 Swipe table horizontally to compare all 3 packages side-by-side
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-sm border border-[#E3DFD5] bg-white scrollbar-none">
          <table className="w-full min-w-[760px] sm:min-w-[850px] border-collapse bg-white text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#101D35] text-white">
                <th className="p-4 sm:p-5 text-left w-1/4 font-semibold sticky left-0 bg-[#101D35] z-10 shadow-[2px_0_6px_rgba(0,0,0,0.15)]">
                  Feature / Sector
                </th>
                <th className="p-4 sm:p-5 text-left w-1/4">
                  <span className="text-[11px] text-[#BAC7D5] uppercase block font-semibold">Package 1</span>
                  <b className="text-sm sm:text-base text-white block">Overland Bus Both Ways</b>
                </th>
                <th className="p-4 sm:p-5 text-left w-1/4 bg-[#1C3F70] border-t-4 border-[#D9A441]">
                  <span className="text-[11px] text-[#D9A441] uppercase block font-bold">Package 2 (Most Popular)</span>
                  <b className="text-sm sm:text-base text-white block">Fly to Lhasa, Drive to Kailash</b>
                </th>
                <th className="p-4 sm:p-5 text-left w-1/4">
                  <span className="text-[11px] text-[#BAC7D5] uppercase block font-semibold">Package 3</span>
                  <b className="text-sm sm:text-base text-white block">Fly Lhasa & Ali (Fastest)</b>
                </th>
              </tr>
            </thead>
            <tbody className="text-[#202A36]">
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Primary Transport</td>
                <td className="p-3.5 sm:p-4">Tourist Coach via Kerung Border</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">Flight KTM-LXA, return road</td>
                <td className="p-3.5 sm:p-4">Dual flights: KTM-LXA & LXA-NGQ (Ali)</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Total Duration</td>
                <td className="p-3.5 sm:p-4">14 Days / 13 Nights</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">15 Days / 14 Nights</td>
                <td className="p-3.5 sm:p-4">11 Days / 10 Nights</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Lhasa Heritage Days</td>
                <td className="p-3.5 sm:p-4 text-[#5A6B82]">None (Direct overland via Kerung)</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">2 Days (Potala Palace & Jokhang)</td>
                <td className="p-3.5 sm:p-4">2 Days (Potala, Jokhang, Sera)</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Road Fatigue Level</td>
                <td className="p-3.5 sm:p-4">Moderate-High (Overland transit)</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">Moderate (Scenic highway)</td>
                <td className="p-3.5 sm:p-4">Minimal (Fly straight into Ali)</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Acclimatisation Style</td>
                <td className="p-3.5 sm:p-4">Natural gradual overland climb via Kerung</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">Gentle rest in Lhasa (3,650 m)</td>
                <td className="p-3.5 sm:p-4">Rest in Lhasa before Ali flight</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Ideal Devotee Profile</td>
                <td className="p-3.5 sm:p-4">Yatris seeking classic overland journey</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">Yatris seeking cultural depth + comfort</td>
                <td className="p-3.5 sm:p-4">Seniors, busy executives & comfort-focused yatris</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Indian Passport Price</td>
                <td className="p-3.5 sm:p-4"><b>₹3,50,000</b> + 5% GST</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40"><b className="text-[#101D35]">₹4,37,000</b> + 5% GST</td>
                <td className="p-3.5 sm:p-4"><b>₹4,94,000</b> + 5% GST</td>
              </tr>
              <tr className="border-b border-[#E3DFD5]">
                <td className="p-3.5 sm:p-4 font-semibold bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">Foreign / NRI Price</td>
                <td className="p-3.5 sm:p-4">₹4,25,000</td>
                <td className="p-3.5 sm:p-4 bg-amber-50/40">₹4,25,000 + US$ 600</td>
                <td className="p-3.5 sm:p-4">₹4,25,000 + US$ 1,200</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 bg-[#F7F5EF] sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)]"></td>
                <td className="p-4 sm:p-5">
                  <Link to="/routes/bus-both-ways" className="block text-center py-2.5 px-3 rounded-full border border-[#101D35] text-[#101D35] font-semibold text-xs hover:bg-[#101D35] hover:text-white transition-colors">
                    Package 1 Details
                  </Link>
                </td>
                <td className="p-4 sm:p-5 bg-amber-50/40">
                  <Link to="/routes/flight-to-lhasa" className="block text-center py-2.5 px-3 rounded-full bg-[#D9A441] text-[#101D35] font-bold text-xs hover:bg-[#c99534] transition-colors shadow-sm">
                    Package 2 Details
                  </Link>
                </td>
                <td className="p-4 sm:p-5">
                  <Link to="/routes/lhasa-ali-pulan" className="block text-center py-2.5 px-3 rounded-full border border-[#101D35] text-[#101D35] font-semibold text-xs hover:bg-[#101D35] hover:text-white transition-colors">
                    Package 3 Details
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Inclusions Across All Routes */}
      <section className="bg-white py-8 sm:py-16 px-4 sm:px-6 border-t border-[#E3DFD5] w-full box-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="eyebrow">Guaranteed Standards</span>
            <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#101D35] mt-2 mb-3 leading-tight">
              Included in Every Shloka Yatra
            </h2>
            <p className="text-[#5A6B82] text-xs sm:text-sm md:text-base leading-relaxed">
              Regardless of the route option you choose, every Shloka Yatra guarantees our sacred spiritual milestones
              and uncompromised safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-full box-border">
            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-[#D9A441]" />
              </div>
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35] mb-2">Vedic Rudrabhishek in Kathmandu</h4>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed">
                Dedicated morning Vedic Rudrabhishek puja at Pashupatinath Temple and Guhyeshwari Shaktipeeth darshan before departing for Tibet.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#6FA8B2]/15 flex items-center justify-center mb-4">
                <ShieldCheck size={20} className="text-[#6FA8B2]" />
              </div>
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35] mb-2">Lake Manasarovar Snan & Havan</h4>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed">
                Scenic Parikrama around Lake Manasarovar, holy water sprinkling / holy dip rituals, and sacred holy Jal collection.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#1C3F70]/15 flex items-center justify-center mb-4">
                <Check size={20} className="text-[#1C3F70]" />
              </div>
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35] mb-2">Complete 52-km Parikrama Circuit</h4>
              <p className="text-[#5A6B82] text-xs sm:text-sm leading-relaxed">
                Trek from Yam Dwar to Dirapuk, across Dolma La Pass (5,630m) to Zuthulpuk and Darchen with experienced guides, porters, and emergency oxygen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
