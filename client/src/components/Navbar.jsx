import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Compass,
  Sparkles,
  ChevronDown,
  Globe,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [member, setMember] = useState(null);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('shlloka_member_token');
    const stored = localStorage.getItem('shlloka_member_user');
    if (token && stored) {
      try {
        setMember(JSON.parse(stored));
      } catch (e) {
        setMember(null);
      }
    } else {
      setMember(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('shlloka_member_token');
    localStorage.removeItem('shlloka_member_user');
    setMember(null);
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.kailashMansarovar', 'Kailash Mansarovar'), path: '/kailash-mansarovar' },
    { name: t('nav.travelRoutes', 'Travel Routes'), path: '/routes' },
    { name: t('nav.journeyExperience', 'Journey Experience'), path: '/itinerary' },
    { name: t('nav.aboutUs', 'About Us'), path: '/about' },
    { name: t('nav.contact', 'Contact'), path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300">
      {/* Top Utility Navigation Strip (MMT Style) */}
      <div className="bg-[#101D35] text-white text-xs sm:text-[13px] py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden md:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between font-sans">
          {/* Left: Verified Helpline & Email */}
          <div className="flex items-center gap-6">
            <a
              href="tel:+916366852888"
              className="flex items-center gap-1.5 text-white hover:text-[#D9A441] transition-colors cursor-pointer"
            >
              <Phone size={14} className="text-[#D9A441]" />
              <span className="font-semibold tracking-wide text-white">24/7 Helpline: +91 6366852888</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href="mailto:volunteers@shlloka.com"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#D9A441] transition-colors cursor-pointer"
            >
              <Mail size={14} className="text-[#6FA8B2]" />
              <span className="text-white">volunteers@shlloka.com</span>
            </a>
          </div>

          {/* Right: Language, My Bookings & Account */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-0.5 text-xs text-white">
              <Globe size={13} className="text-[#D9A441]" />
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`font-semibold cursor-pointer ${
                  language === 'EN' ? 'text-[#D9A441]' : 'text-white hover:text-amber-200'
                }`}
              >
                EN
              </button>
              <span className="text-white/40">/</span>
              <button
                type="button"
                onClick={() => setLanguage('HI')}
                className={`font-semibold cursor-pointer ${
                  language === 'HI' ? 'text-[#D9A441]' : 'text-white hover:text-amber-200'
                }`}
              >
                हिं
              </button>
            </div>

            <span className="text-white/40">|</span>

            {/* Quick Links */}
            <Link
              to="/departures"
              className="flex items-center gap-1 text-white hover:text-[#D9A441] transition-colors text-xs sm:text-[13px]"
            >
              <Calendar size={13} className="text-amber-400" />
              <span className="text-white">{t('common.batches2027', '2027 Batches')}</span>
            </Link>

            <span className="text-white/40">|</span>

            {member ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-1 text-[#D9A441] font-semibold hover:underline"
                >
                  <User size={13} />
                  <span>{member.name?.split(' ')[0] || t('common.myAccount', 'My Account')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-white/70 hover:text-rose-400 transition-colors ml-1"
                  title={t('common.logout', 'Logout')}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-white hover:text-[#D9A441] transition-colors"
              >
                <User size={13} className="text-[#D9A441]" />
                <span className="text-white">{t('common.devoteeLogin', 'Devotee Login')}</span>
              </Link>
            )}

            <span className="text-white/40">|</span>
            <Link
              to="/admin/login"
              className="text-white/90 hover:text-white text-xs sm:text-[13px] tracking-wide"
            >
              {t('common.adminPortal', 'Admin Portal')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 sm:py-3 border-b border-slate-200'
            : 'bg-[#101D35]/95 backdrop-blur-sm py-2.5 sm:py-3.5 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Left: Brand Identity Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 max-w-[calc(100%-52px)] sm:max-w-none">
            {/* Sacred Mountain Crest Icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1C3455] via-[#101D35] to-[#D9A441] p-[2px] shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-[#101D35] rounded-[6px] flex items-center justify-center">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#D9A441]" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span
                className={`font-heading text-base sm:text-xl font-bold tracking-tight leading-none truncate ${
                  isScrolled ? 'text-[#101D35]' : 'text-white'
                }`}
              >
                SHLOKA YATRA
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#D9A441] mt-0.5 font-sans truncate">
                {t('common.kailashYatra', 'Kailash Mansarovar 2027')}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-md text-[15px] font-medium font-sans transition-all ${
                    isScrolled
                      ? isActive
                        ? 'text-[#101D35] font-semibold bg-slate-100'
                        : 'text-slate-700 hover:text-[#101D35] hover:bg-slate-50'
                      : isActive
                      ? 'text-[#D9A441] font-semibold bg-white/10'
                      : 'text-white hover:text-[#D9A441] hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions (Become Member & Book Now) */}
          <div className="hidden lg:flex items-center gap-3 font-sans">
            <Link
              to="/membership/register"
              className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${
                isScrolled
                  ? 'border-slate-300 text-slate-700 hover:border-[#101D35] hover:text-[#101D35]'
                  : 'border-white/30 text-white hover:border-[#D9A441] hover:text-[#D9A441]'
              }`}
            >
              {t('common.becomeMember', 'Become a Member')}
            </Link>

            <Link
              to="/book"
              className="bg-[#D9A441] hover:bg-[#C89432] text-[#101D35] font-bold text-sm uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {t('common.bookNow', 'Book Now 2027')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-lg lg:hidden transition-colors shrink-0 ml-auto flex items-center justify-center min-w-[44px] min-h-[44px] ${
              isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 sm:px-6 py-5 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto animate-fadeIn">
            {/* Mobile Language Switcher Row */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} className="text-[#D9A441]" />
                Language / भाषा:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all min-h-[36px] ${
                    language === 'EN' ? 'bg-[#101D35] text-[#D9A441]' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('HI')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all min-h-[36px] ${
                    language === 'HI' ? 'bg-[#101D35] text-[#D9A441]' : 'text-slate-600'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 font-sans">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center min-h-[44px] ${
                      isActive
                        ? 'bg-slate-100 text-[#101D35] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#101D35]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <hr className="my-2 border-slate-100" />

              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  to="/membership/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-3 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 min-h-[44px] flex items-center justify-center"
                >
                  {t('common.becomeMember', 'Become a Member')}
                </Link>

                <Link
                  to="/book"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-3.5 rounded-lg bg-gradient-to-r from-[#D9A441] to-[#E5B558] text-[#101D35] text-sm font-bold shadow min-h-[44px] flex items-center justify-center uppercase tracking-wider"
                >
                  {t('common.bookNow', 'Book Now 2027')}
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
                  <a href="tel:+916366852888" className="flex items-center gap-1.5 text-slate-700 font-semibold py-1">
                    <Phone size={13} className="text-[#D9A441]" />
                    <span>+91 6366852888</span>
                  </a>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-[#1C3F70] font-bold py-1"
                  >
                    {t('common.devoteeLogin', 'Devotee Login')} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
