"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import GiftCardVisual from "./GiftCardVisual";
import { MOCK_GIFT_CARDS } from "../data";
import { GiftCardModalProps } from "../types";

export default function GiftCardModal({
  open,
  onClose,
  total,
  onComplete,
}: GiftCardModalProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [applied, setApplied] = useState<boolean>(false);

  function handleClose(): void {
    setSelectedCard(null);
    setShowCode(false);
    setCode("");
    setApplied(false);
    onClose();
  }

  function handleConfirm(): void {
    handleClose();
    onComplete?.();
  }

  function handleApply(): void {
    if (code.trim()) setApplied(true);
  }

  const canConfirm = selectedCard !== null || applied;

  return (
    <Modal isOpen={open} onClose={handleClose} title="Gift Card" maxWidth="max-w-[560px]">
      <div className="space-y-4">
        <p className="text-xs text-[#98A4AE]">Select one or more Gifts Cards</p>

        <div className="grid grid-cols-2 gap-4">
          {MOCK_GIFT_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            >
              <GiftCardVisual card={card} selected={selectedCard === card.id} />
            </div>
          ))}
        </div>

        {showCode && (
          <div>
            <label className="text-xs font-semibold text-[#29343D] block mb-1.5">
              Insert Code Manually *
            </label>
            <div className="flex items-center gap-2 border border-[#E0E6EB] rounded-lg px-3 py-2 focus-within:border-[#635BFF] transition-colors">
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setApplied(false);
                }}
                placeholder="Enter code"
                className="flex-1 text-sm text-[#29343D] outline-none bg-transparent"
              />
              {applied ? (
                <span className="text-xs font-semibold text-[#635BFF] flex items-center gap-1 whitespace-nowrap">
                  Applied <Check size={12} strokeWidth={2.5} />
                </span>
              ) : (
                <button
                  onClick={handleApply}
                  className="text-xs font-semibold text-[#635BFF] hover:text-[#4f49e0] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        )}

        {applied && (
          <div className="flex justify-between items-center px-4 py-3 bg-[#F4F6FA] rounded-xl">
            <span className="text-sm font-semibold text-[#29343D]">Total</span>
            <span className="text-sm font-bold text-[#29343D]">
              € {total.toFixed ? total.toFixed(2) : total}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowCode((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] border border-[#DDDBFF] rounded-lg px-3 py-2 hover:bg-[#F4F3FF] transition-colors cursor-pointer"
          >
            <Plus size={13} strokeWidth={2.5} /> Insert Code Manually
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-[#29343D] hover:bg-[#F4F6FA] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={canConfirm ? handleConfirm : undefined}
              disabled={!canConfirm}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                canConfirm
                  ? "bg-[#635BFF] hover:bg-[#4f49e0] text-white cursor-pointer shadow-sm"
                  : "bg-[#E0E6EB] text-[#98A4AE] cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export { GiftCardModal };
