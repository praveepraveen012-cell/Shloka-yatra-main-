import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Coworker Build Functional Integration & Architecture Tests', () => {
  const clientSrc = path.join(process.cwd(), 'client', 'src');

  test('1. App.jsx provides routes and aliases for all coworker URLs', () => {
    const appContent = fs.readFileSync(path.join(clientSrc, 'App.jsx'), 'utf8');

    assert.ok(appContent.includes('/routes/flight-lhasa'), 'App.jsx must support /routes/flight-lhasa');
    assert.ok(appContent.includes('/routes/lhasa-ali'), 'App.jsx must support /routes/lhasa-ali');
    assert.ok(appContent.includes('/high-altitude-risk'), 'App.jsx must support /high-altitude-risk');
    assert.ok(appContent.includes('/terms'), 'App.jsx must support /terms');
    assert.ok(appContent.includes('/terms-and-conditions'), 'App.jsx must support /terms-and-conditions');
    assert.ok(appContent.includes('/cancellation-policy'), 'App.jsx must support /cancellation-policy');
    assert.ok(appContent.includes('/privacy-policy'), 'App.jsx must support /privacy-policy');
    assert.ok(appContent.includes('/service-schedule'), 'App.jsx must support /service-schedule');
    assert.ok(appContent.includes('/itinerary'), 'App.jsx must support /itinerary');
    assert.ok(appContent.includes('/inclusions-exclusions'), 'App.jsx must support /inclusions-exclusions');
    assert.ok(appContent.includes('/preparation-safety'), 'App.jsx must support /preparation-safety');
  });

  test('2. Floating WhatsApp Coordinator button is integrated in PublicLayout', () => {
    const appContent = fs.readFileSync(path.join(clientSrc, 'App.jsx'), 'utf8');
    assert.ok(appContent.includes('FloatingWhatsApp'), 'App.jsx must render FloatingWhatsApp');

    const floatingPath = path.join(clientSrc, 'components', 'FloatingWhatsApp.jsx');
    assert.ok(fs.existsSync(floatingPath), 'FloatingWhatsApp.jsx component must exist');

    const floatingContent = fs.readFileSync(floatingPath, 'utf8');
    assert.ok(floatingContent.includes('wa.me/916366852888'), 'Must link directly to official WhatsApp number +91 6366852888');
    assert.ok(floatingContent.includes('z-40'), 'Must float above content with elevated z-index');
  });

  test('3. Privacy Policy Page renders all 17 DPDP clauses and TOC navigation', () => {
    const privacyPageContent = fs.readFileSync(path.join(clientSrc, 'pages', 'PrivacyPolicyPage.jsx'), 'utf8');
    assert.ok(privacyPageContent.includes('PRIVACY_POLICY'), 'Must consume authoritative PRIVACY_POLICY array');
    assert.ok(privacyPageContent.includes('CONTRACT_METADATA'), 'Must consume CONTRACT_METADATA');
    assert.ok(privacyPageContent.includes('DPDP ACT 2023 COMPLIANT'), 'Must feature DPDP compliance badge');
    assert.ok(privacyPageContent.includes('Table of Contents'), 'Must include quick Table of Contents navigation');
    assert.ok(privacyPageContent.includes('handlePrint'), 'Must include print functionality');

    const legalDataContent = fs.readFileSync(path.join(clientSrc, 'data', 'legalData.js'), 'utf8');
    for (let i = 1; i <= 17; i++) {
      assert.ok(legalDataContent.includes(`"id": "P${i}"`) || legalDataContent.includes(`id: 'P${i}'`) || legalDataContent.includes(`id: "P${i}"`), `Clause P${i} must be defined in legalData`);
    }
  });

  test('4. Footer includes all coworker travel and preparation links + regulatory advisory', () => {
    const footerContent = fs.readFileSync(path.join(clientSrc, 'components', 'Footer.jsx'), 'utf8');
    assert.ok(footerContent.includes('/inclusions-exclusions'), 'Footer must link to /inclusions-exclusions');
    assert.ok(footerContent.includes('/preparation-safety'), 'Footer must link to /preparation-safety');
    assert.ok(footerContent.includes('/itinerary'), 'Footer must link to /itinerary');
    assert.ok(footerContent.includes('/departures'), 'Footer must link to /departures');
    assert.ok(footerContent.includes('CONTRACT_METADATA.officialPhone'), 'Footer must display official helpline');
    assert.ok(footerContent.includes('CONTRACT_METADATA.officialEmail'), 'Footer must display official email');
    assert.ok(footerContent.includes('grexotix.com'), 'Footer must feature Grexotix link');
    assert.ok(footerContent.includes('Regulatory Advisory'), 'Footer must feature regulatory advisory');
  });

  test('5. SEO and Discovery assets (robots.txt & sitemap.xml) are defined in public/', () => {
    const publicDir = path.join(process.cwd(), 'client', 'public');
    assert.ok(fs.existsSync(path.join(publicDir, 'robots.txt')), 'client/public/robots.txt must exist');
    assert.ok(fs.existsSync(path.join(publicDir, 'sitemap.xml')), 'client/public/sitemap.xml must exist');

    const sitemapContent = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
    assert.ok(sitemapContent.includes('/kailash-mansarovar-yatra-2027'), 'Sitemap must list landing page');
    assert.ok(sitemapContent.includes('/routes/bus-both-ways'), 'Sitemap must list route 1');
    assert.ok(sitemapContent.includes('/terms'), 'Sitemap must list terms page');
    assert.ok(sitemapContent.includes('/cancellation-policy'), 'Sitemap must list cancellation policy');
  });

  test('6. Gallery page remains eliminated per strict user directive', () => {
    const appContent = fs.readFileSync(path.join(clientSrc, 'App.jsx'), 'utf8');
    assert.ok(!appContent.includes("import GalleryPage"), 'No GalleryPage component imported');
    assert.ok(appContent.includes('path="/gallery" element={<Navigate to="/kailash-mansarovar" replace />}'), 'Gallery route safely redirects to kailash page');
  });
});
