import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  CheckCircle2,
  Shield,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Check,
  ChevronDown,
  Plane,
  Bus,
  AlertCircle,
  Users,
  HeartHandshake,
  Activity,
  FileCheck,
  Award,
  Clock,
  ExternalLink,
  X,
  Maximize2,
  Camera,
} from 'lucide-react';
import assetUrl from '../utils/assets';
import { useLanguage } from '../context/LanguageContext';
import JourneySearchWidget from '../components/JourneySearchWidget';
import RouteCard from '../components/RouteCard';
import {
  heroImages,
  destinationImages,
  routeImages,
  experienceImages,
  imageManifest,
  getImagesByCategory,
} from '../data/imageManifest';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [activeFaqTab, setActiveFaqTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(0);

  // 5 Sacred Destinations for Interactive Discovery (Bilingual EN / HI)
  const sacredDestinations = [
    {
      id: 'kailash',
      name: language === 'HI' ? 'पवित्र कैलाश पर्वत (कांग रिनपोछे)' : 'Mount Kailash (Gang Rinpoche)',
      shortName: language === 'HI' ? 'कैलाश पर्वत' : 'Mount Kailash',
      subtitle: language === 'HI' ? 'भगवान शिव का शाश्वत पावन धाम एवं विश्व की धुरी' : 'Eternal Abode of Lord Shiva & Axis Mundi',
      elevation: '6,638 m',
      significance: language === 'HI' ? 'ब्रह्मांड का आध्यात्मिक केंद्र' : 'Spiritual Center of the Universe',
      image: destinationImages.kailashSouthFace.src,
      alt: 'Mount Kailash South Face Darshan',
      desc: language === 'HI'
        ? 'पश्चिमी तिब्बत के विस्तृत पठार पर स्थित यह अविजित श्याम शिला शिखर अलौकिक दिव्यता का प्रतीक है। सनातन धर्म में देवाधिदेव महादेव एवं माता पार्वती का पावन धाम, बौद्ध धर्म में कांग रिनपोछे, जैन धर्म में अष्टापद तीर्थ (जहां प्रथम तीर्थंकर ऋषभदेव को मोक्ष प्राप्त हुआ) एवं बोन परंपरा में युंगद्रुंग गुत्सेग के रूप में परम पूज्य।'
        : 'The unclimbed black rock peak rising in celestial majesty in Western Tibet. Revered across Hinduism as the holy abode of Lord Shiva and Mata Parvati, in Buddhism as Kang Rinpoche (Precious Jewel of Snow), in Jainism as Ashtapad where Rishabhadeva attained moksha, and in Bon as Yungdrung Gutseg.',
      rituals: language === 'HI'
        ? '५२ किमी परिक्रमा, उत्तरी मुख पर चरण स्पर्श, साष्टांग प्रणाम एवं शांति हवन'
        : 'Full 52-km Parikrama, Charan Sparsh at North Face, Holy Prostrations, Shanti Havan',
      cardDetail: language === 'HI'
        ? 'चार प्रमुख दिशाओं में सम्मुख इसके चारों दिव्य मुख उच्च तिब्बती पठार पर अद्भुत आध्यात्मिक आभा बिखेरते हैं।'
        : 'Four distinctive faces precisely aligned with cardinal directions, casting spiritual aura across the high plateau.',
    },
    {
      id: 'manasarovar',
      name: language === 'HI' ? 'पवित्र मानसरोवर झील (मापाम युमत्सो)' : 'Lake Manasarovar (Mapam Yumtso)',
      shortName: language === 'HI' ? 'मानसरोवर झील' : 'Lake Manasarovar',
      subtitle: language === 'HI' ? 'चेतना एवं आत्म-शुद्धि का पावन दिव्य सरोवर' : 'Lake of Consciousness & Purity',
      elevation: '4,590 m',
      significance: language === 'HI' ? 'ब्रह्मा जी के मानस संकल्प से उत्पन्न' : 'Born of Lord Brahma’s Mind',
      image: destinationImages.manasarovarShores.src,
      alt: 'Holy Lake Manasarovar Shoreline',
      desc: language === 'HI'
        ? 'सृष्टिकर्ता ब्रह्मा जी के मानस से प्रकट यह पवित्र सरोवर विश्व का सर्वाधिक ऊंचाई पर स्थित मीठे पानी का जलाशय है। इसके निर्मल नील जल में पावन स्नान तथा ब्रह्म मुहूर्त में तट पर रुद्राभिषेक व आरती करने से जन्म-जन्मांतर के संचित पापों का क्षय माना जाता है।'
        : 'Created in the mind of Lord Brahma, Lake Manasarovar is the highest freshwater body in the world. Taking a holy dip in its pure azure waters and performing morning aarti during Brahma Muhurta is believed to cleanse the accumulated karmas of 100 lifetimes.',
      rituals: language === 'HI'
        ? 'पवित्र स्नान, प्रातःकालीन रुद्राभिषेक पूजा, जल संकल्प एवं पावन जल संग्रह'
        : 'Holy Snan (Ritual Bathing), Dawn Rudrabhishek Puja, Jal Sankalp, Holy Water Collection',
      cardDetail: language === 'HI'
        ? 'उत्तर-पश्चिमी तट पर प्रतिष्ठित ऐतिहासिक चिउ गोम्पा मठ, जहां गुरु पद्मसंभव ने ध्यान साधना की थी।'
        : 'Chiu Gompa monastery crowns the northwest shoreline where Guru Padmasambhava meditated.',
    },
    {
      id: 'rakshastal',
      name: language === 'HI' ? 'राक्षस ताल (लांगा त्सो)' : 'Rakshas Tal (Langa Tso)',
      shortName: language === 'HI' ? 'राक्षस ताल' : 'Rakshas Tal',
      subtitle: language === 'HI' ? 'रावण की कठोर तपस्या एवं शिव अनुग्रह की स्थली' : 'Lake of Ravana & Severe Penance',
      elevation: '4,575 m',
      significance: language === 'HI' ? 'प्रचंड तपस्या एवं वैराग्य का प्रतीक' : 'Demon Lake of Intense Austerities',
      image: destinationImages.rakshasTal.src,
      alt: 'Rakshas Tal with Dramatic Mountain Backdrop',
      desc: language === 'HI'
        ? 'गहरे नील वर्ण का अर्धचंद्राकार सरोवर जो एक प्राकृतिक कटक द्वारा मानसरोवर से विभक्त है। पौराणिक मान्यतानुसार लंकापति रावण ने भगवान शिव को प्रसन्न करने हेतु यहां सहस्त्र वर्षों तक कठोर तपस्या कर अपने नौ शीश अर्पित किए थे।'
        : 'The dark-indigo, crescent-shaped lake separated from Manasarovar by a natural ridge. Legend tells that King Ravana performed thousand-year austerities here, offering nine of his heads to please Lord Shiva before receiving divine boons.',
      rituals: language === 'HI'
        ? 'शांत आत्म-चिंतन, फोटोग्राफी एवं विहंगम दृश्य दर्शन (स्नान शास्त्रतः वर्जित)'
        : 'Quiet Contemplation, Photography, Observing Dramatic Alpine Reflections (Bathing Prohibited)',
      cardDetail: language === 'HI'
        ? 'इसकी शांत, लहरदार सतह एवं एकांत परिवेश मानसरोवर के साथ एक गहरा आध्यात्मिक संतुलन प्रस्तुत करता है।'
        : 'Its still, wind-swept surface and absence of aquatic life provide a stark spiritual contrast to Manasarovar.',
    },
    {
      id: 'yamdwar',
      name: language === 'HI' ? 'यम द्वार (मुक्ति का पावन द्वार)' : 'Yam Dwar (Gateway of Salvation)',
      shortName: language === 'HI' ? 'यम द्वार' : 'Yam Dwar',
      subtitle: language === 'HI' ? 'तारबोछे स्थित पवित्र परिक्रमा प्रवेश द्वार' : 'The Sacred Gateway at Tarboche',
      elevation: '4,730 m',
      significance: language === 'HI' ? 'परिक्रमा का आधिकारिक आरंभिक बिंदु' : 'Departure Portal of the Parikrama',
      image: '/assets/shlloka-yatra/images/sy_img_019.jpg',
      alt: 'Yam Dwar Sacred Gateway at Tarboche',
      desc: language === 'HI'
        ? 'तारबोछे स्थित ऐतिहासिक द्वि-मंजिला पाषाण चोर्टेन। श्रद्धालु इसके पावन मेहराब से होकर गुजरते हैं और सांसारिक बंधनों व भय को त्याग कर श्री कैलाश पर्वत की ५२ किमी परिक्रमा के पवित्र मार्ग पर चरण धरते हैं।'
        : 'The ancient two-story stone chorten at Tarboche. Pilgrims pass through its sacred arches to leave behind mortality, worldly attachments, and karmic burdens before stepping onto the sacred circumambulation circuit around Mount Kailash.',
      rituals: language === 'HI'
        ? 'मेहराब से पावन गमन, चोर्टेन प्रदक्षिणा, पद-लाठी पूजन एवं शेरपा दल एकत्रीकरण'
        : 'Passing Through the Archway, Chorten Kora, Blessing of Walking Sticks, Sherpa Assembly',
      cardDetail: language === 'HI'
        ? '५२ किलोमीटर पावन कैलाश परिक्रमा का आधिकारिक प्रारंभ एवं संकल्प बिंदु।'
        : 'The official starting threshold of the 52-kilometer Kailash Parikrama.',
    },
    {
      id: 'dolmala',
      name: language === 'HI' ? 'डोलमा ला दर्रा एवं गौरी कुंड' : 'Dolma La Pass & Gauri Kund',
      shortName: language === 'HI' ? 'डोलमा ला दर्रा' : 'Dolma La Pass',
      subtitle: language === 'HI' ? 'तारा देवी का पावन दर्रा एवं माता पार्वती का सरोवर' : 'Pass of Goddess Tara & Emerald Tarn of Parvati',
      elevation: '5,630 m',
      significance: language === 'HI' ? 'परिक्रमा का सर्वोच्च आध्यात्मिक शिखर' : 'Spiritual Apex of the Circumambulation',
      image: '/assets/shlloka-yatra/images/sy_img_143.jpg',
      alt: 'Dolma La Pass with Prayer Flags at 5630m',
      desc: language === 'HI'
        ? '५,६३० मीटर (१८६०० फीट) की ऊंचाई पर स्थित डोलमा ला दर्रा इस यात्रा का सर्वोच्च बिंदु है। श्रद्धालु तिब्बती ध्वजाओं के मध्य तारा देवी व शिव स्तोत्र का पाठ करते हैं तथा नीचे हरित आभा से दमकते गौरी कुंड के दिव्य दर्शन करते हैं जहां माता पार्वती स्नान करती थीं।'
        : 'At 5,630 meters (18,600 feet), Dolma La represents the highest altitude milestone of the journey. Yatris offer prayers to Goddess Tara amidst fluttering Tibetan flags, and witness Gauri Kund—the emerald tarn where Goddess Parvati bathed.',
      rituals: language === 'HI'
        ? 'श्रद्धा ध्वज बंधन, पावन वस्त्र अर्पण, शिव स्तुति गान एवं दिव्य गौरी कुंड दर्शन'
        : 'Tying Devotional Prayer Flags, Offering Sacred Cloth, Chanting Shiva Stotram, Gauri Kund Darshan',
      cardDetail: language === 'HI'
        ? 'परिक्रमा के द्वितीय दिवस पर १:१ शेरपा सहयोग एवं निरंतर ऑक्सीजन के साथ पार किया जाता है।'
        : 'Crossed on Day 2 of Parikrama with dedicated 1:1 Sherpa care and portable oxygen.',
    },
  ];

  // Frequently Asked Questions (Bilingual EN / HI)
  const faqCategories = [
    { id: 'all', label: language === 'HI' ? 'सभी प्रश्न' : 'All Questions' },
    { id: 'booking', label: language === 'HI' ? 'पंजीकरण एवं बुकिंग' : 'Registration & Booking' },
    { id: 'routes', label: language === 'HI' ? 'मार्ग एवं परिवहन' : 'Routes & Transport' },
    { id: 'health', label: language === 'HI' ? 'स्वास्थ्य एवं तुंगता सुरक्षा' : 'Altitude & Health Safety' },
    { id: 'documents', label: language === 'HI' ? 'परमिट एवं वीज़ा' : 'Permits & Visas' },
  ];

  const faqs = [
    {
      cat: 'booking',
      q: language === 'HI' ? 'कैलाश मानसरोवर यात्रा २०२७ हेतु अग्रिम पंजीकरण क्यों अनिवार्य है?' : 'Why should I register for Kailash Yatra 2027 well in advance?',
      a: language === 'HI'
        ? 'तिब्बत पर्यटन ब्यूरो (TTB) एवं चीनी विदेश मंत्रालय द्वारा राष्ट्रीयता के आधार पर सख्त वार्षिक कोटा निर्धारित किया जाता है। परमिट प्रक्रिया, वीज़ा क्लियरेंस, समर्पित शेरपा दल एवं ल्हासा/अली की सीमित उड़ानों के आरक्षण हेतु कई माह पूर्व पंजीकरण कराना आवश्यक होता है।'
        : 'The Tibet Tourism Bureau (TTB) and Chinese foreign affairs authorities issue restricted group permits governed by strict annual nationality quotas. Registrations must be initiated months in advance to process paperwork, coordinate dedicated Sherpa and transport assets, and secure flight sectors into Lhasa or Ali.',
    },
    {
      cat: 'booking',
      q: language === 'HI' ? 'बुकिंग अग्रिम राशि और भुगतान की किश्तें क्या हैं?' : 'What is the booking advance and what are the payment milestones?',
      a: language === 'HI'
        ? 'बुकिंग ₹५०,००० प्रति व्यक्ति की अग्रिम पंजीकरण राशि के साथ सुनिश्चित की जाती है। द्वितीय चरण (कुल पैकेज का ५०%) प्रस्थान से ६० दिन पूर्व परमिट प्रक्रिया के समय देय होता है, तथा शेष राशि यात्रा प्रस्थान से ३० दिन पूर्व जमा करनी होती है।'
        : 'Bookings are confirmed with an initial registration deposit of ₹50,000 per person. The second milestone (50% of the package cost) is payable 60 days before departure upon permit submission, with the remaining balance due 30 days prior to travel.',
    },
    {
      cat: 'routes',
      q: language === 'HI' ? 'मेरे लिए कौन सा यात्रा पैकेज सबसे उपयुक्त रहेगा?' : 'Which travel route option is best suited for me?',
      a: language === 'HI'
        ? 'पैकेज १ (केरुंग बस मार्ग, १४ दिन) काठमांडू से क्रमिक सड़क चढ़ाई के कारण प्राकृतिक पर्वतीय अनुकूलन और वरिष्ठ नागरिकों हेतु श्रेष्ठ है। पैकेज २ (ल्हासा विमान, १० दिन) पोटाला पैलेस के दर्शन के साथ सड़क यात्रा को कम करता है। पैकेज ३ (ल्हासा-अली वीआईपी उड़ान, ९ दिन) व्यस्त श्रद्धालुओं एवं वरिष्ठों हेतु न्यूनतम सड़क यात्रा वाला द्रुतगामी विकल्प है।'
        : 'Package 1 (Overland Bus Both Ways, 14 Days) offers the most natural, gradual overland altitude acclimatisation from Kathmandu via Kerung. Package 2 (Fly to Lhasa, Drive to Kailash, 15 Days) adds cultural exploration of Lhasa’s Potala Palace while reducing overland transit. Package 3 (Fly to Lhasa & Ali, 11 Days) is the quickest option designed for busy executives and senior yatris seeking minimal road travel.',
    },
    {
      cat: 'health',
      q: language === 'HI' ? '५२ किमी कैलाश परिक्रमा हेतु शारीरिक स्वास्थ्य की क्या आवश्यकता है?' : 'What is the physical fitness requirement for the 52-km Kailash Parikrama?',
      a: language === 'HI'
        ? 'परिक्रमा के दौरान डोलमा ला दर्रे पर ऊंचाई ५,६३० मीटर (१८६०० फीट) तक पहुंचती है। हम यात्रा से ८-१२ सप्ताह पूर्व तेज चलना, सीढ़ियां चढ़ना एवं प्राणायाम का अभ्यास करने की सलाह देते हैं। प्रस्थान से पूर्व अधिकृत चिकित्सक द्वारा स्वास्थ्य फिटनेस प्रमाणपत्र अनिवार्य है।'
        : 'The Parikrama reaches 5,630 meters (18,600 ft) at Dolma La Pass. We recommend an 8- to 12-week cardiovascular conditioning regimen including brisk walking, stair climbing, and pranayama. A comprehensive medical fitness certificate is mandatory before departure.',
    },
    {
      cat: 'health',
      q: language === 'HI' ? 'श्लोका यात्रा मार्ग पर कौन से चिकित्सीय सुरक्षा उपकरण उपलब्ध कराती है?' : 'What medical safety equipment does Shloka Yatra provide on the trail?',
      a: language === 'HI'
        ? 'प्रत्येक समूह के साथ अनुभवी शेरपा दल पल्स ऑक्सीमीटर, आपातकालीन मेडिकल ऑक्सीजन सिलेंडर, गैमोव हाइपरबेरिक बैग एवं प्राथमिक चिकित्सा किट लेकर चलते हैं। प्रतिदिन सुबह एवं शाम प्रत्येक श्रद्धालु की SpO2 एवं पल्स की नियमित जांच दर्ज की जाती है।'
        : 'Every group is accompanied by experienced Sherpas carrying pulse oximeters, supplementary emergency medical oxygen cylinders, a Gamow hyperbaric bag, and high-altitude first aid kits. Daily morning and evening SpO2 and pulse readings are logged for each yatri.',
    },
    {
      cat: 'documents',
      q: language === 'HI' ? 'तिब्बत समूह वीज़ा एवं टीटीबी परमिट हेतु कौन से दस्तावेज आवश्यक हैं?' : 'What documents are required to obtain the Tibet Group Visa and TTB Permit?',
      a: language === 'HI'
        ? 'यात्रा समाप्ति से कम से कम ६ माह वैध मूल पासपोर्ट, ४ पासपोर्ट आकार के नवीनतम फोटो (सफेद पृष्ठभूमि, चश्मा रहित), अधिकृत चिकित्सक द्वारा हस्ताक्षरित फिटनेस प्रमाणपत्र, तथा श्लोका यात्रा का हस्ताक्षरित बुकिंग प्रपत्र आवश्यक है।'
        : 'You need an original passport with at least 6 months validity from the date of return, 4 recent passport-size photographs (white background, no spectacles), a medical fitness certificate signed by a registered physician, and the completed Shloka Yatra booking dossier with Annex B acceptance.',
    },
    {
      cat: 'documents',
      q: language === 'HI' ? 'क्या एनआरआई या विदेशी पासपोर्ट धारक श्लोका यात्रा में भाग ले सकते हैं?' : 'Can NRIs or Foreign Passport holders join Shloka Yatra departures?',
      a: language === 'HI'
        ? 'जी हां। हम भारतीय पासपोर्ट धारकों के साथ-साथ एनआरआई एवं विदेशी पासपोर्ट धारकों (अमेरिका, यूके, कनाडा, यूरोप, ऑस्ट्रेलिया आदि) का भी स्वागत करते हैं। विदेशी नियमों के अनुसार परमिट व वीज़ा का समन्वय हमारी समर्पित टीम द्वारा किया जाता है।'
        : 'Yes. We cater to Indian passport holders as well as Foreign / NRI passport holders (US, UK, Canadian, European, Australian, etc.). Permit fees and visa logistics differ slightly according to foreign affairs rules, and our concierge team coordinates the exact paperwork for your nationality.',
    },
  ];

  const filteredFaqs = activeFaqTab === 'all' ? faqs : faqs.filter((f) => f.cat === activeFaqTab);

  return (
    <div className="bg-[#F7F6F2] w-full overflow-x-hidden min-h-screen">
      {/* =========================================================================
          SECTION 2: NEW HERO EXPERIENCE (100% IMAGE-BASED — ZERO VIDEOS)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden text-white pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 lg:pb-28 min-h-[500px] lg:h-[560px] xl:h-[600px] flex items-center">
        {/* Master High-Res Mountain Banner Photograph with Dedicated Mountain Focus */}
        <img
          src={assetUrl(heroImages.mainHero.src)}
          alt={heroImages.mainHero.alt}
          className="absolute inset-0 w-full h-full object-cover object-mountain-focus object-[center_32%] z-0"
        />

        {/* Sophisticated Gradient Overlay: Deep Navy on Left for Text, Clear on Right to Focus Mountain */}
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-[#101D35]/95 via-[#101D35]/75 to-[#101D35]/20"
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-[#101D35]/80 via-transparent to-[#101D35]/30"
        />

        {/* Hero Content - Left Aligned Editorial Layout */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-left">
            {/* Clean Typographic Eyebrow */}
            <div className="text-[#D9A441] text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 font-sans">
              {t('hero.eyebrow')}
            </div>

            {/* Main Hero Editorial Heading in Montserrat */}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-4 sm:mb-5 drop-shadow-sm">
              {t('hero.title')}
            </h1>

            {/* Subtitle in Segoe UI */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#E3DFD5] max-w-2xl mb-6 sm:mb-8 font-normal font-sans">
              {t('hero.subtitle')}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#routes"
                className="bg-[#D9A441] hover:bg-[#C89432] text-[#101D35] font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-sans text-center"
              >
                <span>{t('hero.ctaExplore')}</span>
                <ArrowRight size={18} />
              </a>

              <a
                href="#search-packages"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl border border-white/40 hover:border-white transition-all backdrop-blur-sm flex items-center justify-center gap-2 font-sans cursor-pointer text-center"
              >
                <span>{t('hero.ctaSearch')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: JOURNEY SEARCH & BOOKING PANEL (LOCATED CLEANLY BELOW BANNER)
          ========================================================================= */}
      <section id="search-packages" className="relative z-20 w-full pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 bg-[#F7F6F2]">
        <JourneySearchWidget />
      </section>

      {/* =========================================================================
          SECTION 3B: PROMOTIONAL OFFERS & YATRA PRIVILEGES (MMT STYLE)
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto mb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441]">
              {t('privileges.eyebrow')}
            </span>
            <h3 className="text-2xl font-bold text-[#101D35] mt-0.5">
              {t('privileges.heading')}
            </h3>
          </div>
          <Link
            to="/packages"
            className="text-sm font-bold text-[#1C3455] hover:text-[#101D35] flex items-center gap-1"
          >
            <span>{t('privileges.viewAllInclusions')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Privilege Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold uppercase mb-3">
                {t('privileges.card1Tag')}
              </div>
              <h4 className="text-lg text-[#101D35] font-bold mb-2">
                {t('privileges.card1Title')}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t('privileges.card1Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-[#1C3455] font-bold">
              {t('privileges.card1Code')}
            </div>
          </div>

          {/* Privilege Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-[11px] font-bold uppercase mb-3">
                {t('privileges.card2Tag')}
              </div>
              <h4 className="text-lg text-[#101D35] font-bold mb-2">
                {t('privileges.card2Title')}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t('privileges.card2Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#1C3455] font-bold">
              {t('privileges.card2Code')}
            </div>
          </div>

          {/* Privilege Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-[11px] font-bold uppercase mb-3">
                {t('privileges.card3Tag')}
              </div>
              <h4 className="text-lg text-[#101D35] font-bold mb-2">
                {t('privileges.card3Title')}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t('privileges.card3Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#1C3455] font-bold">
              {t('privileges.card3Code')}
            </div>
          </div>

          {/* Privilege Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold uppercase mb-3">
                {t('privileges.card4Tag')}
              </div>
              <h4 className="text-lg text-[#101D35] font-bold mb-2">
                {t('privileges.card4Title')}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t('privileges.card4Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-800 font-bold">
              {t('privileges.card4Code')}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: EXPLORE YOUR PILGRIMAGE ROUTES (AUTHENTIC EXPEDITION IMAGES)
          ========================================================================= */}
      <section id="routes" className="max-w-[1440px] mx-auto mb-24 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-[780px] mx-auto mb-14">
          <span className="eyebrow">{t('routesSection.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101D35] mt-2.5 mb-4">
            {t('routesSection.heading')}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t('routesSection.subtitle')}
          </p>
        </div>

        {/* 3 Horizontal MakeMyTrip-Style Route Cards Stack */}
        <div className="flex flex-col gap-8">
          <RouteCard
            route={{
              id: 'option-1-bus',
              routeNumber: 1,
              name: language === 'HI' ? t('packages.p1Name') : 'Package 1: Overland Pilgrimage via Kerung (14 Days / 13 Nights)',
              code: 'bus-both-ways',
              duration: language === 'HI' ? '१४ दिन / १३ रात' : '14 Days / 13 Nights',
              description: t('packages.p1Desc'),
              startingFromInr: 350000,
              image: routeImages.option1_bus.src,
              originCity: language === 'HI' ? 'काठमांडू, नेपाल' : 'Kathmandu, Nepal',
              badge: t('packages.p1Badge'),
            }}
          />

          <RouteCard
            route={{
              id: 'option-2-flight-lhasa',
              routeNumber: 2,
              name: t('packages.p2Name'),
              code: 'flight-to-lhasa',
              duration: language === 'HI' ? '१० दिन / ९ रात' : '10 Days / 9 Nights',
              description: t('packages.p2Desc'),
              startingFromInr: 437000,
              image: routeImages.option2_lhasa.src,
              originCity: language === 'HI' ? 'काठमांडू / चेंगदू' : 'Kathmandu / Chengdu',
              badge: t('packages.p2Badge'),
            }}
          />

          <RouteCard
            route={{
              id: 'option-3-lhasa-ali',
              routeNumber: 3,
              name: t('packages.p3Name'),
              code: 'lhasa-ali-pulan',
              duration: language === 'HI' ? '९ दिन / ८ रात' : '9 Days / 8 Nights',
              description: t('packages.p3Desc'),
              startingFromInr: 494000,
              image: routeImages.option3_ali.src,
              originCity: language === 'HI' ? 'काठमांडू / ल्हासा' : 'Kathmandu / Lhasa',
              badge: t('packages.p3Badge'),
            }}
          />
        </div>

        {/* View All Routes Compare Link */}
        <div className="text-center mt-10">
          <Link
            to="/routes"
            className="inline-flex items-center gap-2 font-semibold text-[#1C3455] hover:text-[#101D35] text-base"
          >
            <span>{t('routesSection.compareAllPrompt')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY CHOOSE SHLOKA YATRA (TRUST & REPUTATION)
          ========================================================================= */}
      <section className="bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-[780px] mx-auto mb-14">
            <span className="eyebrow">{t('whyChoose.eyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101D35] mt-2.5 mb-4">
              {t('whyChoose.heading')}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t('whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#D9A441] flex items-center justify-center mb-5">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f1Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f1Desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#6FA8B2] flex items-center justify-center mb-5">
                <FileCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f2Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f2Desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1C3455] flex items-center justify-center mb-5">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f3Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f3Desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-[#101D35] flex items-center justify-center mb-5">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f4Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f4Desc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#D9A441] flex items-center justify-center mb-5">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f5Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f5Desc')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F7F6F2] p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#6FA8B2] flex items-center justify-center mb-5">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101D35] mb-3">
                {t('whyChoose.f6Title')}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t('whyChoose.f6Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: THE SACRED DESTINATION (INTERACTIVE DESTINATION DISCOVERY)
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto my-20 sm:my-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[800px] mx-auto mb-10">
          <span className="eyebrow">{t('destinations.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101D35] mt-2.5 mb-4">
            {t('destinations.heading')}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t('destinations.subtitle')}
          </p>

          {/* Interactive Destination Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {sacredDestinations.map((dest, idx) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => setActiveDestinationIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeDestinationIndex === idx
                    ? 'bg-[#101D35] text-[#D9A441] shadow-md border border-[#D9A441]/40'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {dest.shortName || dest.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Destination Showcase */}
        {(() => {
          const dest = sacredDestinations[activeDestinationIndex];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              {/* Left Text Narrative */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    {dest.elevation} {t('destinations.elevationBadge')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• {dest.significance}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101D35] mt-2 mb-3 leading-tight">
                  {dest.name}
                </h3>
                <h4 className="text-[#1C3455] text-base font-semibold mb-4">
                  {dest.subtitle}
                </h4>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                  {dest.desc}
                </p>

                {/* Rituals & Practices */}
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 mb-6">
                  <div className="text-xs font-bold text-[#101D35] uppercase tracking-wider mb-1">
                    {t('destinations.scripturalRituals')}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed font-medium">
                    {dest.rituals}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/kailash-mansarovar-yatra-2027"
                    className="btn btn-blue px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <span>{t('destinations.readHeritage')}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/kailash-mansarovar"
                    className="text-xs font-bold text-[#1C3455] hover:text-[#101D35] underline"
                  >
                    {t('destinations.exploreDarshan')}
                  </Link>
                </div>
              </div>

              {/* Right Photographic Composition */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-900">
                  <img
                    src={assetUrl(dest.image)}
                    alt={dest.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping Floating Inset Card */}
                <div className="absolute -bottom-5 -left-3 sm:-left-4 bg-white p-4 rounded-xl shadow-md border border-slate-200 max-w-[280px]">
                  <span className="text-xs text-[#D9A441] font-bold uppercase tracking-wider block">
                    {t('destinations.authenticDarshan')}
                  </span>
                  <strong className="text-sm text-[#101D35] block my-1">
                    {dest.shortName || dest.name.split(' (')[0]}
                  </strong>
                  <p className="text-xs text-slate-500 m-0 leading-snug">
                    {dest.cardDetail}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* =========================================================================
          SECTION 7: JOURNEY EXPERIENCE (VISUAL 6-STAGE TIMELINE WITH REAL PHOTOS)
          ========================================================================= */}
      <section className="bg-[#101D35] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-[780px] mx-auto mb-14">
            <span className="text-[#D9A441] font-bold text-xs sm:text-sm uppercase tracking-wider">
              {t('stages.eyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2.5 mb-4">
              {t('stages.heading')}
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t('stages.subtitle')}
            </p>
          </div>

          {/* 6 Stage Timeline Grid with Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: t('stages.s1Title'),
                timing: t('stages.s1Timing'),
                desc: t('stages.s1Desc'),
                img: experienceImages.stage1_prep.src,
                alt: experienceImages.stage1_prep.alt,
              },
              {
                num: '02',
                title: t('stages.s2Title'),
                timing: t('stages.s2Timing'),
                desc: t('stages.s2Desc'),
                img: experienceImages.stage2_kathmandu.src,
                alt: experienceImages.stage2_kathmandu.alt,
              },
              {
                num: '03',
                title: t('stages.s3Title'),
                timing: t('stages.s3Timing'),
                desc: t('stages.s3Desc'),
                img: experienceImages.stage3_ascent.src,
                alt: experienceImages.stage3_ascent.alt,
              },
              {
                num: '04',
                title: t('stages.s4Title'),
                timing: t('stages.s4Timing'),
                desc: t('stages.s4Desc'),
                img: experienceImages.stage4_manasarovar.src,
                alt: experienceImages.stage4_manasarovar.alt,
              },
              {
                num: '05',
                title: t('stages.s5Title'),
                timing: t('stages.s5Timing'),
                desc: t('stages.s5Desc'),
                img: experienceImages.stage5_parikrama.src,
                alt: experienceImages.stage5_parikrama.alt,
              },
              {
                num: '06',
                title: t('stages.s6Title'),
                timing: t('stages.s6Timing'),
                desc: t('stages.s6Desc'),
                img: experienceImages.stage6_return.src,
                alt: experienceImages.stage6_return.alt,
              },
            ].map((stage, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col backdrop-blur-sm hover:border-amber-400/40 transition-all"
              >
                <div className="h-44 overflow-hidden bg-slate-900">
                  <img
                    src={assetUrl(stage.img)}
                    alt={stage.alt}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-[#D9A441] font-heading">
                        {stage.num}
                      </span>
                      <span className="text-xs bg-amber-400/15 text-[#D9A441] px-2.5 py-1 rounded-full font-semibold">
                        {stage.timing}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/itinerary"
              className="btn btn-gold px-8 py-3.5 rounded-full inline-flex items-center gap-2"
            >
              <span>{t('stages.viewFullItineraries')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: TRAVEL PREPARATION & SAFETY PROTOCOLS
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto my-20 sm:my-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[780px] mx-auto mb-14">
          <span className="eyebrow">{t('preparation.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101D35] mt-2.5 mb-4">
            {t('preparation.heading')}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t('preparation.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {/* Card 1 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1C3455] flex items-center justify-center">
                <Activity size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card1Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card1Desc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D9A441] flex items-center justify-center">
                <Shield size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card2Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card2Desc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#6FA8B2] flex items-center justify-center">
                <FileCheck size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card3Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card3Desc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#101D35] flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card4Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card4Desc')}
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D9A441] flex items-center justify-center">
                <Award size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card5Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card5Desc')}
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1C3455] flex items-center justify-center">
                <HeartHandshake size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#101D35]">{t('preparation.card6Title')}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('preparation.card6Desc')}
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/preparation-safety"
            className="btn btn-outline px-7 py-3 rounded-full inline-flex items-center gap-2"
          >
            <span>{t('preparation.readGuidelinesBtn')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: PILGRIMAGE SUPPORT & ADVISORY
          ========================================================================= */}
      <section className="max-w-[1440px] mx-auto my-20 sm:my-24 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1C3455] to-[#101D35] rounded-3xl p-8 sm:p-12 lg:p-14 text-white grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-xl">
          <div>
            <span className="text-[#D9A441] font-bold text-xs uppercase tracking-wider">
              {t('advisory.eyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 leading-tight">
              {t('advisory.heading')}
            </h2>
            <p className="text-slate-200 text-base leading-relaxed mb-7">
              {t('advisory.subtitle')}
            </p>

            <div className="flex flex-col gap-3.5 text-base">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#D9A441]" />
                <span>
                  {t('advisory.helplineLabel')}{' '}
                  <a href="tel:+916366852888" className="text-white font-bold hover:underline">
                    +91 6366852888
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[#D9A441]" />
                <span>
                  {t('advisory.emailLabel')}{' '}
                  <a href="mailto:volunteers@shlloka.com" className="text-white font-bold hover:underline">
                    volunteers@shlloka.com
                  </a>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#D9A441] shrink-0 mt-1" />
                <span className="text-slate-200 text-sm">
                  {t('advisory.address')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-2">
              {t('advisory.formTitle')}
            </h3>
            <p className="text-slate-300 text-sm mb-5">
              {t('advisory.formDesc')}
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder={t('advisory.namePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                placeholder={t('advisory.phonePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
              />
              <Link
                to="/contact"
                className="btn btn-gold w-full py-3 rounded-xl text-center text-sm font-bold mt-2 inline-flex items-center justify-center gap-2"
              >
                <span>{t('advisory.submitBtn')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="max-w-[1000px] mx-auto my-20 sm:my-24 px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="eyebrow">{t('faqs.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101D35] mt-2.5 mb-4">
            {t('faqs.heading')}
          </h2>
          <p className="text-slate-600 text-base">
            {t('faqs.subtitle')}
          </p>

          {/* Category Filter Pills */}
          <div className="flex justify-center flex-wrap gap-2 mt-7">
            {faqCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveFaqTab(c.id)}
                className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                  activeFaqTab === c.id
                    ? 'bg-[#101D35] text-white border-[#101D35]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Items */}
        <div className="flex flex-col gap-3.5">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center bg-transparent border-none text-left cursor-pointer gap-4"
              >
                <span
                  className={`text-base font-semibold ${
                    openFaq === idx ? 'text-[#1C3455]' : 'text-[#101D35]'
                  }`}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'text-[#D9A441] rotate-180' : 'text-slate-400'
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-3 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: FINAL BOOKING CTA BANNER (IMAGE-BASED)
          ========================================================================= */}
      <section className="relative py-28 sm:py-32 px-4 sm:px-6 text-white overflow-hidden text-center">
        {/* Background Image from Uploaded Collection */}
        <img
          src={assetUrl(heroImages.lakeManasarovar.src)}
          alt={heroImages.lakeManasarovar.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101D35]/85 via-[#101D35]/90 to-[#101D35]/95 z-10" />

        <div className="relative z-20 max-w-[820px] mx-auto">
          <span className="text-[#D9A441] font-bold text-xs sm:text-sm uppercase tracking-wider inline-block mb-4">
            {t('finalCta.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 font-heading">
            {t('finalCta.heading')}
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-[680px] mx-auto mb-9">
            {t('finalCta.desc')}
          </p>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Link
              to="/book"
              className="btn btn-gold px-9 py-4 text-base rounded-full inline-flex items-center gap-2 font-bold shadow-lg"
            >
              <span>{t('finalCta.reserveBtn')}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline-white px-8 py-4 text-base rounded-full inline-flex items-center gap-2 font-semibold"
            >
              <span>{t('finalCta.advisorBtn')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
