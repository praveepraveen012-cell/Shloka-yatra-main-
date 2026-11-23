import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
  Plane,
  Bus,
  Check,
  UploadCloud,
  FileText,
  HeartPulse,
  Lock,
  Building,
} from 'lucide-react';
import api from '../services/api';
import { CONTRACT_METADATA } from '../data/legalData';
import RiskDeclarationModal from '../components/RiskDeclarationModal';

const travellerSchema = z.object({
  fullName: z.string().min(2, 'Full name as per passport is required'),
  passportNumber: z.string().min(4, 'Valid passport or national ID number is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  age: z.coerce.number().int().min(12, 'Min age is 12').max(85, 'Max age is 85'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dietaryPreference: z.string().default('PURE_VEGETARIAN'),
  medicalConditions: z.string().optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(8, 'Emergency contact phone is required'),
});

const bookingFormSchema = z.object({
  routeId: z.string().min(1, 'Please select a package option'),
  departureId: z.string().min(1, 'Please select a departure batch'),
  passportType: z.enum(['INDIAN', 'FOREIGN']),
  contactName: z.string().min(2, 'Primary contact name is required'),
  contactEmail: z.string().email('Valid email address is required'),
  contactPhone: z.string().min(8, 'Valid phone number with country code is required'),
  contactAddress: z.string().min(5, 'Full street address is required for official records'),
  contactCity: z.string().min(2, 'City is required'),
  contactState: z.string().min(2, 'State / Province is required'),
  contactPincode: z.string().min(3, 'Postal code is required'),
  notes: z.string().optional(),
  // Medical Declarations
  hasCardiacCondition: z.boolean().default(false),
  hasRespiratoryCondition: z.boolean().default(false),
  hasHypertension: z.boolean().default(false),
  hasPriorAltitudeSickness: z.boolean().default(false),
  currentMedications: z.string().optional(),
  medicalFitnessAcknowledged: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that a qualified clinician has or will certify your high-altitude fitness',
  }),
  // Annex B Contractual Consents (5 Mandatory, 2 Optional)
  consentMasterTerms: z.boolean().refine((val) => val === true, {
    message: 'Master Terms & Conditions (T1–T35) must be affirmatively accepted',
  }),
  consentCancellationPolicy: z.boolean().refine((val) => val === true, {
    message: 'Cancellation, Refund & Force Majeure Policy (C1–C17) must be affirmatively accepted',
  }),
  consentServiceSchedule: z.boolean().refine((val) => val === true, {
    message: 'Package Service Schedule (Annex A) must be affirmatively accepted',
  }),
  consentRiskAcknowledgement: z.boolean().refine((val) => val === true, {
    message: 'High-Altitude Risk Acknowledgement & Medical Authorisation (R1–R12) must be affirmatively accepted',
  }),
  consentPrivacyNotice: z.boolean().refine((val) => val === true, {
    message: 'Privacy & Data Protection Notice (P1–P17) must be affirmatively accepted',
  }),
  consentMarketingOptional: z.boolean().default(false),
  consentMediaOptional: z.boolean().default(false),
  // Travellers array
  travellers: z.array(travellerSchema).min(1, 'At least one traveller must be registered'),
});

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [departures, setDepartures] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [calculation, setCalculation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [riskDeclarationData, setRiskDeclarationData] = useState(null);

  // Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState({
    passport: null,
    photo: null,
    medicalCert: null,
    insurance: null,
  });

  // Payment Options State (Step 8)
  const [paymentChoice, setPaymentChoice] = useState('DEPOSIT'); // 'DEPOSIT' | 'FIRST_INSTALLMENT' | 'FULL'
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [processingPayment, setProcessingPayment] = useState(false);
  const [simulatedUpiId, setSimulatedUpiId] = useState('devotee@okhdfcbank');
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('4532 •••• •••• 8892');

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passportType: 'INDIAN',
      departureId: '',
      routeId: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactAddress: '',
      contactCity: '',
      contactState: '',
      contactPincode: '',
      notes: '',
      hasCardiacCondition: false,
      hasRespiratoryCondition: false,
      hasHypertension: false,
      hasPriorAltitudeSickness: false,
      currentMedications: 'None',
      medicalFitnessAcknowledged: false,
      consentMasterTerms: false,
      consentCancellationPolicy: false,
      consentServiceSchedule: false,
      consentRiskAcknowledgement: false,
      consentPrivacyNotice: false,
      consentMarketingOptional: false,
      consentMediaOptional: false,
      travellers: [
        {
          fullName: '',
          passportNumber: '',
          nationality: 'Indian',
          age: 45,
          gender: 'MALE',
          dietaryPreference: 'PURE_VEGETARIAN',
          medicalConditions: 'None',
          emergencyContactName: '',
          emergencyContactPhone: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travellers',
  });

  const watchedRouteId = watch('routeId');
  const watchedDepartureId = watch('departureId');
  const watchedPassportType = watch('passportType');
  const watchedTravellers = watch('travellers');

  // Load initial departures and routes
  useEffect(() => {
    window.scrollTo(0, 0);

    async function init() {
      try {
        const [depRes, routeRes] = await Promise.all([api.getDepartures(), api.getRoutes()]);
        const deps = depRes.departures || [];
        const rts = routeRes.routes || [];
        setDepartures(deps);
        setRoutes(rts);

        const pkgParam = searchParams.get('package');
        const routeParam = searchParams.get('routeCode') || searchParams.get('route');
        const depParam = searchParams.get('departureId') || searchParams.get('batch');
        const passportParam = searchParams.get('passport');

        if (passportParam) {
          setValue('passportType', passportParam === 'FOREIGN_NRI' || passportParam === 'FOREIGN' ? 'FOREIGN' : 'INDIAN');
        }

        if (routeParam && rts.length > 0) {
          const match = rts.find((r) => r.code === routeParam || r.id === routeParam);
          if (match) setValue('routeId', match.id);
        } else if (pkgParam && rts.length > 0) {
          const num = parseInt(pkgParam.replace('option-', ''), 10);
          const match = rts.find((r) => r.routeNumber === num || r.id === pkgParam || r.code === pkgParam);
          if (match) setValue('routeId', match.id);
        } else if (rts.length > 0) {
          setValue('routeId', rts[0].id);
        }

        if (depParam && deps.length > 0) {
          const match = deps.find((d) => d.id === depParam || String(d.batchNumber) === String(depParam) || d.id === `batch-${depParam}`);
          if (match) setValue('departureId', match.id);
        } else if (deps.length > 0) {
          setValue('departureId', deps[0].id);
        }
      } catch (err) {
        setServerError('Unable to load departure schedule or route rates.');
      }
    }
    init();
  }, [searchParams, setValue]);

  // Recalculate price whenever package, nationality, or travellers count changes
  useEffect(() => {
    if (!watchedRouteId) return;

    let isMounted = true;
    async function updateCalculation() {
      try {
        setCalculating(true);
        const calcRes = await api.calculatePrice({
          routeId: watchedRouteId,
          passportType: watchedPassportType,
          travellersCount: watchedTravellers.length || 1,
        });
        if (isMounted) {
          setCalculation(calcRes.calculation || calcRes);
        }
      } catch (err) {
        console.error('Calculation error', err);
      } finally {
        if (isMounted) setCalculating(false);
      }
    }

    updateCalculation();
    return () => {
      isMounted = false;
    };
  }, [watchedRouteId, watchedPassportType, watchedTravellers.length]);

  // Handle Step Navigations with precise validation
  const goToStep = async (targetStep) => {
    if (targetStep < activeStep) {
      setActiveStep(targetStep);
      return;
    }

    if (activeStep === 1) {
      const valid = await trigger(['routeId', 'passportType']);
      if (valid) setActiveStep(2);
    } else if (activeStep === 2) {
      const valid = await trigger(['departureId']);
      if (valid) setActiveStep(3);
    } else if (activeStep === 3) {
      const valid = await trigger(['contactName', 'contactEmail', 'contactPhone', 'contactAddress', 'contactCity', 'contactState', 'contactPincode']);
      if (valid) setActiveStep(4);
    } else if (activeStep === 4) {
      const valid = await trigger(['travellers']);
      if (valid) setActiveStep(5);
    } else if (activeStep === 5) {
      const valid = await trigger(['medicalFitnessAcknowledged']);
      if (valid) setActiveStep(6);
    } else if (activeStep === 6) {
      // Step 6: Documents
      setActiveStep(7);
    } else if (activeStep === 7) {
      // Step 7: Contractual Consents
      const valid = await trigger([
        'consentMasterTerms',
        'consentCancellationPolicy',
        'consentServiceSchedule',
        'consentRiskAcknowledgement',
        'consentPrivacyNotice',
      ]);
      if (valid) setActiveStep(8);
    }
  };

  const handleSimulatedFileUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docKey]: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        },
      }));
    }
  };

  // Full End-to-End Submission with Payment Verification
  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setServerError(null);

      // 1. Create Booking in database
      const payload = {
        routeId: formData.routeId,
        departureId: formData.departureId,
        passportType: formData.passportType,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        notes: `Address: ${formData.contactAddress}, ${formData.contactCity}, ${formData.contactState} - ${formData.contactPincode}. Notes: ${formData.notes || 'None'}`,
        policyAccepted: true,
        travellers: formData.travellers,
      };

      const result = await api.createBooking(payload);
      const createdBooking = result.booking;

      // 2. Affirmative Contractual Consent Record (Annex B)
      try {
        await api.recordConsent(createdBooking.id, {
          documentSlug: 'contract-package-2027',
          documentVersion: CONTRACT_METADATA.version,
          consentedToMasterTerms: formData.consentMasterTerms,
          consentedToCancellationPolicy: formData.consentCancellationPolicy,
          consentedToRiskNotice: formData.consentRiskAcknowledgement,
          consentedToServiceSchedule: formData.consentServiceSchedule,
          consentedToPrivacyNotice: formData.consentPrivacyNotice,
          consentMarketingOptional: formData.consentMarketingOptional,
          consentMediaOptional: formData.consentMediaOptional,
          ipAddress: '127.0.0.1 (Logged at submission)',
          userAgent: navigator.userAgent,
        });
      } catch (consentErr) {
        console.warn('Consent recording note:', consentErr);
      }

      // 2b. Formal Document Submission: SYPL-RISK-2027
      if (riskDeclarationData && createdBooking?.travellers?.[0]?.id) {
        try {
          await api.submitRiskDeclaration({
            bookingId: createdBooking.id,
            travellerId: createdBooking.travellers[0].id,
            ...riskDeclarationData,
            emergencyContact: {
              name: formData.travellers[0]?.emergencyContactName,
              relationship: formData.travellers[0]?.emergencyContactRelationship,
              phone: formData.travellers[0]?.emergencyContactPhone,
            },
          });
        } catch (riskErr) {
          console.warn('Risk declaration submission note:', riskErr);
        }
      }

      // 3. Document Attachments
      for (const [key, doc] of Object.entries(uploadedDocs)) {
        if (doc) {
          try {
            await api.uploadDocument(createdBooking.id, {
              documentType: key.toUpperCase(),
              originalFilename: doc.name,
              fileUrl: `/uploads/${createdBooking.bookingReference}_${key}.pdf`,
              fileSize: doc.size,
            });
          } catch (docErr) {
            console.warn('Document log note:', docErr);
          }
        }
      }

      // 4. Payment Order and Verification
      let payableAmount = calculation?.depositAmount || 25000 * formData.travellers.length;
      if (paymentChoice === 'FIRST_INSTALLMENT') {
        payableAmount = Math.round((calculation?.baseAmount || 350000) * 0.5);
      } else if (paymentChoice === 'FULL') {
        payableAmount = calculation?.totalAmount || 367500;
      }

      const orderRes = await api.createPaymentOrder({
        bookingId: createdBooking.id,
        amount: payableAmount,
        currency: 'INR',
        paymentType: paymentChoice === 'DEPOSIT' ? 'REGISTRATION_DEPOSIT' : paymentChoice === 'FIRST_INSTALLMENT' ? 'FIRST_50_PERCENT' : 'FULL_PAYMENT',
      });

      // Verify simulated payment
      const paymentOrder = orderRes.order;
      await api.verifyPayment({
        bookingId: createdBooking.id,
        orderId: paymentOrder.gatewayOrderId || `ORD-${Date.now()}`,
        paymentId: `PAY-${Date.now()}`,
        signature: 'simulated_secure_sha256_sig',
        status: 'SUCCESS',
        method: paymentMethod,
      });

      // 5. Navigate to official voucher
      navigate(`/booking-success?ref=${createdBooking.bookingReference}`);
    } catch (err) {
      setServerError(err.message || 'Booking submission failed. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDeparture = departures.find((d) => d.id === watchedDepartureId);
  const selectedRoute = routes.find((r) => r.id === watchedRouteId);

  const stepsList = [
    { step: 1, label: '1. Package' },
    { step: 2, label: '2. Batch' },
    { step: 3, label: '3. Contact' },
    { step: 4, label: '4. Yatris' },
    { step: 5, label: '5. Medical' },
    { step: 6, label: '6. Documents' },
    { step: 7, label: '7. Consent' },
    { step: 8, label: '8. Payment' },
  ];

  return (
    <div className="bg-[#F5F8FC] min-h-screen w-full overflow-x-hidden font-sans">
      {/* Editorial Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-14 relative w-full overflow-hidden">
        <div className="wrap">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F6FED]/20 border border-[#2F6FED] text-white text-xs font-semibold uppercase tracking-wider">
              Official 2027 Reservation Workflow
            </span>
            <span className="text-slate-400 text-xs sm:text-sm">
              Sole Organiser: {CONTRACT_METADATA.shortName}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
            Kailash Mansarovar Yatra 2027 Registration
          </h1>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#D9E2EF] max-w-2xl">
            Multi-step reservation and contractual acceptance portal. Real-time seat allocation, medical declarations, Annex B legal execution, and sandbox payment simulation.
          </p>
        </div>
      </section>

      {/* Main Multi-Step Form */}
      <section className="sec bg-[#F5F8FC] py-8 sm:py-12 w-full overflow-hidden">
        <div className="wrap">
          {/* Step Progress Indicators with safe horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto pb-3 mb-6 sm:mb-8 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max px-1">
              {stepsList.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => s.step < activeStep && setActiveStep(s.step)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                    activeStep === s.step
                      ? 'bg-[#2F6FED] text-white shadow-md'
                      : activeStep > s.step
                      ? 'bg-[#071B3A] text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {activeStep > s.step ? <Check size={13} className="text-emerald-400 shrink-0" /> : null}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full">
            {serverError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  color: '#B91C1C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <AlertCircle size={20} color="#EF4444" />
                <span style={{ fontSize: '0.92rem' }}>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start w-full max-w-full box-border">
              {/* Form Steps Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-[#D9E2EF] w-full max-w-full box-border">
                {/* STEP 1: SELECT PACKAGE */}
                {activeStep === 1 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 1 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Choose Pilgrimage Route
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Select one of the three travel options described in the confirmed 2027 Kailash Mansarovar Service Schedule.
                    </p>

                    {/* Passport Category */}
                    <div className="mb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Your Passport Category:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            watchedPassportType === 'INDIAN' ? 'border-[#2F6FED] bg-blue-50/50' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            value="INDIAN"
                            {...register('passportType')}
                            className="accent-[#2F6FED]"
                          />
                          <span className="font-semibold text-xs sm:text-sm text-[#071B3A]">🇮🇳 Indian Passport (5% GST)</span>
                        </label>

                        <label
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            watchedPassportType === 'FOREIGN' ? 'border-[#2F6FED] bg-blue-50/50' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            value="FOREIGN"
                            {...register('passportType')}
                            className="accent-[#2F6FED]"
                          />
                          <span className="font-semibold text-xs sm:text-sm text-[#071B3A]">🌍 Foreign / NRI Passport (Tibet Permit Included)</span>
                        </label>
                      </div>
                    </div>

                    {/* Route Cards */}
                    <div className="flex flex-col gap-4 mb-8">
                      {routes.map((r) => {
                        const isSelected = watchedRouteId === r.id;
                        const isOverland = r.code === 'bus-both-ways';
                        return (
                          <div
                            key={r.id}
                            onClick={() => setValue('routeId', r.id)}
                            className={`p-4 sm:p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 sm:gap-4 ${
                              isSelected ? 'border-[#2F6FED] bg-blue-50/40 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={r.id}
                              checked={isSelected}
                              onChange={() => setValue('routeId', r.id)}
                              className="accent-[#2F6FED] mt-1 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                                <div className="flex items-center gap-2">
                                  {isOverland ? <Bus size={18} className="text-[#2F6FED] shrink-0" /> : <Plane size={18} className="text-[#2F6FED] shrink-0" />}
                                  <b className="font-heading text-base sm:text-lg text-[#071B3A]">
                                    Package {r.routeNumber}: {(r.name.split('—')[1] || r.name).replace(/^Option \d+:\s*/, '').replace(/^Package \d+:\s*/, '')}
                                  </b>
                                </div>
                                <span className="text-[#071B3A] font-bold text-base sm:text-lg">
                                  {watchedPassportType === 'INDIAN'
                                    ? `₹${(r.pricingTiers?.find((p) => p.passportType === 'INDIAN')?.basePrice || 350000).toLocaleString('en-IN')}`
                                    : `₹${(r.pricingTiers?.find((p) => p.passportType === 'FOREIGN')?.basePrice || 425000).toLocaleString('en-IN')}`}
                                </span>
                              </div>
                              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                {r.description}
                              </p>
                              <small className="text-[#2F6FED] font-semibold block mt-2 text-xs">
                                Duration: {r.durationDays} Days • Travel Mode: {r.travelMode}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                    >
                      <span>Proceed to Departure Batch</span>
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}

                {/* STEP 2: SELECT DEPARTURE BATCH */}
                {activeStep === 2 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 2 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Choose Departure Batch
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Select one of the eight approved batches for 2027. Four batches coincide with sacred Full Moon at Lake Mansarovar.
                    </p>

                    <div className="flex flex-col gap-3 mb-8">
                      {departures.map((batch) => {
                        const isSelected = watchedDepartureId === batch.id;
                        const available = batch.totalCapacity - batch.bookedSeats;
                        return (
                          <div
                            key={batch.id}
                            onClick={() => setValue('departureId', batch.id)}
                            className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected ? 'border-[#2F6FED] bg-blue-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start sm:items-center gap-3">
                              <input
                                type="radio"
                                value={batch.id}
                                checked={isSelected}
                                onChange={() => setValue('departureId', batch.id)}
                                className="accent-[#2F6FED] mt-1 sm:mt-0 shrink-0"
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <b className="font-heading text-sm sm:text-base text-[#071B3A]">{batch.name}</b>
                                  {batch.isFullMoon && (
                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] border border-blue-200 font-semibold">
                                      Full Moon
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-600 block mt-0.5">
                                  Arrival: {new Date(batch.arrivalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • Departure: {new Date(batch.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right pl-7 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              <span className="text-xs sm:text-sm text-[#2F6FED] font-bold block">
                                {batch.totalDays} Days
                              </span>
                              <small className="text-slate-500 text-xs">
                                {available} seats remaining
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Contact & Address</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: LEAD CONTACT & PERMANENT ADDRESS */}
                {activeStep === 3 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 3 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Lead Contact & Address
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Official contact details required for Tibet Travel Permit dispatch, travel insurance registration, and tax receipts.
                    </p>

                    <div className="flex flex-col gap-4 sm:gap-5 mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Legal Name *
                          </label>
                          <input
                            type="text"
                            {...register('contactName')}
                            placeholder="e.g. Rajesh Kumar Sharma"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address (for official vouchers) *
                          </label>
                          <input
                            type="email"
                            {...register('contactEmail')}
                            placeholder="rajesh@example.com"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone Number with Country Code *
                          </label>
                          <input
                            type="tel"
                            {...register('contactPhone')}
                            placeholder="+91 9876543210"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            {...register('contactCity')}
                            placeholder="Noida / Mumbai / Bengaluru"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactCity && <p className="text-red-500 text-xs mt-1">{errors.contactCity.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Permanent Street Address *
                        </label>
                        <input
                          type="text"
                          {...register('contactAddress')}
                          placeholder="Flat / House Number, Street, Sector, Landmark"
                          className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                        />
                        {errors.contactAddress && <p className="text-red-500 text-xs mt-1">{errors.contactAddress.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            State / Province *
                          </label>
                          <input
                            type="text"
                            {...register('contactState')}
                            placeholder="Uttar Pradesh / Maharashtra"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactState && <p className="text-red-500 text-xs mt-1">{errors.contactState.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Postal Code (PIN / ZIP) *
                          </label>
                          <input
                            type="text"
                            {...register('contactPincode')}
                            placeholder="201304"
                            className="w-full p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                          {errors.contactPincode && <p className="text-red-500 text-xs mt-1">{errors.contactPincode.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(4)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Traveller Roster</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: TRAVELLER ROSTER & PREFERENCES */}
                {activeStep === 4 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 4 of 8
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 mb-4">
                      <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] m-0">
                        Traveller Details ({fields.length})
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          append({
                            fullName: '',
                            passportNumber: '',
                            nationality: watchedPassportType === 'INDIAN' ? 'Indian' : '',
                            age: 45,
                            gender: 'MALE',
                            dietaryPreference: 'PURE_VEGETARIAN',
                            medicalConditions: 'None',
                            emergencyContactName: '',
                            emergencyContactPhone: '',
                          })
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 border border-[#2F6FED] text-[#2F6FED] font-semibold text-xs sm:text-sm hover:bg-blue-100 transition-colors w-full sm:w-auto min-h-[40px] cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>Add Yatri</span>
                      </button>
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Register each devotee exactly as their name and passport number appear on government identification.
                    </p>

                    {fields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-[#D9E2EF] mb-5"
                      >
                        <div className="flex items-center justify-between mb-3.5">
                          <strong className="text-[#071B3A] text-sm sm:text-base font-bold">
                            Yatri #{idx + 1} {idx === 0 ? '(Primary Pilgrim)' : ''}
                          </strong>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-semibold cursor-pointer"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Full Name (as per Passport) *
                            </label>
                            <input
                              type="text"
                              {...register(`travellers.${idx}.fullName`)}
                              placeholder="Full passport name"
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                            {errors.travellers?.[idx]?.fullName && (
                              <p className="text-red-500 text-xs mt-1">{errors.travellers[idx].fullName.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Passport / National ID Number *
                            </label>
                            <input
                              type="text"
                              {...register(`travellers.${idx}.passportNumber`)}
                              placeholder="Passport number"
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                            {errors.travellers?.[idx]?.passportNumber && (
                              <p className="text-red-500 text-xs mt-1">{errors.travellers[idx].passportNumber.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Nationality *
                            </label>
                            <input
                              type="text"
                              {...register(`travellers.${idx}.nationality`)}
                              placeholder="Indian"
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Age (Years)
                            </label>
                            <input
                              type="number"
                              {...register(`travellers.${idx}.age`)}
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Gender
                            </label>
                            <select
                              {...register(`travellers.${idx}.gender`)}
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border bg-white"
                            >
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Emergency Contact Name *
                            </label>
                            <input
                              type="text"
                              {...register(`travellers.${idx}.emergencyContactName`)}
                              placeholder="Spouse / Parent / Sibling Name"
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Emergency Contact Phone *
                            </label>
                            <input
                              type="tel"
                              {...register(`travellers.${idx}.emergencyContactPhone`)}
                              placeholder="+91 Emergency phone"
                              className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(5)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Medical Declarations</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: MEDICAL & SAFETY DECLARATIONS */}
                {activeStep === 5 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 5 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      High-Altitude Medical Declaration
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      The circumambulation route ascends up to 5,630 metres at Dolma La Pass. Truthful clinical disclosure is essential for on-ground safety and permit clearance.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-[#D9E2EF] mb-6">
                      <h4 className="text-sm sm:text-base text-[#071B3A] font-bold mb-3">
                        Check Any Pre-Existing Conditions That Apply:
                      </h4>

                      <div className="flex flex-col gap-3">
                        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
                          <input type="checkbox" {...register('hasCardiacCondition')} className="accent-[#2F6FED] w-4 h-4 mt-0.5 shrink-0" />
                          <span>History of heart condition, bypass surgery, stent, or coronary disease</span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
                          <input type="checkbox" {...register('hasRespiratoryCondition')} className="accent-[#2F6FED] w-4 h-4 mt-0.5 shrink-0" />
                          <span>Asthma, chronic bronchitis, or severe respiratory limitations</span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
                          <input type="checkbox" {...register('hasHypertension')} className="accent-[#2F6FED] w-4 h-4 mt-0.5 shrink-0" />
                          <span>High blood pressure (Hypertension) or diabetes under active medication</span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
                          <input type="checkbox" {...register('hasPriorAltitudeSickness')} className="accent-[#2F6FED] w-4 h-4 mt-0.5 shrink-0" />
                          <span>Prior occurrence of severe Acute Mountain Sickness (AMS), HAPE, or HACE</span>
                        </label>
                      </div>

                      <div className="mt-5">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Current Daily Prescription Medications (if any):
                        </label>
                        <input
                          type="text"
                          {...register('currentMedications')}
                          placeholder="e.g. Telmisartan 40mg, Diamox, Metformin (or write 'None')"
                          className="w-full p-2.5 sm:p-3 rounded-lg border border-[#D9E2EF] text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                        />
                      </div>
                    </div>

                    {/* Medical Fitness Acknowledgment */}
                    <div className="mb-6">
                      <label
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                          errors.medicalFitnessAcknowledged ? 'bg-red-50 border-red-300' : 'bg-blue-50/40 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('medicalFitnessAcknowledged')}
                          className="accent-[#2F6FED] w-4 h-4 mt-0.5 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed">
                          I confirm that all pilgrims in this registration will undergo a physical fitness assessment by a qualified doctor and provide a certified clinical certificate prior to departure as mandated by Tibet Tourism rules.
                        </span>
                      </label>
                      {errors.medicalFitnessAcknowledged && <p className="text-red-500 text-xs mt-1.5">{errors.medicalFitnessAcknowledged.message}</p>}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(4)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(6)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Document Uploads</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: DOCUMENT UPLOAD PORTAL */}
                {activeStep === 6 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 6 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Secure Document Uploads
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Upload government-issued documents now or upload them later via your Member Portal. Passports must have at least 6 months validity from June 2027.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {/* Passport Scan */}
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-dashed border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <UploadCloud size={18} className="text-[#2F6FED] shrink-0" />
                          <strong className="text-xs sm:text-sm text-[#071B3A]">Passport Front & Back</strong>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Clear color copy showing photo, passport number, and expiry date (PDF or JPG).
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleSimulatedFileUpload('passport', e)}
                          className="text-xs w-full"
                        />
                        {uploadedDocs.passport && (
                          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                            <Check size={14} /> {uploadedDocs.passport.name}
                          </div>
                        )}
                      </div>

                      {/* Passport Photo */}
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-dashed border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <UploadCloud size={18} className="text-[#2F6FED] shrink-0" />
                          <strong className="text-xs sm:text-sm text-[#071B3A]">Devotee Portrait Photo</strong>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Recent passport-style photograph with white background for Tibet visa badge.
                        </p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleSimulatedFileUpload('photo', e)}
                          className="text-xs w-full"
                        />
                        {uploadedDocs.photo && (
                          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                            <Check size={14} /> {uploadedDocs.photo.name}
                          </div>
                        )}
                      </div>

                      {/* Medical Fitness Certificate */}
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-dashed border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <UploadCloud size={18} className="text-[#2F6FED] shrink-0" />
                          <strong className="text-xs sm:text-sm text-[#071B3A]">Medical Fitness Certificate</strong>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Clinical clearance signed by registered physician (may be submitted up to 45 days before departure).
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleSimulatedFileUpload('medicalCert', e)}
                          className="text-xs w-full"
                        />
                        {uploadedDocs.medicalCert && (
                          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                            <Check size={14} /> {uploadedDocs.medicalCert.name}
                          </div>
                        )}
                      </div>

                      {/* Travel & Evacuation Insurance */}
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-dashed border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <UploadCloud size={18} className="text-[#2F6FED] shrink-0" />
                          <strong className="text-xs sm:text-sm text-[#071B3A]">Travel & Evacuation Insurance</strong>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Policy covering emergency medical evacuation up to 5,630 metres.
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => handleSimulatedFileUpload('insurance', e)}
                          className="text-xs w-full"
                        />
                        {uploadedDocs.insurance && (
                          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                            <Check size={14} /> {uploadedDocs.insurance.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(5)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(7)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Contractual Consents</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: CONTRACTUAL ACCEPTANCE (ANNEX B) */}
                {activeStep === 7 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 7 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Annex B: Affirmative Contractual Acceptance
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Per legal standards, each document requires separate affirmative consent. Checkboxes are unchecked by default. Version: <code>{CONTRACT_METADATA.version}</code>.
                    </p>

                    <div className="flex flex-col gap-3.5 mb-6">
                      {/* 1. Master Terms */}
                      <label
                        className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          errors.consentMasterTerms ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('consentMasterTerms')}
                          className="accent-[#2F6FED] mt-0.5 w-4 h-4 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed break-words">
                          <strong>Mandatory:</strong> I have read, understood, and affirmatively accept the complete <Link to="/terms" target="_blank" className="text-[#2F6FED] underline font-semibold">Terms & Conditions (T1–T35)</Link> of Shloka Yatra Private Limited.
                        </span>
                      </label>
                      {errors.consentMasterTerms && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consentMasterTerms.message}</p>}

                      {/* 2. Cancellation Policy */}
                      <label
                        className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          errors.consentCancellationPolicy ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('consentCancellationPolicy')}
                          className="accent-[#2F6FED] mt-0.5 w-4 h-4 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed break-words">
                          <strong>Mandatory:</strong> I accept the <Link to="/cancellation-policy" target="_blank" className="text-[#2F6FED] underline font-semibold">Cancellation, Refund & Force Majeure Policy (C1–C17)</Link>, including the voluntary cancellation fee slabs (25% / 50% / 75% / 100%) and the single refund formula without double deductions.
                        </span>
                      </label>
                      {errors.consentCancellationPolicy && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consentCancellationPolicy.message}</p>}

                      {/* 3. Service Schedule */}
                      <label
                        className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          errors.consentServiceSchedule ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('consentServiceSchedule')}
                          className="accent-[#2F6FED] mt-0.5 w-4 h-4 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed break-words">
                          <strong>Mandatory:</strong> I have received and agreed to the personalized <Link to="/service-schedule" target="_blank" className="text-[#2F6FED] underline font-semibold">Package Service Schedule (Annex A)</Link> detailing route sectors, hotel standards, satvik meals, and inclusions.
                        </span>
                      </label>
                      {errors.consentServiceSchedule && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consentServiceSchedule.message}</p>}

                      {/* 4. Risk Acknowledgement & Official Document SYPL-RISK-2027 */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        riskDeclarationData ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/60 border-amber-300'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#071B3A] text-amber-300 font-mono">
                                SYPL-RISK-2027
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                Draft 1.0 – 23 Nov 2026
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#071B3A]">
                              Participant Declaration, Assumption of Inherent High-Altitude Risk & Limited Indemnity
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {riskDeclarationData
                                ? `Signed by ${riskDeclarationData.signerName} (5/5 page initials recorded, 8 direct acknowledgements confirmed)`
                                : 'Official document requires initialing each page (Pages 1 to 5), Section 8 direct acknowledgements, and participant signature.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsRiskModalOpen(true)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                              riskDeclarationData
                                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                : 'bg-[#071B3A] text-amber-300 hover:bg-slate-900 border border-amber-500/40 shadow-sm'
                            }`}
                          >
                            <ShieldCheck size={14} />
                            <span>{riskDeclarationData ? 'Review Signed Declaration' : 'Open & Sign Declaration →'}</span>
                          </button>
                        </div>
                      </div>

                      <label
                        className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          errors.consentRiskAcknowledgement ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('consentRiskAcknowledgement')}
                          className="accent-[#2F6FED] mt-0.5 w-4 h-4 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed break-words">
                          <strong>Mandatory:</strong> I accept the <Link to="/risk-acknowledgement" target="_blank" className="text-[#2F6FED] underline font-semibold">High-Altitude Risk Acknowledgement & Emergency Medical Authorisation (R1–R12 / SYPL-RISK-2027)</Link>, agreeing to voluntary assumption of high-altitude risks, medical proxies, and terms.
                        </span>
                      </label>
                      {errors.consentRiskAcknowledgement && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consentRiskAcknowledgement.message}</p>}

                      {/* 5. Privacy Notice */}
                      <label
                        className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          errors.consentPrivacyNotice ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register('consentPrivacyNotice')}
                          className="accent-[#2F6FED] mt-0.5 w-4 h-4 shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-[#071B3A] leading-relaxed break-words">
                          <strong>Mandatory:</strong> I acknowledge receipt of the <Link to="/privacy-policy" target="_blank" className="text-[#2F6FED] underline font-semibold">Privacy & Data Protection Notice (P1–P17)</Link> for passport and permit compliance.
                        </span>
                      </label>
                      {errors.consentPrivacyNotice && <p className="text-red-500 text-xs -mt-2 ml-7">{errors.consentPrivacyNotice.message}</p>}

                      {/* Optional Consents */}
                      <div className="bg-slate-100 p-4 rounded-xl mt-1">
                        <span className="block text-xs text-slate-600 font-bold uppercase tracking-wider mb-2">
                          Optional Consents (Unchecked by Default)
                        </span>

                        <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-700 mb-2">
                          <input type="checkbox" {...register('consentMarketingOptional')} className="accent-[#2F6FED] mt-0.5 shrink-0" />
                          <span>Optional: Yes, I would like to receive spiritual yatra bulletins and preparation tips via email / WhatsApp.</span>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-700">
                          <input type="checkbox" {...register('consentMediaOptional')} className="accent-[#2F6FED] mt-0.5 shrink-0" />
                          <span>Optional: Yes, I consent to group photographs or video captured during public aartis being used respectfully for promotional media.</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(6)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(8)}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md min-h-[48px] cursor-pointer"
                      >
                        <span>Proceed to Payment Simulator</span>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: PAYMENT GATEWAY SIMULATION */}
                {activeStep === 8 && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#2F6FED] font-bold">
                      Step 8 of 8
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#071B3A] mt-1 mb-2">
                      Payment Gateway Integration
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6">
                      Choose your payment instalment. The initial registration advance (₹25,000 / $250) is credited against the package price, not an additional fee.
                    </p>

                    {/* Choose Amount Option */}
                    <div className="flex flex-col gap-3 mb-6">
                      <label
                        className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                          paymentChoice === 'DEPOSIT' ? 'border-[#2F6FED] bg-blue-50/40' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <input
                            type="radio"
                            name="payOption"
                            value="DEPOSIT"
                            checked={paymentChoice === 'DEPOSIT'}
                            onChange={() => setPaymentChoice('DEPOSIT')}
                            className="accent-[#2F6FED] mt-1 sm:mt-0 shrink-0"
                          />
                          <div>
                            <strong className="block text-sm sm:text-base text-[#071B3A]">
                              Registration Advance Only
                            </strong>
                            <span className="text-xs text-slate-500">
                              Credited towards package price. Locks seat allocation.
                            </span>
                          </div>
                        </div>
                        <strong className="text-[#2F6FED] text-base sm:text-lg pl-7 sm:pl-0">
                          ₹{(calculation?.depositAmount || 25000 * watchedTravellers.length).toLocaleString('en-IN')}
                        </strong>
                      </label>

                      <label
                        className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                          paymentChoice === 'FIRST_INSTALLMENT' ? 'border-[#2F6FED] bg-blue-50/40' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <input
                            type="radio"
                            name="payOption"
                            value="FIRST_INSTALLMENT"
                            checked={paymentChoice === 'FIRST_INSTALLMENT'}
                            onChange={() => setPaymentChoice('FIRST_INSTALLMENT')}
                            className="accent-[#2F6FED] mt-1 sm:mt-0 shrink-0"
                          />
                          <div>
                            <strong className="block text-sm sm:text-base text-[#071B3A]">
                              First 50% Package Instalment
                            </strong>
                            <span className="text-xs text-slate-500">
                              Triggers immediate group permit processing.
                            </span>
                          </div>
                        </div>
                        <strong className="text-[#071B3A] text-base sm:text-lg pl-7 sm:pl-0">
                          ₹{Math.round((calculation?.baseAmount || 350000) * 0.5).toLocaleString('en-IN')}
                        </strong>
                      </label>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-[#D9E2EF] mb-6">
                      <h4 className="text-xs sm:text-sm text-[#071B3A] font-bold mb-3">
                        Select Payment Rail (Sandbox Mode Active):
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('UPI')}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                            paymentMethod === 'UPI' ? 'border-[#2F6FED] bg-blue-50 text-[#2F6FED]' : 'border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          UPI (GPay / PhonePe)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CARD')}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                            paymentMethod === 'CARD' ? 'border-[#2F6FED] bg-blue-50 text-[#2F6FED]' : 'border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          Credit / Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('NETBANKING')}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                            paymentMethod === 'NETBANKING' ? 'border-[#2F6FED] bg-blue-50 text-[#2F6FED]' : 'border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          Net Banking (RTGS/NEFT)
                        </button>
                      </div>

                      {paymentMethod === 'UPI' && (
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            Simulated Virtual Payment Address (VPA):
                          </label>
                          <input
                            type="text"
                            value={simulatedUpiId}
                            onChange={(e) => setSimulatedUpiId(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                        </div>
                      )}

                      {paymentMethod === 'CARD' && (
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            Card Details (Test Sandbox):
                          </label>
                          <input
                            type="text"
                            value={simulatedCardNumber}
                            onChange={(e) => setSimulatedCardNumber(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#2F6FED] box-border"
                          />
                        </div>
                      )}

                      {paymentMethod === 'NETBANKING' && (
                        <div className="text-xs text-slate-600 leading-relaxed">
                          Official Beneficiary: <strong>{CONTRACT_METADATA.companyName}</strong><br />
                          Bank: HDFC Bank Limited, Noida Sector 104 Branch<br />
                          Account Type: Current Pilgrimage Operations Account
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 w-full">
                      <button
                        type="button"
                        onClick={() => goToStep(7)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px] cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg min-h-[50px] cursor-pointer"
                      >
                        <CreditCard size={18} />
                        <span>
                          {submitting
                            ? 'Processing Secure Payment & Generating Voucher...'
                            : `Authorize Payment (₹${(paymentChoice === 'DEPOSIT' ? (calculation?.depositAmount || 25000 * watchedTravellers.length) : Math.round((calculation?.baseAmount || 350000) * 0.5)).toLocaleString('en-IN')})`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Live Quotation & Capacity Card */}
              <div className="bg-[#071B3A] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white border-1.5 border-[#2F6FED]/40 shadow-xl lg:sticky lg:top-28 w-full max-w-full box-border">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkles size={16} color="#FFFFFF" />
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8CA8CC' }}>
                    Live Price Breakdown
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#FFFFFF' }}>
                  Pilgrimage Quotation
                </h3>

                {calculating ? (
                  <p style={{ color: '#D9E2EF', fontSize: '0.88rem' }}>Updating calculation with server...</p>
                ) : calculation ? (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', paddingBottom: '20px', borderBottom: '1px solid rgba(217, 226, 239, 0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#D9E2EF' }}>Base Package ({calculation.travellersCount || watchedTravellers.length} × ₹{Number(calculation.basePricePerPerson || 350000).toLocaleString('en-IN')})</span>
                        <b style={{ color: '#FFFFFF' }}>₹{Number(calculation.baseAmount || 350000).toLocaleString('en-IN')}</b>
                      </div>

                      {calculation.gstAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#D9E2EF' }}>GST (5% Statutory Tax)</span>
                          <b style={{ color: '#FFFFFF' }}>+ ₹{Number(calculation.gstAmount).toLocaleString('en-IN')}</b>
                        </div>
                      )}

                      {calculation.foreignAirfareSupplementUsd > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#D9E2EF' }}>Airfare Sector Supplement</span>
                          <b style={{ color: '#FFFFFF' }}>+ US$ {Number(calculation.foreignAirfareSupplementUsd).toLocaleString('en-US')}</b>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Total Package Cost:</span>
                      <div style={{ textAlign: 'right' }}>
                        <b style={{ fontSize: '1.55rem', color: '#FFFFFF', fontFamily: 'var(--sans)' }}>
                          ₹{Number(calculation.totalAmount || 367500).toLocaleString('en-IN')}
                        </b>
                        {calculation.foreignAirfareSupplementUsd > 0 && (
                          <small style={{ display: 'block', color: '#FFFFFF', fontSize: '0.82rem' }}>
                            + US$ {Number(calculation.foreignAirfareSupplementUsd).toLocaleString('en-US')}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Deposit Due Today */}
                    <div style={{ background: '#041329', padding: '16px 20px', borderRadius: '12px', border: '1px solid #2F6FED', marginBottom: '20px' }}>
                      <small style={{ color: '#8CA8CC', textTransform: 'uppercase', fontSize: '0.72rem', display: 'block' }}>
                        Initial Advance Registration Deposit
                      </small>
                      <b style={{ fontSize: '1.35rem', color: '#FFFFFF' }}>
                        ₹{Number(calculation.depositAmount || 25000 * watchedTravellers.length).toLocaleString('en-IN')}
                      </b>
                      <small style={{ color: '#D9E2EF', fontSize: '0.74rem', display: 'block', marginTop: '2px' }}>
                        (₹25,000 / US$ 250 per traveller • Credited to Base Price)
                      </small>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#D9E2EF', fontSize: '0.88rem' }}>Select package to view calculation.</p>
                )}

                <div style={{ fontSize: '0.8rem', color: '#D9E2EF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <ShieldCheck size={16} color="#2F6FED" />
                    <span>Real-time database capacity lock</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <CheckCircle2 size={16} color="#2F6FED" />
                    <span>Instant booking reference generation</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Risk Declaration Modal (SYPL-RISK-2027) */}
      <RiskDeclarationModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        participantData={{
          fullName: watchedTravellers?.[0]?.fullName || getValues('contactName'),
          passportNumber: watchedTravellers?.[0]?.passportNumber,
          city: getValues('contactCity') || 'Kathmandu, Nepal',
          emergencyContactName: watchedTravellers?.[0]?.emergencyContactName,
          emergencyContactPhone: watchedTravellers?.[0]?.emergencyContactPhone,
        }}
        initialData={riskDeclarationData}
        onDeclarationSigned={(signedData) => {
          setRiskDeclarationData(signedData);
          setValue('consentRiskAcknowledgement', true);
          setIsRiskModalOpen(false);
        }}
      />
    </div>
  );
}
