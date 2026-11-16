"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CustomDatePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  trigger?: React.ReactNode;
  mode?: "Month" | "Week" | "Day";
  className?: string;
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  placeholder,
  required,
  trigger,
  mode = "Day",
  className = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setCurrentDate(parsed);
      }
    }
  }
  const containerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    placement: "top" | "bottom";
  }>({
    left: 0,
    placement: "bottom",
  });
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Removed value sync effect to avoid cascading renders warning

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = event?.target as Node || e.target as Node;
      const clickedOutsideContainer =
        containerRef.current && !containerRef.current.contains(target);
      const clickedOutsideDropdown =
        !dropdownRef.current || !dropdownRef.current.contains(target);

      if (clickedOutsideContainer && clickedOutsideDropdown) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown itself
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node))
        return;
      setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = 320;
      const showOnTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      const width = 256;
      const left = Math.max(10, Math.min(rect.left, window.innerWidth - width - 10));

      if (showOnTop) {
        setDropdownPos({
          bottom: window.innerHeight - rect.top + 6,
          left,
          placement: "top",
        });
      } else {
        setDropdownPos({
          top: rect.bottom + 6,
          left,
          placement: "bottom",
        });
      }
    }
    setIsOpen(!isOpen);
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleDateClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const formatted = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const monthNames = [
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
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      )}
      <div
        ref={inputContainerRef}
        className="relative cursor-pointer flex items-center justify-center h-full w-full"
        onClick={toggleDropdown}
      >
        {trigger ? (
          trigger
        ) : (
          <>
            <input
              type="text"
              value={value}
              readOnly
              placeholder={placeholder}
              required={required}
              className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-colors cursor-pointer pr-10 ${className}`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <CalendarIcon size={20} />
            </div>
          </>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed z-[9999] w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-3 animate-in fade-in ${
              dropdownPos.placement === "top"
                ? "slide-in-from-bottom-2"
                : "slide-in-from-top-2"
            }`}
            style={{
              top:
                dropdownPos.placement === "bottom"
                  ? dropdownPos.top
                  : undefined,
              bottom:
                dropdownPos.placement === "top"
                  ? dropdownPos.bottom
                  : undefined,
              left: dropdownPos.left,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-slate-800 text-sm">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const selectedDate = value ? new Date(value) : null;
                
                let isSelected = false;
                let isHovered = false;

                if (mode === "Week") {
                  if (selectedDate) {
                    const ws1 = new Date(selectedDate);
                    ws1.setDate(ws1.getDate() - ws1.getDay());
                    ws1.setHours(0, 0, 0, 0);

                    const ws2 = new Date(cellDate);
                    ws2.setDate(ws2.getDate() - ws2.getDay());
                    ws2.setHours(0, 0, 0, 0);

                    if (ws1.getTime() === ws2.getTime()) isSelected = true;
                  }
                  
                  if (hoveredDay !== null) {
                    const hDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), hoveredDay);
                    const hw1 = new Date(hDate);
                    hw1.setDate(hw1.getDate() - hw1.getDay());
                    hw1.setHours(0, 0, 0, 0);

                    const hw2 = new Date(cellDate);
                    hw2.setDate(hw2.getDate() - hw2.getDay());
                    hw2.setHours(0, 0, 0, 0);

                    if (hw1.getTime() === hw2.getTime()) isHovered = true;
                  }
                } else {
                  isSelected =
                    !!selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();
                  
                  isHovered = hoveredDay === day;
                }

                return (
                  <button
                    key={day}
                    type="button"
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={(e) => handleDateClick(day, e)}
                    className={`w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-colors
                    ${
                      isSelected
                        ? "bg-[#635BFF] text-white font-medium shadow-sm shadow-[#635BFF]/30"
                        : isHovered
                          ? "bg-indigo-50 text-[#635BFF]"
                          : "text-slate-700 hover:bg-slate-100"
                    }
                  `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
