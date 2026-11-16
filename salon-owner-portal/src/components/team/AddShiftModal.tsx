import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function AddShiftModal({ isOpen, onClose, onSave }: AddShiftModalProps) {
  const [addShiftEmployee, setAddShiftEmployee] = useState("Emma Watson");
  const [addShiftType, setAddShiftType] = useState("");
  const [addShiftStartDate, setAddShiftStartDate] = useState("");
  const [addShiftEndType, setAddShiftEndType] = useState("Never");
  const [addShiftStartTime, setAddShiftStartTime] = useState("");
  const [addShiftEndTime, setAddShiftEndTime] = useState("");
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  const handleSave = () => {
    if (onSave) onSave();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Shift" maxWidth="max-w-[500px]">
      <div className="flex flex-col gap-6">
        <div className="space-y-5">
          <div>
            <CustomSelect
              label="Employee *"
              value={addShiftEmployee}
              onChange={setAddShiftEmployee}
              options={[
                { label: "Emma Watson", value: "Emma Watson" },
                { label: "John Doe", value: "John Doe" },
                { label: "Jane Smith", value: "Jane Smith" },
              ]}
              placeholder="Select employee"
            />
          </div>

          <div>
            <CustomSelect
              label="Schedule Type *"
              value={addShiftType}
              onChange={setAddShiftType}
              options={[
                { label: "Shift", value: "shift" },
                { label: "Break", value: "break" },
                { label: "Leave", value: "leave" },
                { label: "Training", value: "training" }
              ]}
              placeholder="Select type"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:flex-1">
              <CustomDatePicker
                label="Start Date *"
                value={addShiftStartDate}
                onChange={setAddShiftStartDate}
                placeholder="Select Date"
              />
            </div>
            <div className="w-full sm:flex-1">
              <CustomSelect
                label="End *"
                value={addShiftEndType}
                onChange={setAddShiftEndType}
                options={["Never", "Specific Date"]}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:flex-1">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Start Time *</label>
              <CustomTimePicker
                value={addShiftStartTime}
                onChange={setAddShiftStartTime}
              />
            </div>
            <div className="w-full sm:flex-1">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">End Time *</label>
              <CustomTimePicker
                value={addShiftEndTime}
                onChange={setAddShiftEndTime}
              />
            </div>
          </div>

          {/* Overrule Warning Block */}
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="text-[#EF4444] mt-0.5 text-lg leading-none">⚠️</div>
              <div className="flex-1">
                <h4 className="text-[13px] font-bold text-[#991B1B] mb-1">Warning: Shift Conflict</h4>
                <p className="text-[13px] text-[#B91C1C] mb-3">This shift overrules preexisting ones. Do you want to overwrite them?</p>

                <div className="bg-white rounded border border-[#FECACA] p-3 mb-3">
                  <p className="text-[12px] font-bold text-[#7F1D1D] mb-2">Shifts that will be overruled:</p>
                  <ul className="text-[12px] text-[#991B1B] space-y-1 list-disc pl-4">
                    <li>Aug 12, 10:00 - 14:00 (Break)</li>
                    <li>Aug 13, 14:00 - 18:00 (Shift)</li>
                  </ul>
                </div>

                <CustomCheckbox
                  label="Confirm overwrite"
                  checked={confirmOverwrite}
                  onChange={setConfirmOverwrite}
                />
              </div>
            </div>
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
    </Modal>
  );
}
