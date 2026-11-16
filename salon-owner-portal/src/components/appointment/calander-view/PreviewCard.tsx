"use client";

import { useState } from "react";
import {
  AppStatus,
  CalAppointment,
} from "@/@types/salon-owner/CalAppointment.type";
import Image from "next/image";
import Link from "next/link";
import { IconDots } from "./PreviewCardIcons";
import PreviewCardDropdownMenu from "./PreviewCardDropdownMenu";

export default function PreviewCard({
  appt,
  onViewDetails,
  onEdit,
  onDelete,
  style,
  statusBadgeColor,
}: {
  appt: CalAppointment;
  onClose: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: React.CSSProperties;
  statusBadgeColor?: Record<AppStatus, string>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const badgeClass =
    statusBadgeColor?.[appt.status] ?? "bg-gray-100 text-gray-700";

  const latestNote =
    "Client requested a trim and light layers. Prefers no heat styling. Allergic to certain dyes check profile before rescheduling.";

  return (
    <div
      className="absolute z-50 bg-white rounded-[14px] shadow-[0px_12px_40px_rgba(0,0,0,0.15)] border border-[#EFF4FA] p-4 w-[350px]"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link
          href="/dashboard/clients/view-client"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src="/avatar/icon1.png"
            alt={appt.clientName}
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <span className="text-sm font-semibold font-manrope text-[#29343D] hover:text-[#635BFF] transition-colors">
            {appt.clientName}
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold font-manrope px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            {appt.status}
          </span>

          <span
            className={`text-xs font-semibold font-manrope px-2 py-0.5 rounded-full whitespace-nowrap ${
              appt.paymentStatus === "Paid"
                ? "bg-[#E6F8F3] text-[#10B981]"
                : appt.paymentStatus === "Partially Paid"
                ? "bg-[#FFF8E6] text-[#F59E0B]"
                : "bg-[#FFF1F1] text-[#E53535]"
            }`}
          >
            {appt.paymentStatus || "Unpaid"}
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="flex items-center justify-center w-6 h-6 rounded-full text-[#98A4AE] hover:bg-[#F5F8FB] transition-colors"
            >
              <IconDots />
            </button>

            {menuOpen && (
              <PreviewCardDropdownMenu
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2.5">
        <div>
          <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
            Date
          </p>
          <p className="text-xs font-semibold font-manrope text-[#29343D]">
            {appt.date
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "/")}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
            Time
          </p>
          <p className="text-xs font-semibold font-manrope text-[#29343D]">
            {appt.startTime} - {appt.endTime}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
            Service
          </p>
          <p className="text-xs font-semibold font-manrope text-[#29343D]">
            {appt.service}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
              Price
            </p>
            <p className="text-xs font-semibold font-manrope text-[#29343D]">
              € 170
            </p>
          </div>
          <div>
            <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
              Duration
            </p>
            <p className="text-xs font-semibold font-manrope text-[#29343D]">
              {appt.duration}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-manrope text-[#98A4AE] mb-0.5 uppercase tracking-wide">
            Employee
          </p>
          <div className="flex items-center gap-1">
            <Image
              src="/avatar/icon1.png"
              alt={appt.employeeName}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
            <p className="text-xs font-semibold font-manrope text-[#29343D] truncate">
              {appt.employeeName}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-3 rounded-[10px] bg-[#F5F8FB] px-3 py-2.5">
        <p className="text-[10px] font-manrope text-[#98A4AE] mb-1 uppercase tracking-wide">
          Notes
        </p>
        <p className="text-xs font-manrope text-[#29343D] leading-[1.6]">
          {latestNote}
        </p>
      </div>

      {appt.paymentStatus !== "Paid" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="mt-3 w-full py-2.5 rounded-[10px] bg-[#635BFF] text-white text-sm font-bold font-manrope hover:bg-[#5249db] transition-colors shadow-lg shadow-[#635BFF]/20 cursor-pointer"
        >
          Checkout
        </button>
      )}
    </div>
  );
}
