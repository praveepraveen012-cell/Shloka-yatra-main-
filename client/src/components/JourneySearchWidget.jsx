import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  Calendar,
  Users,
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Plane,
  Bus,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import api from '../services/api';

const DEFAULT_ROUTES = [
  {
    id: 'option-1',
    routeNumber: 1,
    code: 'bus-both-ways',
    name: 'Package 1: Classic Overland via Kerung (14 Days / 13 Nights)',
    shortName: 'Overland Drive via Kyirong Border',
    duration: '14 Days / 13 Nights',
    transport: 'Overland Luxury AC Tourist Coach',
    startingPrice: 350000,
    nriPrice: 425000,
    acclimatization: 'Gradual Road Ascent (Best for Seniors)',
    badge: 'MOST POPULAR · 14 DAYS',
    origin: 'Kathmandu, Nepal',
    destination: 'Mount Kailash & Lake Mansarovar',
  },
  {
    id: 'option-2',
    routeNumber: 2,
    code: 'flight-to-lhasa',
    name: 'Package 2: Fly to Lhasa, Continue by Road (10 Days / 9 Nights)',
    shortName: 'Scenic Lhasa Flight + Overland Drive',
    duration: '10 Days / 9 Nights',
    transport: 'Commercial Airline + AC Coach',
    startingPrice: 437000,
    nriPrice: 515000,
    acclimatization: 'Flight to 3,650m (Potala Palace Tour)',
    badge: 'CULTURAL HERITAGE · 10 DAYS',
    origin: 'Kathmandu / Chengdu',
    destination: 'Lhasa → Mansarovar → Kailash',
  },
  {
    id: 'option-3',
    routeNumber: 3,
    code: 'lhasa-ali-pulan',
    name: 'Package 3: Fly to Lhasa & Fly to Ali/Pulan (9 Days / 8 Nights)',
    shortName: 'VIP Twin Flights to Ali (Fastest Route)',
    duration: '9 Days / 8 Nights',
    transport: 'Twin Domestic Flights + VIP Land Cruisers',
    startingPrice: 494000,
    nriPrice: 585000,
    acclimatization: 'Rapid VIP Flight (Requires Fitness)',
    badge: 'VIP FASTEST · 9 DAYS',
    origin: 'Lhasa / Chengdu',
    destination: 'Ngari Gunsa (Ali) → Darchen Base',
  },
];

