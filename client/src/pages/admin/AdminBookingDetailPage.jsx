import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Send,
  Shield,
  User,
  Users,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const WHATSAPP_TEMPLATES = {
  BOOKING_RECEIVED: {
    name: '1. Booking Received & Registration Confirmation',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nThank you for registering for the sacred Kailash Mansarovar Yatra 2027 with Shloka Yatra.\n\n📌 Booking Reference: *${b.bookingReference}*\n🏔 Departure Batch: *${b.departure?.name}*\n🗺 Route: *${b.route?.name}*\n👥 Yatris Registered: *${b.totalTravellers}*\n💰 Total Package Amount: *₹${b.totalAmount.toLocaleString('en-IN')}*\n\nOur pilgrimage coordinators have received your dossier. Please ensure your initial deposit of ₹25,000 per yatri is completed to secure group permit filing.\n\nNeed assistance? Reply directly to this number or call +91 6366852888.\n— Shloka Yatra Pilgrimage Command`,
  },
  ADVANCE_RECEIVED: {
    name: '2. Advance Deposit Received',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nWe have successfully received your initial registration deposit for Kailash Mansarovar Yatra 2027.\n\n📌 Booking Reference: *${b.bookingReference}*\n✅ Amount Received: *₹25,000*\n🏔 Batch: *${b.departure?.name}*\n\nYour preliminary slot is now secured. The travel operations desk will contact you regarding document submission and passport verification.\n\nHar Har Mahadev! ॐ नमः शिवाय\n— Shloka Yatra Private Limited`,
  },
  FULL_PAYMENT_CONFIRMED: {
    name: '3. Full Payment Confirmed & Seat Allocation',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nWe are delighted to confirm that full payment for your Kailash Mansarovar Yatra 2027 has been received and verified.\n\n📌 Booking Reference: *${b.bookingReference}*\n🏔 Departure Batch: *${b.departure?.name}*\n🗺 Route: *${b.route?.name}*\n💳 Payment Status: *PAID IN FULL*\n\nYour group permit allocation and Kathmandu hotel bookings are locked. We will send you the flight and logistics itinerary shortly.\n— Shloka Yatra Pilgrimage Command`,
  },
  BALANCE_REMINDER: {
    name: '4. Balance Payment Due Reminder',
    generate: (b) => {
      const balance = b.financialSummary?.balanceDue || 0;
      return `🙏 Hari Om, ${b.contactName} Ji!\n\nThis is a gentle reminder regarding the outstanding balance for your Kailash Mansarovar Yatra 2027.\n\n📌 Booking Ref: *${b.bookingReference}*\n💰 Balance Due: *₹${balance.toLocaleString('en-IN')}*\n🏔 Departure Batch: *${b.departure?.name}*\n\nPer contractual guidelines, final balances must be settled to complete China Group Visa and Tibet Military permit approvals. Please contact our finance desk at finance@shlloka.com or pay via our authorized channels.\n— Shloka Yatra Finance Desk`;
    },
  },
  DOCS_PENDING: {
    name: '5. Documents Pending Verification',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nTo ensure timely processing of your Tibet Travel Permit and China Group Visa, please upload the following documents for all registered yatris:\n\n1. Passport front & back scan (minimum 6 months validity from travel date)\n2. Medical Fitness Certificate with resting SpO2 & BP clearance\n3. High-Altitude Risk Undertaking (Annex B)\n\n📌 Booking Ref: *${b.bookingReference}*\n\nPlease reply with scanned copies or upload them via your devotee account.\n— Shloka Yatra Operations Desk`,
  },
  DOCS_VERIFIED: {
    name: '6. Documents Verified & Permit Filing Initiated',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nGood news! The passports and medical certificates for Booking Ref *${b.bookingReference}* have been reviewed and verified by our compliance team.\n\nYour dossier has been submitted for official Tibet Tourism Bureau (TTB) and border military entry clearances.\n\nHar Har Mahadev!\n— Shloka Yatra Pilgrimage Command`,
  },
  DEPARTURE_APPROACHING: {
    name: '7. Departure Approaching Advisory',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nYour sacred pilgrimage to Mount Kailash and Lake Manasarovar departs in approximately 30 days!\n\n📌 Batch: *${b.departure?.name}*\n📅 Reporting in Kathmandu: *${new Date(b.departure?.arrivalDate).toLocaleDateString()}*\n\nPlease ensure physical cardio preparation, stair climbing, and deep pranayama routines are maintained. Our Kathmandu representative will reach out next week.\n— Shloka Yatra Operations Desk`,
  },
  PACKING_GUIDE: {
    name: '8. Packing & Down Jacket Guidelines',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nHere is your essential packing checklist for Kailash Mansarovar Yatra 2027:\n\n🧥 Provided by Shloka Yatra: High-altitude down jacket & expedition duffel bag (handed over during Kathmandu briefing).\n🎒 Personal items needed: Broken-in trekking boots, thermal inners (3-4 sets), UV sunglasses (Cat 3/4), SPF 50+ sunscreen, lip balm, personal medication, and thermos flask.\n\nDetailed packing guide is available on our portal.\n— Shloka Yatra Team`,
  },
  MEDICAL_ADVISORY: {
    name: '9. High-Altitude Medical Advisory',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nImportant medical advisory for high-altitude trekking across Tibet (3,700m - 5,630m):\n\n1. Hydration is vital: consume 4-5 litres of warm water/fluids daily.\n2. Consult your physician regarding Acetazolamide (Diamox) prophylactic regimen.\n3. Our team carries certified oxygen cylinders and hyperbaric equipment throughout the journey.\n\nSafety is our supreme priority.\n— Shloka Yatra Medical Operations`,
  },
  BRIEFING_SCHEDULE: {
    name: '10. Kathmandu Briefing & Orientation Schedule',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nWelcome schedule for Day 1 in Kathmandu:\n\n📍 Venue: Official 5-Star Hotel Ballroom, Kathmandu\n⏰ Time: 5:00 PM Nepal Time\n📋 Agenda: Yatra kit distribution, sacred Rudra Homam orientation, passport handover for China Group Visa stamping, and Q&A with Sherpa leaders.\n\nAttendance is mandatory for all yatris in Booking Ref *${b.bookingReference}*.\n— Shloka Yatra Command`,
  },
  ROUTE_UPDATE: {
    name: '11. Operational Route & Border Update',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nImportant route operational update for Booking Ref *${b.bookingReference}*:\n\nAll mountain road conditions and border checkpoints on your route (*${b.route?.name}*) have been inspected and cleared by our advance sherpa logistics team.\n\nPlease refer to your portal for the updated road transit timings.\n— Shloka Yatra Operations Desk`,
  },
  CANCELLATION_NOTICE: {
    name: '12. Booking Cancellation Notice',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nThis message confirms that Booking Reference *${b.bookingReference}* has been processed for cancellation as per your request.\n\nApplicable refunds (if any) are processed strictly in accordance with Clause C4 of the Master Contractual Policy. Our finance desk will email you the official credit note.\n— Shloka Yatra Grievance & Finance Desk`,
  },
  CUSTOM_MESSAGE: {
    name: '13. Custom Administrative Message',
    generate: (b) =>
      `🙏 Hari Om, ${b.contactName} Ji!\n\nRegarding your Kailash Mansarovar Yatra 2027 booking (*${b.bookingReference}*):\n\n[Type your custom message here]\n\nWarm regards,\nShloka Yatra Pilgrimage Command\n+91 6366852888`,
  },
};

export default function AdminBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status updates
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Offline Payment Modal State
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineAmount, setOfflineAmount] = useState('');
  const [offlineMode, setOfflineMode] = useState('BANK_TRANSFER');
  const [offlineRef, setOfflineRef] = useState('');
  const [offlineType, setOfflineType] = useState('REGISTRATION');
  const [offlineNotes, setOfflineNotes] = useState('');
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);

  // Internal Note State
  const [noteContent, setNoteContent] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // WhatsApp Modal State
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('BOOKING_RECEIVED');
  const [whatsAppMessageText, setWhatsAppMessageText] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [whatsAppSending, setWhatsAppSending] = useState(false);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminBookingDetail(id);
      if (res.booking) {
        setBooking(res.booking);
        setRecipientPhone(res.booking.contactPhone || '');
        setRecipientName(res.booking.contactName || '');
        // Initial template text
        const template = WHATSAPP_TEMPLATES.BOOKING_RECEIVED;
        setWhatsAppMessageText(template.generate(res.booking));
      } else {
        throw new Error('Booking record not returned.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  // Handle template selection change
  const handleTemplateChange = (key) => {
    setSelectedTemplateKey(key);
    if (booking && WHATSAPP_TEMPLATES[key]) {
      setWhatsAppMessageText(WHATSAPP_TEMPLATES[key].generate(booking));
    }
  };

  // Change Booking Status
  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      await api.updateAdminBookingStatus(booking.id, { status: newStatus });
      setActionSuccess(`Booking status changed to ${newStatus}`);
      await loadBooking();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Change Payment Status
  const handlePaymentStatusChange = async (newPaymentStatus) => {
    try {
      setStatusUpdating(true);
      await api.updateAdminBookingStatus(booking.id, {
        status: booking.status,
        paymentStatus: newPaymentStatus,
      });
      setActionSuccess(`Payment status changed to ${newPaymentStatus}`);
      await loadBooking();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error updating payment status: ' + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setNoteSubmitting(true);
      await api.addAdminBookingNote(booking.id, { content: noteContent.trim() });
      setNoteContent('');
      setActionSuccess('Internal note added to booking history.');
      await loadBooking();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error adding note: ' + err.message);
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Submit Offline Payment
  const handleRecordOfflinePayment = async (e) => {
    e.preventDefault();
    const amountNum = parseInt(offlineAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid positive payment amount in INR.');
      return;
    }
    if (!offlineRef.trim()) {
      alert('Please enter a valid reference / UTR / cheque number.');
      return;
    }

    try {
      setOfflineSubmitting(true);
      await api.recordAdminOfflinePayment({
        bookingId: booking.id,
        amount: amountNum,
        paymentMode: offlineMode,
        referenceNumber: offlineRef.trim(),
        installmentType: offlineType,
        adminNotes: offlineNotes.trim() || undefined,
      });

      setOfflineModalOpen(false);
      setOfflineAmount('');
      setOfflineRef('');
      setOfflineNotes('');
      setActionSuccess(`Offline payment of ₹${amountNum.toLocaleString('en-IN')} recorded successfully.`);
      await loadBooking();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to record offline payment: ' + err.message);
    } finally {
      setOfflineSubmitting(false);
    }
  };

  // Send WhatsApp Update via wa.me and log to DB
  const handleSendWhatsApp = async () => {
    if (!recipientPhone.trim() || !whatsAppMessageText.trim()) {
      alert('Recipient phone and message content cannot be empty.');
      return;
    }

    try {
      setWhatsAppSending(true);

      // Clean phone number: remove spaces, dashes, parentheses
      const cleanPhone = String(recipientPhone || '').replace(/[^0-9+]/g, '').replace(/^0+/, '');

      // 1. Log to backend database
      await api.sendAdminWhatsAppMessage(booking.id, {
        templateKey: selectedTemplateKey,
        recipientPhone: cleanPhone,
        recipientName: recipientName.trim() || booking.contactName,
        messageContent: whatsAppMessageText,
        status: 'CLICK_TO_CHAT',
      });

      // 2. Open WhatsApp Web or Mobile click-to-chat in new tab
      const encodedMsg = encodeURIComponent(whatsAppMessageText);
      const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');

      setWhatsAppModalOpen(false);
      setActionSuccess('WhatsApp update recorded and dispatched via click-to-chat.');
      await loadBooking();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert('Failed to log WhatsApp update: ' + err.message);
    } finally {
      setWhatsAppSending(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Booking Detail" subtitle="Loading pilgrimage record...">
        <div className="py-20 text-center text-[#8CA8CC]">
          <div className="w-8 h-8 border-3 border-[#2F6FED]/30 border-t-[#2F6FED] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Fetching complete booking records, payments, and travellers...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !booking) {
    return (
      <AdminLayout title="Booking Detail" subtitle="Error Loading Record">
        <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-6 rounded-2xl max-w-lg mx-auto text-center my-10">
          <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
          <h3 className="font-bold text-lg mb-1">Booking Not Found</h3>
          <p className="text-xs mb-4">{error || 'Unable to locate booking record.'}</p>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-[#2F6FED] text-white text-xs font-semibold rounded-xl inline-block"
          >
            ← Back to Booking List
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { financialSummary } = booking;

  return (
    <AdminLayout
      title={`Booking ${booking.bookingReference}`}
      subtitle={`Devotee: ${booking.contactName} • ${booking.departure?.name}`}
    >
      <div className="space-y-6 font-body">
        {/* Success Alert */}
        {actionSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Top Control Bar: Back, Statuses, and Quick Actions */}
        <div className="bg-[#071B3A] p-4 sm:p-5 rounded-2xl border border-[#D9E2EF]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/bookings"
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
              title="Return to bookings table"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-white">
                  {booking.bookingReference}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : booking.status === 'CANCELLED'
                      ? 'bg-red-500/15 border-red-500/40 text-red-400'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {booking.status}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    booking.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : booking.paymentStatus === 'PARTIALLY_PAID'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {(booking.paymentStatus || 'UNPAID').replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#8CA8CC] mt-0.5">
                Submitted on {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons: Status Selector, WhatsApp, Offline Payment */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp Update Button */}
            <button
              onClick={() => {
                handleTemplateChange('BOOKING_RECEIVED');
                setWhatsAppModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <MessageCircle size={15} />
              <span>Send WhatsApp Update</span>
            </button>

            {/* Record Offline Payment Button */}
            <button
              onClick={() => setOfflineModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-[#2F6FED]/30"
            >
              <CreditCard size={15} />
              <span>+ Record Offline Payment</span>
            </button>

            {/* Quick Booking Status Toggle */}
            <select
              value={booking.status}
              disabled={statusUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="PENDING">Status: PENDING</option>
              <option value="CONFIRMED">Status: CONFIRMED</option>
              <option value="CANCELLED">Status: CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Section A & B: Devotee & Journey Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Primary Devotee Contact */}
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8CA8CC] uppercase tracking-wider">
              <User size={15} className="text-[#2F6FED]" />
              <span>Primary Contact Devotee</span>
            </div>
            <div>
              <div className="text-base font-bold text-white">{booking.contactName}</div>
              <div className="text-xs text-[#8CA8CC]">Passport: {booking.passportType}</div>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Mobile Phone:</span>
                <div className="flex items-center gap-2">
                  <a href={`tel:${booking.contactPhone}`} className="text-white hover:underline">
                    {booking.contactPhone}
                  </a>
                  <a
                    href={`https://wa.me/${String(booking.contactPhone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Direct WhatsApp Chat"
                  >
                    <MessageCircle size={13} />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Email Address:</span>
                <a href={`mailto:${booking.contactEmail}`} className="text-white hover:underline truncate max-w-[160px]">
                  {booking.contactEmail}
                </a>
              </div>

              {booking.notes && (
                <div className="pt-2 text-[11px] text-[#D9E2EF] bg-[#041329] p-2.5 rounded-lg border border-white/5">
                  <strong className="block text-[#8CA8CC] text-[10px] uppercase">Special Pilgrim Request:</strong>
                  {booking.notes}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Departure Batch & Route */}
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8CA8CC] uppercase tracking-wider">
              <Calendar size={15} className="text-[#D9A441]" />
              <span>Departure & Route</span>
            </div>
            <div>
              <div className="text-base font-bold text-white">{booking.departure?.name}</div>
              <div className="text-xs text-[#8CA8CC]">
                {booking.departure?.totalDays} Days Pilgrimage • {booking.totalTravellers} Yatri(s)
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Arrival Date:</span>
                <span className="text-white">
                  {new Date(booking.departure?.arrivalDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Departure Date:</span>
                <span className="text-white">
                  {new Date(booking.departure?.departureDate).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[#8CA8CC] block text-[11px]">Selected Package:</span>
                <span className="text-white font-medium block mt-0.5">{booking.route?.name}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Financial Summary */}
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8CA8CC] uppercase tracking-wider">
              <CreditCard size={15} className="text-emerald-400" />
              <span>Financial Summary</span>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-white">
                ₹{booking.totalAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#8CA8CC]">Total Package Amount (Inc. GST)</div>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Total Paid:</span>
                <span className="text-emerald-400 font-bold">
                  ₹{(financialSummary?.totalPaid || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8CA8CC]">Balance Due:</span>
                <span className="text-amber-300 font-bold">
                  ₹{(financialSummary?.balanceDue || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#8CA8CC]">Settlement Status:</span>
                <select
                  value={booking.paymentStatus}
                  disabled={statusUpdating}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-md px-2 py-1 text-[11px] outline-none"
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                  <option value="PAID">PAID IN FULL</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Registered Yatris (Devotees) Table */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#2F6FED]" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Registered Yatris ({booking.travellers?.length || 0})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-3">Yatri Full Name</th>
                  <th className="py-3 px-3">Age / Gender</th>
                  <th className="py-3 px-3">Passport / ID</th>
                  <th className="py-3 px-3">Nationality</th>
                  <th className="py-3 px-3">Dietary</th>
                  <th className="py-3 px-3">Emergency Contact</th>
                  <th className="py-3 px-3 text-center">Doc Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(!booking.travellers || booking.travellers.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-[#8CA8CC]">
                      No travellers registered under this booking.
                    </td>
                  </tr>
                ) : (
                  booking.travellers.map((t, idx) => (
                    <tr key={t.id || idx} className="hover:bg-white/5">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">
                          {t.fullName}
                          {t.isPrimary && (
                            <span className="ml-1.5 text-[10px] bg-[#2F6FED]/20 text-[#2F6FED] px-1.5 py-0.5 rounded font-normal">
                              Primary
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#D9E2EF]">
                        {t.age} Yrs • {t.gender}
                      </td>
                      <td className="py-3 px-3 font-mono text-white">
                        {t.passportNumber}
                      </td>
                      <td className="py-3 px-3 text-[#D9E2EF]">{t.nationality}</td>
                      <td className="py-3 px-3 text-[#D9E2EF]">{t.dietaryPreference}</td>
                      <td className="py-3 px-3">
                        <div className="text-white">{t.emergencyContactName}</div>
                        <div className="text-[10px] text-[#8CA8CC]">{t.emergencyContactPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.docVerificationStatus === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : t.docVerificationStatus === 'REJECTED'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {t.docVerificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D.2: Booking Documents & Compliance Register */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-400" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Booking Documents & Compliance Register ({booking.travellers?.length || 1} Yatris)
              </h3>
            </div>
            <span className="text-xs text-[#8CA8CC]">
              Official Requirements: SYPL-RISK-2027, SYPL-MED-2027, SYPL-INS-2027
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-3">Participant</th>
                  <th className="py-3 px-3">Risk Declaration (SYPL-RISK-2027)</th>
                  <th className="py-3 px-3">Medical Fitness (SYPL-MED-2027)</th>
                  <th className="py-3 px-3">Insurance Proof (SYPL-INS-2027)</th>
                  <th className="py-3 px-3 text-center">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(booking.travellers || []).map((t) => {
                  const riskSub = (booking.documentSubmissions || []).find(
                    (s) => s.travellerId === t.id && s.documentRef === 'SYPL-RISK-2027'
                  );
                  const medSub = (booking.documentSubmissions || []).find(
                    (s) => s.travellerId === t.id && s.documentRef === 'SYPL-MED-2027'
                  );
                  const insSub = (booking.documentSubmissions || []).find(
                    (s) => s.travellerId === t.id && s.documentRef === 'SYPL-INS-2027'
                  );

                  const allAccepted =
                    riskSub?.status === 'ACCEPTED' &&
                    medSub?.status === 'ACCEPTED' &&
                    insSub?.status === 'ACCEPTED';

                  const anySubmitted = riskSub || medSub || insSub;

                  return (
                    <tr key={t.id} className="hover:bg-white/5">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{t.fullName}</div>
                        <div className="text-[10px] text-[#8CA8CC] font-mono">{t.passportNumber}</div>
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          riskSub?.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : riskSub?.status === 'SUBMITTED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : riskSub?.status === 'CLARIFICATION_REQUIRED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {riskSub?.status || 'NOT_SUBMITTED'}
                        </span>
                        {riskSub?.signerName && (
                          <div className="text-[10px] text-[#8CA8CC] mt-0.5">Signed: {riskSub.signerName}</div>
                        )}
                      </td>

                      {/* Med */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          medSub?.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : medSub?.status === 'SUBMITTED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : medSub?.status === 'CLARIFICATION_REQUIRED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {medSub?.status || 'NOT_SUBMITTED'}
                        </span>
                        {t.medicalFitnessCertified && (
                          <div className="text-[10px] text-emerald-400 mt-0.5">✓ Clinically Certified</div>
                        )}
                      </td>

                      {/* Ins */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          insSub?.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : insSub?.status === 'SUBMITTED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {insSub?.status || 'NOT_SUBMITTED'}
                        </span>
                        {t.insuranceProvider && (
                          <div className="text-[10px] text-[#8CA8CC] mt-0.5">{t.insuranceProvider}</div>
                        )}
                      </td>

                      {/* Overall Compliance */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold ${
                          allAccepted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : anySubmitted
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {allAccepted ? 'FULLY COMPLIANT' : anySubmitted ? 'IN REVIEW' : 'PENDING ACTION'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section E: Payment Transactions Ledger */}
        <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-400" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Payment Transactions & Receipts ({booking.payments?.length || 0})
              </h3>
            </div>
            <button
              onClick={() => setOfflineModalOpen(true)}
              className="px-3 py-1.5 bg-[#2F6FED] hover:bg-[#2557c4] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Offline Payment</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#041329] text-[#8CA8CC] uppercase font-semibold border-b border-[#D9E2EF]/15">
                  <th className="py-3 px-3">Receipt / Txn ID</th>
                  <th className="py-3 px-3">Installment Type</th>
                  <th className="py-3 px-3">Payment Mode / Method</th>
                  <th className="py-3 px-3">Reference / UTR</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(!booking.payments || booking.payments.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-[#8CA8CC]">
                      No payment transactions recorded for this booking yet.
                    </td>
                  </tr>
                ) : (
                  booking.payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white font-mono">{p.receiptNumber || 'N/A'}</div>
                        <div className="text-[10px] text-[#8CA8CC] font-mono">{p.transactionId}</div>
                      </td>
                      <td className="py-3 px-3 text-[#D9E2EF]">{p.installmentType}</td>
                      <td className="py-3 px-3 text-[#D9E2EF]">
                        {p.paymentMode || p.paymentMethod}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#D9E2EF]">
                        {p.referenceNumber || '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#8CA8CC]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section F & G: WhatsApp Communication History & Internal Administrative Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp Communications History */}
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-emerald-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  WhatsApp Updates History ({booking.whatsAppMessages?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => {
                  handleTemplateChange('BOOKING_RECEIVED');
                  setWhatsAppModalOpen(true);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                + Send New Update
              </button>
            </div>

            {(!booking.whatsAppMessages || booking.whatsAppMessages.length === 0) ? (
              <div className="text-center py-8 text-[#8CA8CC] text-xs">
                No WhatsApp updates sent to this devotee yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {booking.whatsAppMessages.map((m) => (
                  <div key={m.id} className="bg-[#041329] border border-white/5 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{m.templateKey || 'Update'}</span>
                      <span className="text-[10px] text-[#8CA8CC]">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#D9E2EF] text-[11px] whitespace-pre-wrap line-clamp-3 bg-white/5 p-2 rounded">
                      {m.messageContent}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-[#8CA8CC]">
                      <span>To: {m.recipientPhone}</span>
                      <span>By: {m.sentBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Notes & Administrative History */}
          <div className="bg-[#071B3A] border border-[#D9E2EF]/15 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#2F6FED]" />
              <h3 className="font-heading font-bold text-base text-white">
                Internal Administrative Notes ({booking.bookingNotes?.length || 0})
              </h3>
            </div>

            {/* Note form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add confidential internal note (e.g. passport courier tracking, medical clearance remarks, diet details)..."
                rows={3}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-xl p-3 text-xs outline-none focus:border-[#2F6FED] transition-colors"
              />
              <button
                type="submit"
                disabled={noteSubmitting || !noteContent.trim()}
                className="px-4 py-2 bg-[#2F6FED] hover:bg-[#2557c4] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {noteSubmitting ? 'Saving Note...' : 'Save Internal Note'}
              </button>
            </form>

            {/* Notes List */}
            {(!booking.bookingNotes || booking.bookingNotes.length === 0) ? (
              <div className="text-center py-6 text-[#8CA8CC] text-xs">
                No internal notes recorded yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {booking.bookingNotes.map((n) => (
                  <div key={n.id} className="bg-[#041329] border border-white/5 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#8CA8CC] text-[10px]">
                      <span>{n.authorName || n.authorEmail}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-white text-xs whitespace-pre-wrap">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: Send WhatsApp Update Modal with 13 Templates */}
      {whatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-[#071B3A] border border-[#D9E2EF]/20 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageCircle size={20} />
                <h3 className="font-heading font-bold text-base text-white">
                  Send WhatsApp Customer Update
                </h3>
              </div>
              <button
                onClick={() => setWhatsAppModalOpen(false)}
                className="text-[#8CA8CC] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Recipient Phone & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#8CA8CC] mb-1 font-semibold">Devotee Mobile (WhatsApp)</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none font-mono"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-[#8CA8CC] mb-1 font-semibold">Devotee Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Select Pre-Approved Template (13 Options)
              </label>
              <select
                value={selectedTemplateKey}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none"
              >
                {Object.entries(WHATSAPP_TEMPLATES).map(([key, tpl]) => (
                  <option key={key} value={key}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Body (Editable) */}
            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Message Content (Formatted for WhatsApp)
              </label>
              <textarea
                value={whatsAppMessageText}
                onChange={(e) => setWhatsAppMessageText(e.target.value)}
                rows={9}
                className="w-full bg-[#041329] border border-emerald-500/30 text-white font-mono rounded-xl p-3 text-xs leading-relaxed outline-none focus:border-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setWhatsAppModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={whatsAppSending}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-900/40"
              >
                <Send size={14} />
                <span>{whatsAppSending ? 'Logging & Dispatching...' : 'Send via WhatsApp (wa.me)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Offline Payment Modal */}
      {offlineModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <form
            onSubmit={handleRecordOfflinePayment}
            className="bg-[#071B3A] border border-[#D9E2EF]/20 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#2F6FED]">
                <CreditCard size={20} />
                <h3 className="font-heading font-bold text-base text-white">
                  Record Offline Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOfflineModalOpen(false)}
                className="text-[#8CA8CC] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Payment Amount (INR) *
              </label>
              <input
                type="number"
                value={offlineAmount}
                onChange={(e) => setOfflineAmount(e.target.value)}
                placeholder="e.g. 25000"
                required
                min="1"
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-sm font-mono outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#8CA8CC] font-semibold mb-1">Payment Mode *</label>
                <select
                  value={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">Direct UPI Transfer</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8CA8CC] font-semibold mb-1">Installment Type</label>
                <select
                  value={offlineType}
                  onChange={(e) => setOfflineType(e.target.value)}
                  className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 outline-none"
                >
                  <option value="REGISTRATION">Registration Deposit</option>
                  <option value="FIRST_INSTALLMENT">First 50% Installment</option>
                  <option value="FINAL_BALANCE">Final Balance</option>
                  <option value="FULL">Full Payment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Transaction / UTR / Cheque Ref Number *
              </label>
              <input
                type="text"
                value={offlineRef}
                onChange={(e) => setOfflineRef(e.target.value)}
                placeholder="e.g. UTR1234567890 or CHQ-48201"
                required
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="block text-[#8CA8CC] text-xs font-semibold mb-1">
                Administrative Notes / Bank Details
              </label>
              <input
                type="text"
                value={offlineNotes}
                onChange={(e) => setOfflineNotes(e.target.value)}
                placeholder="e.g. Verified in ICICI Current Account statement"
                className="w-full bg-[#041329] border border-[#D9E2EF]/20 text-white rounded-lg p-2.5 text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setOfflineModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={offlineSubmitting}
                className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2557c4] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#2F6FED]/30"
              >
                {offlineSubmitting ? 'Recording Receipt...' : 'Record Payment & Issue Receipt'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
