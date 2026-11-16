"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Calendar as CalendarIcon,
  Activity,
  CheckCircle,
  FileText,
  Trash2,
} from "lucide-react";

export default function RecordShiftDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [shift, setShift] = useState({
    id: id || "1",
    date: "Dec 01, 2024",
    day: "Sunday",
    scheduleType: "Regular Shift",
    timeIn: "09:00",
    timeOut: "18:00",
    breakDuration: "1h",
    hours: "8h",
    status: "Approved",
    notes: "Styling & coloring appointments. Client consultations handled.",
  });

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      {/* Top Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 flex justify-between items-center">
        <Link
          href="/record-shifts"
          className="flex items-center gap-2 text-[#1E293B] hover:text-[#635BFF] transition-colors font-bold text-[14px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Record Shifts
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
                Shift Details #{id}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  shift.status === "Approved"
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {shift.status}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">
              Logged shift record for {shift.date} ({shift.day})
            </p>
          </div>

          <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#EEF2FF] text-[#635BFF] self-start sm:self-auto">
            {shift.scheduleType}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              Time In
            </span>
            <div className="text-lg font-bold text-[#1E293B] mt-1">
              {shift.timeIn}
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              Time Out
            </span>
            <div className="text-lg font-bold text-[#1E293B] mt-1">
              {shift.timeOut}
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              Break Duration
            </span>
            <div className="text-lg font-bold text-[#1E293B] mt-1">
              {shift.breakDuration}
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              Total Hours
            </span>
            <div className="text-lg font-bold text-[#635BFF] mt-1">
              {shift.hours}
            </div>
          </div>
        </div>

        {/* Notes */}
        {shift.notes && (
          <div className="mt-6 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1">
              <FileText className="w-3.5 h-3.5" />
              Notes / Description
            </div>
            <p className="text-sm text-[#1E293B]">{shift.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
