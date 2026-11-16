"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";

const DISCOUNT_TYPES = ["Percentage", "Fixed Amount"];

export default function AddDiscountModal({
  open,
  onClose,
  initialType = "Percentage",
  initialAmount = "",
  subtotal = 0,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  initialType?: string;
  initialAmount?: string;
  subtotal?: number;
  onApply?: (type: string, amount: string) => void;
}) {
  const [discountType, setDiscountType] = useState(initialType);
  const [amount, setAmount] = useState(initialAmount);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setDiscountType(initialType);
      setAmount(initialAmount);
    }
  }, [open, initialType, initialAmount]);

  // Live total after discount
  const parsedAmount = parseFloat(amount) || 0;
  const totalAfterVal =
    subtotal > 0
      ? discountType === "Percentage"
        ? Math.max(0, subtotal * (1 - parsedAmount / 100))
        : Math.max(0, subtotal - parsedAmount)
      : parsedAmount;

  const totalAfterDisplay =
    subtotal > 0
      ? `€ ${Number.isInteger(totalAfterVal) ? totalAfterVal : totalAfterVal.toFixed(2)}`
      : `€ ${Number.isInteger(parsedAmount) ? parsedAmount : parsedAmount.toFixed(2)}`;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[698px] px-8 py-7 font-manrope animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E]">
              Add Cart Discount
            </h3>
            <p className="text-sm text-[#98A4AE] mt-1">
              Taxes will be recalculated after the discount has been applied.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-4"
          >
            <X size={18} className="text-[#29343D]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7 mb-7">
          {/* Discount Type */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
              Type <span className="text-[#29343D]">*</span>
            </label>
            <CustomSelect
              value={discountType}
              onChange={(val) => setDiscountType(val)}
              options={DISCOUNT_TYPES}
              buttonClassName="w-full flex items-center justify-between px-4 py-3 border border-[#E0E6EB] rounded-[8px] text-sm text-[#29343D] hover:border-[#635BFF] transition-colors bg-white font-medium"
            />
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
              Amount ({discountType === "Percentage" ? "%" : "€"}) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder={discountType === "Percentage" ? "Enter percentage" : "Enter amount"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[#E0E6EB] rounded-[8px] px-4 py-3 text-sm text-[#29343D] placeholder-[#C4CDD5] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <span className="text-sm font-medium text-[#16CDC7] bg-[#ECFDFD] px-4 py-2 rounded-full w-fit">
            Total After Discount: {totalAfterDisplay}
          </span>

          <button
            onClick={() => {
              if (onApply) onApply(discountType, amount);
              onClose();
            }}
            className="px-6 py-3 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-[8px] transition-colors cursor-pointer text-center"
          >
            Add Discount
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
