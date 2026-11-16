"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import { Search } from "lucide-react";

interface ServiceBreakdownItem {
  rank: number;
  name: string;
  category?: string;
  bookings: number;
  totalEarned: string;
}

const ALL_SERVICES_BREAKDOWN: ServiceBreakdownItem[] = [
  { rank: 1, name: "Haircuts", category: "Hair", bookings: 34, totalEarned: "€ 1,700" },
  { rank: 2, name: "Coloring", category: "Color", bookings: 22, totalEarned: "€ 1,700" },
  { rank: 3, name: "Treatments", category: "Care", bookings: 19, totalEarned: "€ 1,700" },
  { rank: 4, name: "Blow Dry & Styling", category: "Hair", bookings: 16, totalEarned: "€ 1,350" },
  { rank: 5, name: "Highlights & Balayage", category: "Color", bookings: 14, totalEarned: "€ 1,280" },
  { rank: 6, name: "Keratin Treatment", category: "Care", bookings: 10, totalEarned: "€ 1,100" },
  { rank: 7, name: "Scalp & Head Massage", category: "Wellness", bookings: 12, totalEarned: "€ 890" },
  { rank: 8, name: "Beard Trim & Grooming", category: "Barber", bookings: 15, totalEarned: "€ 750" },
  { rank: 9, name: "Facial Hydration", category: "Skin", bookings: 8, totalEarned: "€ 680" },
  { rank: 10, name: "Hair Extensions", category: "Hair", bookings: 5, totalEarned: "€ 650" },
  { rank: 11, name: "Glossing & Toner", category: "Color", bookings: 9, totalEarned: "€ 540" },
  { rank: 12, name: "Bridal Styling", category: "Special", bookings: 3, totalEarned: "€ 450" },
];

interface AllServicesBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllServicesBreakdownModal({
  isOpen,
  onClose,
}: AllServicesBreakdownModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = ALL_SERVICES_BREAKDOWN.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Breakdown by Service Type" maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search service by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#635BFF] focus:bg-white transition-colors"
          />
        </div>

        {/* Services List */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 text-[13px] text-[#94A3B8]">
              No services found matching &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredServices.map((item) => (
              <div
                key={item.rank}
                className="bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#E2E8F0] rounded-lg p-3.5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-white text-[13px] font-bold">{item.rank}</span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1E293B]">{item.name}</h4>
                    <span className="text-[11px] font-medium text-[#94A3B8]">
                      {item.bookings} appointments • {item.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#10B981]">{item.totalEarned}</div>
                  <div className="text-[10px] font-medium text-[#94A3B8]">Total Earned</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#94A3B8]">
            Showing {filteredServices.length} of {ALL_SERVICES_BREAKDOWN.length} services
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] rounded-lg text-[12px] font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
