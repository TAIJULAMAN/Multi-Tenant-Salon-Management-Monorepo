"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";

interface ScheduledShiftsHeaderProps {
  onExportClick: () => void;
  onAddShift?: () => void;
  onAddTimeOff: () => void;
  onAddBlockedTime: () => void;
  onAddClosedPeriod: () => void;
}

export default function ScheduledShiftsHeader({
  onExportClick,
  onAddTimeOff,
  onAddBlockedTime,
  onAddClosedPeriod,
}: ScheduledShiftsHeaderProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target as Node)
      ) {
        setIsAddMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-[1.15rem] font-bold text-[#1E293B] font-manrope">
        Scheduled Shifts
      </h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onExportClick}
          className="w-full sm:w-auto justify-center bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <div className="relative w-full sm:w-auto" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            Add
            <ChevronDown className="w-4 h-4" />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-1.5 z-30">
              <button
                onClick={() => {
                  onAddTimeOff();
                  setIsAddMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                Add Time Off
              </button>
              <button
                onClick={() => {
                  onAddBlockedTime();
                  setIsAddMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                Add Blocked Time
              </button>
              <button
                onClick={() => {
                  onAddClosedPeriod();
                  setIsAddMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                Business Closed Period
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
