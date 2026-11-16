"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import CustomExportButton from "@/components/customComponent/CustomExportButton";

const servicesByPeriod: Record<
  string,
  { rank: number; name: string; appointments: number }[]
> = {
  Weekly: [
    { rank: 1, name: "Cut and Fold", appointments: 25 },
    { rank: 2, name: "Cut and Fold", appointments: 25 },
    { rank: 3, name: "Cut and Fold", appointments: 25 },
  ],
  Monthly: [
    { rank: 1, name: "Cut and Fold", appointments: 110 },
    { rank: 2, name: "Coloring & Highlights", appointments: 85 },
    { rank: 3, name: "Styling & Blowout", appointments: 62 },
  ],
  Yearly: [
    { rank: 1, name: "Cut and Fold", appointments: 1240 },
    { rank: 2, name: "Coloring & Highlights", appointments: 980 },
    { rank: 3, name: "Styling & Blowout", appointments: 750 },
  ],
};

export default function DashboardTopServices() {
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const periods = ["Weekly", "Monthly", "Yearly"];
  const currentServices =
    servicesByPeriod[selectedPeriod] || servicesByPeriod.Weekly;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 flex flex-col justify-between h-full font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B]">Top 3 Services</h2>

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

      {/* Services List */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
        {currentServices.map((service) => (
          <div
            key={service.rank}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#F8F9FE] via-[#F4F6FE] to-[#F1F4FD] border border-[#E8ECF8] hover:border-[#D6DEFB] transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {service.rank}
              </div>
              <span className="font-semibold text-sm text-[#1E293B]">
                {service.name}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[18px] font-bold text-[#1E293B] leading-none">
                {service.appointments}
              </div>
              <div className="text-[11px] font-medium text-[#94A3B8] mt-1">
                Appointments
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Top Services"
        description="Download your top services report in your preferred format."
      />
    </div>
  );
}