const DEFAULT_DEPARTURES = [
  {
    id: 'batch-1',
    batchNumber: 1,
    startDate: '2027-05-18',
    endDate: '2027-05-31',
    name: 'Batch 1: 18 May – 31 May 2027',
    displayDate: '18 May 2027',
    isFullMoon: true,
    fullMoonDate: '20 May 2027 (Buddha Purnima)',
    availableSeats: 8,
    totalCapacity: 35,
    status: 'AVAILABLE',
  },
  {
    id: 'batch-2',
    batchNumber: 2,
    startDate: '2027-06-03',
    endDate: '2027-06-16',
    name: 'Batch 2: 03 Jun – 16 Jun 2027',
    displayDate: '03 Jun 2027',
    isFullMoon: false,
    fullMoonDate: null,
    availableSeats: 14,
    totalCapacity: 35,
    status: 'AVAILABLE',
  },
  {
    id: 'batch-3',
    batchNumber: 3,
    startDate: '2027-06-17',
    endDate: '2027-06-30',
    name: 'Batch 3: 17 Jun – 30 Jun 2027',
    displayDate: '17 Jun 2027',
    isFullMoon: true,
    fullMoonDate: '19 Jun 2027 (Jyeshtha Purnima)',
    availableSeats: 4,
    totalCapacity: 35,
    status: 'FAST_FILLING',
  },
  {
    id: 'batch-4',
    batchNumber: 4,
    startDate: '2027-07-02',
    endDate: '2027-07-15',
    name: 'Batch 4: 02 Jul – 15 Jul 2027',
    displayDate: '02 Jul 2027',
    isFullMoon: false,
    fullMoonDate: null,
    availableSeats: 19,
    totalCapacity: 35,
    status: 'AVAILABLE',
  },
  {
    id: 'batch-5',
    batchNumber: 5,
    startDate: '2027-07-16',
    endDate: '2027-07-29',
    name: 'Batch 5: 16 Jul – 29 Jul 2027',
    displayDate: '16 Jul 2027',
    isFullMoon: true,
    fullMoonDate: '18 Jul 2027 (Guru Purnima)',
    availableSeats: 6,
    totalCapacity: 35,
    status: 'FAST_FILLING',
  },
  {
    id: 'batch-6',
    batchNumber: 6,
    startDate: '2027-08-01',
    endDate: '2027-08-14',
    name: 'Batch 6: 01 Aug – 14 Aug 2027',
    displayDate: '01 Aug 2027',
    isFullMoon: false,
    fullMoonDate: null,
    availableSeats: 22,
    totalCapacity: 35,
    status: 'AVAILABLE',
  },
  {
    id: 'batch-7',
    batchNumber: 7,
    startDate: '2027-08-15',
    endDate: '2027-08-28',
    name: 'Batch 7: 15 Aug – 28 Aug 2027',
    displayDate: '15 Aug 2027',
    isFullMoon: true,
    fullMoonDate: '17 Aug 2027 (Raksha Bandhan Purnima)',
    availableSeats: 5,
    totalCapacity: 35,
    status: 'FAST_FILLING',
  },
  {
    id: 'batch-8',
    batchNumber: 8,
    startDate: '2027-09-01',
    endDate: '2027-09-14',
    name: 'Batch 8: 01 Sep – 14 Sep 2027',
    displayDate: '01 Sep 2027',
    isFullMoon: true,
    fullMoonDate: '15 Sep 2027 (Bhadrapada Purnima)',
    availableSeats: 11,
    totalCapacity: 35,
    status: 'AVAILABLE',
  },
];

