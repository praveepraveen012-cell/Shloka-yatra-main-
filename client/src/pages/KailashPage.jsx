import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mountain, Droplet, Sun, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function KailashPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden font-body">
      {/* Hero */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 px-4 sm:px-6 relative">
        <div className="wrap px-0 sm:px-4">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
            Main Pilgrimage Overview
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Mount Kailash & Lake Manasarovar
          </h1>
          <p className="lead text-[#D9E2EF] max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed">
            Known as Mount Meru, the Axis Mundi, and the eternal abode of Lord Shiva and Goddess Parvati, Kailash is considered the spiritual epicenter of the universe.
          </p>
          <div className="flex gap-3 flex-wrap mt-6 sm:mt-8">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2F6FED] text-white font-semibold text-xs sm:text-sm hover:bg-blue-600 transition-colors"
            >
              <span>View 3 Package Options</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/departures-2027"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9E2EF] text-white font-semibold text-xs sm:text-sm bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span>2027 Departure Dates</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Spiritual Dimensions */}
      <section className="py-8 sm:py-16 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-full box-border">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#2F6FED] font-semibold block mb-1">
                Sacred Geography
              </span>
              <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#071B3A] mb-3 leading-tight">
                The Four Sacred Faces
              </h2>
              <p className="text-[#102C52] text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                Rising dramatically to 6,638 meters above sea level on the high Tibetan plateau, Mount Kailash is distinct from all surrounding mountains. Its four symmetrical faces point toward the four cardinal directions:
              </p>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#071B3A]">
                <li><b>• North Face (Gold):</b> Seen with overwhelming majesty from Diraphuk, this is the sheer rock and ice face revered during Day 1 of the Parikrama.</li>
                <li><b>• South Face (Sapphire):</b> The side visible from Yamdwar and Darchen, striped by natural horizontal ice bands resembling Lord Shiva’s Trishul and Tripundra.</li>
                <li><b>• West Face (Ruby):</b> Towering over the steep gorge, flanked by high glaciated pinnacles.</li>
                <li><b>• East Face (Crystal):</b> Greeting the morning sun and visible as pilgrims descend from Dolma La Pass into Zutulphuk.</li>
              </ul>
            </div>

            <div>
              <div className="bg-[#071B3A] rounded-2xl p-5 sm:p-8 text-white border border-[#102C52] shadow-lg">
                <Mountain size={28} className="text-[#2F6FED] mb-3" />
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">Four Great Asian Rivers</h3>
                <p className="text-[#D9E2EF] text-xs sm:text-sm leading-relaxed mb-4">
                  From the glaciers of Kailash and the catchment of Lake Manasarovar spring four of Asia’s most sacred life-giving rivers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-[#102C52] p-3 rounded-xl">
                    <b className="text-white block font-semibold">Indus (Sengge Zangbo)</b>
                    <small className="text-[#D9E2EF]">Lion River (North)</small>
                  </div>
                  <div className="bg-[#102C52] p-3 rounded-xl">
                    <b className="text-white block font-semibold">Brahmaputra (Yarlung)</b>
                    <small className="text-[#D9E2EF]">Horse River (East)</small>
                  </div>
                  <div className="bg-[#102C52] p-3 rounded-xl">
                    <b className="text-white block font-semibold">Sutlej (Langqen Zangbo)</b>
                    <small className="text-[#D9E2EF]">Elephant River (West)</small>
                  </div>
                  <div className="bg-[#102C52] p-3 rounded-xl">
                    <b className="text-white block font-semibold">Karnali (Peacock River)</b>
                    <small className="text-[#D9E2EF]">Ganges Tributary (South)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lake Manasarovar & Rakshastal */}
      <section className="bg-[#041329] py-8 sm:py-16 text-white px-4 sm:px-6">
        <div className="wrap px-0 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#2F6FED] font-semibold block mb-1">
              The Dual Waters
            </span>
            <h2 className="text-xl sm:text-3xl font-heading font-bold text-white mb-2 leading-tight">
              Lake Manasarovar & Rakshastal
            </h2>
            <p className="text-[#D9E2EF] text-xs sm:text-sm md:text-base leading-relaxed">
              Side-by-side on the Tibetan plateau lie two starkly contrasting bodies of water, embodying the dual cosmic energies of light and shadow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full box-border">
            <div className="bg-[#071B3A] border border-[#102C52] rounded-2xl p-5 sm:p-7 shadow-md">
              <Droplet size={26} className="text-[#2F6FED] mb-3" />
              <h3 className="text-base sm:text-xl font-heading font-bold mb-2 text-white">Lake Manasarovar (Mapam Yumtso)</h3>
              <p className="text-[#D9E2EF] text-xs sm:text-sm leading-relaxed mb-3">
                Created in the mind (Manas) of Lord Brahma, Lake Manasarovar sits at 4,590 meters as the highest freshwater body in the world. Its round shape represents the sun and the light of divine consciousness.
              </p>
              <p className="text-[#D9E2EF] text-xs sm:text-sm leading-relaxed">
                Yatris undertake a vehicle parikrama around its perimeter, offer Vedic Hawan and morning prayers, and collect sacred Manasarovar Jal to carry back home.
              </p>
            </div>

            <div className="bg-[#071B3A] border border-[#102C52] rounded-2xl p-5 sm:p-7 shadow-md">
              <Sun size={26} className="text-[#2F6FED] mb-3" />
              <h3 className="text-base sm:text-xl font-heading font-bold mb-2 text-white">Lake Rakshastal (Lhanag Tso)</h3>
              <p className="text-[#D9E2EF] text-xs sm:text-sm leading-relaxed mb-3">
                Directly adjacent lies the crescent-shaped, saltwater Lake Rakshastal, historically associated with King Ravana’s intense penance to Lord Shiva. Shaped like a crescent moon, it represents night and the untamed elemental forces.
              </p>
              <p className="text-[#D9E2EF] text-xs sm:text-sm leading-relaxed">
                Contemplating these two lakes side-by-side teaches the pilgrim the necessity of balance and spiritual equilibrium on the road to Kailash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parikrama Key Landmarks */}
      <section className="py-8 sm:py-16 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#071B3A] mb-6 sm:mb-8 text-center sm:text-left">
            Sacred Milestones on the Parikrama
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full box-border">
            <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-[#D9E2EF]">
              <span className="text-[#2F6FED] font-bold text-base sm:text-lg">01</span>
              <h4 className="text-base sm:text-lg font-heading font-bold my-1.5 text-[#071B3A]">Yamdwar (Tarboche)</h4>
              <p className="text-[#102C52] text-xs sm:text-sm leading-relaxed">
                The Gate of Salvation. Pilgrims walk through the arched Yamdwar leaving behind fear of death and spiritual burdens before taking their first steps on the parikrama trail.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-[#D9E2EF]">
              <span className="text-[#2F6FED] font-bold text-base sm:text-lg">02</span>
              <h4 className="text-base sm:text-lg font-heading font-bold my-1.5 text-[#071B3A]">Dolma La Pass (5,650 m)</h4>
              <p className="text-[#102C52] text-xs sm:text-sm leading-relaxed">
                Dedicated to Goddess Tara (Dolma), this is the highest and most spiritually intense altitude of the yatra. Crossing the pass symbolizes spiritual rebirth and redemption.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-[#D9E2EF] sm:col-span-2 lg:col-span-1">
              <span className="text-[#2F6FED] font-bold text-base sm:text-lg">03</span>
              <h4 className="text-base sm:text-lg font-heading font-bold my-1.5 text-[#071B3A]">Gauri Kund (Lake of Compassion)</h4>
              <p className="text-[#102C52] text-xs sm:text-sm leading-relaxed">
                Just beneath Dolma La Pass lies the sacred glacial tarn where Goddess Parvati is believed to have bathed. Pilgrims offer quiet prostrations from the ridge above.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-8 sm:py-16 text-center bg-[#071B3A] text-white px-4 sm:px-6">
        <div className="wrap px-0 sm:px-4 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-heading font-bold text-white mb-3">Ready to Experience Mount Kailash?</h2>
          <p className="text-[#D9E2EF] text-xs sm:text-sm md:text-base leading-relaxed mb-6">
            Choose your preferred route and explore our 8 fixed departure batches for the 2027 season.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/routes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2F6FED] text-white font-semibold text-xs sm:text-sm hover:bg-blue-600 transition-colors"
            >
              <span>Compare Route Options</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/departures-2027"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9E2EF] text-white font-semibold text-xs sm:text-sm bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span>View 2027 Dates</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
