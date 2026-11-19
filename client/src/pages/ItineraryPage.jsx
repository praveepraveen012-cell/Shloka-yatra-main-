import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, ArrowRight, Bus, Plane, Calendar, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function ItineraryPage() {
  const [routes, setRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getRoutes().then((res) => setRoutes(res.routes || [])).catch(() => {});
  }, []);

  const activeRoute = routes[activeTab] || routes[0];

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 relative">
        <div className="wrap px-4 sm:px-6">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#102C52] text-[#D9E2EF] border border-[#2F6FED] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
            Day-by-Day Flow
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
            Comprehensive Pilgrimage Itineraries
          </h1>
          <p className="lead text-[#D9E2EF] max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Each day of the Yatra is structured to balance sacred devotion, gradual physiological acclimatisation, and physical endurance. Select a package below to explore the detailed daily itinerary.
          </p>
        </div>
      </section>

      {/* Package Switcher Tabs */}
      <section className="py-8 sm:py-12 bg-[#F5F8FC]">
        <div className="wrap px-4 sm:px-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center mb-8 sm:mb-12">
            {routes.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold flex items-center gap-2 sm:gap-2.5 transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#071B3A] text-white border-2 border-[#2F6FED] shadow-md'
                    : 'bg-white text-[#071B3A] border border-[#D9E2EF] hover:bg-slate-50'
                }`}
              >
                {r.code !== 'bus-both-ways' ? (
                  <Plane size={16} className="text-[#2F6FED] shrink-0" />
                ) : (
                  <Bus size={16} className="text-[#2F6FED] shrink-0" />
                )}
                <span>Package {r.routeNumber}: {r.name.split('—')[1] || r.name}</span>
              </button>
            ))}
          </div>

          {/* Active Package Overview Card */}
          {activeRoute && (
            <div className="bg-[#071B3A] rounded-2xl p-6 sm:p-8 md:p-10 text-white border border-[#2F6FED]/35 mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-widest text-[#8CA8CC] font-bold block mb-1">
                  Selected Package Overview
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-2 break-words">
                  {activeRoute.name.replace(/Option/g, 'Package')}
                </h2>
                <p className="text-sm sm:text-base text-[#D9E2EF] max-w-2xl leading-relaxed">
                  {activeRoute.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center shrink-0">
                <Link
                  to={`/book?routeCode=${activeRoute.code}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-md"
                >
                  <span>Book This Package</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* Day By Day List */}
          {activeRoute && activeRoute.itinerary && (
            <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
              {activeRoute.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#D9E2EF] flex flex-col sm:flex-row gap-4 sm:gap-6 items-start transition-colors hover:border-[#2F6FED]/40"
                >
                  <div className="bg-[#2F6FED]/10 text-[#2F6FED] border border-[#2F6FED]/30 px-4 py-2.5 rounded-xl text-center min-w-[70px] shrink-0 self-start">
                    <small className="text-[10px] sm:text-xs block uppercase font-bold tracking-wider text-[#2F6FED]">
                      DAY
                    </small>
                    <b className="text-xl sm:text-2xl font-heading font-bold leading-none block mt-0.5">
                      {String(day.day).padStart(2, '0')}
                    </b>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-[#071B3A] mb-2 break-words">
                      {day.title}
                    </h3>
                    <p className="text-[#102C52] text-xs sm:text-sm md:text-base leading-relaxed font-body">
                      {day.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
