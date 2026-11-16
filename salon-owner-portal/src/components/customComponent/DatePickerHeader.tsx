"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface DatePickerHeaderProps {
  currentDate: Date;
  onPrevMonth: (e: React.MouseEvent) => void;
  onNextMonth: (e: React.MouseEvent) => void;
  onSelectMonth: (monthIdx: number) => void;
  onSelectYear: (year: number) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const START_YEAR = 2015;
const END_YEAR = 2040;
const YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i,
);

export default function DatePickerHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
}: DatePickerHeaderProps) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const activeYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isYearOpen && activeYearRef.current) {
      activeYearRef.current.scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    }
  }, [isYearOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (monthListRef.current && !monthListRef.current.contains(target)) {
        setIsMonthOpen(false);
      }
      if (yearListRef.current && !yearListRef.current.contains(target)) {
        setIsYearOpen(false);
      }
    };
    if (isMonthOpen || isYearOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isMonthOpen, isYearOpen]);

  return (
    <div className="flex items-center justify-between mb-3 gap-1 relative select-none">
      <button
        type="button"
        onClick={(e) => {
          setIsMonthOpen(false);
          setIsYearOpen(false);
          onPrevMonth(e);
        }}
        className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 cursor-pointer"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {/* Custom Month Dropdown */}
        <div className="relative" ref={monthListRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMonthOpen(!isMonthOpen);
              setIsYearOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isMonthOpen
                ? "bg-[#F3F0FF] text-[#635BFF]"
                : "text-slate-800 hover:text-[#635BFF] hover:bg-slate-100"
            }`}
          >
            <span>{MONTH_NAMES[currentDate.getMonth()]}</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${
                isMonthOpen ? "rotate-180 text-[#635BFF]" : "text-slate-400"
              }`}
            />
          </button>

          {isMonthOpen && (
            <div className="absolute top-full mt-1.5 left-0 z-50 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 custom-scrollbar">
              {MONTH_NAMES.map((name, idx) => {
                const isSelected = currentDate.getMonth() === idx;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMonth(idx);
                      setIsMonthOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#F3F0FF] text-[#635BFF] font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#635BFF]"
                    }`}
                  >
                    <span>{name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Year Dropdown */}
        <div className="relative" ref={yearListRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsYearOpen(!isYearOpen);
              setIsMonthOpen(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isYearOpen
                ? "bg-[#F3F0FF] text-[#635BFF]"
                : "text-slate-800 hover:text-[#635BFF] hover:bg-slate-100"
            }`}
          >
            <span>{currentDate.getFullYear()}</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${
                isYearOpen ? "rotate-180 text-[#635BFF]" : "text-slate-400"
              }`}
            />
          </button>

          {isYearOpen && (
            <div className="absolute top-full mt-1.5 right-0 z-50 w-24 bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 custom-scrollbar">
              {YEARS.map((y) => {
                const isSelected = currentDate.getFullYear() === y;
                return (
                  <button
                    key={y}
                    ref={isSelected ? activeYearRef : null}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#F3F0FF] text-[#635BFF] font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#635BFF]"
                    }`}
                  >
                    <span>{y}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          setIsMonthOpen(false);
          setIsYearOpen(false);
          onNextMonth(e);
        }}
        className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 cursor-pointer"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
