import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

export default function FaqAccordion({ faqs = [] }) {
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'ALL', label: 'All FAQs' },
    { key: 'GENERAL', label: 'General & Yatra' },
    { key: 'ITINERARY', label: 'Parikrama & Trek' },
    { key: 'PRICING', label: 'Pricing & Terms' },
    { key: 'HEALTH', label: 'Health & Altitude' },
    { key: 'TRAVEL_PERMITS', label: 'Visas & Permits' },
  ];

  const filtered = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-full font-sans">
      {/* Search & Category Filter */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10 w-full">
        {/* Search Input Box */}
        <div className="relative w-full max-w-lg mx-auto">
          <Search
            size={18}
            className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search questions on preparation, routes, pricing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 sm:py-3.5 pl-11 pr-4 rounded-full bg-[#071B3A] border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2F6FED] transition-colors"
          />
        </div>

        {/* Filter Pills with natural responsive wrapping */}
        <div className="flex flex-wrap gap-2 justify-center items-center w-full max-w-3xl mx-auto px-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer min-h-[36px] flex items-center justify-center whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2F6FED] text-white shadow-sm border border-[#2F6FED]'
                    : 'bg-[#071B3A] text-slate-200 border border-white/15 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 text-slate-400">
          <HelpCircle size={32} className="mx-auto mb-3 opacity-60" />
          <p className="text-sm sm:text-base">No questions found matching your search. Please reach out to our Yatra advisors directly.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#102C52] border-[#2F6FED]'
                    : 'bg-[#071B3A] border-white/15 hover:border-white/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left bg-transparent border-0 text-white font-heading text-sm sm:text-base md:text-lg font-semibold leading-snug cursor-pointer transition-colors"
                >
                  <span className="flex-1 font-heading">{faq.question}</span>
                  <span className={`shrink-0 ml-2 transition-colors ${isOpen ? 'text-[#D9A441]' : 'text-slate-400'}`}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm md:text-[15px] text-[#D9E2EF] font-sans leading-relaxed border-t border-white/10 mt-1">
                    <p className="whitespace-pre-line m-0">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
