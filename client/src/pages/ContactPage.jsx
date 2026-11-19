import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, Building, MapPin, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import api from '../services/api';

const enquirySchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid telephone / mobile number'),
  preferredBatch: z.string().optional(),
  preferredRoute: z.string().optional(),
  travellersCount: z.coerce.number().int().min(1).max(20).default(1),
  message: z.string().min(5, 'Please provide details or specific questions regarding your yatra'),
});

export default function ContactPage() {
  const [departures, setDepartures] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getDepartures().then((res) => setDepartures(res.departures || [])).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      travellersCount: 1,
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.submitEnquiry(data);
      setSuccessMsg(res.message || 'Your enquiry has been received. Our Yatra advisor will connect with you shortly.');
      reset();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try calling directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#101D35] to-[#1C3F70] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 sm:mb-4">
            Get in Touch
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 sm:mb-4 leading-tight">
            Speak with a Yatra Advisor
          </h1>
          <p className="text-[#E3DFD5] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-body">
            Have questions about physical fitness, visa documentation, air route availability, or booking procedures?
            Our team is here to guide your pilgrimage planning with transparency and care.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Office Info */}
      <section className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6 w-full box-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full max-w-full box-border">
          {/* Form */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#D9E2EF] shadow-sm w-full max-w-full box-border min-w-0">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#101D35] mb-2">
              Send a Pilgrimage Enquiry
            </h2>
            <p className="text-[#5A6B82] text-xs sm:text-sm mb-6 leading-relaxed">
              Fill in the details below and we will prepare a personalized itinerary and preparation pack for you.
            </p>

            {successMsg && (
              <div className="bg-[#D9A441]/15 border border-[#D9A441] text-[#101D35] p-3.5 sm:p-4 rounded-xl flex items-center gap-3 mb-6">
                <CheckCircle2 size={20} className="text-[#D9A441] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500 text-red-700 p-3.5 sm:p-4 rounded-xl flex items-center gap-3 mb-6">
                <AlertCircle size={20} className="text-red-600 shrink-0" />
                <span className="text-xs sm:text-sm">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#071B3A] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Suresh Nair"
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED] transition-colors ${
                    errors.name ? 'border-red-500' : 'border-[#D9E2EF]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#071B3A] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="suresh@example.com"
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED] transition-colors ${
                      errors.email ? 'border-red-500' : 'border-[#D9E2EF]'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#071B3A] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+91 9876543210"
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED] transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-[#D9E2EF]'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#071B3A] mb-1.5">
                    Preferred Batch
                  </label>
                  <select
                    {...register('preferredBatch')}
                    className="w-full p-2.5 rounded-xl border border-[#D9E2EF] text-xs text-[#071B3A] bg-white outline-none focus:border-[#2F6FED]"
                  >
                    <option value="">Select Batch...</option>
                    {departures.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} {d.isFullMoon ? '(Full Moon)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#071B3A] mb-1.5">
                    Preferred Route
                  </label>
                  <select
                    {...register('preferredRoute')}
                    className="w-full p-2.5 rounded-xl border border-[#D9E2EF] text-xs text-[#071B3A] bg-white outline-none focus:border-[#2F6FED]"
                  >
                    <option value="">Select Package...</option>
                    <option value="Package 1 — Bus Both Ways">Package 1 — Bus Both Ways</option>
                    <option value="Package 2 — Fly to Lhasa, Road">Package 2 — Fly to Lhasa, Road</option>
                    <option value="Package 3 — Fly Lhasa & Ali">Package 3 — Fly Lhasa & Ali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#071B3A] mb-1.5">
                    No. of Travellers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    {...register('travellersCount')}
                    className="w-full p-2.5 rounded-xl border border-[#D9E2EF] text-xs text-[#071B3A] bg-white outline-none focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#071B3A] mb-1.5">
                  Message / Questions *
                </label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Tell us about your fitness level, any medical questions, or travel preferences..."
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm text-[#071B3A] bg-white outline-none focus:border-[#2F6FED] transition-colors font-body ${
                    errors.message ? 'border-red-500' : 'border-[#D9E2EF]'
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#D9A441] text-[#101D35] font-bold text-sm sm:text-base hover:bg-[#c99534] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                <Send size={18} />
                <span>{submitting ? 'Submitting Enquiry...' : 'Submit Pilgrimage Enquiry'}</span>
              </button>
            </form>
          </div>

          {/* Direct Contact & Bank Info */}
          <div className="flex flex-col gap-6 w-full min-w-0">
            <div className="bg-[#101D35] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white border border-white/10 shadow-lg">
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-5 sm:mb-6 text-white">
                Direct Contact Channels
              </h3>

              <div className="flex flex-col gap-5 sm:gap-6">
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#D9A441]/15 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#D9A441]" />
                  </div>
                  <div className="min-w-0">
                    <small className="text-[#BAC7D5] text-[11px] uppercase tracking-wider block">Telephone / Helpline</small>
                    <a href="tel:+916366852888" className="text-base sm:text-lg text-white font-bold hover:text-[#D9A441] transition-colors block">
                      +91 6366852888
                    </a>
                    <span className="text-xs text-[#BAC7D5]">Mon–Sat: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#D9A441]/15 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#D9A441]" />
                  </div>
                  <div className="min-w-0">
                    <small className="text-[#BAC7D5] text-[11px] uppercase tracking-wider block">Electronic Mail</small>
                    <a href="mailto:volunteers@shlloka.com" className="text-sm sm:text-base text-white hover:text-[#D9A441] transition-colors block break-words">
                      volunteers@shlloka.com
                    </a>
                    <span className="text-xs text-[#BAC7D5]">Official enquiry & document submission desk</span>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#D9A441]/15 flex items-center justify-center shrink-0">
                    <Building size={18} className="text-[#D9A441]" />
                  </div>
                  <div className="min-w-0">
                    <small className="text-[#BAC7D5] text-[11px] uppercase tracking-wider block">Operating Company</small>
                    <span className="text-sm sm:text-base text-white font-semibold block">
                      Shloka Yatra Private Limited
                    </span>
                    <span className="text-xs text-[#BAC7D5] leading-relaxed block break-words">
                      Flat No. 7164, ATS One Hamlet Tower 7, Sector 104, Noida, UP 201304
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Bank Transfer Info */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#D9E2EF] shadow-sm">
              <h4 className="text-base sm:text-lg font-heading font-bold text-[#101D35] mb-3">
                Bank Transfer Account (RTGS / NEFT / IMPS)
              </h4>
              <div className="text-xs sm:text-sm text-[#5A6B82] flex flex-col gap-2 font-body">
                <p className="m-0"><b className="text-[#071B3A]">Account Name:</b> Shloka Yatra Private Limited</p>
                <p className="m-0"><b className="text-[#071B3A]">Account Number:</b> 201037169009</p>
                <p className="m-0"><b className="text-[#071B3A]">IFSC Code:</b> INDB0000672</p>
                <p className="m-0"><b className="text-[#071B3A]">Account Type:</b> Current Account</p>
                <p className="m-0"><b className="text-[#071B3A]">Bank Name:</b> IndusInd Bank</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
