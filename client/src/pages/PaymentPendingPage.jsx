import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, RefreshCw, MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref') || 'PENDING-REF';
  const txn = searchParams.get('txn') || 'TXN-AWAITING-CONFIRMATION';

  return (
    <div className="bg-[#F7F6F2] min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 font-sans text-slate-800">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            <Clock size={36} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Payment Processing Pending
          </span>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101D35] mb-2">
            Awaiting Gateway Confirmation
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Your payment is currently being cleared by the banking network or gateway switch. Your booking slot is reserved under reference:
          </p>

          <div className="bg-[#071B3A] text-white rounded-2xl p-5 mb-6 text-left border border-[#2F6FED]/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#8CA8CC]">Booking Reference:</span>
              <span className="font-mono font-bold text-[#D9A441] text-base">{reference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#8CA8CC]">Transaction Reference:</span>
              <span className="font-mono text-xs text-slate-300">{txn}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            UPI and Net Banking reconciliations typically finalize within 15–30 minutes. Once received, our webhook automatically updates your status to <strong>CONFIRMED</strong> and sends confirmation via SMS and WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101D35] hover:bg-[#1C3455] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>Refresh Status</span>
            </button>

            <a
              href="https://wa.me/916366852888?text=Namaste%20Shloka%20Yatra,%20inquiring%20about%20pending%20payment%20ref:%20"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-sm transition-all"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Support</span>
            </a>

            <Link
              to="/account"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Devotee Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
