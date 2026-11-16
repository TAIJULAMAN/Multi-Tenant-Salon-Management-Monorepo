"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import { PaymentMethodId } from "../types";
import { METHOD_LABELS } from "../data";
import { MethodIcon } from "../components/CheckoutIcons";
import { ChevronDown, Plus, Check } from "lucide-react";

interface DividePaymentModalProps {
  open: boolean;
  onClose: () => void;
  methodA: PaymentMethodId;
  methodB: PaymentMethodId;
  total: number;
  onComplete: () => void;
  availableGiftCards?: { id: string; code: string; balance: number; name: string }[];
}

const DEFAULT_GIFT_CARDS = [
  { id: "gc1", code: "#0B1", balance: 170, name: "Birthday Voucher" },
  { id: "gc2", code: "#0B5", balance: 170, name: "Special Client Reward" },
];

export default function DividePaymentModal({
  open,
  onClose,
  methodA,
  methodB,
  total,
  onComplete,
  availableGiftCards = DEFAULT_GIFT_CARDS,
}: DividePaymentModalProps) {
  const [amountA, setAmountA] = useState<string>((total / 2).toFixed(2));
  const [amountB, setAmountB] = useState<string>((total / 2).toFixed(2));

  // Gift card selection state
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<string>(
    availableGiftCards.length > 0 ? availableGiftCards[0].id : "manual"
  );
  const [manualGiftCardCode, setManualGiftCardCode] = useState<string>("");

  useEffect(() => {
    if (open) {
      const half = (total / 2).toFixed(2);
      setAmountA(half);
      setAmountB((total - parseFloat(half)).toFixed(2));
      if (availableGiftCards.length > 0) {
        setSelectedGiftCardId(availableGiftCards[0].id);
      } else {
        setSelectedGiftCardId("manual");
      }
    }
  }, [open, total, availableGiftCards]);

  const numA = parseFloat(amountA) || 0;
  const numB = parseFloat(amountB) || 0;
  const currentSum = numA + numB;
  const isValid = Math.abs(currentSum - total) <= 0.05;

  const handleAmountAChange = (val: string) => {
    setAmountA(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= total) {
      setAmountB((total - parsed).toFixed(2));
    }
  };

  const handleAmountBChange = (val: string) => {
    setAmountB(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= total) {
      setAmountA((total - parsed).toFixed(2));
    }
  };

  function handleCollect(): void {
    if (isValid) {
      onComplete();
    }
  }

  const renderGiftCardSelector = () => {
    return (
      <div className="mt-3 pt-3 border-t border-[#E0E6EB] space-y-2">
        <label className="block text-[11px] font-bold text-[#475569]">
          Choose Gift Card to Apply *
        </label>
        <div className="relative">
          <select
            value={selectedGiftCardId}
            onChange={(e) => setSelectedGiftCardId(e.target.value)}
            className="w-full bg-white border border-[#E0E6EB] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer pr-8"
          >
            {availableGiftCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.code} - {card.name} (Balance: € {card.balance.toFixed(2)})
              </option>
            ))}
            <option value="manual">+ Add Gift Card Manually</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {selectedGiftCardId === "manual" && (
          <div className="pt-1 animate-in fade-in duration-150">
            <input
              type="text"
              placeholder="Enter gift card code (e.g. #GC-9021)"
              value={manualGiftCardCode}
              onChange={(e) => setManualGiftCardCode(e.target.value)}
              className="w-full bg-white border border-[#E0E6EB] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] placeholder:text-[#94A3B8]"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-[480px]">
      <div className="p-1 font-manrope">
        <h3 className="text-[17px] font-bold text-[#1E293B] mb-1">
          Divide Payment
        </h3>
        <p className="text-[13px] text-[#64748B] mb-5">
          Split the total across two payment methods. Total:{" "}
          <span className="font-bold text-[#635BFF]">€ {total.toFixed(2)}</span>
        </p>

        <div className="flex flex-col gap-3.5 mb-4">
          {/* Method A */}
          <div className="p-3.5 rounded-xl border border-[#E0E6EB] bg-[#FAFBFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E0E6EB] flex items-center justify-center shrink-0">
                <MethodIcon id={methodA} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#1E293B]">
                  {METHOD_LABELS[methodA]}
                </div>
                <div className="text-[11px] text-[#64748B]">First Method</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-[#64748B]">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountA}
                  onChange={(e) => handleAmountAChange(e.target.value)}
                  className="w-24 h-9 px-2.5 rounded-lg border border-[#E0E6EB] text-[14px] font-bold text-[#1E293B] text-right focus:border-[#635BFF] focus:outline-none bg-white"
                />
              </div>
            </div>
            {methodA === "gift" && renderGiftCardSelector()}
          </div>

          {/* Method B */}
          <div className="p-3.5 rounded-xl border border-[#E0E6EB] bg-[#FAFBFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E0E6EB] flex items-center justify-center shrink-0">
                <MethodIcon id={methodB} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#1E293B]">
                  {METHOD_LABELS[methodB]}
                </div>
                <div className="text-[11px] text-[#64748B]">Second Method</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-[#64748B]">€</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountB}
                  onChange={(e) => handleAmountBChange(e.target.value)}
                  className="w-24 h-9 px-2.5 rounded-lg border border-[#E0E6EB] text-[14px] font-bold text-[#1E293B] text-right focus:border-[#635BFF] focus:outline-none bg-white"
                />
              </div>
            </div>
            {methodB === "gift" && renderGiftCardSelector()}
          </div>
        </div>

        {!isValid && (
          <p className="text-xs text-rose-500 mb-4 font-medium">
            Amounts must sum up to € {total.toFixed(2)} (current: € {currentSum.toFixed(2)})
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCollect}
            disabled={!isValid}
            className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm cursor-pointer ${
              isValid
                ? "bg-[#635BFF] hover:bg-[#5248e5] text-white shadow-[#635BFF]/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Collect € {total.toFixed(2)}
          </button>
        </div>
      </div>
    </Modal>
  );
}
