"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface DateRangePreset {
  label: string;
  daysAgo?: number; // number of days to subtract from today
  monthsAgo?: number;
  yearsAgo?: number;
}

export const DEFAULT_DATE_PRESETS: string[] = [
  "Today",
  "Last 7 Days",
  "Last 14 Days",
  "Last Month",
  "Last Year",
];

interface CustomDateRangePickerWithPresetsProps {
  value?: string; // e.g. "Last 7 Days" or "2025-08-01 - 2025-08-15"
  onChange?: (label: string, fromDate?: string, toDate?: string) => void;
  fromDate?: string;
  toDate?: string;
  presets?: string[];
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
}

export default function CustomDateRangePickerWithPresets({
  value = "Last 7 Days",
  onChange,
  fromDate: initialFrom = "",
  toDate: initialTo = "",
  presets = DEFAULT_DATE_PRESETS,
  placeholder = "Select Date Range",
  className = "",
  align = "right",
}: CustomDateRangePickerWithPresetsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const toYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculatePresetDates = (preset: string): { from: string; to: string } => {
    const now = new Date();
    const to = toYMD(now);
    let fromDateObj = new Date(now);

    if (preset === "Today") {
      return { from: to, to };
    } else if (preset === "Last 7 Days" || preset === "Last 7 days") {
      fromDateObj.setDate(now.getDate() - 7);
    } else if (preset === "Last 14 Days" || preset === "Last 14 days") {
      fromDateObj.setDate(now.getDate() - 14);
    } else if (preset === "Last Month" || preset === "Last month" || preset === "Last 30 days") {
      fromDateObj.setMonth(now.getMonth() - 1);
    } else if (preset === "Last 3 Months") {
      fromDateObj.setMonth(now.getMonth() - 3);
    } else if (preset === "Last Year" || preset === "Last year" || preset === "This Year") {
      fromDateObj.setFullYear(now.getFullYear() - 1);
    } else {
      fromDateObj.setDate(now.getDate() - 7);
    }
    return { from: toYMD(fromDateObj), to };
  };

  const initialCalculated = calculatePresetDates(value);
  const [selectedLabel, setSelectedLabel] = useState(value);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(presets.includes(value) ? value : null);
  const [fromDate, setFromDate] = useState(initialFrom || initialCalculated.from);
  const [toDate, setToDate] = useState(initialTo || initialCalculated.to);

  const [viewMonth, setViewMonth] = useState(() => {
    if (fromDate) {
      const parts = fromDate.split("-");
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    }
    return today.getMonth();
  });
  const [viewYear, setViewYear] = useState(() => {
    if (fromDate) {
      const parts = fromDate.split("-");
      if (parts.length === 3) return parseInt(parts[0], 10);
    }
    return today.getFullYear();
  });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (value && value !== selectedLabel) {
      setSelectedLabel(value);
      if (presets.includes(value)) {
        setSelectedPreset(value);
        const calc = calculatePresetDates(value);
        setFromDate(calc.from);
        setToDate(calc.to);
      }
    }
  }, [value, presets]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (ymd: string) => {
    setSelectedPreset(null);
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(ymd);
      setToDate("");
    } else {
      if (ymd < fromDate) {
        setToDate(fromDate);
        setFromDate(ymd);
      } else {
        setToDate(ymd);
      }
    }
  };

  const handleSelectPreset = (preset: string) => {
    setSelectedPreset(preset);
    const { from, to } = calculatePresetDates(preset);
    setFromDate(from);
    setToDate(to);
    setSelectedLabel(preset);
    if (onChange) {
      onChange(preset, from, to);
    }
    setIsOpen(false);
  };

  const handleApply = () => {
    if (fromDate && toDate) {
      const label = `${fmtShort(fromDate)} - ${fmtShort(toDate)}`;
      setSelectedLabel(label);
      if (onChange) {
        onChange(label, fromDate, toDate);
      }
    } else if (fromDate) {
      const label = fmtShort(fromDate);
      setSelectedLabel(label);
      if (onChange) {
        onChange(label, fromDate, fromDate);
      }
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSelectedPreset(null);
    setSelectedLabel(placeholder);
    if (onChange) {
      onChange("", "", "");
    }
  };

  // Calendar cells calculation
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toYMD(new Date(viewYear, viewMonth, i + 1))
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const activeEnd = toDate || hovered || null;

  const isRangeEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    const lo = fromDate <= activeEnd ? fromDate : activeEnd;
    const hi = fromDate <= activeEnd ? activeEnd : fromDate;
    return ymd === lo || ymd === hi;
  };
  const isInRange = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    const lo = fromDate <= activeEnd ? fromDate : activeEnd;
    const hi = fromDate <= activeEnd ? activeEnd : fromDate;
    return ymd > lo && ymd < hi;
  };
  const isLoEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    return ymd === (fromDate <= activeEnd ? fromDate : activeEnd);
  };
  const isHiEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    return ymd === (fromDate <= activeEnd ? activeEnd : fromDate);
  };

  const fmtShort = (ymd: string) => {
    if (!ymd) return "—";
    const [y, m, d] = ymd.split("-");
    return `${MONTHS[parseInt(m, 10) - 1].slice(0, 3)} ${parseInt(d, 10)}, ${y}`;
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[12px] font-bold text-[#334155] shadow-sm transition-colors min-w-[140px]"
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#64748B] shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E0E6EB] p-4 animate-in fade-in zoom-in-95 duration-150 w-[330px] max-w-[calc(100vw-2rem)] ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {/* Month / Year Controls */}
          <div className="flex items-center justify-between px-1 pb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#334155] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-[#0F172A]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#334155] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 pb-1 text-center">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-[10px] font-bold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 pb-3">
            {cells.map((ymd, idx) => {
              if (!ymd) return <div key={`empty-${idx}`} style={{ height: 34 }} />;

              const edge = isRangeEdge(ymd);
              const inRange = isInRange(ymd);
              const loEdge = isLoEdge(ymd);
              const hiEdge = isHiEdge(ymd);
              const singleSelected = fromDate === ymd && !activeEnd;

              return (
                <div
                  key={ymd}
                  onClick={() => handleDayClick(ymd)}
                  onMouseEnter={() => {
                    if (fromDate && !toDate) setHovered(ymd);
                  }}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex items-center justify-center cursor-pointer"
                  style={{ height: 34 }}
                >
                  {inRange && <div className="absolute inset-0 bg-[#635BFF]/10" />}
                  {loEdge && activeEnd && fromDate !== activeEnd && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#635BFF]/10" />
                  )}
                  {hiEdge && activeEnd && fromDate !== activeEnd && (
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#635BFF]/10" />
                  )}
                  <div
                    className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-semibold transition-all select-none ${
                      edge || singleSelected
                        ? "bg-[#635BFF] text-white shadow-sm"
                        : inRange
                        ? "text-[#635BFF]"
                        : "text-[#1E293B] hover:bg-gray-100"
                    }`}
                  >
                    {parseInt(ymd.split("-")[2], 10)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* From / To Preview */}
          {(fromDate || toDate) && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-[#F4F4FF] rounded-xl">
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-[#635BFF] uppercase tracking-wider mb-0.5">From</p>
                <p className="text-[11px] font-semibold text-[#0F172A] truncate">{fmtShort(fromDate)}</p>
              </div>
              <ChevronRight size={12} className="text-[#635BFF] shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-[#635BFF] uppercase tracking-wider mb-0.5">To</p>
                <p className="text-[11px] font-semibold text-[#0F172A] truncate">{fmtShort(toDate)}</p>
              </div>
            </div>
          )}

          {/* Default Options on the Bottom (Presets) */}
          <div className="pt-2 pb-3 border-t border-[#F1F5F9]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 px-0.5">
              Default Options
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const isActive = selectedPreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      isActive
                        ? "bg-[#635BFF] text-white shadow-sm"
                        : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EEF2FF] hover:text-[#635BFF]"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-1.5 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors border border-[#FFE4E6]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-[2] py-1.5 text-[12px] font-bold text-white bg-[#635BFF] hover:bg-[#524be0] rounded-lg transition-colors shadow-sm"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
