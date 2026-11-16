"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import { GiftCardItem } from "../types";
import { MOCK_GIFT_CARDS } from "../data";

interface GiftCardModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

function GiftCardVisual({ card, selected }: { card: GiftCardItem; selected: boolean }) {
  return (
    <div
      style={{ background: card.bg }}
      className={`relative w-full h-[140px] rounded-2xl p-4 flex flex-col justify-between text-white shadow-md transition-all cursor-pointer select-none ${
        selected ? "ring-2 ring-offset-2 ring-[#635BFF] scale-[1.02]" : "opacity-85 hover:opacity-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold tracking-widest uppercase opacity-80">
          Gift Card
        </span>
        {card.type === "vip" && (
          <span className="text-[10px] font-bold bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
            VIP
          </span>
        )}
      </div>

      <div>
        <div className="text-[15px] font-bold tracking-wide">{card.name}</div>
        <div className="text-[11px] font-mono opacity-70 tracking-widest mt-0.5">
          {card.code}
        </div>
      </div>
    </div>
  );
}

export default function GiftCardModal({
  open,
  onClose,
  onComplete,
}: GiftCardModalProps) {
  const [selectedCard, setSelectedCard] = useState<string>("gc1");
  const [inputCode, setInputCode] = useState<string>("");

  function handleClose(): void {
    setInputCode("");
    onClose();
  }

  function handleConfirm(): void {
    onComplete();
  }

  function handleApply(): void {
    if (inputCode.trim()) {
      onComplete();
    }
  }

  return (
    <Modal isOpen={open} onClose={handleClose} maxWidth="max-w-[480px]">
      <div className="p-1">
        <h3 className="text-[17px] font-bold text-[#1E293B] mb-1">
          Apply Gift Card
        </h3>
        <p className="text-[13px] text-[#64748B] mb-5">
          Select an available gift card or enter a gift card code manually.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {MOCK_GIFT_CARDS.map((card) => (
            <div key={card.id} onClick={() => setSelectedCard(card.id)}>
              <GiftCardVisual card={card} selected={selectedCard === card.id} />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wider">
            Or Enter Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="#GIFT-XXXX"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none font-mono"
            />
            <button
              onClick={handleApply}
              disabled={!inputCode.trim()}
              className="px-4 h-10 rounded-lg bg-[#F4F6FA] text-[13px] font-semibold text-[#1E293B] hover:bg-[#E0E6EB] disabled:opacity-40 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5248e5] transition-colors"
          >
            Confirm Card
          </button>
        </div>
      </div>
    </Modal>
  );
}
