"use client";

import React from "react";
import { X } from "lucide-react";

interface NewAppointmentModalHeaderProps {
  currentStep: number;
  date: Date;
  onClose: () => void;
  onFinalize: () => void;
}

export default function NewAppointmentModalHeader({
  currentStep,
  date,
  onClose,
  onFinalize,
}: NewAppointmentModalHeaderProps) {
  return (
    <div className="flex-none px-8 py-6 flex items-start justify-between border-b border-slate-100 bg-white">
      <div>
        <h2 className="text-[20px] font-bold text-[#29343D]">
          {currentStep === 4 ? "Success" : "New Appointment"}{" "}
          {currentStep < 4 && (
            <span className="text-[#999] text-[14px] font-normal ml-2">
              Step {currentStep} of 3
            </span>
          )}
        </h2>
        {currentStep < 4 && (
          <p className="text-[14px] text-[#999] font-medium mt-0.5">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
      <button
        onClick={currentStep === 4 ? onFinalize : onClose}
        className="p-1 hover:bg-slate-100 rounded-full cursor-pointer text-[#29343D]"
      >
        <X size={24} />
      </button>
    </div>
  );
}
