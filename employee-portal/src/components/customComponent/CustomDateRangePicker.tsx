"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS = [
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

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface CustomDateRangePickerProps {
  value?: string;
  onChange?: (rangeStr: string, startDate?: Date, endDate?: Date) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  iconPosition?: "left" | "right";
  align?: "left" | "right";
}

export default function CustomDateRangePicker({
  value = "",
  onChange,
  onClear,
  placeholder = "Select Date Range",
  className = "",
  buttonClassName = "",
  iconPosition = "left",
  align = "right",
}: CustomDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const formatRangeString = (start: Date, end: Date) => {
    if (start.getTime() === end.getTime()) {
      return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
    }
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()} – ${SHORT_MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  };

  const handleDateClick = (clickedDate: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      let finalStart = startDate;
      let finalEnd = clickedDate;

      if (clickedDate.getTime() < startDate.getTime()) {
        finalStart = clickedDate;
        finalEnd = startDate;
      }

      setStartDate(finalStart);
      setEndDate(finalEnd);

      const formatted = formatRangeString(finalStart, finalEnd);
      if (onChange) {
        onChange(formatted, finalStart, finalEnd);
      }
      setIsOpen(false);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    setHoveredDate(null);
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("", undefined, undefined);
    }
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isDateSelected = (cellDate: Date) => {
    const t = cellDate.getTime();
    if (startDate && t === startDate.getTime()) return true;
    if (endDate && t === endDate.getTime()) return true;
    if (startDate && endDate && t > startDate.getTime() && t < endDate.getTime()) {
      return true;
    }
    return false;
  };

  const isDateInHoverRange = (cellDate: Date) => {
    if (!startDate || endDate || !hoveredDate) return false;
    const t = cellDate.getTime();
    const st = startDate.getTime();
    const ht = hoveredDate.getTime();
    const min = Math.min(st, ht);
    const max = Math.max(st, ht);
    return t >= min && t <= max;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          `flex items-center gap-2.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1E293B] shadow-sm transition-all cursor-pointer whitespace-nowrap outline-none ${
            isOpen ? "border-[#635BFF] ring-1 ring-[#635BFF]" : ""
          } ${className}`
        }
      >
        {iconPosition === "left" && (
          <Calendar className="w-4 h-4 text-[#635BFF] shrink-0" />
        )}
        <span className="truncate">{value || placeholder}</span>
        {iconPosition === "right" && (
          <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
        )}
        {value && (
          <span
            onClick={handleClear}
            className="ml-1 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Calendar Dropdown Popover - Matches Image 1 */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 w-[290px] select-none animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-bold text-[#0F172A]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold text-slate-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(viewYear, viewMonth, day);
              cellDate.setHours(0, 0, 0, 0);

              const selected = isDateSelected(cellDate);
              const preview = isDateInHoverRange(cellDate);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(cellDate)}
                  onMouseEnter={() => setHoveredDate(cellDate)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#635BFF] text-white shadow-sm"
                      : preview
                      ? "bg-[#EEF2FF] text-[#635BFF]"
                      : "text-[#1E293B] hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Clear / Action Footer if date is selected */}
          {(startDate || value) && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] font-bold text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer"
              >
                Clear
              </button>
              <span className="text-[11px] font-semibold text-slate-400">
                {startDate && !endDate ? "Select end date" : "Range selected"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
