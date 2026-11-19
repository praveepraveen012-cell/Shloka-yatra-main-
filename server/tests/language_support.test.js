import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_SRC = path.resolve(__dirname, '../../client/src');

test('Language & Translation Architecture Tests', async (t) => {
  await t.test('1. LanguageContext exists with comprehensive EN and HI dictionaries', () => {
    const langContextPath = path.join(CLIENT_SRC, 'context', 'LanguageContext.jsx');
    assert.ok(fs.existsSync(langContextPath), 'LanguageContext.jsx must exist');
    const content = fs.readFileSync(langContextPath, 'utf8');

    // Check critical Hindi translations
    assert.ok(content.includes('पवित्र कैलाश मानसरोवर यात्रा २०२७'), 'Must have Hindi hero title');
    assert.ok(content.includes('आधिकारिक २०२७ पवित्र तीर्थ यात्रा अभियान'), 'Must have Hindi hero eyebrow');
    assert.ok(content.includes('यात्रा पैकेज देखें'), 'Must have Hindi explore CTA');
    assert.ok(content.includes('२०२७ बैच खोजें'), 'Must have Hindi search CTA');
    assert.ok(content.includes('पैकेज १: केरुंग मार्ग से क्लासिक स्थल यात्रा'), 'Must have Hindi Package 1');
    assert.ok(content.includes('पैकेज २: ल्हासा विमान यात्रा'), 'Must have Hindi Package 2');
    assert.ok(content.includes('पैकेज ३: ल्हासा एवं अली/पुरंग'), 'Must have Hindi Package 3');
    assert.ok(content.includes('५२ किमी पावन कैलाश परिक्रमा'), 'Must have Hindi 52km parikrama');
    assert.ok(content.includes('समर्पित सात्विक रसोई दल'), 'Must have Hindi Satvik Kitchen');
  });

  await t.test('2. main.jsx wraps App with LanguageProvider', () => {
    const mainPath = path.join(CLIENT_SRC, 'main.jsx');
    const content = fs.readFileSync(mainPath, 'utf8');
    assert.ok(content.includes('<LanguageProvider>'), 'main.jsx must wrap App with LanguageProvider');
    assert.ok(content.includes('</LanguageProvider>'), 'main.jsx must close LanguageProvider');
  });

  await t.test('3. Navbar.jsx consumes useLanguage and provides EN/HI toggle for desktop and mobile', () => {
    const navbarPath = path.join(CLIENT_SRC, 'components', 'Navbar.jsx');
    const content = fs.readFileSync(navbarPath, 'utf8');
    assert.ok(content.includes('useLanguage'), 'Navbar.jsx must import useLanguage');
    assert.ok(content.includes("setLanguage('EN')"), 'Navbar.jsx must allow setting English');
    assert.ok(content.includes("setLanguage('HI')"), 'Navbar.jsx must allow setting Hindi');
    assert.ok(content.includes('t('), 'Navbar.jsx must use translation helper t');
  });

  await t.test('4. HomePage.jsx consumes useLanguage and supports full page Hindi translation', () => {
    const homePath = path.join(CLIENT_SRC, 'pages', 'HomePage.jsx');
    const content = fs.readFileSync(homePath, 'utf8');
    assert.ok(content.includes('useLanguage'), 'HomePage.jsx must import useLanguage');
    assert.ok(content.includes("t('hero.title')"), 'HomePage.jsx must translate hero title');
    assert.ok(content.includes("t('hero.subtitle')"), 'HomePage.jsx must translate hero subtitle');
    assert.ok(content.includes("t('privileges.heading')"), 'HomePage.jsx must translate benefits heading');
    assert.ok(content.includes("t('whyChoose.heading')"), 'HomePage.jsx must translate why choose heading');
    assert.ok(content.includes("t('destinations.heading')"), 'HomePage.jsx must translate destinations heading');
    assert.ok(content.includes("t('stages.heading')"), 'HomePage.jsx must translate stages heading');
    assert.ok(content.includes("t('preparation.heading')"), 'HomePage.jsx must translate preparation heading');
    assert.ok(content.includes("t('faqs.heading')"), 'HomePage.jsx must translate faqs heading');
    assert.ok(content.includes("t('finalCta.heading')"), 'HomePage.jsx must translate final CTA heading');
  });

  await t.test('5. JourneySearchWidget.jsx consumes useLanguage and translates all search UI', () => {
    const widgetPath = path.join(CLIENT_SRC, 'components', 'JourneySearchWidget.jsx');
    const content = fs.readFileSync(widgetPath, 'utf8');
    assert.ok(content.includes('useLanguage'), 'JourneySearchWidget.jsx must import useLanguage');
    assert.ok(content.includes("t('search.allPackages')"), 'Search widget must translate tabs');
    assert.ok(content.includes("t('search.passportCategory')"), 'Search widget must translate passport category');
    assert.ok(content.includes("t('search.pilgrimageRoute')"), 'Search widget must translate route label');
    assert.ok(content.includes("t('search.departureSchedule')"), 'Search widget must translate schedule label');
    assert.ok(content.includes("t('search.devoteesRoom')"), 'Search widget must translate devotees label');
  });

  await t.test('6. RouteCard.jsx and Footer.jsx consume useLanguage', () => {
    const cardPath = path.join(CLIENT_SRC, 'components', 'RouteCard.jsx');
    const footerPath = path.join(CLIENT_SRC, 'components', 'Footer.jsx');
    const cardContent = fs.readFileSync(cardPath, 'utf8');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert.ok(cardContent.includes('useLanguage'), 'RouteCard.jsx must import useLanguage');
    assert.ok(footerContent.includes('useLanguage'), 'Footer.jsx must import useLanguage');
  });
});
