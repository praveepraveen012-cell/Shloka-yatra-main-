import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PackagesPage from './pages/PackagesPage';
import DeparturesPage from './pages/DeparturesPage';
import ItineraryPage from './pages/ItineraryPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import InclusionsPage from './pages/InclusionsPage';
import PreparationPage from './pages/PreparationPage';
import ContactPage from './pages/ContactPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage';
import Landing2027Page from './pages/Landing2027Page';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import FaqsPage from './pages/FaqsPage';
import KailashPage from './pages/KailashPage';
import RiskAcknowledgementPage from './pages/RiskAcknowledgementPage';
import ServiceSchedulePage from './pages/ServiceSchedulePage';

// Route & Journey Pages
import YatrasPage from './pages/YatrasPage';
import RoutesComparePage from './pages/RoutesComparePage';
import RouteBusPage from './pages/RouteBusPage';
import RouteFlightLhasaPage from './pages/RouteFlightLhasaPage';
import RouteLhasaAliPage from './pages/RouteLhasaAliPage';

// Membership & Auth Pages
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MembershipRegisterPage from './pages/MembershipRegisterPage';
import MembershipSuccessPage from './pages/MembershipSuccessPage';
import MemberAccountPage from './pages/MemberAccountPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminDeparturesPage from './pages/admin/AdminDeparturesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminBookingDetailPage from './pages/admin/AdminBookingDetailPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminWhatsAppPage from './pages/admin/AdminWhatsAppPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage';
import AdminRefundsPage from './pages/admin/AdminRefundsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Shared Header and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/departures" element={<DeparturesPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/inclusions-exclusions" element={<InclusionsPage />} />
        <Route path="/preparation-safety" element={<PreparationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
        <Route path="/kailash-mansarovar-yatra-2027" element={<Landing2027Page />} />

        {/* Dedicated Route and Journey Pages */}
        <Route path="/yatras" element={<YatrasPage />} />
        <Route path="/routes" element={<RoutesComparePage />} />
        <Route path="/routes/bus-both-ways" element={<RouteBusPage />} />
        <Route path="/routes/flight-to-lhasa" element={<RouteFlightLhasaPage />} />
        <Route path="/routes/flight-lhasa" element={<RouteFlightLhasaPage />} />
        <Route path="/routes/lhasa-ali-pulan" element={<RouteLhasaAliPage />} />
        <Route path="/routes/lhasa-ali" element={<RouteLhasaAliPage />} />

        {/* Membership & Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/membership/register" element={<MembershipRegisterPage />} />
        <Route path="/membership/success" element={<MembershipSuccessPage />} />
        <Route path="/account" element={<MemberAccountPage />} />

        {/* Supporting Pages & Policy Routes */}
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/risk-acknowledgement" element={<RiskAcknowledgementPage />} />
        <Route path="/high-altitude-risk" element={<RiskAcknowledgementPage />} />
        <Route path="/service-schedule" element={<ServiceSchedulePage />} />
        <Route path="/package-service-schedule" element={<ServiceSchedulePage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/kailash-mansarovar" element={<KailashPage />} />

        {/* Backward Compatibility Aliases */}
        <Route path="/about-us" element={<Navigate to="/about" replace />} />
        <Route path="/departures-2027" element={<Navigate to="/departures" replace />} />
        <Route path="/book-now" element={<Navigate to="/book" replace />} />
        <Route path="/preparation-guide" element={<Navigate to="/preparation-safety" replace />} />
        <Route path="/pricing" element={<Navigate to="/packages" replace />} />
        <Route path="/kailash-2027" element={<Navigate to="/kailash-mansarovar-yatra-2027" replace />} />
        <Route path="/yatra-2027" element={<Navigate to="/kailash-mansarovar-yatra-2027" replace />} />
        <Route path="/gallery" element={<Navigate to="/kailash-mansarovar" replace />} />
      </Route>

      {/* Admin Portal Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Administrative Dashboard Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute>
            <AdminMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departures"
        element={
          <ProtectedRoute>
            <AdminDeparturesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <AdminBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings/:id"
        element={
          <ProtectedRoute>
            <AdminBookingDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute>
            <AdminCustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <AdminPaymentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/whatsapp"
        element={
          <ProtectedRoute>
            <AdminWhatsAppPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/documents"
        element={
          <ProtectedRoute>
            <AdminDocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/refunds"
        element={
          <ProtectedRoute>
            <AdminRefundsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute>
            <AdminEnquiriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pricing"
        element={
          <ProtectedRoute>
            <AdminPricingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute>
            <AdminAuditLogsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
