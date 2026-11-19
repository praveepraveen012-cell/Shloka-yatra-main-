import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Plane,
  Bus,
  ShieldCheck,
  Sparkles,
  MapPin,
  HeartPulse,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { assetUrl } from '../utils/assets';

export default function RouteCard({ route, isFeatured = false }) {
  const { language, t } = useLanguage();
  const isFlight = route.code !== 'bus-both-ways';
  const isLhasaAli = route.code === 'lhasa-ali-pulan';

  // Specific authentic landscape image mapping
  let cardImage = route.image;
  if (!cardImage || cardImage.includes('sy_img_026')) {
    if (route.routeNumber === 1) cardImage = '/assets/shlloka-yatra/images/sy_img_007.jpg';
    else if (route.routeNumber === 2) cardImage = '/assets/shlloka-yatra/images/sy_img_066.jpg';
    else cardImage = '/assets/shlloka-yatra/images/sy_img_037.jpg';
  }

  // Badges and milestones
  const badgeText =
    language === 'HI'
      ? route.routeNumber === 1
        ? 'सर्वाधिक लोकप्रिय · प्राकृतिक अनुकूलन'
        : route.routeNumber === 2
        ? 'सांस्कृतिक धरोहर एवं दृश्य संतुलन'
        : 'वीआईपी द्रुतगामी · न्यूनतम सड़क यात्रा'
      : route.badge ||
        (route.routeNumber === 1
          ? 'MOST POPULAR · GRADUAL ACCLIMATIZATION'
          : route.routeNumber === 2
          ? 'CULTURAL & SCENIC BALANCE'
          : 'FASTEST VIP PILGRIMAGE');

  const durationText =
    language === 'HI'
      ? route.routeNumber === 1
        ? '१४ दिन / १३ रात'
        : route.routeNumber === 2
        ? '१० दिन / ९ रात'
        : '९ दिन / ८ रात'
      : route.duration ||
        (route.routeNumber === 1
          ? '14 Days / 13 Nights'
          : route.routeNumber === 2
          ? '10 Days / 9 Nights'
          : '9 Days / 8 Nights');

  const startingPrice = route.startingFromInr || (route.routeNumber === 1 ? 350000 : route.routeNumber === 2 ? 437000 : 494000);

  const routeUrl =
    route.routeNumber === 1
      ? '/routes/bus-both-ways'
      : route.routeNumber === 2
      ? '/routes/flight-to-lhasa'
      : '/routes/lhasa-ali-pulan';

  const bookingUrl = `/book?package=${route.id || (route.routeNumber === 1 ? 'option-1-bus' : route.routeNumber === 2 ? 'option-2-flight-lhasa' : 'option-3-lhasa-ali')}`;

  const packageName =
    language === 'HI'
      ? route.routeNumber === 1
        ? 'पैकेज १: केरुंग मार्ग से क्लासिक स्थल यात्रा (१४ दिन / १३ रात)'
        : route.routeNumber === 2
        ? 'पैकेज २: ल्हासा विमान यात्रा एवं सड़क मार्ग (१० दिन / ९ रात)'
        : 'पैकेज ३: ल्हासा एवं अली/पुरंग सीधी उड़ान (९ दिन / ८ रात)'
      : route.name;

  const packageDescription =
    language === 'HI'
      ? route.routeNumber === 1
        ? 'काठमांडू से केरुंग सीमा पार करते हुए सागा और मानसरोवर से होकर दारचेन तक क्रमिक चढ़ाई। प्राकृतिक पर्वतीय अनुकूलन, वरिष्ठ नागरिकों की सुरक्षा एवं संपूर्ण आध्यात्मिक अनुभव हेतु सर्वश्रेष्ठ मार्ग।'
        : route.routeNumber === 2
        ? 'ल्हासा हेतु मनोरम हिमालयी उड़ान, पोटाला पैलेस व जोखांग मंदिर के दर्शन, तत्पश्चात शिगात्से व सागा होते हुए पवित्र कैलाश पर्वत तक डीलक्स वातानुकूलित कोच यात्रा।'
        : 'नगारी गुनसा हवाई अड्डे (अली) हेतु दोहरी घरेलू उड़ानों के साथ द्रुतगामी वीआईपी यात्रा, जिससे लंबी सड़क यात्रा घटकर दारचेन बेस कैंप तक मात्र २ घंटे की रह जाती है।'
      : route.description ||
        (route.routeNumber === 1
          ? 'The classic overland pilgrimage via Kyirong border offering the most thorough high-altitude acclimatization and spiritual transition into Tibet.'
          : route.routeNumber === 2
          ? 'Scenic Himalayan flight into Lhasa followed by private road journey through Yamdrok Lake, Shigatse, and Saga to holy Mount Kailash.'
          : 'Expedited VIP journey with direct flights into Ngari Gunsa Airport (Ali) reducing overland drive to just 2 hours to Darchen base camp.');

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col lg:flex-row items-stretch group max-w-full">
      {/* Left Column (42%): Balanced Landscape Photographic Showcase */}
      <div className="relative w-full lg:w-[42%] aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[290px] lg:max-h-[350px] overflow-hidden bg-slate-900 shrink-0">
        <img
          src={assetUrl(cardImage)}
          alt={packageName}
          className="w-full h-full object-cover object-mountain-focus object-[center_32%] group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="bg-[#101D35]/90 backdrop-blur-md text-[#D9A441] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-400/30">
            {badgeText}
          </span>

          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            {isFlight ? <Plane size={13} className="text-[#1C3F70]" /> : <Bus size={13} className="text-[#1C3F70]" />}
            <span>{language === 'HI' ? `पैकेज ${route.routeNumber}` : <>Package {route.routeNumber}</>}</span>
          </span>
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-0.5">
            <Clock size={13} />
            <span>{durationText}</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold truncate text-slate-100">
            {language === 'HI' ? 'काठमांडू ➔ पवित्र कैलाश पर्वत एवं मानसरोवर झील' : `${route.originCity || 'Kathmandu'} ➔ Mount Kailash & Lake Mansarovar`}
          </div>
        </div>
      </div>

      {/* Right Column (58%): Content, Inclusions, and Pricing */}
      <div className="w-full lg:w-[58%] p-5 sm:p-6 lg:p-6 flex flex-col justify-between gap-3 font-sans">
        <div>
          {/* Title & Category */}
          <div className="mb-2">
            <span className="text-xs font-bold text-[#1C3455] uppercase tracking-wider">
              {language === 'HI' ? `तीर्थ यात्रा पैकेज ${route.routeNumber}` : <>Yatra Package {route.routeNumber}</>}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#101D35] mt-0.5 leading-snug">
              {packageName}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {packageDescription}
          </p>

          {/* Key Milestones Tags */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <MapPin size={12} className="text-[#D9A441]" />
              <span>{t('packages.milestonesLabel', 'Route Milestones')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
              {route.routeNumber === 1 && (
                <>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'काठमांडू' : 'Kathmandu'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'केरुंग (२,८०० मी)' : 'Kyirong (2,800m)'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'सागा (४,४५० मी)' : 'Saga (4,450m)'}</span>
                  <span>➔</span>
                  <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-0.5 rounded">{language === 'HI' ? 'मानसरोवर झील' : 'Lake Mansarovar'}</span>
                  <span>➔</span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded">{language === 'HI' ? 'कैलाश परिक्रमा' : 'Kailash Parikrama'}</span>
                </>
              )}
              {route.routeNumber === 2 && (
                <>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'काठमांडू उड़ान' : 'Kathmandu Flight'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'ल्हासा (३,६५० मी)' : 'Lhasa (3,650m)'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'शिगात्से' : 'Shigatse'}</span>
                  <span>➔</span>
                  <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-0.5 rounded">{language === 'HI' ? 'मानसरोवर' : 'Mansarovar'}</span>
                  <span>➔</span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded">{language === 'HI' ? 'कैलाश परिक्रमा' : 'Kailash Parikrama'}</span>
                </>
              )}
              {route.routeNumber === 3 && (
                <>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'ल्हासा उड़ान' : 'Flight to Lhasa'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'अली सीधी उड़ान (४,२७४ मी)' : 'Twin Flight to Ali (4,274m)'}</span>
                  <span>➔</span>
                  <span className="bg-white px-2.5 py-0.5 rounded border border-slate-200">{language === 'HI' ? 'दारचेन' : 'Darchen'}</span>
                  <span>➔</span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded">{language === 'HI' ? 'कैलाश परिक्रमा' : 'Kailash Parikrama'}</span>
                </>
              )}
            </div>
          </div>

          {/* Key Inclusions Grid (Compact 2x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-700">
              <CheckCircle2 size={14} className="text-[#16845B] shrink-0" />
              <span>{t('packages.incl1')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-700">
              <CheckCircle2 size={14} className="text-[#16845B] shrink-0" />
              <span>{t('packages.incl2')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-700">
              <CheckCircle2 size={14} className="text-[#16845B] shrink-0" />
              <span>{t('packages.incl3')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-700">
              <CheckCircle2 size={14} className="text-[#16845B] shrink-0" />
              <span>{t('packages.incl4')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Price & Actions */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('common.startingFrom', 'All-Inclusive Starting From')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#101D35]">
                ₹{startingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">{t('common.perDevotee', '/ Devotee')}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {t('common.gstNote')}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <Link
              to={routeUrl}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:text-[#101D35] hover:border-[#101D35] text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap"
            >
              {t('common.viewDayByDay', 'View Day-by-Day')}
            </Link>

            <Link
              to={bookingUrl}
              className="flex-1 sm:flex-initial bg-[#D9A441] hover:bg-[#C89432] text-[#101D35] text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <span>{t('common.bookThisRoute', 'Book Package')}</span>
              <ArrowRight size={14} className="text-[#101D35]" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
