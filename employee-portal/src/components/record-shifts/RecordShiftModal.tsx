"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";
import { SCHEDULE_TYPES } from "./data";

interface RecordShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (shift: {
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
    breakDuration: string;
    notes?: string;
  }) => void;
}

export const RecordShiftModal: React.FC<RecordShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [scheduleType, setScheduleType] = useState("Regular Shift");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakDuration, setBreakDuration] = useState("1h");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return;

    if (onSave) {
      onSave({
        scheduleType: scheduleType || "Regular Shift",
        date,
        startTime,
        endTime,
        breakDuration,
        notes,
      });
    }

    setScheduleType("Regular Shift");
    setDate("");
    setStartTime("09:00");
    setEndTime("18:00");
    setBreakDuration("1h");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Shift"
      maxWidth="max-w-[500px]"
    >
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
              options={SCHEDULE_TYPES}
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

        {/* Row 3: Break Duration */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            Break Duration
          </label>
          <CustomSelect
            value={breakDuration}
            onChange={setBreakDuration}
            options={["None", "15m", "30m", "45m", "1h", "1h 30m"]}
            buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
          />
        </div>

        {/* Row 4: Notes */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            Shift Notes / Comments
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Add any notes about this shift (optional)..."
            className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#635BFF] focus:outline-none resize-none transition-colors"
          />
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#635BFF] hover:bg-[#5248e5] text-white px-6 py-2 rounded-lg font-bold text-[13px] shadow-sm transition-colors cursor-pointer"
          >
            Record Shift
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordShiftModal;
