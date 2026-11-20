import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Shlloka Yatra 2027 Database...');

  // Clean existing tables in reverse order of foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.uploadedDocument.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.traveller.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.route.deleteMany();
  await prisma.departure.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed RBAC Users
  const adminHash = await bcrypt.hash('Shloka#2027$AdminKailash!Secure', 10);
  const memberHash = await bcrypt.hash('Devotee@2027', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@shloka.com',
      passwordHash: adminHash,
      name: 'Shloka Administrator',
      phone: '+91 6366852888',
      role: 'ADMIN',
      mustChangePassword: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@shlloka.com',
      passwordHash: adminHash,
      name: 'Shloka Administrator',
      phone: '+91 6366852888',
      role: 'ADMIN',
      mustChangePassword: true,
    },
  });

  console.log('Seeded RBAC users: Super Admin, Travel Ops, Finance, Support');

  // Seed sample Member
  const sampleMember = await prisma.member.create({
    data: {
      membershipReference: 'SHL-MEM-2027-1088',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      email: 'rajesh.sharma@example.com',
      mobile: '+91 9876543210',
      whatsapp: '+91 9876543210',
      dateOfBirth: '1975-04-12',
      nationality: 'Indian',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      passwordHash: memberHash,
      membershipType: 'GOLD',
      yatraInterest: 'YES',
      preferredBatch: 'may-batch-2027',
      preferredPackage: 'bus-both-ways',
      travellersCount: 2,
      sourceDiscovery: 'Official Recommendation',
      marketingConsent: true,
      status: 'ACTIVE',
    },
  });
  console.log(`Seeded Member: ${sampleMember.email}`);

  // 2. Seed 8 Batches for 2027
  const departuresData = [
    {
      batchNumber: 1,
      name: 'May Batch — Full Moon',
      slug: 'may-batch-full-moon-2027',
      arrivalDate: new Date('2027-05-09T00:00:00Z'),
      departureDate: new Date('2027-05-23T00:00:00Z'),
      totalDays: 15,
      isFullMoon: true,
      totalCapacity: 25,
      bookedSeats: 18,
      status: 'FAST_FILLING',
      description: 'First departure of the 2027 season aligned with the auspicious Vaishakh Full Moon at holy Lake Manasarovar and Mount Kailash.',
      notes: 'Preserves the brochure original stated duration: 15 days.',
    },
    {
      batchNumber: 2,
      name: 'June I Batch',
      slug: 'june-1-batch-2027',
      arrivalDate: new Date('2027-05-31T00:00:00Z'),
      departureDate: new Date('2027-06-15T00:00:00Z'),
      totalDays: 16,
      isFullMoon: false,
      totalCapacity: 25,
      bookedSeats: 8,
      status: 'AVAILABLE',
      description: 'Early summer yatra with crisp visibility across the high Tibetan plateau and pleasant daytime trekking conditions.',
      notes: 'Preserves the brochure original stated duration: 16 days (31 May arrival to 15 June final departure).',
    },
    {
      batchNumber: 3,
      name: 'June II Batch — Full Moon',
      slug: 'june-2-batch-full-moon-2027',
      arrivalDate: new Date('2027-06-06T00:00:00Z'),
      departureDate: new Date('2027-06-21T00:00:00Z'),
      totalDays: 16,
      isFullMoon: true,
      totalCapacity: 25,
      bookedSeats: 21,
      status: 'FAST_FILLING',
      description: 'Saga Dawa / Jyeshtha Full Moon yatra. One of the holiest and most sought-after pilgrimage dates across the Himalayas.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
    {
      batchNumber: 4,
      name: 'June III Batch',
      slug: 'june-3-batch-2027',
      arrivalDate: new Date('2027-06-14T00:00:00Z'),
      departureDate: new Date('2027-06-29T00:00:00Z'),
      totalDays: 16,
      isFullMoon: false,
      totalCapacity: 25,
      bookedSeats: 12,
      status: 'AVAILABLE',
      description: 'Midsummer departure with extended daylight hours, vibrant Tibetan landscape, and steady weather windows.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
    {
      batchNumber: 5,
      name: 'July I Batch',
      slug: 'july-1-batch-2027',
      arrivalDate: new Date('2027-07-05T00:00:00Z'),
      departureDate: new Date('2027-07-20T00:00:00Z'),
      totalDays: 16,
      isFullMoon: false,
      totalCapacity: 25,
      bookedSeats: 10,
      status: 'AVAILABLE',
      description: 'Traverses through the rain-shadow region of Western Tibet where the sacred plateau remains predominantly dry.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
    {
      batchNumber: 6,
      name: 'July II Batch — Full Moon',
      slug: 'july-2-batch-full-moon-2027',
      arrivalDate: new Date('2027-07-11T00:00:00Z'),
      departureDate: new Date('2027-07-26T00:00:00Z'),
      totalDays: 16,
      isFullMoon: true,
      totalCapacity: 25,
      bookedSeats: 22,
      status: 'FAST_FILLING',
      description: 'Auspicious Guru Purnima Full Moon Batch. Sacred rituals on the holy shores of Lake Manasarovar under the illuminated sky.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
    {
      batchNumber: 7,
      name: 'August I Batch',
      slug: 'august-1-batch-2027',
      arrivalDate: new Date('2027-08-02T00:00:00Z'),
      departureDate: new Date('2027-08-17T00:00:00Z'),
      totalDays: 16,
      isFullMoon: false,
      totalCapacity: 25,
      bookedSeats: 9,
      status: 'AVAILABLE',
      description: 'Late summer journey with green alpine pastures in lower regions and clear water streams across the circumambulation trails.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
    {
      batchNumber: 8,
      name: 'August II Batch — Full Moon',
      slug: 'august-2-batch-full-moon-2027',
      arrivalDate: new Date('2027-08-10T00:00:00Z'),
      departureDate: new Date('2027-08-25T00:00:00Z'),
      totalDays: 16,
      isFullMoon: true,
      totalCapacity: 25,
      bookedSeats: 17,
      status: 'AVAILABLE',
      description: 'Shravana Purnima Full Moon Batch. Deep spiritual resonance marking the grand conclusion of the 2027 pilgrimage season.',
      notes: 'Preserves the brochure original stated duration: 16 days.',
    },
  ];

  for (const dep of departuresData) {
    await prisma.departure.create({ data: dep });
  }
  console.log(`Seeded ${departuresData.length} departures`);

  // 3. Seed 3 Travel Routes (Options 1, 2, 3)
  const route1Itinerary = [
    { day: 1, title: 'Arrival in Kathmandu', desc: 'Airport assistance, transfer to hotel, yatra orientation, packing briefing, and distribution of sacred yatra kits.' },
    { day: 2, title: 'Kathmandu Temple Darshan & Dhulikhel', desc: 'Special Rudra Homam at sacred Pashupatinath Temple, Guhyeshwari Mata darshan, Doleshwor Mahadev. Scenic drive to Dhulikhel for peaceful evening rest.' },
    { day: 3, title: 'Drive to Border & Ascend to Nyalam', desc: 'Drive to Nepal-Tibet border at Kodari, complete customs and immigration formalities, meet Tibetan guide and ascend to Nyalam (3,750 m).' },
    { day: 4, title: 'Acclimatisation Day in Nyalam', desc: 'Crucial rest and acclimatisation. Short guided acclimatisation hike, blood pressure and SpO2 vital checks, high-altitude briefing.' },
    { day: 5, title: 'Nyalam to Saga across Tibetan Plateau', desc: 'Traverse Lalung La Pass (5,050 m) with views of Mount Shishapangma and turquoise Lake Pigutsho to Saga (4,450 m).' },
    { day: 6, title: 'Saga to Sacred Lake Manasarovar', desc: 'Cross Mayum La Pass (5,216 m) for your first breathtaking darshan of Mount Kailash. Vehicle parikrama of Lake Manasarovar, evening sacred Aarti and holy Jal collection.' },
    { day: 7, title: 'Manasarovar Rituals to Darchen Base Camp', desc: 'Morning holy bath / sprinkling of sacred waters, Vedic puja, and havan. Drive to Darchen base camp (4,670 m) at the foot of Mount Kailash.' },
    { day: 8, title: 'Parikrama Day 1: Yamdwar to Diraphuk (12–14 km)', desc: 'Drive to Yamdwar. Begin the circumambulation along the Lha Chu river facing the northern face of Kailash to Diraphuk (5,080 m).' },
    { day: 9, title: 'Parikrama Day 2: Across Dolma La Pass to Zuthulphuk (22 km)', desc: 'Ascend to Dolma La Pass (5,630 m), view sacred Gauri Kund, descend into the grassy valley of Zuthulphuk (4,790 m).' },
    { day: 10, title: 'Parikrama Day 3: Zuthulphuk to Darchen & Saga (8 km walk)', desc: 'Gentle walk to complete the sacred circle, meet vehicles at Darchen, and drive back to Saga.' },
    { day: 11, title: 'Saga to Nyalam', desc: 'Return drive across the high plateau with scenic vistas of Himalayan mountain chains.' },
    { day: 12, title: 'Nyalam to Kathmandu', desc: 'Border formalities and return drive to Kathmandu. Evening celebration dinner and well-deserved rest.' },
    { day: 13, title: 'Contingency / Sightseeing Buffer', desc: 'Safety buffer day for high-altitude weather or road conditions, or relaxed exploration of Kathmandu.' },
    { day: 14, title: 'Final Departure', desc: 'Certificate of Yatra completion distribution and transfer to Tribhuvan International Airport for your flight home.' },
  ];

  const route2Itinerary = [
    { day: 1, title: 'Arrival in Kathmandu', desc: 'Airport welcome, transfer to hotel, Tibet visa verification, comprehensive briefing.' },
    { day: 2, title: 'Pashupatinath Darshan & Kathmandu Heritage', desc: 'Special Rudra Abhishek at Pashupatinath, Guhyeshwari Shaktipeeth, Boudhanath Stupa, and flight packing guidance.' },
    { day: 3, title: 'Flight Kathmandu to Lhasa (3,650 m)', desc: 'Spectacular trans-Himalayan flight over Everest to Gonggar Airport. Transfer to Lhasa, check-in, and relaxed acclimatisation.' },
    { day: 4, title: 'Lhasa: Potala Palace & Jokhang Temple', desc: 'Guided spiritual visits to Potala Palace (winter residence of Dalai Lamas), ancient Jokhang Temple, and Barkhor pilgrimage street.' },
    { day: 5, title: 'Sera Monastery & Acclimatisation Rest', desc: 'Visit historic Sera Monastery to witness philosophical debates. Medical vital checks, hydration, and gentle walks.' },
    { day: 6, title: 'Drive Lhasa to Shigatse (3,840 m)', desc: 'Scenic highland drive along the Yarlung Tsangpo River via Gyantse to Shigatse, home of the Tashilhunpo Monastery.' },
    { day: 7, title: 'Shigatse to Saga (4,450 m)', desc: 'Traverse vast nomadic grasslands and high-altitude plateaus towards western Tibet.' },
    { day: 8, title: 'Saga to Lake Manasarovar (4,590 m)', desc: 'Cross Mayum La pass into the holy Kailash mandala. First view of Mount Kailash and Lake Manasarovar. Evening Aarti on the shore.' },
    { day: 9, title: 'Manasarovar Rituals to Darchen', desc: 'Sacred lakeside rituals, havan, and holy jal collection. Short drive to Darchen base camp at the foot of Kailash.' },
    { day: 10, title: 'Parikrama Day 1: Yamdwar to Diraphuk (12–14 km)', desc: 'Pass through the Gate of Salvation (Yamdwar), trek along Lha Chu river with direct views of the North Face.' },
    { day: 11, title: 'Parikrama Day 2: Across Dolma La Pass to Zuthulphuk (22 km)', desc: 'Early morning climb to Dolma La (5,630 m), darshan of turquoise Gauri Kund, descent to Zuthulphuk Cave.' },
    { day: 12, title: 'Parikrama Day 3: Zuthulphuk to Darchen & Saga (8 km walk)', desc: 'Complete the sacred circumambulation, rejoin vehicles, and drive to Saga.' },
    { day: 13, title: 'Saga to Nyalam / Kyirong', desc: 'Scenic road drive towards the Nepal-China border.' },
    { day: 14, title: 'Border Crossing to Kathmandu', desc: 'Cross border into Nepal and drive to Kathmandu hotel.' },
    { day: 15, title: 'Contingency / Kathmandu Buffer', desc: 'Safety buffer day for high-altitude weather and flight connections.' },
    { day: 16, title: 'Final Departure', desc: 'Transfer to Kathmandu International Airport with blessed memories.' },
  ];

  const route3Itinerary = [
    { day: 1, title: 'Arrival in Kathmandu', desc: 'Airport assistance, hotel check-in, visa formalities, and evening pilgrimage orientation.' },
    { day: 2, title: 'Pashupatinath & Heritage Darshan', desc: 'Special Rudrabhishek at Pashupatinath, Guhyeshwari Mata temple, domestic Tibet flight luggage briefing.' },
    { day: 3, title: 'Flight Kathmandu to Lhasa (3,650 m)', desc: 'Himalayan mountain flight landing at Lhasa Gonggar Airport. Hotel transfer and mandatory low-energy rest.' },
    { day: 4, title: 'Lhasa: Potala Palace & Jokhang Temple', desc: 'Visits to Potala Palace and Jokhang Temple with entry included. Barkhor pilgrimage circuit walk.' },
    { day: 5, title: 'Sera Monastery & Acclimatisation Rest', desc: 'Excursion to Sera Monastery, resting and physiological adaptation for the upcoming flight to Ali.' },
    { day: 6, title: 'Flight Lhasa to Ali (Gunsa Airport) & Drive to Lake Manasarovar', desc: 'Scenic flight directly over Western Tibet to Ali (Gunsa Airport) or Pulan. Drastically cuts road travel days. Drive to sacred Lake Manasarovar.' },
    { day: 7, title: 'Lake Manasarovar Rituals to Darchen Base Camp', desc: 'Holy bath / jal collection, Vedic prayers, and havan. Drive to Darchen with close-up views of Mount Kailash.' },
    { day: 8, title: 'Kailash Parikrama Day 1: Yamdwar to Diraphuk (12–14 km)', desc: 'Drive to Yamdwar. Gradual walk or pony ride to Diraphuk facing the sacred North Face.' },
    { day: 9, title: 'Kailash Parikrama Day 2: Across Dolma La Pass to Zuthulphuk (22 km)', desc: 'Spiritual journey traversing Dolma La (5,630 m), sight of Gauri Kund, reach Zuthulphuk.' },
    { day: 10, title: 'Parikrama Day 3 Completion & Drive to Saga (8 km walk)', desc: 'Conclude the sacred circumambulation circle, vehicle pickup to Saga.' },
    { day: 11, title: 'Saga to Nyalam / Kyirong', desc: 'Comfortable road journey across the southern Tibetan plateau.' },
    { day: 12, title: 'Drive Nyalam to Kathmandu', desc: 'Cross back into Nepal and transfer to Kathmandu hotel.' },
    { day: 13, title: 'Departure for Onward Journey', desc: 'Airport transfer for your return flight with a transformed spirit.' },
  ];

  const routes = [
    {
      routeNumber: 1,
      name: 'Option 1: Classic Overland',
      code: 'bus-both-ways',
      approachType: 'BUS_BOTH_WAYS',
      titleTag: 'By Bus Both Ways via Nyalam & Saga',
      durationDays: 15,
      description: 'The time-tested overland pilgrimage from Kathmandu to Mount Kailash and back by road across the southern Tibetan plateau. Provides natural, staged physiological acclimatisation as you ascend gradually through Nyalam and Saga.',
      startingFromInr: 350000,
      image: '/assets/shlloka-yatra/images/sy_img_007.jpg',
      highlights: JSON.stringify([
        'Authentic overland Himalayan transit via Kodari & Nyalam',
        'Staged acclimatisation day at Nyalam (3,750 m)',
        'Special Rudra Homam at Pashupatinath Temple in Kathmandu',
        'Full vehicle Parikrama of holy Lake Manasarovar with holy dip rituals',
        'Complete 3-day sacred Kailash Parikrama (52 km, foot or pony)',
        'Pure vegetarian meals prepared fresh by dedicated Nepali kitchen crew',
      ]),
      itinerary: JSON.stringify(route1Itinerary),
      pricing: [
        {
          passportType: 'INDIAN',
          basePrice: 350000,
          currency: 'INR',
          gstPercentage: 5.0,
          foreignAirfareSupplement: 0,
          depositRequired: 25000,
          termsNotes: '₹3,50,000 + 5% GST for Indian passport holders. Initial registration deposit ₹25,000 credited towards package.',
        },
        {
          passportType: 'FOREIGN',
          basePrice: 425000,
          currency: 'INR',
          gstPercentage: 0.0,
          foreignAirfareSupplement: 0,
          depositRequired: 25000,
          termsNotes: 'Foreign passport holders: INR 4,25,000. No airfare supplement required for overland route.',
        },
      ],
    },
    {
      routeNumber: 2,
      name: 'Option 2: Fly to Lhasa, Continue by Road',
      code: 'flight-to-lhasa',
      approachType: 'FLIGHT_LHASA',
      titleTag: 'Flight Kathmandu to Lhasa + Overland to Kailash',
      durationDays: 16,
      description: 'Avoid arduous border road journeys by taking a scenic trans-Himalayan flight from Kathmandu directly into Lhasa. Spend two restorative days acclimatising in the spiritual heart of Tibet, exploring Potala Palace and Jokhang Temple, before driving across Shigatse and Saga to Mount Kailash.',
      startingFromInr: 437000,
      image: '/assets/shlloka-yatra/images/sy_img_092.jpg',
      highlights: JSON.stringify([
        'Trans-Himalayan flight Kathmandu to Lhasa Gonggar Airport',
        '2 nights in historic Lhasa with Potala Palace & Jokhang Temple entry included',
        'Gentle physiological acclimatisation at 3,650 m before higher altitudes',
        'Traverse Tibetan heartland via Shigatse and Saga',
        'Lake Manasarovar sacred Aarti and holy water collection',
        'Full 3-day Kailash Parikrama with dedicated Sherpa team',
      ]),
      itinerary: JSON.stringify(route2Itinerary),
      pricing: [
        {
          passportType: 'INDIAN',
          basePrice: 437000,
          currency: 'INR',
          gstPercentage: 5.0,
          foreignAirfareSupplement: 0,
          depositRequired: 25000,
          termsNotes: '₹4,37,000 + 5% GST for Indian passport holders. Includes Kathmandu-Lhasa flight.',
        },
        {
          passportType: 'FOREIGN',
          basePrice: 425000,
          currency: 'INR',
          gstPercentage: 0.0,
          foreignAirfareSupplement: 600, // +$600 USD
          depositRequired: 25000,
          termsNotes: 'Foreign passport holders: INR 4,25,000 + US$ 600 flight sector supplement.',
        },
      ],
    },
    {
      routeNumber: 3,
      name: 'Option 3: Fly to Lhasa & Ali/Pulan',
      code: 'lhasa-ali-pulan',
      approachType: 'FLIGHT_LHASA_ALI_PULAN',
      titleTag: 'Dual Flight Sectors + Scenic Road Parikrama',
      durationDays: 13,
      description: 'The premier high-comfort approach featuring two flight sectors: Kathmandu to Lhasa, and Lhasa to Ali Gunsa / Pulan Airport. Drastically reduces overland drive hours and physical fatigue, allowing pilgrims to arrive fresh and focused on the sacred Kailash Parikrama.',
      startingFromInr: 494000,
      image: '/assets/shlloka-yatra/images/sy_img_037.jpg',
      highlights: JSON.stringify([
        'Dual domestic flight sectors: Kathmandu to Lhasa, and Lhasa to Ali/Pulan',
        'Cuts out hundreds of kilometres of arduous plateau highway driving',
        'Sightseeing at Potala Palace, Jokhang Temple, and Sera Monastery',
        'Rapid arrival within direct vicinity of Lake Manasarovar and Mount Kailash',
        'Ideal for senior yatris, business executives, and those with limited time',
        'Full 3-day Kailash Parikrama with priority pony/porter coordination',
      ]),
      itinerary: JSON.stringify(route3Itinerary),
      pricing: [
        {
          passportType: 'INDIAN',
          basePrice: 494000,
          currency: 'INR',
          gstPercentage: 5.0,
          foreignAirfareSupplement: 0,
          depositRequired: 25000,
          termsNotes: '₹4,94,000 + 5% GST for Indian passport holders. Includes two flight sectors.',
        },
        {
          passportType: 'FOREIGN',
          basePrice: 425000,
          currency: 'INR',
          gstPercentage: 0.0,
          foreignAirfareSupplement: 1200, // +$1,200 USD
          depositRequired: 25000,
          termsNotes: 'Foreign passport holders: INR 4,25,000 + US$ 1,200 dual flight sectors supplement.',
        },
      ],
    },
  ];

  for (const r of routes) {
    const { pricing, ...routeFields } = r;
    const createdRoute = await prisma.route.create({ data: routeFields });
    for (const p of pricing) {
      await prisma.pricingTier.create({
        data: {
          ...p,
          routeId: createdRoute.id,
        },
      });
    }
  }
  console.log(`Seeded ${routes.length} routes with pricing tiers`);

  // 4. Seed FAQs from Brochure and Knowledge Base
  const faqsData = [
    {
      category: 'GENERAL',
      question: 'Who is eligible to undertake the Kailash Mansarovar Yatra 2027?',
      answer: 'The Yatra is open to both Indian and Foreign passport holders, generally between the ages of 18 and 70 in good cardiovascular health. Yatris must pass physical fitness checks and obtain medical clearance before departure.',
      displayOrder: 1,
    },
    {
      category: 'ITINERARY',
      question: 'What is the physical difficulty of the 3-day Kailash Parikrama?',
      answer: 'The Parikrama is approximately 52 km in total. Stage 1 is 12-14 km (~4-5 hours), Stage 2 is 22 km traversing Dolma La Pass at 5,630 m (~7-8 hours, the most challenging day), and Stage 3 is a 6-8 km gentle walk to completion. Yatris who prefer not to trek the entire distance may hire a local pony/horse with horseman directly at Yamdwar.',
      displayOrder: 2,
    },
    {
      category: 'PRICING',
      question: 'What are the payment terms and registration deposit?',
      answer: 'Registration begins with an initial deposit of ₹25,000 (or USD 250 for foreign passports). A 50% payment secures your Yatra seat and initiates permit filings. The remaining balance is payable 30 days after the initial confirmation payment. The initial registration deposit is credited towards the Package Base Price.',
      displayOrder: 3,
    },
    {
      category: 'PRICING',
      question: 'What is the pricing structure for Foreign and NRI passport holders?',
      answer: 'Indian passport prices are quoted in INR with 5% GST applicable. Foreign passport holders have a base price of INR 4,25,000. In addition, flight supplements apply: no supplement for Option 1, US$ 600 supplement for Option 2, and US$ 1,200 supplement for Option 3.',
      displayOrder: 4,
    },
    {
      category: 'HEALTH',
      question: 'How do you handle high altitude sickness (AMS)?',
      answer: 'Safety is our paramount priority. We provide dedicated acclimatisation days at Nyalam or Lhasa, carry certified medical oxygen cylinders, pulse oximeters, and have experienced Nepali sherpa leaders trained in wilderness medical protocols.',
      displayOrder: 5,
    },
    {
      category: 'TRAVEL_PERMITS',
      question: 'Do I need a separate Chinese visa or does Shlloka arrange it?',
      answer: 'Shlloka Yatra coordinates the entire group Tibet Travel Permit and China group visa processing in coordination with authorities. Pilgrims only need to supply valid passport copies and photos adhering to our briefing guidelines.',
      displayOrder: 6,
    },
    {
      category: 'GENERAL',
      question: 'What kind of food is served during the high-altitude pilgrimage?',
      answer: 'Nutritious, pure vegetarian food (including Jain options on request) freshly prepared by our accompanying Nepali kitchen and support crew, specifically tailored for high-altitude endurance and digestion.',
      displayOrder: 7,
    },
    {
      category: 'PRICING',
      question: 'What is the cancellation and refund policy?',
      answer: 'Voluntary cancellation schedule (draft pending legal approval): 75+ days before departure: 75% refund of Package Base Price; 60–74 days: 50% refund; 30–59 days: 25% refund; fewer than 30 days or no-show: 0% refund. GST and third-party statutory fees are non-refundable per applicable law.',
      displayOrder: 8,
    },
  ];

  for (const faq of faqsData) {
    await prisma.faq.create({ data: faq });
  }
  console.log(`Seeded ${faqsData.length} FAQs`);

  // 5. Seed Legal Documents (Loaded from contractual docs)
  const legalDocs = [
    {
      slug: 'terms-and-conditions',
      title: 'Master Terms and Conditions',
      version: 'DRAFT-V1.0-NOV-2026',
      effectiveDate: new Date('2026-11-12'),
      status: 'DRAFT',
      isApproved: false,
      contentMarkdown: `# TERMS & CONDITIONS
**Shlloka Yatra Private Limited | Kailash Mansarovar Parikrama Yatra 2027**
*DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026*

### T1 Contracting entity and application
Shlloka Yatra Private Limited (the “Company”, “we”, “us” or “our”) is the sole contracting organiser and seller of the pilgrimage services expressly described in the Participant’s Booking Confirmation and Package Service Schedule. The Participant (“you” or “Pilgrim”) contracts with Shlloka Yatra Private Limited only.

### T2 Contract documents, definitions and priority
The “Booking Documents” comprise:
(a) the dated Booking Confirmation and individual Package Service Schedule;
(b) these Terms and Conditions;
(c) the Cancellation, Refund and Force Majeure Policy;
(d) the Participant High-Altitude Risk Acknowledgement and Emergency Medical Authorisation; and
(e) the Privacy Notice.

### T3 Nature and scope of services
The Company will use reasonable skill, care and diligence to arrange and coordinate the services specifically included in the confirmed Package Service Schedule.

### T4 2027 travel options and package-specific confirmation
Option 1 — Bus Both Ways; Option 2 — Fly to Lhasa, Continue by Road; and Option 3 — Fly to Lhasa and Fly to Ali/Pulan.

### T5 Registration, acceptance and confirmation
The initial registration payment is INR 25,000 per Participant, or USD 250 where expressly quoted. It is credited against the Package Base Price and is not an additional fee.

### T6 Payment deadlines, default and secure payments
The remaining 50% of the Package Base Price is due within 30 calendar days after payment of the first 50% instalment.

### T7 Taxes, exchange rates and later price changes
GST (5%) and other statutory charges are payable where legally applicable and stated separately.

*(Full 35-clause text preserved in document records)*`,
    },
    {
      slug: 'cancellation-policy',
      title: 'Cancellation, Refund and Force Majeure Policy',
      version: 'DRAFT-V1.0-NOV-2026',
      effectiveDate: new Date('2026-11-12'),
      status: 'DRAFT',
      isApproved: false,
      contentMarkdown: `# CANCELLATION, REFUND & FORCE MAJEURE POLICY
**Shlloka Yatra Private Limited | Kailash Mansarovar Parikrama Yatra 2027**
*DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026*

### C2 Voluntary cancellation schedule
- **75 calendar days or more before departure**: 25% cancellation charge (75% package refund if fully paid)
- **60–74 calendar days before departure**: 50% cancellation charge (50% refund)
- **30–59 calendar days before departure**: 75% cancellation charge (25% refund)
- **Fewer than 30 calendar days or no-show**: 100% cancellation charge (0% package refund)

### C3 Treatment of initial registration payment
The initial INR 25,000 registration payment (or USD 250) is an advance credited towards the Package Base Price. It is not an additional fee.

### C4 Single refund formula; no double deductions
**Package Refund = max(0, Package Base Price actually paid - applicable cancellation charge calculated on full Package Base Price).**
The Company will not additionally deduct the registration payment or ordinary package charges twice. Statutory GST and third-party fees are non-refundable as mandated by tax regulations.

### C7 Cancellation initiated by the Company
If the Company cancels a confirmed departure for reasons within its control, a full refund plus reciprocal cancellation compensation is provided. Commercial under-enrolment is not force majeure.`,
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy and Data Protection Notice',
      version: 'DRAFT-V1.0-NOV-2026',
      effectiveDate: new Date('2026-11-12'),
      status: 'DRAFT',
      isApproved: false,
      contentMarkdown: `# PRIVACY & DATA PROTECTION NOTICE
**Shlloka Yatra Private Limited | Kailash Mansarovar Parikrama Yatra 2027**
*DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026*

### P1 Who controls your information
Shlloka Yatra Private Limited, Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304, India. Contact: volunteers@shlloka.com.

### P2 Information collected
Name, passport details, date of birth, emergency contacts, medical declarations, vital checks, and travel insurance records.

### P7 Security and retention
Strict role-based access control. Medical records and passport copies are accessible only to authorised operations and medical personnel.`,
    },
    {
      slug: 'risk-acknowledgement',
      title: 'Participant High-Altitude Risk Acknowledgement & Emergency Medical Authorisation',
      version: 'DRAFT-V1.0-NOV-2026',
      effectiveDate: new Date('2026-11-12'),
      status: 'DRAFT',
      isApproved: false,
      contentMarkdown: `# PARTICIPANT HIGH-ALTITUDE RISK ACKNOWLEDGEMENT & EMERGENCY MEDICAL AUTHORISATION
**Shlloka Yatra Private Limited | Kailash Mansarovar Parikrama Yatra 2027**
*DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL | 12 November 2026*

### R2 Voluntary and informed participation
The Yatra takes place in remote high-altitude regions of Nepal and Tibet exceeding 5,000 metres.

### R3 Specific risks acknowledged
Acute Mountain Sickness (AMS), HAPE, HACE, severe cold, delayed medical and evacuation infrastructure. Yatris accept inherent risks while retaining statutory rights for non-excludable negligence.

### R7 Emergency medical authorisation
Where a participant cannot make an informed decision in an emergency, on-ground staff are authorised to seek qualified clinical help, contact the emergency person, and coordinate evacuation.`,
    },
  ];

  for (const doc of legalDocs) {
    await prisma.legalDocument.create({ data: doc });
  }
  console.log(`Seeded ${legalDocs.length} legal documents`);

  // 6. Seed Gallery Items
  const galleryItems = [
    {
      title: 'Mount Kailash Sacred North Face',
      category: 'KAILASH',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_100.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_100.jpg',
      caption: 'The sheer, majestic northern amphitheatre of Mount Kailash viewed from Diraphuk at 5,080 metres.',
      displayOrder: 1,
    },
    {
      title: 'Sacred Lake Manasarovar Shore & Peaks',
      category: 'MANSAROVAR',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_066.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_066.jpg',
      caption: 'Evening calm on the sacred shores of holy Lake Manasarovar with reflections of the sky.',
      displayOrder: 2,
    },
    {
      title: 'Overland Himalayan Transit',
      category: 'TREK',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_007.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_007.jpg',
      caption: 'Modern deluxe tourist coaches traversing the trans-Himalayan highway through Nyalam and Saga.',
      displayOrder: 3,
    },
    {
      title: 'Tibetan Highland Valley Fields',
      category: 'KAILASH',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_092.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_092.jpg',
      caption: 'Vibrant yellow fields and mountain vistas on the high plateau during acclimatisation.',
      displayOrder: 4,
    },
    {
      title: 'Trans-Himalayan Snow Ranges',
      category: 'TREK',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_037.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_037.jpg',
      caption: 'Scenic trans-Himalayan peaks flanking the Ngari Gunsa air corridor in Western Tibet.',
      displayOrder: 5,
    },
    {
      title: 'Traversing the Sacred Dolma La Pass (5,630m)',
      category: 'PARIKRAMA',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_143.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_143.jpg',
      caption: 'Pilgrims reaching the pinnacle of the Parikrama at Dolma La Pass adorned with prayer flags.',
      displayOrder: 6,
    },
    {
      title: 'Divine Darshan of Turquoise Gauri Kund',
      category: 'PARIKRAMA',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_104.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_104.jpg',
      caption: 'The miraculous emerald-turquoise waters of Gauri Kund nestled just below the Dolma La Pass.',
      displayOrder: 7,
    },
    {
      title: 'Mount Kailash Geological Striations',
      category: 'KAILASH',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_116.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_116.jpg',
      caption: 'Ancient horizontal rock strata and glacial amphitheatre viewed during the 52-km circuit.',
      displayOrder: 8,
    },
    {
      title: 'Yamdwar — The Gate of Salvation',
      category: 'PARIKRAMA',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_019.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_019.jpg',
      caption: 'Yatris passing through Yamdwar at Tarboche to commence the sacred 52 km circumambulation.',
      displayOrder: 9,
    },
    {
      title: 'Lake Manasarovar Serene Shores',
      category: 'MANSAROVAR',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_063.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_063.jpg',
      caption: 'Pristine azure waters of Mapam Yumtso under vast Himalayan skies.',
      displayOrder: 10,
    },
    {
      title: 'Pilgrim Devotee Companions',
      category: 'RITUALS',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_010.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_010.jpg',
      caption: 'Devotees united in faith and fellowship during the transformative journey.',
      displayOrder: 11,
    },
    {
      title: 'Mount Kailash Golden Sunset Darshan',
      category: 'KAILASH',
      imageUrl: '/assets/shlloka-yatra/images/sy_img_065.jpg',
      thumbnailUrl: '/assets/shlloka-yatra/images/sy_img_065.jpg',
      caption: 'Golden alpine glow over the holy summit of Mount Kailash.',
      displayOrder: 12,
    },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }
  console.log(`Seeded ${galleryItems.length} gallery items`);

  // 7. Seed Sample Bookings (Confirmed, Pending, Cancelled)
  const dep1 = await prisma.departure.findUnique({ where: { batchNumber: 1 } });
  const dep2 = await prisma.departure.findUnique({ where: { batchNumber: 2 } });
  const dep3 = await prisma.departure.findUnique({ where: { batchNumber: 3 } });
  const route1 = await prisma.route.findUnique({ where: { routeNumber: 1 } });
  const route2 = await prisma.route.findUnique({ where: { routeNumber: 2 } });

  // Booking 1: Confirmed & Fully Paid
  const booking1 = await prisma.booking.create({
    data: {
      bookingReference: 'SKY-2027-1001',
      departureId: dep1.id,
      routeId: route1.id,
      passportType: 'INDIAN',
      contactName: 'Rajesh Sharma',
      contactEmail: 'rajesh.sharma@example.com',
      contactPhone: '+91 9876543210',
      totalTravellers: 2,
      baseAmount: 700000,
      gstAmount: 35000,
      supplementAmount: 0,
      totalAmount: 735000,
      currency: 'INR',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      notes: 'Special request: Jain meal preference and ground floor room preference in Kathmandu.',
      travellers: {
        create: [
          {
            fullName: 'Rajesh Sharma',
            passportNumber: 'Z1234567',
            nationality: 'Indian',
            age: 52,
            gender: 'MALE',
            dietaryPreference: 'JAIN',
            emergencyContactName: 'Sunita Sharma',
            emergencyContactPhone: '+91 9876543211',
            isPrimary: true,
            docVerificationStatus: 'VERIFIED',
          },
          {
            fullName: 'Sunita Sharma',
            passportNumber: 'Z1234568',
            nationality: 'Indian',
            age: 49,
            gender: 'FEMALE',
            dietaryPreference: 'JAIN',
            emergencyContactName: 'Ankit Sharma',
            emergencyContactPhone: '+91 9876543212',
            isPrimary: false,
            docVerificationStatus: 'VERIFIED',
          },
        ],
      },
      payments: {
        create: [
          {
            transactionId: 'TXN-SHLLOKA-001A',
            installmentType: 'REGISTRATION',
            receiptNumber: 'REC-2027-001A',
            paymentMethod: 'ONLINE_UPI',
            amount: 50000,
            currency: 'INR',
            status: 'SUCCESS',
            webhookVerified: true,
            gatewayResponse: JSON.stringify({ mode: 'sandbox', verifiedAt: new Date() }),
          },
          {
            transactionId: 'TXN-SHLLOKA-001B',
            installmentType: 'FULL',
            receiptNumber: 'REC-2027-001B',
            paymentMethod: 'ONLINE_NET_BANKING',
            amount: 685000,
            currency: 'INR',
            status: 'SUCCESS',
            webhookVerified: true,
            gatewayResponse: JSON.stringify({ mode: 'sandbox', verifiedAt: new Date() }),
          },
        ],
      },
      consentRecords: {
        create: {
          termsAccepted: true,
          termsVersion: 'DRAFT-V1.0-NOV-2026',
          cancellationAccepted: true,
          cancellationVersion: 'DRAFT-V1.0-NOV-2026',
          scheduleAccepted: true,
          scheduleVersion: '2027-V1.0',
          riskAcknowledged: true,
          riskVersion: 'DRAFT-V1.0-NOV-2026',
          privacyConsent: true,
          marketingConsent: true,
          publicityConsent: false,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      },
    },
  });

  // Booking 2: Pending (Deposit paid, documents uploaded)
  const booking2 = await prisma.booking.create({
    data: {
      bookingReference: 'SKY-2027-1002',
      departureId: dep2.id,
      routeId: route2.id,
      passportType: 'INDIAN',
      contactName: 'Ananya Deshmukh',
      contactEmail: 'ananya.deshmukh@example.com',
      contactPhone: '+91 9822012345',
      totalTravellers: 1,
      baseAmount: 437000,
      gstAmount: 21850,
      supplementAmount: 0,
      totalAmount: 458850,
      currency: 'INR',
      status: 'PENDING',
      paymentStatus: 'PARTIALLY_PAID',
      notes: 'Awaiting medical fitness certificate verification.',
      travellers: {
        create: [
          {
            fullName: 'Ananya Deshmukh',
            passportNumber: 'M9876543',
            nationality: 'Indian',
            age: 38,
            gender: 'FEMALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Vikram Deshmukh',
            emergencyContactPhone: '+91 9822012346',
            isPrimary: true,
            docVerificationStatus: 'PENDING',
          },
        ],
      },
      payments: {
        create: {
          transactionId: 'TXN-SHLLOKA-002A',
          installmentType: 'REGISTRATION',
          receiptNumber: 'REC-2027-002A',
          paymentMethod: 'ONLINE_CARD',
          amount: 25000,
          currency: 'INR',
          status: 'SUCCESS',
          webhookVerified: true,
          gatewayResponse: JSON.stringify({ mode: 'sandbox', deposit: 25000 }),
        },
      },
      consentRecords: {
        create: {
          termsAccepted: true,
          termsVersion: 'DRAFT-V1.0-NOV-2026',
          cancellationAccepted: true,
          cancellationVersion: 'DRAFT-V1.0-NOV-2026',
          scheduleAccepted: true,
          scheduleVersion: '2027-V1.0',
          riskAcknowledged: true,
          riskVersion: 'DRAFT-V1.0-NOV-2026',
          privacyConsent: true,
          marketingConsent: false,
          publicityConsent: false,
          ipAddress: '127.0.0.1',
        },
      },
    },
  });

  // Booking 3: Cancelled with Refund Record
  const booking3 = await prisma.booking.create({
    data: {
      bookingReference: 'SKY-2027-1003',
      departureId: dep3.id,
      routeId: route1.id,
      passportType: 'INDIAN',
      contactName: 'Suresh Patel',
      contactEmail: 'suresh.patel@example.com',
      contactPhone: '+91 9712345678',
      totalTravellers: 1,
      baseAmount: 350000,
      gstAmount: 17500,
      supplementAmount: 0,
      totalAmount: 367500,
      currency: 'INR',
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      cancellationReason: 'Personal medical emergency before travel',
      cancelledAt: new Date(),
      refundAmount: 262500,
      travellers: {
        create: [
          {
            fullName: 'Suresh Patel',
            passportNumber: 'P4567890',
            nationality: 'Indian',
            age: 61,
            gender: 'MALE',
            dietaryPreference: 'PURE_VEGETARIAN',
            emergencyContactName: 'Bhavna Patel',
            emergencyContactPhone: '+91 9712345679',
            isPrimary: true,
            docVerificationStatus: 'REJECTED',
            rejectionReason: 'Cancelled upon participant request due to knee surgery.',
          },
        ],
      },
      payments: {
        create: {
          transactionId: 'TXN-SHLLOKA-003A',
          installmentType: 'FULL',
          receiptNumber: 'REC-2027-003A',
          paymentMethod: 'ONLINE_NET_BANKING',
          amount: 367500,
          currency: 'INR',
          status: 'SUCCESS',
          webhookVerified: true,
        },
      },
      refunds: {
        create: {
          refundReference: 'REF-2027-001',
          cancellationReason: 'Doctor recommended postponing strenuous trekking due to acute knee surgery',
          daysBeforeDeparture: 82,
          packageBasePrice: 350000,
          totalPaid: 367500,
          cancellationChargeRate: 0.25,
          cancellationChargeAmount: 87500,
          taxRefundAmount: 0,
          netRefundAmount: 262500,
          status: 'PROCESSED',
          approvedBy: 'finance@shlloka.com',
          approvedAt: new Date(),
          processedAt: new Date(),
          notes: 'Cancelled 82 days prior (75+ days slab: 75% package refund = ₹2,62,500; GST non-refundable). Approved by Finance.',
        },
      },
    },
  });

  console.log('Seeded 3 sample bookings (Confirmed, Pending, Cancelled with Refund)');

  // 8. Seed Sample Enquiries
  const enquiriesData = [
    {
      name: 'Dr. Meenakshi Sundaram',
      email: 'dr.sundaram@gmail.com',
      phone: '+91 9840123456',
      preferredBatch: 'june-2-batch-full-moon-2027',
      preferredRoute: 'Option 2: Fly to Lhasa, Continue by Road',
      travellersCount: 2,
      message: 'My spouse and I are doctors interested in the Saga Dawa full moon batch. What are the oxygen backups provided during the trek?',
      status: 'NEW',
    },
    {
      name: 'Amitabh Sengupta',
      email: 'amitabh.s@hotmail.com',
      phone: '+91 9830987654',
      preferredBatch: 'may-batch-full-moon-2027',
      preferredRoute: 'Option 1: Classic Overland',
      travellersCount: 4,
      message: 'We are a family of four. Can we hire two ponies for our senior parents in advance?',
      status: 'CONTACTED',
      assignedTo: 'operations@shlloka.com',
      internalNotes: 'Contacted via phone. Explained pony hire process at Yamdwar and issued brochure.',
    },
    {
      name: 'Sneha Kapadia',
      email: 'sneha.k@yahoo.com',
      phone: '+91 9820554433',
      preferredBatch: 'july-2-batch-full-moon-2027',
      preferredRoute: 'Option 3: Fly to Lhasa & Ali/Pulan',
      travellersCount: 1,
      message: 'Interested in the high-comfort flight route for Guru Purnima. Please share flight timings and visa deadlines.',
      status: 'CONVERTED',
      assignedTo: 'operations@shlloka.com',
      internalNotes: 'Converted to Booking SKY-2027-1002.',
    },
  ];

  for (const enq of enquiriesData) {
    await prisma.enquiry.create({ data: enq });
  }
  console.log(`Seeded ${enquiriesData.length} enquiries`);

  // 9. Seed Sample Support Tickets
  await prisma.supportTicket.create({
    data: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      bookingId: booking1.id,
      subject: 'Inquiry regarding down jacket sizing and duffel bags',
      message: 'Namaste! We received our booking confirmation. When do we need to submit our jacket sizes for the complimentary down jackets?',
      status: 'OPEN',
      priority: 'NORMAL',
    },
  });

  await prisma.supportTicket.create({
    data: {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@example.com',
      bookingId: booking2.id,
      subject: 'Doctor fitness certificate submission deadline',
      message: 'My doctor appointment for treadmill ECG is next week. Can I upload the certificate by end of month?',
      status: 'IN_PROGRESS',
      priority: 'NORMAL',
      adminNotes: 'Informed traveller that medical certificates can be uploaded until 45 days before departure.',
    },
  });
  console.log('Seeded sample support tickets');

  // 10. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      userEmail: admin.email,
      action: 'SYSTEM_SEED_INITIALIZATION',
      entity: 'DATABASE',
      details: JSON.stringify({
        event: 'Shlloka Yatra 2027 full database initialization completed successfully',
        timestamp: new Date().toISOString(),
      }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Shlloka Yatra 2027 database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
