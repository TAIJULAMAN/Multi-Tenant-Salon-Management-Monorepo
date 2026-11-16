"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";

interface AddClosedPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startDate: string, endDate: string, reason: string) => void;
}

export default function AddClosedPeriodModal({ isOpen, onClose, onSave }: AddClosedPeriodModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    onSave(startDate, endDate, reason);
    setStartDate("");
    setEndDate("");
    setReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Business Closed Period" maxWidth="max-w-md">
      <div className="space-y-4 pt-4 font-manrope">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              Start Date
            </label>
            <CustomDatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              End Date
            </label>
            <CustomDatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            placeholder="E.g. National Holiday, Renovation..."
          />
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
            Save Period
          </button>
        </div>
      </div>
    </Modal>
  );
}
