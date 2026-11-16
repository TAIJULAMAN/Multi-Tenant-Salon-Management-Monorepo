import React from "react";
import { Clock, Calendar as CalendarIcon, TrendingUp } from "lucide-react";

interface RecordShiftsStatCardsProps {
  totalHoursDisplay: string;
  daysWorkedDisplay: number;
  avgHoursDisplay: string;
}

export const RecordShiftsStatCards: React.FC<RecordShiftsStatCardsProps> = ({
  totalHoursDisplay,
  daysWorkedDisplay,
  avgHoursDisplay,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-manrope animate-in fade-in duration-200">
      {/* Card 1: Total Hours Recorded */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Total Hours Recorded
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              {totalHoursDisplay}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Logged in this period
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EEF2FF] text-[#635BFF] mb-0.5 whitespace-nowrap">
            Monthly
          </span>
        </div>
      </div>

      {/* Card 2: Days Logged */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4] text-white flex items-center justify-center shrink-0 shadow-sm">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Days Recorded
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              {daysWorkedDisplay}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Recorded shift days
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D1FAE5] text-[#10B981] mb-0.5 whitespace-nowrap">
            Active
          </span>
        </div>
      </div>

      {/* Card 3: Daily Average */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-[#CBD5E1] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xs text-[#1E293B] leading-snug">
            Daily Average
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold text-[#1E293B] leading-none">
              {avgHoursDisplay}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-1.5">
              Average hours per shift
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] mb-0.5 whitespace-nowrap">
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecordShiftsStatCards;
