import React from "react";
import { Wallet, Briefcase, Layers } from "lucide-react";

export const RemunerationStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-manrope">
      {/* Card 1: Last Payslip */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Last Payslip
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              € 1,700
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Gross: €4,500.00
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EEF2FF] text-[#635BFF] mb-0.5 whitespace-nowrap">
            Nov 29, 2024
          </span>
        </div>
      </div>

      {/* Card 2: Average Salary */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Average Salary
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              € 2,200
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Last 12 months
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D1FAE5] text-[#10B981] mb-0.5 whitespace-nowrap">
            Active
          </span>
        </div>
      </div>

      {/* Card 3: Accumulated TFR */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Accumulated TFR
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              € 5,500
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Available balance
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] mb-0.5 whitespace-nowrap">
            Updated
          </span>
        </div>
      </div>
    </div>
  );
};

export default RemunerationStatCards;
