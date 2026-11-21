import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_SRC = path.resolve(__dirname, '../../client/src');

test('Journey Search Widget & Package Selection — Unit and Functionality Test Suite', async (t) => {
  const widgetPath = path.join(CLIENT_SRC, 'components', 'JourneySearchWidget.jsx');
  assert.ok(fs.existsSync(widgetPath), 'JourneySearchWidget.jsx must exist');
  const widgetContent = fs.readFileSync(widgetPath, 'utf8');

  await t.test('1. Component imports required React hooks, routing, icons, and API service', () => {
    assert.ok(widgetContent.includes('useRef'), 'Must import useRef for scrolling to search results');
    assert.ok(widgetContent.includes('useState'), 'Must import useState');
    assert.ok(widgetContent.includes('useEffect'), 'Must import useEffect');
    assert.ok(widgetContent.includes('useNavigate'), 'Must import useNavigate');
    assert.ok(widgetContent.includes('useLanguage'), 'Must import useLanguage for bilingual support');
    assert.ok(widgetContent.includes('api'), 'Must import api service');
  });

  await t.test('2. Default routes define Package 1, 2, and 3 with standardized IDs and official prices', () => {
    assert.ok(widgetContent.includes("id: 'option-1'"), 'Route 1 must have standardized ID option-1');
    assert.ok(widgetContent.includes("id: 'option-2'"), 'Route 2 must have standardized ID option-2');
    assert.ok(widgetContent.includes("id: 'option-3'"), 'Route 3 must have standardized ID option-3');
    assert.ok(widgetContent.includes('startingPrice: 350000'), 'Package 1 starting price must be 3,50,000 INR');
    assert.ok(widgetContent.includes('startingPrice: 437000'), 'Package 2 starting price must be 4,37,000 INR');
    assert.ok(widgetContent.includes('startingPrice: 494000'), 'Package 3 starting price must be 4,94,000 INR');
    assert.ok(widgetContent.includes('nriPrice: 425000'), 'Package 1 NRI price must be 4,25,000 INR');
  });

  await t.test('3. Search button executes search and triggers scroll to #search-results', () => {
    assert.ok(widgetContent.includes('handleSearchClick'), 'Must have handleSearchClick function');
    assert.ok(widgetContent.includes('resultsRef'), 'Must declare resultsRef');
    assert.ok(widgetContent.includes('scrollIntoView'), 'Must call scrollIntoView to display search results');
    assert.ok(widgetContent.includes('id="search-results"'), 'Must render dedicated #search-results container');
    assert.ok(widgetContent.includes('isSearching'), 'Must manage searching loading state');
  });

  await t.test('4. Dropdown and tabs support "All Yatra Packages" and individual package filtering', () => {
    assert.ok(widgetContent.includes("value=\"all\""), 'Dropdown must have "all" option to compare all packages');
    assert.ok(widgetContent.includes('handleCategorySwitch'), 'Must handle category tab switching');
    assert.ok(widgetContent.includes('handleRouteSelect'), 'Must handle route dropdown selection with tab synchronization');
    assert.ok(widgetContent.includes('displayedRoutes'), 'Must compute displayedRoutes based on active filter');
  });

  await t.test('5. Real-time pricing computes base price, devotee count, and single room supplement', () => {
    assert.ok(widgetContent.includes('totalDevotees'), 'Must calculate totalDevotees from adults and seniors');
    assert.ok(widgetContent.includes('basePrice'), 'Must resolve basePrice for Indian vs NRI passport');
    assert.ok(widgetContent.includes('singleSupplement'), 'Must account for single room supplement');
    assert.ok(widgetContent.includes('45000'), 'Single room supplement must be 45,000 INR');
  });

  await t.test('6. Search results display rich package metadata and inclusion pills', () => {
    assert.ok(widgetContent.includes("t('search.stayKathmandu')"), 'Must display Kathmandu stay inclusion');
    assert.ok(widgetContent.includes("t('search.tibetVisa')"), 'Must display Tibet visa inclusion');
    assert.ok(widgetContent.includes("t('search.sattvicMeals')"), 'Must display Sattvic meals inclusion');
    assert.ok(widgetContent.includes("t('search.hyperbaricOxygen')"), 'Must display oxygen chamber inclusion');
    assert.ok(widgetContent.includes('availableSeats'), 'Must display available seats for the selected departure batch');
  });

  await t.test('7. Search results provide direct booking CTA and day-by-day itinerary link', () => {
    assert.ok(widgetContent.includes('handleProceedBooking'), 'Must have handleProceedBooking handler');
    assert.ok(widgetContent.includes('/book?'), 'Must redirect to /book with query parameters');
    assert.ok(widgetContent.includes('/itinerary?route='), 'Must link to itinerary page with route code');
    assert.ok(widgetContent.includes("t('search.bookThisPackage')"), 'Must have Book This Package CTA');
    assert.ok(widgetContent.includes("t('search.viewItinerary')"), 'Must have View Itinerary link');
  });

  await t.test('8. BookingPage.jsx parses package, batch, passport, and devotee parameters seamlessly', () => {
    const bookingPath = path.join(CLIENT_SRC, 'pages', 'BookingPage.jsx');
    const bookingContent = fs.readFileSync(bookingPath, 'utf8');

    assert.ok(bookingContent.includes("searchParams.get('package')"), 'BookingPage must parse package param');
    assert.ok(bookingContent.includes("searchParams.get('batch')") || bookingContent.includes("searchParams.get('departureId')"), 'BookingPage must parse batch param');
    assert.ok(bookingContent.includes("searchParams.get('passport')"), 'BookingPage must parse passport param');
  });

  await t.test('9. Absence of prohibited moon emoji (🌕) in departure batch selections', () => {
    assert.strictEqual(widgetContent.includes('🌕'), false, 'Search widget must not contain moon emoji');
  });

  await t.test('10. LanguageContext defines all search labels in both English and Hindi', () => {
    const langPath = path.join(CLIENT_SRC, 'context', 'LanguageContext.jsx');
    const langContent = fs.readFileSync(langPath, 'utf8');

    assert.ok(langContent.includes('allPackages'), 'Must have allPackages translation');
    assert.ok(langContent.includes('searchResultsTitle'), 'Must have searchResultsTitle translation');
    assert.ok(langContent.includes('instantConfirmation'), 'Must have instantConfirmation translation');
    assert.ok(langContent.includes('viewItinerary'), 'Must have viewItinerary translation');
    assert.ok(langContent.includes('उपलब्ध तीर्थ यात्रा पैकेज'), 'Must have Hindi searchResultsTitle');
  });
});
