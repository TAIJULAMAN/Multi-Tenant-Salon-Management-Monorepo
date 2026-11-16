"use client";

import React from "react";
import { Clock, Calendar as CalendarIcon, Activity } from "lucide-react";

interface WorkedShiftsProfileStatsProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  totalHours?: string;
  daysWorked?: number | string;
  avgHoursPerDay?: string;
}

export default function WorkedShiftsProfileStats({
  name = "Maria Fernandez",
  email = "maria@gmail.com",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaF&backgroundColor=fce7f3",
  totalHours = "165h",
  daysWorked = 21,
  avgHoursPerDay = "7.9h",
}: WorkedShiftsProfileStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6 sm:mb-8 w-full">
        <img
          src={avatarUrl}
          alt={name}
          className="w-14 h-14 rounded-lg object-cover bg-[#FCE7F3] mix-blend-multiply shrink-0"
        />
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold text-[#1E293B] truncate">
            {name}
          </h2>
          <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5 truncate">
            {email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-[#EEF2FF] rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#635BFF] flex items-center justify-center text-white shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold text-[#1E293B]">
              Total Hours
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#1E293B] relative z-10">
            {totalHours}
          </div>
        </div>

        <div className="bg-[#F0FDF4] rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#2DD4BF] flex items-center justify-center text-white shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold text-[#1E293B]">
              Days Worked
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#1E293B] relative z-10">
            {daysWorked}
          </div>
        </div>

        <div className="bg-[#F0FDF4] rounded-lg p-6 relative overflow-hidden sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#4ADE80] flex items-center justify-center text-white shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-bold text-[#1E293B]">
              Avg Hour/Day
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#1E293B] relative z-10">
            {avgHoursPerDay}
          </div>
        </div>
      </div>
    </div>
  );
}

