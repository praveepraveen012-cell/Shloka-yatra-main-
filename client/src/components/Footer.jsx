


import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CONTRACT_METADATA } from '../data/legalData';

export default function Footer() {
  const { language, t } = useLanguage();
  return (
    <footer className="bg-[#101D35] text-[#F7F6F2] w-full relative overflow-hidden font-sans">
      {/* Saffron & Teal Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#D9A441] via-[#1C3455] to-[#6FA8B2]" />

      {/* Main Footer Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Col 1: Brand & Sacred Mission */}
          <div>
            <Link to="/" className="flex items-center gap-3 text-white mb-5 group">
              <span className="text-4xl text-[#D9A441] leading-none">ॐ</span>
              <div>
                <b className="block font-heading text-xl font-bold tracking-wider text-white">
                  SHLOKA YATRA
                </b>
                <small className="block text-[11px] font-bold tracking-widest text-[#D9A441] uppercase">
                  {language === 'HI' ? 'पवित्र हिमालयी यात्रा २०२७' : 'SACRED HIMALAYAN EXPEDITIONS 2027'}
                </small>
              </div>
            </Link>

            <p className="text-sm sm:text-[15px] leading-relaxed text-[#D3DDEB] mb-5">
              {t('footer.mission')}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#D9A441]/15 border border-[#D9A441]/35 text-[#D9A441] text-xs font-semibold">
              <Sparkles size={14} />
              <span>{t('footer.regOpen')}</span>
            </div>
          </div>

          {/* Col 2: Pilgrimage Travel Routes */}
          <div>
            <h4 className="text-white text-base font-bold tracking-wider uppercase mb-5 font-sans">
              {t('footer.packagesTitle')}
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm sm:text-[15px]">
              <li>
                <Link to="/routes/bus-both-ways" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.p1Link')}
                </Link>
              </li>
              <li>
                <Link to="/routes/flight-to-lhasa" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.p2Link')}
                </Link>
              </li>
              <li>
                <Link to="/routes/lhasa-ali-pulan" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.p3Link')}
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-[#D9A441] font-semibold flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                  <span>{t('footer.compareLink')}</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
              <li>
                <Link to="/departures" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.departuresLink')}
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.itinerariesLink')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Journey Planning & Preparation */}
          <div>
            <h4 className="text-white text-base font-bold tracking-wider uppercase mb-5 font-sans">
              {t('footer.prepTitle')}
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm sm:text-[15px]">
              <li>
                <Link to="/about" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.aboutLink')}
                </Link>
              </li>
              <li>
                <Link to="/kailash-mansarovar" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.kailashLink')}
                </Link>
              </li>
              <li>
                <Link to="/preparation-safety" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.safetyLink')}
                </Link>
              </li>
              <li>
                <Link to="/inclusions-exclusions" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.inclusionsLink')}
                </Link>
              </li>
              <li>
                <Link to="/departures" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.batchesLink')}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-[#D3DDEB] hover:text-[#D9A441] transition-colors">
                  {t('footer.faqsLink')}
                </Link>
              </li>
              <li>
                <Link to="/membership/register" className="text-[#D9A441] font-semibold hover:text-amber-300 transition-colors">
                  {t('footer.memberLink')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Support */}
          <div>
            <h4 className="text-white text-base font-bold tracking-wider uppercase mb-5 font-sans">
              {t('footer.contactTitle')}
            </h4>

            <div className="flex flex-col gap-3.5 text-sm sm:text-[15px]">
              <div className="flex gap-2.5 items-start">
                <Phone size={18} className="text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <small className="block text-xs text-[#D9A441] uppercase font-semibold">{t('footer.helplineLabel')}</small>
                  <a href={`tel:${CONTRACT_METADATA.officialPhone}`} className="text-white font-semibold hover:text-[#D9A441] transition-colors">
                    {CONTRACT_METADATA.officialPhone}
                  </a>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Mail size={18} className="text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <small className="block text-xs text-[#D9A441] uppercase font-semibold">{t('footer.emailLabel')}</small>
                  <a href={`mailto:${CONTRACT_METADATA.officialEmail}`} className="text-white hover:text-[#D9A441] transition-colors">
                    {CONTRACT_METADATA.officialEmail}
                  </a>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <MapPin size={18} className="text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <small className="block text-xs text-[#D9A441] uppercase font-semibold">{t('footer.officeLabel')}</small>
                  <span className="text-[#D3DDEB] leading-relaxed text-xs sm:text-sm">
                    {t('footer.officeAddress')}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-xs text-[#8CA8CC]">
                {t('footer.grievanceLabel')}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Regulatory Advisory Strip */}
        <div className="border-t border-white/10 py-5 text-xs text-[#8CA8CC] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <span className="text-[#D9A441] font-bold shrink-0 uppercase tracking-wide">
            {language === 'HI' ? 'नियामक सूचना:' : 'Regulatory Advisory:'}
          </span>
          <p className="m-0">
            {language === 'HI'
              ? 'इस पोर्टल पर प्रदर्शित दरें सांकेतिक हैं; भुगतान से पूर्व विस्तृत औपचारिक कोटेशन जारी किया जाता है। परमिट और वीजा संबंधित संप्रभु सरकारी प्राधिकारियों के निर्णयाधीन हैं।'
              : 'All prices shown on this platform are indicative; an itemised quotation is issued prior to payment. The company does not represent or guarantee permits, visas, or entry approvals which remain under the sovereign jurisdiction of competent government authorities.'}
          </p>
        </div>

        {/* Legal Links Bar */}
        <div className="border-t border-white/10 py-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#8CA8CC]">
          <span className="text-[#D9A441] font-semibold">{language === 'HI' ? t('footer.contractualRefs') : 'Contractual References (2027):'}</span>
          <Link to="/terms" className="text-[#D3DDEB] hover:text-white transition-colors">{language === 'HI' ? t('footer.termsLink') : 'Terms & Conditions'}</Link>
          <Link to="/cancellation-policy" className="text-[#D3DDEB] hover:text-white transition-colors">{language === 'HI' ? t('footer.cancellationLink') : 'Cancellation & Refund Policy'}</Link>
          <Link to="/risk-acknowledgement" className="text-[#D3DDEB] hover:text-white transition-colors">{language === 'HI' ? t('footer.riskLink') : 'High-Altitude Risk Acknowledgement'}</Link>
          <Link to="/service-schedule" className="text-[#D3DDEB] hover:text-white transition-colors">{language === 'HI' ? t('footer.serviceScheduleLink') : 'Service Schedule (Annex A)'}</Link>
          <Link to="/privacy-policy" className="text-[#D3DDEB] hover:text-white transition-colors">{language === 'HI' ? t('footer.privacyLink') : 'Privacy Notice'}</Link>
          <Link to="/admin/login" className="text-[#D9A441] ml-auto hover:text-amber-300 transition-colors">{t('footer.adminPortalLink') || 'Admin Panel'}</Link>
        </div>

        {/* Bottom Copyright & Grexotix Strip */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4 text-sm text-[#8CA8CC]">
          <div>
            {language === 'HI' ? t('footer.allRights') : '© 2027 Shloka Yatra Private Limited. All rights reserved.'}
          </div>

          <div className="inline-flex items-center gap-1.5">
            <span className="text-[#8CA8CC]">Powered by</span>
            <a
              href="https://grexotix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D9A441] hover:text-white font-semibold inline-flex items-center gap-1 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#D9A441] rounded px-0.5"
            >
              <span>Grexotix</span>
              <ArrowRight size={13} className="text-current" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
