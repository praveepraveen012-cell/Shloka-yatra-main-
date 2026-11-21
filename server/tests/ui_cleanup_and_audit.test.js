import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
const clientSrc = path.join(rootDir, 'client', 'src');

describe('UI Cleanup, Legal Pages Simplification & Design Audit Suite', () => {

  test('1. Package Booking Section: no double bullet separators in metadata', () => {
    const journeySearchCode = fs.readFileSync(path.join(clientSrc, 'components', 'JourneySearchWidget.jsx'), 'utf8');
    
    // Check that there is no double bullet sequence '•  •' or '• •'
    assert.strictEqual(journeySearchCode.includes('•  •'), false, 'Must not contain double bullet with two spaces');
    assert.strictEqual(journeySearchCode.includes('• •'), false, 'Must not contain double bullet with single space');

    // Verify metadata structure retains Batch, Route, and Acclimatization cleanly
    assert.ok(journeySearchCode.includes("Batch:"), 'Must retain Batch label');
    assert.ok(journeySearchCode.includes("Route:"), 'Must retain Route label');
    assert.ok(journeySearchCode.includes("Acclimatization:"), 'Must retain Acclimatization label');
  });

  test('2. Terms & Conditions Page: "Master" removed from headings and badges, 35 clauses intact', () => {
    const termsCode = fs.readFileSync(path.join(clientSrc, 'pages', 'TermsPage.jsx'), 'utf8');
    
    // Heading must be "Terms & Conditions"
    assert.ok(termsCode.includes('<h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">\n            Terms & Conditions\n          </h1>'), 'Terms heading must be "Terms & Conditions"');
    assert.strictEqual(termsCode.includes('Master Terms & Conditions'), false, 'Must not contain "Master Terms & Conditions"');

    // Badges must be removed
    assert.strictEqual(termsCode.includes('OFFICIAL 2027 MASTER CONTRACT PACKAGE'), false, 'Master contract package badge must be removed');
    assert.strictEqual(termsCode.includes('35 Master Clauses'), false, 'Master clauses badge must be removed');

    // All 35 clauses intact in legalData
    const legalDataCode = fs.readFileSync(path.join(clientSrc, 'data', 'legalData.js'), 'utf8');
    for (let i = 1; i <= 35; i++) {
      assert.ok(legalDataCode.includes(`id: 'T${i}'`) || legalDataCode.includes(`"id": "T${i}"`), `Clause T${i} must exist`);
    }
  });

  test('3. Terms & Conditions Layout: sidebar removed, full-width max-w-4xl layout', () => {
    const termsCode = fs.readFileSync(path.join(clientSrc, 'pages', 'TermsPage.jsx'), 'utf8');

    // Sidebar removed
    assert.strictEqual(termsCode.includes('<aside'), false, 'Sidebar <aside> must be completely removed');
    assert.strictEqual(termsCode.includes('Priority of Contract Documents'), false, 'Sidebar priority card must be removed');
    assert.strictEqual(termsCode.includes('Associated Legal Documents'), false, 'Sidebar associated documents card must be removed');

    // Clean full-width container
    assert.ok(termsCode.includes('max-w-4xl mx-auto'), 'TermsPage must render in clean full-width max-w-4xl container');
  });

  test('4. Print Options removed from both Terms and Privacy Policy pages', () => {
    const termsCode = fs.readFileSync(path.join(clientSrc, 'pages', 'TermsPage.jsx'), 'utf8');
    const privacyCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PrivacyPolicyPage.jsx'), 'utf8');

    // Print button and handler removed
    assert.strictEqual(termsCode.includes('Print Terms'), false, 'TermsPage must not contain "Print Terms" button');
    assert.strictEqual(termsCode.includes('handlePrint'), false, 'TermsPage must not contain handlePrint');
    assert.strictEqual(privacyCode.includes('Print Privacy Policy'), false, 'PrivacyPolicyPage must not contain "Print Privacy Policy" button');
    assert.strictEqual(privacyCode.includes('handlePrint'), false, 'PrivacyPolicyPage must not contain handlePrint');
  });

  test('5. Privacy Policy Layout: sidebar removed, full-width max-w-4xl layout, all 17 clauses intact', () => {
    const privacyCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PrivacyPolicyPage.jsx'), 'utf8');

    // Sidebar removed
    assert.strictEqual(privacyCode.includes('<aside'), false, 'Sidebar <aside> must be completely removed');
    assert.strictEqual(privacyCode.includes('Table of Contents'), false, 'Sidebar Table of Contents must be removed');
    assert.strictEqual(privacyCode.includes('Key Safeguards'), false, 'Sidebar Key Safeguards must be removed');

    // Clean full-width container
    assert.ok(privacyCode.includes('max-w-4xl mx-auto'), 'PrivacyPolicyPage must render in clean full-width max-w-4xl container');

    // All 17 clauses intact in legalData
    const legalDataCode = fs.readFileSync(path.join(clientSrc, 'data', 'legalData.js'), 'utf8');
    for (let i = 1; i <= 17; i++) {
      assert.ok(legalDataCode.includes(`id: 'P${i}'`) || legalDataCode.includes(`"id": "P${i}"`), `Clause P${i} must exist`);
    }
  });

  test('6. FAQ Page & Accordion: high contrast styling, readable text on dark backgrounds', () => {
    const indexCss = fs.readFileSync(path.join(clientSrc, 'index.css'), 'utf8');
    const accordionCode = fs.readFileSync(path.join(clientSrc, 'components', 'FaqAccordion.jsx'), 'utf8');

    // .font-heading must NOT force text-[#101D35] in base styles
    assert.ok(!indexCss.includes('h1, h2, h3, h4, h5, h6, .font-heading {\n    font-family: var(--heading) !important;\n    @apply font-semibold text-[#101D35];'), 'CSS must separate .font-heading from dark navy color apply');

    // High contrast styling in FaqAccordion
    assert.ok(accordionCode.includes('#D9A441'), 'Active/open questions and icons must use gold accent');
    assert.ok(accordionCode.includes('#D9E2EF'), 'Answers must use high-contrast readable light grey/white');
  });

  test('7. FAQ Category Tabs: removed from FaqAccordion, FaqsPage, and HomePage', () => {
    const accordionCode = fs.readFileSync(path.join(clientSrc, 'components', 'FaqAccordion.jsx'), 'utf8');
    const homeCode = fs.readFileSync(path.join(clientSrc, 'pages', 'HomePage.jsx'), 'utf8');

    // No category tabs in FaqAccordion
    assert.strictEqual(accordionCode.includes('activeCategory'), false, 'FaqAccordion must not use activeCategory state');
    assert.strictEqual(accordionCode.includes('categories = ['), false, 'FaqAccordion must not define categories array');

    // No category filter pills in HomePage Section 11
    assert.strictEqual(homeCode.includes('faqCategories.map'), false, 'HomePage Section 11 must not map category filter pills');
  });

  test('8. Font and Color Palette System: compliant with Montserrat, Segoe UI, Deep Navy, and Gold', () => {
    const indexCss = fs.readFileSync(path.join(clientSrc, 'index.css'), 'utf8');

    assert.ok(indexCss.includes('--heading: "Montserrat", sans-serif;'), 'Montserrat must be configured as heading font');
    assert.ok(indexCss.includes('--sans: "Segoe UI"'), 'Segoe UI must be configured as sans/body font');
    assert.ok(indexCss.includes('--color-navy: #101D35;'), 'Deep Navy #101D35 must be configured');
    assert.ok(indexCss.includes('--color-gold: #D9A441;'), 'Gold #D9A441 must be configured');
    assert.ok(indexCss.includes('--color-ivory: #F7F6F2;'), 'Ivory #F7F6F2 must be configured');
  });

  test('9. Dev / AI Artefacts: clean production-ready code with no draft or dummy markers', () => {
    const pagesToCheck = ['TermsPage.jsx', 'PrivacyPolicyPage.jsx', 'HomePage.jsx', 'FaqsPage.jsx'];
    for (const page of pagesToCheck) {
      const content = fs.readFileSync(path.join(clientSrc, 'pages', page), 'utf8');
      assert.strictEqual(content.includes('TODO'), false, `${page} must not contain TODO`);
      assert.strictEqual(content.includes('FIXME'), false, `${page} must not contain FIXME`);
      assert.strictEqual(content.includes('DRAFT'), false, `${page} must not contain DRAFT`);
      assert.strictEqual(content.includes('Lorem ipsum'), false, `${page} must not contain Lorem ipsum`);
    }
  });

  test('10. Viewport responsiveness: fluid wraps and containers without fixed overflow styles', () => {
    const termsCode = fs.readFileSync(path.join(clientSrc, 'pages', 'TermsPage.jsx'), 'utf8');
    const privacyCode = fs.readFileSync(path.join(clientSrc, 'pages', 'PrivacyPolicyPage.jsx'), 'utf8');

    // Must have overflow-x-hidden and w-full
    assert.ok(termsCode.includes('overflow-x-hidden'), 'TermsPage must prevent horizontal overflow');
    assert.ok(privacyCode.includes('overflow-x-hidden'), 'PrivacyPolicyPage must prevent horizontal overflow');
  });

});
