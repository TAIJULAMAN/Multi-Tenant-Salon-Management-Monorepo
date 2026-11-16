"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";

interface EditWorkedShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, timeIn: string, timeOut: string) => void;
  initialData?: { date: string; timeIn: string; timeOut: string };
}

export default function EditWorkedShiftModal({ isOpen, onClose, onSave, initialData }: EditWorkedShiftModalProps) {
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("17:00");

  useEffect(() => {
    if (isOpen && initialData) {
      setDate(initialData.date);
      setTimeIn(initialData.timeIn);
      setTimeOut(initialData.timeOut);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave(date, timeIn, timeOut);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Shift" maxWidth="max-w-md">
      <div className="space-y-4 pt-4 font-manrope">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
            Date
          </label>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            placeholder="Select date"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              Time In
            </label>
            <CustomTimePicker
              value={timeIn}
              onChange={setTimeIn}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              Time Out
            </label>
            <CustomTimePicker
              value={timeOut}
              onChange={setTimeOut}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
