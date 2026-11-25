import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, Phone, MessageSquare, ArrowRight } from 'lucide-react';

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref') || searchParams.get('bookingReference');
  const reason = searchParams.get('reason') || 'Transaction could not be completed by payment gateway.';

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={36} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-3">
            Payment Incomplete
          </span>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35] mb-2">
            Payment Not Completed
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            We were unable to complete your registration payment. No funds have been debited from your account, or if debited, will be auto-reversed by your bank within 24–48 hours.
          </p>

          <div className="bg-red-50 text-red-800 rounded-2xl p-4 mb-6 text-left border border-red-200 text-xs">
            <span className="font-bold block mb-1">Gateway Notice / Reason:</span>
            <span>{reason}</span>
            {reference && (
              <span className="block mt-2 font-mono text-slate-700">
                Preserved Booking Reference: <strong>{reference}</strong>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Your travel roster and chosen dates remain temporarily saved. You can retry with a different payment method (UPI, Credit/Debit Card, or Bank NEFT) or contact our support team.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={reference ? `/book?retryRef=${reference}` : '/book'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>Retry Payment</span>
            </Link>

            <a
              href="https://wa.me/916366852888?text=Namaste%20Shloka%20Yatra,%20I%20faced%20a%20payment%20issue%20with%20booking%20ref:%20"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-sm transition-all"
            >
              <MessageSquare size={16} />
              <span>Help via WhatsApp</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
