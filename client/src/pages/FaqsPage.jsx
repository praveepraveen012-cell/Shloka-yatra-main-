import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Phone, ArrowRight } from 'lucide-react';
import FaqAccordion from '../components/FaqAccordion';
import api from '../services/api';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getFaqs()
      .then((res) => setFaqs(res.faqs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#041329] min-h-screen text-white font-sans">
      {/* Header */}
      <section className="bg-[#041329] text-white pt-28 pb-10 sm:pt-36 sm:pb-16 border-b border-white/10">
        <div className="wrap">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#102C52] text-white border border-[#2F6FED] text-xs font-bold uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            Yatri Knowledge Base
          </h1>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#D9E2EF] max-w-2xl">
            Find answers to commonly asked questions on eligibility, high-altitude preparation, visa processing, food, routes, and payment terms.
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-[#041329] py-8 sm:py-14">
        <div className="wrap">
          {loading ? (
            <div className="text-center py-16 text-[#D9E2EF]">
              <p>Loading questions...</p>
            </div>
          ) : (
            <FaqAccordion faqs={faqs} />
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-12 sm:py-20 text-center bg-[#071B3A] text-white border-t border-[#102C52]">
        <div className="wrap">
          <h2 className="font-heading text-xl sm:text-3xl font-bold text-white mb-3">
            Have a question not listed here?
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D9E2EF] max-w-xl mx-auto mb-6 leading-relaxed">
            Our experienced Yatra advisors are on call to assist you with personalized medical, logistical, and spiritual guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md mx-auto">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2F6FED] hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md min-h-[44px]"
            >
              <span>Contact an Advisor</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+916366852888"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/30 hover:border-white text-white font-semibold text-sm bg-white/5 transition-all min-h-[44px]"
            >
              <Phone size={15} className="text-[#D9A441]" />
              <span>Call +91 6366852888</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
