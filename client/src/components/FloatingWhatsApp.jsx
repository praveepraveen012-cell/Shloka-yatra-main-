import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTRACT_METADATA } from '../data/legalData';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/916366852888?text=Namaste%20Shloka%20Yatra,%20I%20would%20like%20to%20know%20more%20about%20Kailash%20Mansarovar%20Yatra%202027.`;

  return (
    <aside
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
      aria-label="Direct Yatra Coordinator Contact Options"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="WhatsApp Us — Chat with Yatra Coordinator on WhatsApp"
      >
        <MessageCircle size={20} className="shrink-0 fill-current" />
        <span className="text-xs sm:text-sm font-bold tracking-wide pr-1 hidden xs:inline sm:inline">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
}
