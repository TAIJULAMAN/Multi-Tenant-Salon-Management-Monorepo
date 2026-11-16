"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { CustomDatePicker } from "@/components/common/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";
import { TextareaGroup } from "@/components/common/TextareaGroup";

interface AddTimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function AddTimeOffModal({ isOpen, onClose, onSave }: AddTimeOffModalProps) {
  const [leaveType, setLeaveType] = useState("Annual leave");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isRepeatChecked, setIsRepeatChecked] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState("daily");
  const [description, setDescription] = useState("");

  // Calculate total hours
  let totalHours = 0;
  if (startDate && endDate && startTime && endTime) {
    const start = new Date(startDate);
    const [startH, startM] = startTime.split(":");
    start.setHours(parseInt(startH), parseInt(startM), 0, 0);

    const end = new Date(endDate);
    const [endH, endM] = endTime.split(":");
    end.setHours(parseInt(endH), parseInt(endM), 0, 0);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      // Calculate simple difference in hours
      totalHours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
    }
  }

  const handleSave = () => {
    const data = {
      leaveType,
      startDate,
      endDate,
      startTime,
      endTime,
      isRepeatChecked,
      repeatFreq: isRepeatChecked ? repeatFreq : null,
      description,
      totalHours
    };
    if (onSave) {
      onSave(data);
    } else {
      console.log("Time off saved:", data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-lg w-full max-w-[550px] max-h-[90vh] overflow-x-hidden overflow-y-auto relative z-10 shadow-xl flex flex-col custom-scrollbar">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between z-20">
          <h2 className="text-[18px] font-bold text-[#1E293B]">Add Time Off</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Type *</label>
            <CustomSelect
              value={leaveType}
              onChange={setLeaveType}
              options={["Annual leave", "Sick leave", "Personal leave", "Maternity leave", "Paternity leave", "Bereavement leave", "Other"]}
              buttonClassName="w-full text-[14px] px-4 py-3 justify-between font-normal h-[46px]"
              align="left"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Start Date *</label>
              <CustomDatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="DD/MM/YYYY"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">End Date *</label>
              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="DD/MM/YYYY"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Start Time *</label>
              <CustomTimePicker
                value={startTime}
                onChange={setStartTime}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">End Time *</label>
              <CustomTimePicker
                value={endTime}
                onChange={setEndTime}
                className="w-full"
              />
            </div>
          </div>

          <CustomCheckbox
            checked={isRepeatChecked}
            onChange={setIsRepeatChecked}
            label="Repeat"
          />

          {isRepeatChecked && (
            <div className="bg-[#F8FAFC] rounded-lg p-5 space-y-4 border border-[#E2E8F0]">
              <h4 className="text-[13px] font-bold text-[#1E293B]">Repeat frequency</h4>
              <div className="space-y-3">
                {[
                  { id: 'daily', label: 'Daily', sub: 'Repeat blocks of time a day' },
                  { id: 'weekly', label: 'Weekly', sub: 'Repeat on [Day] of every week' },
                  { id: 'biweekly', label: 'Every 2 weeks', sub: 'Repeat every 2 weeks on [Day]' },
                  { id: 'monthly', label: 'Monthly', sub: 'Repeat on date of every month' },
                  { id: 'quarterly', label: 'Quarterly', sub: 'Repeat every 3 months on date' },
                  { id: 'yearly', label: 'Yearly', sub: 'Repeat on [Date] of every year' },
                ].map((freq, idx) => (
                  <div key={freq.id} className="flex gap-3">
                    <input
                      type="radio"
                      name="repeat-freq"
                      id={freq.id}
                      checked={repeatFreq === freq.id}
                      onChange={() => setRepeatFreq(freq.id)}
                      className="mt-1 w-4 h-4 text-[#635BFF] border-[#E2E8F0] focus:ring-[#635BFF] cursor-pointer"
                    />
                    <div>
                      <label htmlFor={freq.id} className="text-[14px] font-medium text-[#1E293B] cursor-pointer block">{freq.label}</label>
                      <span className="text-[12px] text-[#94A3B8]">{freq.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <TextareaGroup
            label="Description (Optional)"
            placeholder="Add description or note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <span className="inline-block bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-3 py-1 rounded-full">
              Time off total: {totalHours.toFixed(1)}h
            </span>
          </div>

          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 flex gap-3">
            <div>
              <h4 className="text-[13px] font-bold text-[#92400E] mb-1">Warning</h4>
              <p className="text-[13px] text-[#B45309]">Online bookings cannot be placed during time off.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
