"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";

const TIP_OPTIONS = [
  { label: "No Tip", pct: 0, amount: null },
  { label: "10%", pct: 10, amount: "€ 13,20" },
  { label: "18%", pct: 18, amount: "€ 23,76" },
  { label: "25%", pct: 25, amount: "€ 33" },
  { label: "35%", pct: 35, amount: "€ 46,20" },
  { label: "45%", pct: 45, amount: "€ 59,40" },
  { label: "Custom Tip", pct: -1, amount: null },
];

const EMPLOYEE_OPTIONS = ["Maria Rodriguez", "John Smith", "Sarah Lee"];
const DISCOUNT_TYPES = ["Percentage", "Fixed Amount"];

export default function SendTipModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selectedTip, setSelectedTip] = useState(0);
  const [employee, setEmployee] = useState(EMPLOYEE_OPTIONS[0]);

  // Custom tip fields
  const [tipType, setTipType] = useState(DISCOUNT_TYPES[0]);
  const [customAmount, setCustomAmount] = useState("");

  const isCustom = TIP_OPTIONS[selectedTip]?.pct === -1;

  // Computed total tip
  const totalTip = (() => {
    if (!isCustom || !customAmount) return 0;
    const val = parseFloat(customAmount);
    return isNaN(val) ? 0 : val;
  })();

  // Close modal on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", h);
    }
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[698px] p-6 sm:p-8 font-manrope animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#1A1A2E]">Send a Tip</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-[#29343D]" />
          </button>
        </div>

        {/* Employee dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
            Employee <span className="text-[#29343D]">*</span>
          </label>
          <CustomSelect
            value={employee}
            onChange={(val) => setEmployee(val)}
            options={EMPLOYEE_OPTIONS}
            buttonClassName="w-full flex items-center justify-between px-4 py-3.5 border border-[#E0E6EB] rounded-[8px] text-sm hover:border-[#635BFF] transition-colors cursor-pointer bg-white text-[#29343D] font-medium"
          />
        </div>

        {/* Amount label */}
        <label className="block text-sm font-semibold text-[#1A1A2E] mb-4">
          Amount <span className="text-[#29343D]">*</span>
        </label>

        {/* Tip grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {TIP_OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedTip(i)}
              className={`flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer py-6 sm:py-8 ${
                selectedTip === i
                  ? "border border-[#635BFF] bg-[#F0EEFF]"
                  : "border-0 bg-[#F4F6FA] hover:bg-[#EEEEFF]"
              }`}
            >
              <span className="text-xl sm:text-2xl font-semibold text-[#29343D]">
                {opt.label}
              </span>
              {opt.amount && (
                <span className="text-xs sm:text-sm text-[#526B7A] mt-1 font-normal">
                  {opt.amount}
                </span>
              )}
            </button>
          ))}
        </div>

        {isCustom && (
          <div className="mb-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Type dropdown */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Type <span className="text-[#526B7A]">*</span>
                </label>
                <CustomSelect
                  value={tipType}
                  onChange={(val) => setTipType(val)}
                  options={DISCOUNT_TYPES}
                  buttonClassName="w-full flex items-center justify-between px-4 py-3 border border-[#E0E6EB] rounded-[8px] text-sm hover:border-[#635BFF] transition-colors cursor-pointer bg-white text-[#29343D] font-medium"
                />
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Amount ({tipType === "Percentage" ? "%" : "€"}) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={tipType === "Percentage" ? "Enter percentage" : "Enter amount"}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full border border-[#E0E6EB] rounded-[8px] px-4 py-3 text-sm text-[#29343D] placeholder-[#C4CDD5] outline-none focus:border-[#635BFF] transition-colors"
                />
              </div>
            </div>

            {/* Total Tip */}
            <p className="text-sm font-semibold bg-[#ECFDFD] w-fit text-[#16CDC7] leading-6 px-3 py-1 rounded-2xl">
              Total Tip: € {totalTip}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
