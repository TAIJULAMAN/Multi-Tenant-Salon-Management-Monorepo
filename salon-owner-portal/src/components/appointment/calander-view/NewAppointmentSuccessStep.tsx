"use client";

import React from "react";

export default function NewAppointmentSuccessStep() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-6">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 className="text-[24px] font-bold text-[#29343D] mb-3">
        Appointment Created!
      </h2>
      <p className="text-[15px] text-[#999] max-w-sm mx-auto leading-relaxed">
        Your new appointment has been successfully booked and added to the
        calendar.
      </p>
    </div>
  );
}
