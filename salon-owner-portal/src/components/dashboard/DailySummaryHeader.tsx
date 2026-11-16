"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Settings, Download } from "lucide-react";
import { DailySummaryHeaderProps } from "./types";

export default function DailySummaryHeader({
  isRegisterOpen,
  onOpenSettings,
  onOpenExport,
}: DailySummaryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-6 ">
      <h2 className="text-[16px] font-bold text-[#1E293B]">Daily Summary</h2>
      <div className="flex justify-between md:justify-end items-center w-full gap-2">
        {isRegisterOpen ? (
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wide">
              Cash Register Open
            </span>
          </div>
        ) : (
          <div className="bg-[#FFE4E6] px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></div>
            <span className="text-[10px] font-bold text-[#F43F5E] uppercase tracking-wide">
              Cash Register Closed
            </span>
          </div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors text-[#64748B]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-20 py-2">
              <button
                onClick={() => {
                  onOpenSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC]"
              >
                <Settings className="w-4 h-4 text-[#94A3B8]" />
                Cash register settings
              </button>
              <button
                onClick={() => {
                  onOpenExport();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC]"
              >
                <Download className="w-4 h-4 text-[#94A3B8]" />
                Export Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