export default function JourneySearchWidget() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const resultsRef = useRef(null);

  // Active Category Tab (MakeMyTrip Style)
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL'); // 'ALL', 'BUS', 'LHASA_ROAD', 'LHASA_ALI', 'ASSIST'

  // Form State
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [departures, setDepartures] = useState(DEFAULT_DEPARTURES);
  const [selectedRouteId, setSelectedRouteId] = useState('all'); // 'all', 'option-1', 'option-2', 'option-3'
  const [selectedBatchId, setSelectedBatchId] = useState(DEFAULT_DEPARTURES[0].id);
  const [passportType, setPassportType] = useState('INDIAN'); // 'INDIAN' | 'FOREIGN_NRI'

  // Travellers Popover State
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [adultsCount, setAdultsCount] = useState(2);
  const [seniorsCount, setSeniorsCount] = useState(0);
  const [singleSupplement, setSingleSupplement] = useState(false);

  // Instant Assistance Callback Form State
  const [assistName, setAssistName] = useState('');
  const [assistPhone, setAssistPhone] = useState('');
  const [assistMonth, setAssistMonth] = useState('May 2027');
  const [assistSubmitted, setAssistSubmitted] = useState(false);
  const [assistLoading, setAssistLoading] = useState(false);

  // Search Results & Loading
  const [isSearching, setIsSearching] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [showResultsPreview, setShowResultsPreview] = useState(true);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const [rRes, dRes] = await Promise.all([api.getRoutes(), api.getDepartures()]);
        if (rRes?.routes?.length > 0) {
          // Merge API data with rich details
          const mergedRoutes = DEFAULT_ROUTES.map((dr) => {
            const match = rRes.routes.find((r) => r.routeNumber === dr.routeNumber || r.id === dr.id || r.code === dr.code);
            if (match) {
              return {
                ...dr,
                id: match.id || dr.id,
                name: match.name || dr.name,
                startingPrice: match.startingFromInr || dr.startingPrice,
              };
            }
            return dr;
          });
          setRoutes(mergedRoutes);
        }
        if (dRes?.departures?.length > 0) {
          const mergedBatches = dRes.departures.map((db, i) => {
            return {
              id: db.id,
              batchNumber: db.batchNumber || i + 1,
              name: db.name || `Batch ${i + 1}`,
              displayDate: db.startDate ? new Date(db.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '2027',
              isFullMoon: !!db.isFullMoon,
              fullMoonDate: db.fullMoonDate || (db.isFullMoon ? 'Full Moon Special Darshan' : null),
              availableSeats: db.availableSeats ?? 12,
              totalCapacity: db.totalCapacity ?? 35,
              status: db.availableSeats < 6 ? 'FAST_FILLING' : 'AVAILABLE',
            };
          });
          setDepartures(mergedBatches);
          if (mergedBatches[0]) {
            setSelectedBatchId(mergedBatches[0].id);
          }
        }
      } catch (err) {
        // Fallbacks already in state
      }
    }
    loadBackendData();
  }, []);

  // Update selected route when category tab switches
  const handleCategorySwitch = (tabKey) => {
    setActiveCategoryTab(tabKey);
    if (tabKey === 'ALL') {
      setSelectedRouteId('all');
    } else if (tabKey === 'BUS') {
      setSelectedRouteId(routes[0]?.id || 'option-1');
    } else if (tabKey === 'LHASA_ROAD') {
      setSelectedRouteId(routes[1]?.id || 'option-2');
    } else if (tabKey === 'LHASA_ALI') {
      setSelectedRouteId(routes[2]?.id || 'option-3');
    }
  };

  // Update category tab when route dropdown changes
  const handleRouteSelect = (routeId) => {
    setSelectedRouteId(routeId);
    if (routeId === 'all') {
      setActiveCategoryTab('ALL');
    } else {
      const match = routes.find((r) => r.id === routeId);
      if (match?.routeNumber === 1) setActiveCategoryTab('BUS');
      else if (match?.routeNumber === 2) setActiveCategoryTab('LHASA_ROAD');
      else if (match?.routeNumber === 3) setActiveCategoryTab('LHASA_ALI');
    }
  };

  const currentBatch = departures.find((d) => d.id === selectedBatchId) || departures[0];
  const totalDevotees = adultsCount + seniorsCount;

  // Filter routes to display
  const displayedRoutes =
    selectedRouteId === 'all' || activeCategoryTab === 'ALL'
      ? routes
      : [routes.find((r) => r.id === selectedRouteId) || routes[0]];

  const handleSearchClick = () => {
    setIsSearching(true);
    setSearchExecuted(true);
    setShowResultsPreview(true);
    setTimeout(() => {
      setIsSearching(false);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 280);
  };

  const handleProceedBooking = (routeIdToBook) => {
    const routeId = routeIdToBook || (selectedRouteId !== 'all' ? selectedRouteId : routes[0]?.id || 'option-1');
    const selectedRouteObj = routes.find((r) => r.id === routeId) || routes[0];
    const query = new URLSearchParams({
      package: routeId,
      routeCode: selectedRouteObj?.code || '',
      batch: selectedBatchId || departures[0]?.id || '',
      passport: passportType,
      count: totalDevotees.toString(),
      adults: adultsCount.toString(),
      seniors: seniorsCount.toString(),
      singleRoom: singleSupplement ? 'true' : 'false',
    });
    navigate(`/book?${query.toString()}`);
  };

  const handleAssistSubmit = async (e) => {
    e.preventDefault();
    if (!assistPhone || assistPhone.length < 10) return;
    setAssistLoading(true);
    try {
      await api.submitEnquiry({
        name: assistName || 'Devotee Guest',
        email: 'callback@shlloka.com',
        phone: assistPhone,
        routeInterest: routes.find((r) => r.id === selectedRouteId)?.name || 'Kailash Mansarovar 2027',
        preferredMonth: assistMonth,
        message: 'Requesting immediate callback for Kailash Mansarovar 2027 booking assistance.',
      });
      setAssistSubmitted(true);
    } catch (err) {
      setAssistSubmitted(true);
    } finally {
      setAssistLoading(false);
    }
  };

  return (
    <div className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Console Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Top MakeMyTrip Category Navigation Tabs */}
        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth bg-[#101D35] px-2 pt-2 border-b border-slate-200/20">
          <button
            type="button"
            onClick={() => handleCategorySwitch('ALL')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategoryTab === 'ALL'
                ? 'bg-white text-[#101D35] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass size={16} className={activeCategoryTab === 'ALL' ? 'text-[#D9A441]' : 'text-slate-400'} />
            <span>{t('search.allPackages')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('BUS')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategoryTab === 'BUS'
                ? 'bg-white text-[#101D35] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bus size={16} className={activeCategoryTab === 'BUS' ? 'text-[#D9A441]' : 'text-slate-400'} />
            <span>{t('search.package1Tab')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('LHASA_ROAD')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategoryTab === 'LHASA_ROAD'
                ? 'bg-white text-[#101D35] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Plane size={16} className={activeCategoryTab === 'LHASA_ROAD' ? 'text-[#D9A441]' : 'text-slate-400'} />
            <span>{t('search.package2Tab')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('LHASA_ALI')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategoryTab === 'LHASA_ALI'
                ? 'bg-white text-[#101D35] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles size={16} className={activeCategoryTab === 'LHASA_ALI' ? 'text-[#D9A441]' : 'text-slate-400'} />
            <span>{t('search.package3Tab')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('ASSIST')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ml-auto cursor-pointer ${
              activeCategoryTab === 'ASSIST'
                ? 'bg-white text-[#101D35] shadow-sm'
                : 'text-amber-300 hover:text-amber-100 hover:bg-white/10'
            }`}
          >
            <PhoneCall size={15} className="text-[#D9A441]" />
            <span>{t('search.assistTab')}</span>
          </button>
        </div>

        {/* Tab 1 to 4: MakeMyTrip Main Flight/Package Search Console */}
        {activeCategoryTab !== 'ASSIST' ? (
          <div className="p-4 sm:p-6 lg:p-7">
            {/* Upper Mini-Toolbar: Passport Type & Special Batch Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('search.passportCategory')}
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPassportType('INDIAN')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      passportType === 'INDIAN'
                        ? 'bg-[#101D35] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('search.indianPassport')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassportType('FOREIGN_NRI')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      passportType === 'FOREIGN_NRI'
                        ? 'bg-[#101D35] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t('search.nriPassport')}
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 text-xs sm:text-[13px]">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('search.batchesOpen')}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-3 py-1 rounded-md font-semibold border border-amber-200">
                  {t('search.fullMoonDarshan')}
                </span>
              </div>
            </div>

            {/* MakeMyTrip 4-Box Grid Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border border-slate-200 rounded-xl p-2 sm:p-2.5 bg-slate-50/70 font-sans">
              {/* Field 1: Route Selector */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-[#1C3455] transition-colors relative cursor-pointer group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{t('search.pilgrimageRoute')}</span>
                  <Compass size={14} className="text-[#1C3455]" />
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => handleRouteSelect(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-[#101D35] focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">
                    {language === 'HI' ? 'सभी यात्रा पैकेज (तीनों विकल्पों की तुलना)' : 'All Yatra Packages (Compare All 3)'}
                  </option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {language === 'HI'
                        ? `पैकेज ${r.routeNumber}: ${
                            r.routeNumber === 1
                              ? 'केरुंग मार्ग से स्थल यात्रा'
                              : r.routeNumber === 2
                              ? 'ल्हासा विमान एवं सड़क मार्ग'
                              : 'ल्हासा-अली वीआईपी सीधी उड़ान'
                          }`
                        : `Package ${r.routeNumber}: ${r.shortName.replace(/^Package \d+:\s*/, '')}`}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 truncate mt-1">
                  {selectedRouteId === 'all'
                    ? (language === 'HI' ? '३ आधिकारिक पैकेज उपलब्ध' : '3 Official 2027 Packages Available')
                    : (language === 'HI'
                        ? routes.find((r) => r.id === selectedRouteId)?.routeNumber === 1
                          ? '१४ दिन / १३ रात · डीलक्स बस'
                          : routes.find((r) => r.id === selectedRouteId)?.routeNumber === 2
                          ? '१० दिन / ९ रात · विमान व बस'
                          : '९ दिन / ८ रात · वीआईपी विमान'
                        : `${routes.find((r) => r.id === selectedRouteId)?.duration || '14 Days'} · ${routes.find((r) => r.id === selectedRouteId)?.transport?.split(' ')[0] || 'Overland'}`)}
                </div>
              </div>

              {/* Field 2: Departure Schedule / Batch Selector */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-[#1C3455] transition-colors relative cursor-pointer">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{t('search.departureSchedule')}</span>
                  <Calendar size={14} className="text-[#D9A441]" />
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full bg-transparent text-base font-bold text-[#101D35] focus:outline-none cursor-pointer truncate"
                >
                  {departures.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isFullMoon && !d.name.includes('Full Moon') ? (language === 'HI' ? '— पूर्णिमा' : '— Full Moon') : ''}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-amber-800 font-medium truncate mt-1 flex items-center gap-1.5">
                  {currentBatch?.isFullMoon ? (
                    <>
                      <span className="font-semibold">{t('common.fullMoonSpecial')}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-emerald-700 font-semibold">{currentBatch.availableSeats} {t('common.seatsLeft')}</span>
                    </>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      {currentBatch?.availableSeats} {t('common.seatsAvailable')}
                    </span>
                  )}
                </div>
              </div>

              {/* Field 3: Travellers & Accommodation Selector */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-[#1C3F70] transition-colors relative">
                <button
                  type="button"
                  onClick={() => setTravellersOpen(!travellersOpen)}
                  className="w-full text-left focus:outline-none cursor-pointer"
                >
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>{t('search.devoteesRoom')}</span>
                    <Users size={13} className="text-slate-500" />
                  </label>
                  <div className="text-sm font-bold text-[#101D35]">
                    {totalDevotees} {totalDevotees === 1 ? t('search.devoteeCountSingle') : t('search.devoteeCountPlural')}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">
                    {singleSupplement ? t('search.singleRoom') : t('search.twinSharing')}
                  </div>
                </button>

                {/* Popover Dropdown for Devotees */}
                {travellersOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-fadeIn min-w-[280px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{t('search.adultDevotees')}</div>
                        <div className="text-[10px] text-slate-500">{t('search.adultDesc')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{adultsCount}</span>
                        <button
                          type="button"
                          onClick={() => setAdultsCount(Math.min(10, adultsCount + 1))}
                          className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{t('search.seniorDevotees')}</div>
                        <div className="text-[10px] text-slate-500">{t('search.seniorDesc')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSeniorsCount(Math.max(0, seniorsCount - 1))}
                          className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{seniorsCount}</span>
                        <button
                          type="button"
                          onClick={() => setSeniorsCount(Math.min(5, seniorsCount + 1))}
                          className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="pt-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={singleSupplement}
                          onChange={(e) => setSingleSupplement(e.target.checked)}
                          className="rounded text-[#1C3F70]"
                        />
                        <span>{t('search.singleSupplementLabel')}</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTravellersOpen(false)}
                      className="w-full mt-3 py-1.5 bg-[#101D35] text-white text-xs font-bold rounded-lg hover:bg-[#183B68] cursor-pointer"
                    >
                      {t('search.done')}
                    </button>
                  </div>
                )}
              </div>

              {/* Field 4: MakeMyTrip Big Search Button */}
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-[#D9A441] via-[#E5B558] to-[#C89432] hover:opacity-95 text-[#101D35] font-black text-sm uppercase tracking-wider py-4 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
                >
                  <Search size={18} className={`text-[#101D35] transition-transform ${isSearching ? 'animate-spin' : 'group-hover:scale-110'}`} />
                  <span>{isSearching ? t('search.checkingSeats') : t('search.searchButton')}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Search Results & Package Cards Stack */}
            {showResultsPreview && (
              <div ref={resultsRef} id="search-results" className="mt-6 pt-5 border-t border-slate-100 animate-fadeIn scroll-mt-24">
                {/* Search Results Summary Header Bar */}
                <div className="bg-[#101D35] text-white rounded-xl p-4 sm:p-5 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md border border-[#D9A441]/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441]">
                        {t('search.searchResultsTitle')}
                      </span>
                      <span className="text-xs text-slate-300">
                        ({displayedRoutes.length} {displayedRoutes.length === 1 ? 'Package Available' : 'Packages Available'})
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{currentBatch?.name}</span>
                      <span className="text-slate-400">•</span>
                      <span>
                        {totalDevotees} {totalDevotees === 1 ? t('search.yatriSingle') : t('search.yatriPlural')} ({singleSupplement ? t('search.singleRoom') : t('search.twinSharing')})
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#D9A441]">
                        {passportType === 'INDIAN' ? t('search.indianPassport') : t('search.nriPassport')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {displayedRoutes.length < routes.length && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategoryTab('ALL');
                          setSelectedRouteId('all');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                      >
                        {language === 'HI' ? 'तीनों पैकेज देखें' : 'View All 3 Packages'}
                      </button>
                    )}
                    <span className="text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{t('search.instantConfirmation')}</span>
                    </span>
                  </div>
                </div>

                {/* Displayed Packages Stack */}
                <div className="space-y-4">
                  {displayedRoutes.map((route) => {
                    const basePrice = passportType === 'INDIAN' ? (route.startingPrice || 350000) : (route.nriPrice || 425000);
                    const roomSupplement = singleSupplement ? 45000 * totalDevotees : 0;
                    const totalCost = basePrice * totalDevotees + roomSupplement;
                    const isSelected = selectedRouteId === route.id;

                    return (
                      <div
                        key={route.id}
                        className={`bg-gradient-to-r from-slate-50 via-white to-amber-50/30 rounded-2xl p-5 sm:p-6 border transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                          isSelected ? 'border-[#D9A441] ring-2 ring-[#D9A441]/25' : 'border-slate-200'
                        }`}
                      >
                        {/* Left: Package Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#101D35] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {language === 'HI'
                                ? route.routeNumber === 1
                                  ? 'सर्वाधिक लोकप्रिय · १४ दिन'
                                  : route.routeNumber === 2
                                  ? 'सांस्कृतिक धरोहर · १० दिन'
                                  : 'वीआईपी द्रुतगामी · ९ दिन'
                                : route.badge}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={12} /> {t('common.confirmed2027')}
                            </span>
                            {currentBatch?.isFullMoon && (
                              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                                {language === 'HI'
                                  ? `पूर्णिमा: ${currentBatch.fullMoonDate || 'पूर्णिमा विशेष दर्शन'}`
                                  : `Full Moon: ${currentBatch.fullMoonDate}`}
                              </span>
                            )}
                            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                              {currentBatch?.availableSeats} {t('common.seatsLeft')}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-[#101D35]">
                            {language === 'HI'
                              ? route.routeNumber === 1
                                ? 'पैकेज १: केरुंग मार्ग से क्लासिक स्थल यात्रा (१४ दिन / १३ रात)'
                                : route.routeNumber === 2
                                ? 'पैकेज २: ल्हासा विमान यात्रा एवं सड़क मार्ग (१० दिन / ९ रात)'
                                : 'पैकेज ३: ल्हासा एवं अली/पुरंग सीधी उड़ान (९ दिन / ८ रात)'
                              : route.name.startsWith('Package')
                              ? route.name
                              : `Package ${route.routeNumber}: ${route.name}`}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                            <span>
                              <strong className="text-slate-700">{language === 'HI' ? 'बैच:' : 'Batch:'}</strong> {currentBatch?.name}
                            </span>
                            <span className="text-slate-400 select-none">•</span>
                            <span>
                              <strong className="text-slate-700">{language === 'HI' ? 'मार्ग:' : 'Route:'}</strong>{' '}
                              {language === 'HI' ? 'काठमांडू ➔ मानसरोवर ➔ कैलाश पर्वत' : `${route.origin} → ${route.destination}`}
                            </span>
                            <span className="text-slate-400 select-none">•</span>
                            <span>
                              <strong className="text-slate-700">{language === 'HI' ? 'पर्वतीय अनुकूलन:' : 'Acclimatization:'}</strong>{' '}
                              {language === 'HI' ? 'क्रमिक पर्वतीय अनुकूलन (वरिष्ठों हेतु सुरक्षित)' : route.acclimatization}
                            </span>
                          </div>

                          {/* Verified Inclusions Pills */}
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            <span className="text-[11px] bg-slate-50/80 border border-slate-200/90 px-2.5 py-0.5 rounded-md text-slate-700 font-medium tracking-tight">
                              {t('search.stayKathmandu')}
                            </span>
                            <span className="text-[11px] bg-slate-50/80 border border-slate-200/90 px-2.5 py-0.5 rounded-md text-slate-700 font-medium tracking-tight">
                              {t('search.tibetVisa')}
                            </span>
                            <span className="text-[11px] bg-slate-50/80 border border-slate-200/90 px-2.5 py-0.5 rounded-md text-slate-700 font-medium tracking-tight">
                              {t('search.sattvicMeals')}
                            </span>
                            <span className="text-[11px] bg-slate-50/80 border border-slate-200/90 px-2.5 py-0.5 rounded-md text-slate-700 font-medium tracking-tight">
                              {t('search.hyperbaricOxygen')}
                            </span>
                          </div>
                        </div>

                        {/* Right: Live Price & Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                          <div className="text-left lg:text-right">
                            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                              {t('search.previewStartingFrom')}
                            </div>
                            <div className="text-xl sm:text-2xl font-black text-[#101D35]">
                              ₹{basePrice.toLocaleString('en-IN')}
                              <span className="text-xs font-normal text-slate-500"> {t('common.perPerson')}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              + 5% GST · {t('search.totalFor')} {totalDevotees} {totalDevotees === 1 ? t('search.yatriSingle') : t('search.yatriPlural')}:{' '}
                              <strong className="text-[#101D35] font-black">₹{totalCost.toLocaleString('en-IN')}</strong>
                            </div>
                            {singleSupplement && (
                              <div className="text-[10px] text-amber-700 font-semibold">
                                {language === 'HI' ? 'एकल कक्ष पूरक शामिल' : 'Single Room Supplement Included'}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Link
                              to={`/itinerary?route=${route.code || route.id}`}
                              className="px-4 py-2.5 rounded-lg border border-[#1C3455]/30 hover:border-[#101D35] text-[#101D35] text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Eye size={13} />
                              <span>{t('search.viewItinerary')}</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleProceedBooking(route.id)}
                              className="bg-[#1C3F70] hover:bg-[#101D35] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-98"
                            >
                              <span>{t('search.bookThisPackage')}</span>
                              <ArrowRight size={14} className="text-[#D9A441]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Tab 5: Instant Booking Assistance & Callback Request */
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-amber-50/30">
            {assistSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-bold text-[#101D35]">
                  {t('search.callbackSuccessTitle')}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {t('search.callbackSuccessDesc')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAssistSubmitted(false);
                    setActiveCategoryTab('ALL');
                    setSelectedRouteId('all');
                  }}
                  className="mt-3 text-xs font-bold text-[#1C3F70] hover:underline cursor-pointer"
                >
                  {t('search.returnToSearch')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAssistSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[#101D35] text-[#D9A441] flex items-center justify-center">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#101D35]">
                      {t('search.callbackTitle')}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {t('search.callbackDesc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {t('search.fullName')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={assistName}
                      onChange={(e) => setAssistName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F70]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {t('search.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={assistPhone}
                      onChange={(e) => setAssistPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F70]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {t('search.preferredMonth')}
                    </label>
                    <select
                      value={assistMonth}
                      onChange={(e) => setAssistMonth(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F70]"
                    >
                      <option value="May 2027">May 2027 (Buddha Purnima)</option>
                      <option value="June 2027">June 2027 (Saga Dawa)</option>
                      <option value="July 2027">July 2027 (Guru Purnima)</option>
                      <option value="August 2027">August 2027 (Raksha Bandhan)</option>
                      <option value="September 2027">September 2027 (Clear Weather)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>{t('search.directCoordination')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={assistLoading}
                    className="bg-[#101D35] hover:bg-[#183B68] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow"
                  >
                    <Send size={14} className="text-[#D9A441]" />
                    <span>{assistLoading ? t('search.submitting') : t('search.requestCallback')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
