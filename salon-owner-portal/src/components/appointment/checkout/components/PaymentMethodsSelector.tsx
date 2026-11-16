"use client";

import React from "react";
import { PaymentMethodId } from "../types";
import { MethodIcon } from "./CheckoutIcons";

interface PaymentMethodsSelectorProps {
  selectedMethods: PaymentMethodId[];
  onToggleMethod: (id: PaymentMethodId) => void;
  divided: boolean;
  onToggleDivided: () => void;
  activeGiftCardsCount?: number;
}

const METHODS: { id: PaymentMethodId; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card Terminal" },
  { id: "online", label: "Online Payment" },
  { id: "gift", label: "Gift Card" },
];

export default function PaymentMethodsSelector({
  selectedMethods,
  onToggleMethod,
  divided,
  onToggleDivided,
  activeGiftCardsCount = 2,
}: PaymentMethodsSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E6EB] shadow-xs font-manrope">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-[#1E293B]">
          Payment Methods
        </h3>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={divided}
            onChange={onToggleDivided}
            className="w-4 h-4 rounded text-[#635BFF] focus:ring-[#635BFF] cursor-pointer"
          />
          <span className="text-[12px] font-semibold text-[#64748B]">
            Split / Divide
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METHODS.map((m) => {
          const isSelected = selectedMethods.includes(m.id);
          const hasGiftBadge = m.id === "gift" && activeGiftCardsCount > 0;

          return (
            <button
              key={m.id}
              onClick={() => onToggleMethod(m.id)}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all relative cursor-pointer ${
                isSelected
                  ? "bg-[#635BFF] border-[#635BFF] text-white shadow-sm"
                  : "bg-[#FAFBFC] border-[#E0E6EB] text-[#1E293B] hover:border-[#CBD5E1]"
              }`}
            >
              {/* Circular Badge with number of active gift cards */}
              {hasGiftBadge && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-[#EF4444] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-75 duration-200">
                  {activeGiftCardsCount}
                </span>
              )}
              <MethodIcon id={m.id} white={isSelected} />
              <span className="text-[12px] font-bold">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
