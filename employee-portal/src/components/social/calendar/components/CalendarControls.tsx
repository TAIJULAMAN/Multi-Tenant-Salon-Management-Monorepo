"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Globe,
} from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";

type ViewMode = "Month" | "Week" | "Day";

interface CalendarControlsProps {
  account: string;
  setAccount: (val: string) => void;
  onConnectAccounts: () => void;
  onPrev: () => void;
  onNext: () => void;
  headerDate: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onToggleFullscreen: () => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function CalendarControls({
  account,
  setAccount,
  onConnectAccounts,
  onPrev,
  onNext,
  headerDate,
  viewMode,
  setViewMode,
  onToggleFullscreen,
  currentDate,
  setCurrentDate,
}: CalendarControlsProps) {
  const handleDateChange = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      setCurrentDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    }
  };

  const formattedDateValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* Left: Accounts Filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <CustomSelect
            options={[
              "All Accounts",
              "X (Twitter)",
              "Facebook",
              "Instagram",
              "LinkedIn",
            ]}
            value={account}
            onChange={setAccount}
            placeholder="Filter by account"
            buttonClassName="w-full sm:w-[160px] flex items-center justify-between bg-white border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm text-slate-700 font-medium outline-none cursor-pointer transition-colors"
          />
          <button
            onClick={onConnectAccounts}
            className="px-4 py-2 bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Globe className="w-4 h-4" />
            Connect Accounts
          </button>
        </div>
      </div>

      {/* Middle: Date Navigation */}
      <div className="flex items-center border border-[#E8EEFF] rounded-[8px] overflow-hidden bg-white">
        <button
          onClick={onPrev}
          className="px-3 sm:px-4 py-2.5 border-r border-[#E8EEFF] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} className="text-[#635BFF]" />
        </button>
        
        <div className="relative flex items-center h-full">
          <CustomDatePicker
            value={formattedDateValue}
            onChange={handleDateChange}
            mode={viewMode}
            trigger={
              <span className="px-4 sm:px-6 py-2.5 text-sm font-semibold font-manrope text-[#635BFF] whitespace-nowrap cursor-pointer hover:opacity-80">
                {headerDate}
              </span>
            }
          />
        </div>

        <button
          onClick={onNext}
          className="px-3 sm:px-4 py-2.5 border-l border-[#E8EEFF] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <ChevronRight size={18} className="text-[#635BFF]" />
        </button>
      </div>

      {/* Right: View Toggles & Fullscreen */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-1">
          {(["Month", "Week", "Day"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                viewMode === mode
                  ? "bg-[#E0E7FF] text-[#635BFF]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <button 
          onClick={onToggleFullscreen}
          className="w-10 h-10 flex items-center justify-center bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
