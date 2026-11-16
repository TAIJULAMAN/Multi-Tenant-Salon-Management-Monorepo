"use client";

import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { SupportFAQProps } from "./types";

export default function SupportFAQ({ faqs }: SupportFAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] font-manrope">Frequently Asked Questions</h2>
          <p className="text-xs text-[#64748B]">Quick self-help guides to resolve issues immediately without waiting.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:bg-white transition-all placeholder:text-[#94A3B8]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#F1F5F9] rounded-lg hover:border-[#E2E8F0] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between text-left p-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-sm text-[#334155] font-manrope">{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-[#64748B] leading-relaxed border-t border-[#F8FAFC] pt-3 bg-[#F8FAFC]/50 rounded-b-xl animate-slideDown">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-[#94A3B8] text-xs">
            No FAQ answers match your search term. Use the form above to submit a support request.
          </div>
        )}
      </div>
    </div>
  );
}
