/**
 * Shloka Yatra 2027 — Clean Production Database Seeder
 * Database: AWS RDS PostgreSQL
 * 
 * STRICT PRODUCTION RULES:
 * - NO demo devotees / test accounts
 * - NO demo bookings or test payments
 * - NO test support tickets or fake leads
 * - Seeds strictly:
 *   1. Super Admin administrative accounts (SUPER_ADMIN role)
 *   2. 8 Official 2027 Departures / Batches
 *   3. 3 Travel Routes and Pricing Tiers (Indian & Foreign)
 *   4. Official FAQs & Gallery Items
 *   5. Official Legal Documents (Terms, Privacy, Cancellation, Risk)
 *   6. Document Templates for Medical & Risk Compliance
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Clean Production Database Seeding for Shloka Yatra 2027 ---');

  // Verify database connection
  await prisma.$connect();
  console.log('Connected to Production Database.');

  // Check if admin already exists to prevent duplicate seeding
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@shloka.com' },
  });

  if (existingAdmin) {
    console.log('Super Admin account already exists. Skipping user creation.');
  } else {
    // 1. Seed Super Admin Accounts
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'ShlokaAdmin@2027';
    const adminHash = await bcrypt.hash(defaultPassword, 12);

    await prisma.user.create({
      data: {
        email: 'admin@shloka.com',
        passwordHash: adminHash,
        name: 'Super Administrator',
        phone: '+91 6366852888',
        role: 'SUPER_ADMIN',
        mustChangePassword: true,
      },
    });

    await prisma.user.create({
      data: {
        email: 'admin@shlloka.com',
        passwordHash: adminHash,
        name: 'Super Administrator',
        phone: '+91 6366852888',
        role: 'SUPER_ADMIN',
        mustChangePassword: true,
      },
    });

    console.log('Seeded Super Admin credentials (SUPER_ADMIN role).');
  }

  // 2. Seed 8 Official Departures for 2027
  const departuresCount = await prisma.departure.count();
  if (departuresCount === 0) {
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'First departure of the 2027 season aligned with the auspicious Vaishakh Full Moon at holy Lake Manasarovar and Mount Kailash.',
        notes: 'Brochure stated duration: 15 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Early summer yatra with crisp visibility across the high Tibetan plateau and pleasant daytime trekking conditions.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Saga Dawa / Jyeshtha Full Moon yatra. One of the holiest and most sought-after pilgrimage dates across the Himalayas.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Midsummer departure with extended daylight hours, vibrant Tibetan landscape, and steady weather windows.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Traverses through the rain-shadow region of Western Tibet where the sacred plateau remains predominantly dry.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Auspicious Guru Purnima Full Moon Batch. Sacred rituals on the holy shores of Lake Manasarovar under the illuminated sky.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Late summer journey with green alpine pastures in lower regions and clear water streams across the circumambulation trails.',
        notes: 'Brochure stated duration: 16 days.',
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
        bookedSeats: 0,
        status: 'AVAILABLE',
        description: 'Shravana Purnima Full Moon Batch. Deep spiritual resonance marking the grand conclusion of the 2027 pilgrimage season.',
        notes: 'Brochure stated duration: 16 days.',
      },
    ];

    for (const dep of departuresData) {
      await prisma.departure.create({ data: dep });
    }
    console.log(`Seeded ${departuresData.length} Departures for 2027.`);
  }

  // 3. Seed 3 Routes and Pricing Tiers
  const routesCount = await prisma.route.count();
  if (routesCount === 0) {
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
            foreignAirfareSupplement: 600,
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
            foreignAirfareSupplement: 1200,
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
    console.log(`Seeded ${routes.length} Routes with Pricing Tiers.`);
  }

  // 4. Seed FAQs
  const faqsCount = await prisma.faq.count();
  if (faqsCount === 0) {
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
        answer: 'Voluntary cancellation schedule: 75+ days before departure: 75% refund of Package Base Price; 60–74 days: 50% refund; 30–59 days: 25% refund; fewer than 30 days or no-show: 0% refund. GST and third-party statutory fees are non-refundable per applicable law.',
        displayOrder: 8,
      },
    ];

    for (const faq of faqsData) {
      await prisma.faq.create({ data: faq });
    }
    console.log(`Seeded ${faqsData.length} FAQs.`);
  }

  // 5. Seed Official Legal Documents
  const legalDocsCount = await prisma.legalDocument.count();
  if (legalDocsCount === 0) {
    const legalDocs = [
      {
        slug: 'terms-and-conditions',
        title: 'Master Terms and Conditions',
        version: 'DRAFT-V1.0-NOV-2026',
        effectiveDate: new Date('2026-11-12'),
        status: 'PUBLISHED',
        isApproved: true,
        contentMarkdown: `# TERMS & CONDITIONS\n**Shlloka Yatra Private Limited | Kailash Mansarovar Parikrama Yatra 2027**\n\n### T1 Contracting entity\nShlloka Yatra Private Limited is the sole contracting organiser.\n\n### T5 Registration & Confirmation\nInitial registration deposit of ₹25,000 (or USD 250) credited towards package base price.`,
      },
      {
        slug: 'cancellation-policy',
        title: 'Cancellation, Refund and Force Majeure Policy',
        version: 'DRAFT-V1.0-NOV-2026',
        effectiveDate: new Date('2026-11-12'),
        status: 'PUBLISHED',
        isApproved: true,
        contentMarkdown: `# CANCELLATION, REFUND & FORCE MAJEURE POLICY\n\n### C2 Voluntary Cancellation\n- 75+ days: 25% charge\n- 60-74 days: 50% charge\n- 30-59 days: 75% charge\n- <30 days: 100% charge`,
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy and Data Protection Notice',
        version: 'DRAFT-V1.0-NOV-2026',
        effectiveDate: new Date('2026-11-12'),
        status: 'PUBLISHED',
        isApproved: true,
        contentMarkdown: `# PRIVACY & DATA PROTECTION NOTICE\n\nData processed strictly for travel permits, medical readiness, and logistics coordination.`,
      },
      {
        slug: 'risk-acknowledgement',
        title: 'Participant High-Altitude Risk Acknowledgement & Emergency Medical Authorisation',
        version: 'DRAFT-V1.0-NOV-2026',
        effectiveDate: new Date('2026-11-12'),
        status: 'PUBLISHED',
        isApproved: true,
        contentMarkdown: `# PARTICIPANT HIGH-ALTITUDE RISK ACKNOWLEDGEMENT\n\nParticipants acknowledge extreme altitude conditions exceeding 5,000m and commit to medical compliance.`,
      },
    ];

    for (const doc of legalDocs) {
      await prisma.legalDocument.create({ data: doc });
    }
    console.log(`Seeded ${legalDocs.length} Legal Documents.`);
  }

  // 6. Seed Compliance Document Templates
  const templatesCount = await prisma.documentTemplate.count();
  if (templatesCount === 0) {
    const templates = [
      {
        documentRef: 'DOC-MED-FITNESS-2027',
        title: 'High-Altitude Medical Fitness Certificate',
        category: 'MEDICAL',
        version: 'Draft 1.0 – 23 November 2026',
        lifecycleStatus: 'PUBLISHED',
        isApproved: true,
        description: 'Mandatory clinical fitness certification from registered physician with ECG and pulmonary clearance.',
        clausesCount: 14,
      },
      {
        documentRef: 'DOC-RISK-INDEMNITY-2027',
        title: 'Risk Declaration and Voluntary Indemnity',
        category: 'COMPLIANCE',
        version: 'Draft 1.0 – 23 November 2026',
        lifecycleStatus: 'PUBLISHED',
        isApproved: true,
        description: 'Participant acknowledgement of high-altitude Himalayan terrain, weather unpredictability, and safety protocols.',
        clausesCount: 22,
      },
    ];

    for (const t of templates) {
      await prisma.documentTemplate.create({ data: t });
    }
    console.log(`Seeded ${templates.length} Compliance Document Templates.`);
  }

  console.log('--- Production Database Seeding Successfully Completed (Zero Demo Data) ---');
}

main()
  .catch((e) => {
    console.error('Production Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
