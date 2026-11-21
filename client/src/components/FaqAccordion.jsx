import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

export default function FaqAccordion({ faqs = [] }) {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faqs.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  });

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-full font-sans">
      {/* Search Bar */}
      <div className="flex flex-col mb-8 sm:mb-10 w-full">
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
      </div>

      {/* Accordion Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 text-slate-400">
          <HelpCircle size={32} className="mx-auto mb-3 opacity-60 text-slate-400" />
          <p className="text-sm sm:text-base text-slate-300">
            No questions found matching your search. Please reach out to our Yatra advisors directly.
          </p>
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
                    ? 'bg-[#102C52] border-[#2F6FED] shadow-md'
                    : 'bg-[#071B3A] border-white/15 hover:border-white/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left bg-transparent border-0 cursor-pointer transition-colors group"
                >
                  <span
                    className={`flex-1 font-heading text-sm sm:text-base md:text-lg font-semibold leading-snug transition-colors ${
                      isOpen ? 'text-[#D9A441]' : 'text-white group-hover:text-[#D9A441]'
                    }`}
                    style={{ color: isOpen ? '#D9A441' : '#FFFFFF' }}
                  >
                    {faq.question}
                  </span>
                  <span className={`shrink-0 ml-2 transition-colors ${isOpen ? 'text-[#D9A441]' : 'text-white/70 group-hover:text-white'}`}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm md:text-[15px] text-[#D9E2EF] font-sans leading-relaxed border-t border-white/10 mt-1">
                    <p className="whitespace-pre-line m-0 text-[#D9E2EF]">{faq.answer}</p>
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
