"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { createPortal } from "react-dom";

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
  buttonClassName?: string;
}

export function CustomTimePicker({ value, onChange, className = "", buttonClassName }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [dropdownPos, setDropdownPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
  }>({
    left: 0,
    width: 0,
    placement: "bottom",
  });

  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = 240;
      const showOnTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      const width = Math.max(rect.width, 140);
      const left = Math.max(10, Math.min(rect.left, window.innerWidth - width - 10));

      if (showOnTop) {
        setDropdownPos({
          bottom: window.innerHeight - rect.top + 6,
          left,
          width,
          placement: "top",
        });
      } else {
        setDropdownPos({
          top: rect.bottom + 6,
          left,
          width,
          placement: "bottom",
        });
      }
    }
    setIsOpen(!isOpen);
  };

  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  };

  const formatTimeAMPM = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    let hours = parseInt(h);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  const times = generateTimes();

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between gap-2 text-left transition-colors cursor-pointer outline-none ${
          buttonClassName
            ? buttonClassName
            : `px-3.5 py-2.5 bg-white border ${
                isOpen
                  ? "border-[#635BFF] ring-1 ring-[#635BFF]"
                  : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              } rounded-lg text-[13px] font-medium text-[#1E293B]`
        }`}
      >
        <span className="truncate">{formatTimeAMPM(value) || "Select time"}</span>
        <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
      </button>

      {isOpen && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed z-[9999] bg-white border border-[#E2E8F0] rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in ${
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
              width: dropdownPos.width,
            }}
          >
            {times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChange(t);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[#F8FAFC] ${
                  value === t ? "text-[#635BFF] bg-[#EEF2FF]" : "text-[#1E293B]"
                }`}
              >
                {formatTimeAMPM(t)}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
