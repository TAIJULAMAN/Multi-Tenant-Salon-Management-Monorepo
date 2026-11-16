"use client";

import React, { useState } from "react";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export function SchedulePostModal({ isOpen, onClose, onConfirm, initialDate, initialTime }: SchedulePostModalProps) {
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#343C46]/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[8px] w-full max-w-[560px] flex flex-col relative shadow-2xl font-sans">

        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-[18px] font-bold text-[#1C2024]">Schedule Post</h2>
          <CustomCloseButton onClick={onClose} className="text-[#8B929A] hover:text-[#1C2024] transition-colors" />
        </div>

        {/* Content */}
        <div className="px-6 pb-24">
          <div className="grid grid-cols-2 gap-4">

            {/* Date Input */}
            <div>
              <label className="block text-[13px] font-bold text-[#1C2024] mb-2">
                Date *
              </label>
              <CustomDatePicker
                value={date}
                onChange={setDate}
                placeholder="mm/dd/yyyy"
                className="w-full"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-[13px] font-bold text-[#1C2024] mb-2">
                Time *
              </label>
              <CustomTimePicker
                value={time}
                onChange={setTime}
                className="w-full"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 flex items-center justify-end gap-3 rounded-b-[8px]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-[6px] border border-[#E6E8EB] bg-white text-[#636C75] font-bold text-[14px] hover:bg-[#F9FAFB] hover:text-[#343C46] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(date, time)}
            className="px-6 py-2.5 rounded-[6px] bg-[#6B4EFF] text-white font-bold text-[14px] hover:bg-[#5A3EE0] transition-colors"
          >
            Schedule
          </button>
        </div>

      </div>
    </div>
  );
}
