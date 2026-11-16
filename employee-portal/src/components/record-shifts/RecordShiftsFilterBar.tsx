import React from "react";
import { Download, Plus } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDateRangePicker from "@/components/customComponent/CustomDateRangePicker";
import { MONTHS, YEARS } from "./data";

interface RecordShiftsFilterBarProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  customRange: string;
  onCustomRangeChange: (
    rangeStr: string,
    start?: Date,
    end?: Date,
  ) => void;
  onClearCustomRange: () => void;
  onExportClick: () => void;
  onRecordShiftClick: () => void;
}

export const RecordShiftsFilterBar: React.FC<RecordShiftsFilterBarProps> = ({
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  customRange,
  onCustomRangeChange,
  onClearCustomRange,
  onExportClick,
  onRecordShiftClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 font-manrope">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl sm:text-[22px] font-bold text-[#1E293B] shrink-0">
            Record Shifts
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Log and review your shift records, hours, and status
          </p>
        </div>

        {/* Right: The controls */}
        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 sm:gap-4 w-full xl:w-auto">
          {/* Period: Month & Year */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#64748B] shrink-0">
              Period
            </span>
            <div className="flex items-center gap-1.5">
              <CustomSelect
                value={selectedMonth}
                onChange={onMonthChange}
                options={MONTHS}
                className="w-32"
                buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#1E293B] shadow-sm transition-colors cursor-pointer"
              />

              <CustomSelect
                value={selectedYear}
                onChange={onYearChange}
                options={YEARS}
                className="w-24"
                buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#1E293B] shadow-sm transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#64748B] shrink-0">
              Date
            </span>
            <CustomDateRangePicker
              value={customRange}
              onChange={onCustomRangeChange}
              onClear={onClearCustomRange}
              placeholder="Filter by date range"
            />
          </div>

          {/* Action Buttons: Export & Record Shift */}
          <div className="flex items-center gap-2 ml-auto xl:ml-0">
            <button
              onClick={onExportClick}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#1E293B] rounded-lg text-[12px] font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              Export
            </button>
            <button
              onClick={onRecordShiftClick}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5248e5] text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              Record Shift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordShiftsFilterBar;
