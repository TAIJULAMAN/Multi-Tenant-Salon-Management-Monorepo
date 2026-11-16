"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import CustomExportButton from "@/components/customComponent/CustomExportButton";

const customersByPeriod: Record<
  string,
  {
    rank: number;
    name: string;
    lastVisit: string;
    appointments: number;
    totalSpent: string;
  }[]
> = {
  Weekly: [
    {
      rank: 1,
      name: "Sofia Bianchi",
      lastVisit: "November 27, 2024",
      appointments: 25,
      totalSpent: "€ 1,700",
    },
    {
      rank: 2,
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 24,
      totalSpent: "€ 1,500",
    },
    {
      rank: 3,
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 20,
      totalSpent: "€ 1,200",
    },
  ],
  Monthly: [
    {
      rank: 1,
      name: "Sofia Bianchi",
      lastVisit: "November 27, 2024",
      appointments: 82,
      totalSpent: "€ 5,400",
    },
    {
      rank: 2,
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 74,
      totalSpent: "€ 4,800",
    },
    {
      rank: 3,
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 68,
      totalSpent: "€ 3,900",
    },
  ],
  Yearly: [
    {
      rank: 1,
      name: "Sofia Bianchi",
      lastVisit: "November 27, 2024",
      appointments: 240,
      totalSpent: "€ 15,200",
    },
    {
      rank: 2,
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 210,
      totalSpent: "€ 13,800",
    },
    {
      rank: 3,
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 195,
      totalSpent: "€ 11,500",
    },
  ],
};

export default function DashboardLoyalCustomers() {
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const periods = ["Weekly", "Monthly", "Yearly"];
  const currentCustomers =
    customersByPeriod[selectedPeriod] || customersByPeriod.Weekly;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 flex flex-col justify-between h-full font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B]">
          Most Loyal Customers
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              {selectedPeriod}{" "}
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 py-1">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[12px] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                      selectedPeriod === p
                        ? "text-[#635BFF] font-bold"
                        : "text-[#64748B] font-medium"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
        {currentCustomers.map((c) => (
          <div
            key={c.rank}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all bg-white gap-3 sm:gap-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {c.rank}
              </div>
              <div>
                <div className="font-semibold text-sm text-[#1E293B]">
                  {c.name}
                </div>
                <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                  Last Visit: {c.lastVisit}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pl-11 sm:pl-0">
              <div className="text-left sm:text-right">
                <div className="text-[15px] font-bold text-[#1E293B] leading-none">
                  {c.appointments}
                </div>
                <div className="text-[11px] font-medium text-[#94A3B8] mt-1">
                  Appointments
                </div>
              </div>

              <div className="text-right">
                <div className="text-[15px] font-bold text-[#10B981] leading-none">
                  {c.totalSpent}
                </div>
                <div className="text-[11px] font-medium text-[#94A3B8] mt-1">
                  Total Spent
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Loyal Customers"
        description="Download your most loyal customers report in your preferred format."
      />
    </div>
  );
}
