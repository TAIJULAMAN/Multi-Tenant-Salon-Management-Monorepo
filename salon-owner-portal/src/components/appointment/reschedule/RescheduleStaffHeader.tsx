"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StaffMember } from "./utils";

interface RescheduleStaffHeaderProps {
  STAFF: StaffMember[];
  selectedStaff: string;
  setSelectedStaff: (id: string) => void;
  colW: number;
  totalW: number;
  TIME_W: number;
  headRef: React.RefObject<HTMLDivElement | null>;
  onSlide: (dir: "l" | "r") => void;
}

export default function RescheduleStaffHeader({
  STAFF,
  selectedStaff,
  setSelectedStaff,
  colW,
  totalW,
  TIME_W,
  headRef,
  onSlide,
}: RescheduleStaffHeaderProps) {
  return (
    <div className="shrink-0 bg-[#F3F3FF] relative h-[88px] border-b border-[#E0E6EB]">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => onSlide("l")}
        className="absolute z-30 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#DDE3EC] shadow-sm hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        style={{ left: TIME_W - 14 }}
        title="Scroll left"
      >
        <ChevronLeft size={14} strokeWidth={2} className="text-[#7A8FA6]" />
      </button>

      {/* Header: synced via ref */}
      <div
        ref={headRef}
        style={{
          position: "absolute",
          left: TIME_W,
          right: 36,
          top: 0,
          bottom: 0,
          overflowX: "hidden",
        }}
      >
        <div
          className="flex h-full border-l border-[#E0E6EB]"
          style={{ width: totalW }}
        >
          {STAFF.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff.id)}
              className="shrink-0 flex flex-col items-center justify-center gap-[6px] border-r border-[#E0E6EB] last:border-r-0 cursor-pointer hover:bg-[#FAFAFE] transition-colors"
              style={{ width: colW }}
            >
              <div
                className="relative overflow-hidden shrink-0 transition-all"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  outline:
                    selectedStaff === staff.id
                      ? "2px dashed #635BFF"
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                <Image
                  src={staff.avatar}
                  alt={staff.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="text-[12px] font-semibold font-manrope text-[#29343D] text-center w-full px-1 truncate">
                {staff.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => onSlide("r")}
        className="absolute z-30 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#DDE3EC] shadow-sm hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        style={{ right: 6 }}
        title="Scroll right"
      >
        <ChevronRight size={14} strokeWidth={2} className="text-[#7A8FA6]" />
      </button>
    </div>
  );
}
