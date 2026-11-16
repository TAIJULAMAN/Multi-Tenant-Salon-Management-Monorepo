"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import CustomExportButton from "@/components/customComponent/CustomExportButton";
import { paymentPeriodsData } from "./data";
import { PaymentPeriodType } from "./types";

const PERIODS: PaymentPeriodType[] = ["Yearly", "Quarterly", "Monthly"];

export default function DashboardPaymentsPerYear() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<PaymentPeriodType>("Yearly");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentConfig =
    paymentPeriodsData[selectedPeriod] || paymentPeriodsData.Yearly;

  const totalPages = currentConfig.pages.length;
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const currentItems =
    currentConfig.pages[safePageIndex] || currentConfig.pages[0];

  const handlePeriodChange = (p: PaymentPeriodType) => {
    setSelectedPeriod(p);
    setIsMenuOpen(false);
    setHoveredIndex(null);
    setPageIndex(paymentPeriodsData[p].pages.length - 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 w-full font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B]">
          {currentConfig.title}
        </h2>

        <div className="flex items-center gap-3 relative z-30">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              {selectedPeriod}{" "}
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-[#E2E8F0] rounded-lg shadow-xl z-50 py-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={`w-full text-left px-4 py-2 text-[12px] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                      selectedPeriod === p
                        ? "text-[#635BFF] font-bold bg-[#EEF2FF]/50"
                        : "text-[#64748B] font-medium"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CustomExportButton
            label="Export Data"
            onClick={() => setIsExportModalOpen(true)}
            variant="outline"
          />
        </div>
      </div>

      {/* Main Chart Area with top clearance for hover tooltip */}
      <div
        className="flex gap-4 sm:gap-6 min-h-[350px] pt-12 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between py-2 text-right pr-2 select-none shrink-0 w-16 sm:w-20">
          {currentConfig.yLabels.map((label, idx) => (
            <span key={idx} className="text-[11px] font-medium text-[#94A3B8]">
              {label}
            </span>
          ))}
        </div>

        {/* Pillars Grid */}
        <div className="flex-1 grid grid-cols-6 gap-2 sm:gap-5 items-end relative border-b border-[#F1F5F9] pb-2">
          {currentItems.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            // For rightmost columns (idx >= 4), align tooltip to the right so it never overlaps or clips
            const isRightSide = idx >= 4;

            return (
              <div
                key={item.label}
                className="flex flex-col items-center h-full justify-end relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                {/* Tooltip Card (Only shows on actual user hover, never permanently active) */}
                {isHovered && (
                  <div
                    className={`absolute -top-12 z-20 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E2E8F0] p-3 w-40 sm:w-44 pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${
                      isRightSide ? "right-0" : "left-1/2 -translate-x-1/2"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
                      <span className="text-xs font-bold text-[#1E293B]">
                        {item.label}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between items-center text-[#64748B]">
                        <span>Total</span>
                        <span className="font-semibold text-[#1E293B]">
                          {item.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#64748B]">
                        <span>Monthly mean</span>
                        <span className="font-semibold text-[#1E293B]">
                          {item.monthlyMean}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pillar Track Container */}
                <div className="w-full max-w-[70px] sm:max-w-[90px] h-[240px] sm:h-[260px] bg-[#F8FAFC] rounded-2xl flex flex-col justify-end p-1 overflow-hidden transition-colors group-hover:bg-[#F1F5F9]">
                  {/* Filled Bar */}
                  <div
                    className="w-full bg-[#635BFF] rounded-xl transition-all duration-500 group-hover:bg-[#524be0] shadow-sm shadow-[#635BFF]/20"
                    style={{ height: `${item.percentHeight}%` }}
                  />
                </div>

                {/* Pillar Label */}
                <span className="text-[12px] font-medium text-[#94A3B8] mt-3 group-hover:text-[#1E293B] group-hover:font-semibold transition-colors">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CustomExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={`Export ${currentConfig.title}`}
        description="Download your payments report in your preferred format."
      />
    </div>
  );
}
