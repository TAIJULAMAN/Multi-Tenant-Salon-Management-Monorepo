"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";

interface AddBlockedTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddBlockedTimeModal({ isOpen, onClose, onSave }: AddBlockedTimeModalProps) {
  const [member, setMember] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Blocked Time" maxWidth="max-w-md">
      <div className="space-y-4 pt-4 font-manrope">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
            Team Member
          </label>
          <CustomSelect
            value={member}
            onChange={setMember}
            options={["Select a member", "Maria Rodriguez", "Sarah Chen", "James Wilson"]}
            placeholder="Select a member"
            buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
          />
        </div>
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
              Start Time
            </label>
            <CustomTimePicker
              value={startTime}
              onChange={setStartTime}
              buttonClassName="w-full flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1E293B] shadow-sm transition-colors cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              End Time
            </label>
            <CustomTimePicker
              value={endTime}
              onChange={setEndTime}
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
            Block Time
          </button>
        </div>
      </div>
    </Modal>
  );
}
