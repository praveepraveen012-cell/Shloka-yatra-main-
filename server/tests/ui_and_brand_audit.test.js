import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd().endsWith('server') ? path.resolve(process.cwd(), '..') : process.cwd();
const CLIENT_SRC = path.join(ROOT_DIR, 'client', 'src');

describe('Shloka Yatra 2027 — UI Refinement, Brand, and Quality Audit Tests', () => {

  // TEST 1: Header rendering & correct brand name
  test('1. Header renders with correct "SHLOKA YATRA" brand text and no "SHLLOKA"', () => {
    const navbarPath = path.join(CLIENT_SRC, 'components', 'Navbar.jsx');
    const content = fs.readFileSync(navbarPath, 'utf8');

    assert.ok(content.includes('SHLOKA YATRA'), 'Navbar must contain "SHLOKA YATRA"');
    assert.strictEqual(content.includes('SHLLOKA YATRA'), false, 'Navbar must not contain "SHLLOKA YATRA"');
  });

  // TEST 2: Absence of the draft approval notice
  test('2. Complete absence of the draft approval notice across public navigation and legal pages', () => {
    const navbarPath = path.join(CLIENT_SRC, 'components', 'Navbar.jsx');
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');
    const termsPath = path.join(CLIENT_SRC, 'pages', 'TermsPage.jsx');
    const legalDataPath = path.join(CLIENT_SRC, 'data', 'legalData.js');

    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    const homeContent = fs.readFileSync(homePath, 'utf8');
    const termsContent = fs.readFileSync(termsPath, 'utf8');
    const legalDataContent = fs.readFileSync(legalDataPath, 'utf8');

    const draftPattern = 'DRAFT V1.0 — FOR LEGAL AND MANAGEMENT APPROVAL';
    assert.strictEqual(navbarContent.includes(draftPattern), false, 'Navbar must not contain draft notice');
    assert.strictEqual(homeContent.includes(draftPattern), false, 'HomePage must not contain draft notice');
    assert.strictEqual(termsContent.includes(draftPattern), false, 'TermsPage must not contain draft notice');
    assert.strictEqual(legalDataContent.includes(draftPattern), false, 'legalData must not contain draft notice');
  });

  // TEST 3: Navigation labels in Navbar
  test('3. Navigation labels are correctly structured with 15-16px font scale and clean routes', () => {
    const navbarPath = path.join(CLIENT_SRC, 'components', 'Navbar.jsx');
    const content = fs.readFileSync(navbarPath, 'utf8');

    assert.ok(content.includes('Kailash Mansarovar'), 'Navbar must have Kailash Mansarovar link');
    assert.ok(content.includes('Travel Routes'), 'Navbar must have Travel Routes link');
    assert.ok(content.includes('Journey Experience'), 'Navbar must have Journey Experience link');
    assert.ok(content.includes('About Us'), 'Navbar must have About Us link');
    assert.ok(content.includes('Contact'), 'Navbar must have Contact link');
    assert.ok(content.includes('text-[15px]'), 'Navbar links must use readable 15px text');
  });

  // TEST 4: Absence of the four hero feature-strip items from Homepage
  test('4. Absence of the four decorative feature-strip items from Homepage Hero', () => {
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');
    const content = fs.readFileSync(homePath, 'utf8');

    // Section 2 Hero should not contain the horizontal strip
    const heroSectionMatch = content.match(/SECTION 2: NEW HERO EXPERIENCE[\s\S]*?SECTION 3: JOURNEY SEARCH/);
    assert.ok(heroSectionMatch, 'Hero section must exist');
    const heroText = heroSectionMatch[0];

    assert.strictEqual(heroText.includes('3 Curated Travel Routes'), false, 'Hero must not have "3 Curated Travel Routes"');
    assert.strictEqual(heroText.includes('Pure Satvik Catering'), false, 'Hero must not have "Pure Satvik Catering"');
    assert.strictEqual(heroText.includes('1:3 Dedicated Sherpa Ratio'), false, 'Hero must not have "1:3 Dedicated Sherpa Ratio"');
    assert.strictEqual(heroText.includes('Official Tibet Group Permits'), false, 'Hero must not have "Official Tibet Group Permits"');
  });

  // TEST 5: Absence of moon emoji in batch information
  test('5. Absence of moon emoji (🌕) in batch information and schedule dropdowns', () => {
    const widgetPath = path.join(CLIENT_SRC, 'components', 'JourneySearchWidget.jsx');
    const selectorPath = path.join(CLIENT_SRC, 'components', 'DepartureSelector.jsx');
    const widgetContent = fs.readFileSync(widgetPath, 'utf8');
    const selectorContent = fs.readFileSync(selectorPath, 'utf8');

    assert.strictEqual(widgetContent.includes('🌕'), false, 'JourneySearchWidget must not contain moon emoji 🌕');
    assert.strictEqual(widgetContent.includes('🌕 (Full Moon)'), false, 'Dropdown must not contain "🌕 (Full Moon)"');
    assert.strictEqual(selectorContent.includes('<Moon'), false, 'DepartureSelector must not contain <Moon /> icon');
  });

  // TEST 6: Footer Terms & Conditions label (no "Master")
  test('6. Footer displays "Terms & Conditions" without "Master"', () => {
    const footerPath = path.join(CLIENT_SRC, 'components', 'Footer.jsx');
    const content = fs.readFileSync(footerPath, 'utf8');

    assert.ok(content.includes('Terms & Conditions'), 'Footer must contain "Terms & Conditions"');
    assert.strictEqual(content.includes('Master Terms & Conditions'), false, 'Footer must not contain "Master Terms & Conditions"');
  });

  // TEST 7: Powered by Grexotix rendering & isolated hover styling
  test('7. Powered by Grexotix isolates hover styling strictly to the word "Grexotix"', () => {
    const footerPath = path.join(CLIENT_SRC, 'components', 'Footer.jsx');
    const content = fs.readFileSync(footerPath, 'utf8');

    assert.ok(content.includes('Powered by'), 'Footer must contain "Powered by" text');
    assert.ok(content.includes('https://grexotix.com/'), 'Footer must link to https://grexotix.com/');
    // Verify that "Powered by" is outside the <a> link in a neutral span
    assert.ok(
      content.includes('<span className="text-[#8CA8CC]">Powered by</span>') ||
      content.includes('Powered by</span>'),
      '"Powered by" must be neutral text'
    );
    assert.ok(
      content.includes('hover:text-white') || content.includes('onMouseEnter'),
      'Grexotix must have hover state'
    );
  });

  // TEST 8: Typography configuration in Tailwind & CSS
  test('8. Typography system enforces Montserrat for headings and Segoe UI for body', () => {
    const tailwindPath = path.join(ROOT_DIR, 'client', 'tailwind.config.js');
    const cssPath = path.join(CLIENT_SRC, 'index.css');

    const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    assert.ok(tailwindContent.includes('Montserrat'), 'Tailwind must configure Montserrat');
    assert.ok(tailwindContent.includes('Segoe UI'), 'Tailwind must configure Segoe UI');
    assert.ok(cssContent.includes('--heading: "Montserrat", sans-serif;'), 'CSS must set --heading to Montserrat');
    assert.ok(cssContent.includes('--sans: "Segoe UI"'), 'CSS must set --sans to Segoe UI');
  });

  // TEST 9: Color palette matches the professional palette system
  test('9. Color palette matches the approved palette: Navy #101D35, Gold #D9A441, Ivory #F7F6F2', () => {
    const cssPath = path.join(CLIENT_SRC, 'index.css');
    const content = fs.readFileSync(cssPath, 'utf8');

    assert.ok(content.includes('#101D35'), 'CSS must contain primary navy #101D35');
    assert.ok(content.includes('#1C3455'), 'CSS must contain secondary navy #1C3455');
    assert.ok(content.includes('#D9A441'), 'CSS must contain gold accent #D9A441');
    assert.ok(content.includes('#F7F6F2'), 'CSS must contain main background #F7F6F2');
    assert.ok(content.includes('#202A36'), 'CSS must contain main text #202A36');
    assert.ok(content.includes('#5E6B7A'), 'CSS must contain secondary text #5E6B7A');
    assert.ok(content.includes('#E2E6EB'), 'CSS must contain border color #E2E6EB');
  });

  // TEST 10: RouteCard layout balance and sizing
  test('10. RouteCard enforces 42% image / 58% content layout with capped image height', () => {
    const cardPath = path.join(CLIENT_SRC, 'components', 'RouteCard.jsx');
    const content = fs.readFileSync(cardPath, 'utf8');

    assert.ok(content.includes('lg:w-[42%]'), 'RouteCard must specify 42% left image width');
    assert.ok(content.includes('lg:w-[58%]'), 'RouteCard must specify 58% right content width');
    assert.ok(content.includes('lg:max-h-[350px]'), 'RouteCard must cap image height to max 350px');
    assert.ok(content.includes('font-heading text-xl sm:text-2xl'), 'RouteCard title must use Montserrat 20-24px');
  });

  // TEST 11: Booking route data integrity across 3 routes
  test('11. Booking route data integrity: Option 1 (Bus), Option 2 (Flight Lhasa), Option 3 (Lhasa-Ali)', () => {
    const brochurePath = path.join(CLIENT_SRC, 'data', 'brochureData.js');
    const content = fs.readFileSync(brochurePath, 'utf8');

    assert.ok(content.includes('bus-both-ways'), 'Must support Option 1 Bus Both Ways');
    assert.ok(content.includes('flight-to-lhasa'), 'Must support Option 2 Flight to Lhasa');
    assert.ok(content.includes('lhasa-ali-pulan'), 'Must support Option 3 Lhasa-Ali');
    assert.ok(content.includes('350000'), 'Option 1 base price is 350000');
    assert.ok(content.includes('437000'), 'Option 2 base price is 437000');
    assert.ok(content.includes('494000'), 'Option 3 base price is 494000');
  });

  // TEST 12: Departure batches configuration (8 total, 4 full moon)
  test('12. Departure batches configuration: 8 total batches, Full Moon alignments properly marked', () => {
    const brochurePath = path.join(CLIENT_SRC, 'data', 'brochureData.js');
    const content = fs.readFileSync(brochurePath, 'utf8');

    assert.ok(content.includes('May Batch — Full Moon'), 'May batch must exist');
    assert.ok(content.includes('June I Batch'), 'June I batch must exist');
    assert.ok(content.includes('June II Batch — Full Moon'), 'June II batch must exist');
    assert.ok(content.includes('June III Batch'), 'June III batch must exist');
    assert.ok(content.includes('July I Batch'), 'July I batch must exist');
    assert.ok(content.includes('July II Batch — Full Moon'), 'July II batch must exist');
    assert.ok(content.includes('August I Batch'), 'August I batch must exist');
    assert.ok(content.includes('August II Batch — Full Moon'), 'August II batch must exist');
  });

  // TEST 13: Legal contractual metadata standardisation
  test('13. Legal contractual metadata uses "Shloka Yatra" and official 2027 release badge', () => {
    const legalPath = path.join(CLIENT_SRC, 'data', 'legalData.js');
    const content = fs.readFileSync(legalPath, 'utf8');

    assert.ok(content.includes('shortName: "Shloka Yatra"'), 'legalData shortName must be Shloka Yatra');
    assert.ok(content.includes('companyName: "Shloka Yatra Private Limited"'), 'companyName must be Shloka Yatra Private Limited');
    assert.ok(content.includes('OFFICIAL 2027 RELEASE V1.0'), 'version must be OFFICIAL 2027 RELEASE V1.0');
  });

  // TEST 14: HTML page title and metadata
  test('14. HTML page title and meta description use standardized "Shloka Yatra"', () => {
    const htmlPath = path.join(ROOT_DIR, 'client', 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(content.includes('<title>Shloka Yatra — Sacred Journeys to Kailash Manasarovar 2027</title>'), 'HTML title must be Shloka Yatra');
    assert.ok(content.includes('content="Shloka Yatra —'), 'HTML meta description must be Shloka Yatra');
    assert.strictEqual(content.includes('Shlloka Yatra'), false, 'HTML must not contain "Shlloka Yatra"');
  });

  // TEST 15: Absence of video elements throughout the website
  test('15. Zero video elements: no <video>, <source>, iframe YouTube or Vimeo embeds', () => {
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');
    const landingPath = path.join(CLIENT_SRC, 'pages', 'Landing2027Page.jsx');
    const homeContent = fs.readFileSync(homePath, 'utf8');
    const landingContent = fs.readFileSync(landingPath, 'utf8');

    assert.strictEqual(homeContent.includes('<video'), false, 'HomePage must not have <video>');
    assert.strictEqual(homeContent.includes('youtube.com'), false, 'HomePage must not have YouTube embeds');
    assert.strictEqual(landingContent.includes('<video'), false, 'LandingPage must not have <video>');
  });

  // TEST 16: JourneySearchWidget sits cleanly below the Hero banner without negative margin overlap
  test('16. Booking widget sits cleanly below the Hero banner without overlapping negative margins', () => {
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');
    const homeContent = fs.readFileSync(homePath, 'utf8');

    // Confirm negative margin overlap is eliminated
    assert.strictEqual(homeContent.includes('-mt-12'), false, 'HomePage must not pull widget up with -mt-12');
    assert.strictEqual(homeContent.includes('-mt-14'), false, 'HomePage must not pull widget up with -mt-14');
    assert.strictEqual(homeContent.includes('-mt-16'), false, 'HomePage must not pull widget up with -mt-16');
    assert.ok(homeContent.includes('id="search-packages"'), 'Search widget must be placed in clean dedicated section');
  });

  // TEST 17: Pilgrimage route packages use "Package 1", "Package 2", "Package 3" professional nomenclature
  test('17. Pilgrimage packages use professional "Package 1 / 2 / 3" terminology', () => {
    const widgetPath = path.join(CLIENT_SRC, 'components', 'JourneySearchWidget.jsx');
    const routeCardPath = path.join(CLIENT_SRC, 'components', 'RouteCard.jsx');
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');

    const widgetContent = fs.readFileSync(widgetPath, 'utf8');
    const cardContent = fs.readFileSync(routeCardPath, 'utf8');
    const homeContent = fs.readFileSync(homePath, 'utf8');

    assert.ok(widgetContent.includes('Package 1:'), 'Search widget must reference Package 1');
    assert.ok(widgetContent.includes('Package 2:'), 'Search widget must reference Package 2');
    assert.ok(widgetContent.includes('Package 3:'), 'Search widget must reference Package 3');
    assert.ok(cardContent.includes('Package {route.routeNumber}'), 'RouteCard badge must say Package');
    assert.ok(cardContent.includes('Yatra Package {route.routeNumber}'), 'RouteCard subtitle must say Yatra Package');
    assert.ok(homeContent.includes('Package 1: Overland Pilgrimage'), 'HomePage must use Package 1');
  });

  // TEST 18: Table responsiveness features for mobile and tablet
  test('18. Table responsiveness features: swipe cues, sticky columns, and mobile views', () => {
    const comparePath = path.join(CLIENT_SRC, 'pages', 'RoutesComparePage.jsx');
    const departuresPath = path.join(CLIENT_SRC, 'pages', 'DeparturesPage.jsx');

    const compareContent = fs.readFileSync(comparePath, 'utf8');
    const departuresContent = fs.readFileSync(departuresPath, 'utf8');

    assert.ok(compareContent.includes('Swipe table horizontally'), 'Compare matrix must have swipe cue on mobile');
    assert.ok(compareContent.includes('sticky'), 'Compare matrix must have sticky first column');
    assert.ok(departuresContent.includes('grid grid-cols-1 gap-4 md:hidden'), 'Departures page must provide mobile card view');
  });
});
