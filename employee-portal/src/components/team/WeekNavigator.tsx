"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectWeek?: (date: Date) => void;
}

export default function WeekNavigator({
  currentWeekStart,
  onPrevWeek,
  onNextWeek,
  onSelectWeek,
}: WeekNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullMonthNames = [
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

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const [viewMonth, setViewMonth] = useState(currentWeekStart.getMonth());
  const [viewYear, setViewYear] = useState(currentWeekStart.getFullYear());

  useEffect(() => {
    setViewMonth(currentWeekStart.getMonth());
    setViewYear(currentWeekStart.getFullYear());
  }, [currentWeekStart]);

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

  const formatHeaderDateRange = () => {
    const startMonth = fullMonthNames[currentWeekStart.getMonth()];
    const startDay = currentWeekStart.getDate();
    const endMonth = fullMonthNames[weekEnd.getMonth()];
    const endDay = weekEnd.getDate();

    return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
  };

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

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleDayClick = (dayDate: Date) => {
    const targetStart = new Date(dayDate);
    targetStart.setDate(targetStart.getDate() - targetStart.getDay());
    targetStart.setHours(0, 0, 0, 0);

    if (onSelectWeek) {
      onSelectWeek(targetStart);
    }
    setIsOpen(false);
  };

  const isDayInCurrentWeek = (cellDate: Date) => {
    const start = new Date(currentWeekStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(weekEnd);
    end.setHours(23, 59, 59, 999);
    const t = cellDate.getTime();
    return t >= start.getTime() && t <= end.getTime();
  };

  return (
    <div
      className="inline-flex items-center bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-1.5 relative select-none"
      ref={containerRef}
    >
      <button
        onClick={onPrevWeek}
        className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-1 text-[13px] font-bold text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors cursor-pointer"
      >
        {formatHeaderDateRange()}
      </button>
      <button
        onClick={onNextWeek}
        className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Calendar Dropdown Popover - Matches Image 1 */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 w-[290px] animate-in fade-in zoom-in-95 duration-150">
          {/* Month / Year Controls */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-bold text-[#0F172A]">
              {fullMonthNames[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
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
              const isSelected = isDayInCurrentWeek(cellDate);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(cellDate)}
                  className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#635BFF] text-white shadow-sm"
                      : "text-[#1E293B] hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
