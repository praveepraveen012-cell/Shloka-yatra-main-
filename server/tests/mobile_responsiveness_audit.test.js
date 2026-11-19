import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const clientSrcDir = path.resolve('client', 'src');

describe('Mobile Responsiveness & Viewport Audit Tests', () => {
  test('1. Global CSS enforces box-sizing: border-box and horizontal overflow prevention on html & body', () => {
    const css = fs.readFileSync(path.join(clientSrcDir, 'index.css'), 'utf8');
    assert.match(css, /box-sizing:\s*border-box/, 'CSS must declare box-sizing: border-box globally');
    assert.match(css, /overflow-x:\s*hidden/, 'HTML and body must prevent horizontal overflow');
    assert.match(css, /max-width:\s*100%/, 'HTML and body must be constrained to max-width: 100%');
  });

  test('2. Navbar: responsive brand logo, 44px+ touch hamburger, and scrollable mobile drawer', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'components', 'Navbar.jsx'), 'utf8');
    // Touch target for hamburger
    assert.match(code, /min-w-\[44px\]/, 'Hamburger menu must have minimum 44px touch target');
    assert.match(code, /min-h-\[44px\]/, 'Hamburger menu must have minimum 44px touch target');
    // Truncate on brand to prevent blowout on small 320px screens
    assert.match(code, /truncate/, 'Brand logo text must have truncate protection');
    // Mobile drawer auto-close on link click
    assert.match(code, /setMobileOpen\(false\)/, 'Mobile drawer must close on navigation click');
  });

  test('3. FAQ Page & FaqAccordion: responsive headings, wrapped filter pills, and contained search input', () => {
    const pageCode = fs.readFileSync(path.join(clientSrcDir, 'pages', 'FaqsPage.jsx'), 'utf8');
    const accordionCode = fs.readFileSync(path.join(clientSrcDir, 'components', 'FaqAccordion.jsx'), 'utf8');

    // Heading scaled responsively without awkward clamp blowout
    assert.ok(!pageCode.includes('clamp(38px, 5.5vw, 72px)'), 'FaqsPage heading must not use oversized desktop clamp');
    assert.match(pageCode, /text-2xl\s+sm:text-4xl/, 'FaqsPage heading must scale responsively');

    // Filter pills wrapped
    assert.match(accordionCode, /flex-wrap/, 'FaqAccordion category buttons must wrap properly on mobile');
  });

  test('4. Booking Page: eliminates fixed desktop columns and employs responsive grid with full-width mobile inputs', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'BookingPage.jsx'), 'utf8');

    // Verify root cause of horizontal blowout is eradicated
    assert.ok(!code.includes("gridTemplateColumns: '1fr min(380px, 100%)'"), 'BookingPage must not use fixed inline grid blowout');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-\[1fr_380px\]/, 'BookingPage must use single column on mobile and two columns on large screens');

    // Step indicators scrollable
    assert.match(code, /overflow-x-auto/, 'Booking steps row must be horizontally scrollable on mobile');

    // Buttons stack on mobile
    assert.match(code, /flex-col-reverse\s+sm:flex-row/, 'Booking buttons must stack on mobile screens');
  });

  test('5. Terms & Conditions Page: eliminates 1fr 340px blowout and wraps long legal identifiers', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'TermsPage.jsx'), 'utf8');

    assert.ok(!code.includes("gridTemplateColumns: '1fr 340px'"), 'TermsPage must not use fixed 1fr 340px grid');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-\[1fr_340px\]/, 'TermsPage must use responsive grid');
    assert.match(code, /break-words/, 'TermsPage must wrap long contractual text');
  });

  test('6. Cancellation Policy Page: eliminates 1fr 380px blowout and wraps slabs table with scroll container', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'CancellationPolicyPage.jsx'), 'utf8');

    assert.ok(!code.includes("gridTemplateColumns: '1fr 380px'"), 'CancellationPolicyPage must not use fixed 1fr 380px grid');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-\[1fr_380px\]/, 'CancellationPolicyPage must use responsive grid');
    assert.match(code, /overflow-x-auto/, 'Cancellation slabs table must be wrapped in overflow-x-auto');
  });

  test('7. Risk Acknowledgement Page: eliminates fixed desktop columns and scales clauses responsively', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'RiskAcknowledgementPage.jsx'), 'utf8');

    assert.ok(!code.includes("gridTemplateColumns: '1fr 340px'"), 'RiskAcknowledgementPage must not use fixed 1fr 340px grid');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-\[1fr_340px\]/, 'RiskAcknowledgementPage must use responsive grid');
  });

  test('8. Service Schedule Page: responsive tabs and mobile-friendly inclusions/exclusions grid', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'ServiceSchedulePage.jsx'), 'utf8');

    assert.match(code, /flex-col\s+sm:flex-row/, 'Route switcher tabs must stack on mobile');
    assert.match(code, /grid-cols-1\s+md:grid-cols-2/, 'Inclusions/Exclusions must stack on mobile');
  });

  test('9. Contact Page: eliminates fixed minmax(360px, 1fr) blowout and stacks form inputs on mobile', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'ContactPage.jsx'), 'utf8');

    assert.ok(!code.includes('minmax(360px, 1fr)'), 'ContactPage must not use minmax(360px, 1fr)');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-2/, 'ContactPage form and channels must stack on mobile');
  });

  test('10. About Page: corporate governance cards wrap into single-column layout on mobile', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'AboutPage.jsx'), 'utf8');

    assert.ok(!code.includes('minmax(360px, 1fr)'), 'AboutPage must not use minmax(360px, 1fr)');
    assert.match(code, /grid-cols-1\s+lg:grid-cols-2/, 'AboutPage philosophy must stack on mobile');
    assert.match(code, /grid-cols-1\s+sm:grid-cols-2\s+lg:grid-cols-3/, 'AboutPage registry cards must be responsive');
  });

  test('11. Routes Compare Page & Pricing Table: responsive columns and table scroll container', () => {
    const routesCode = fs.readFileSync(path.join(clientSrcDir, 'pages', 'RoutesComparePage.jsx'), 'utf8');
    const pricingCode = fs.readFileSync(path.join(clientSrcDir, 'components', 'PricingTable.jsx'), 'utf8');

    assert.match(routesCode, /overflow-x-auto/, 'Routes comparison table must be horizontally scrollable');
    assert.match(pricingCode, /grid-cols-1\s+md:grid-cols-3/, 'PricingTable must stack into single column on mobile');
  });

  test('12. Membership Registration: scrollable step tracker and responsive input columns', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'pages', 'MembershipRegisterPage.jsx'), 'utf8');

    assert.match(code, /overflow-x-auto/, 'Membership steps tracker must be horizontally scrollable on mobile');
    assert.match(code, /grid-cols-1\s+sm:grid-cols-2/, 'Membership form fields must stack into single column on mobile');
    assert.match(code, /flex-col-reverse\s+sm:flex-row/, 'Membership buttons must stack on mobile');
  });

  test('13. Admin Layout: mobile slide-over sidebar with backdrop and hamburger button', () => {
    const code = fs.readFileSync(path.join(clientSrcDir, 'components', 'AdminLayout.jsx'), 'utf8');

    assert.match(code, /sidebarOpen/, 'AdminLayout must manage mobile sidebar state');
    assert.match(code, /-translate-x-full\s+lg:translate-x-0/, 'Admin sidebar must collapse on mobile');
  });
});
