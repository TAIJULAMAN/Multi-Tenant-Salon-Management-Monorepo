"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (shift: {
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
}

export default function AddShiftModal({
  isOpen,
  onClose,
  onSave,
}: AddShiftModalProps) {
  const [scheduleType, setScheduleType] = useState("Regular Shift");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return;

    if (onSave) {
      onSave({
        scheduleType: scheduleType || "Regular Shift",
        date,
        startTime,
        endTime,
      });
    }

    setScheduleType("Regular Shift");
    setDate("");
    setStartTime("09:00");
    setEndTime("17:00");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Shift" maxWidth="max-w-[480px]">
      <form onSubmit={handleSubmit} className="pt-2 space-y-4 font-manrope">
        {/* Row 1: Schedule Type & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              Schedule Type <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              value={scheduleType}
              onChange={setScheduleType}
              options={["Regular Shift", "Overtime", "Weekend Shift", "Part Time"]}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              Date <span className="text-[#EF4444]">*</span>
            </label>
            <CustomDatePicker
              value={date}
              onChange={setDate}
              placeholder="Select date"
            />
          </div>
        </div>

        {/* Row 2: Start Time & End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              Start Time <span className="text-[#EF4444]">*</span>
            </label>
            <CustomTimePicker
              value={startTime}
              onChange={setStartTime}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              End Time <span className="text-[#EF4444]">*</span>
            </label>
            <CustomTimePicker
              value={endTime}
              onChange={setEndTime}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-[#635BFF] hover:bg-[#5248e5] text-white px-7 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
