"use client";

import React from "react";
import { AlertCircle, Gift } from "lucide-react";

interface ActiveGiftCardWarningModalProps {
  isOpen: boolean;
  onGoBack: () => void;
  onContinueAnyway: () => void;
  activeCardsCount?: number;
}

export default function ActiveGiftCardWarningModal({
  isOpen,
  onGoBack,
  onContinueAnyway,
  activeCardsCount = 2,
}: ActiveGiftCardWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-manrope">
      <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl p-6 border border-[#E2E8F0] animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#EF4444] mb-4 mx-auto">
          <Gift className="w-6 h-6 text-[#635BFF]" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-[17px] font-bold text-[#1E293B] mb-2">
            Active Gift Card Available
          </h3>
          <p className="text-[13px] text-[#64748B] leading-relaxed">
            There {activeCardsCount === 1 ? "is" : "are"}{" "}
            <strong className="text-[#1E293B] font-bold">
              {activeCardsCount} active eligible gift{" "}
              {activeCardsCount === 1 ? "card" : "cards"}
            </strong>{" "}
            for this client. Are you sure you don’t want to apply it?
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onGoBack}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E2E8F0] text-[13px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={onContinueAnyway}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-bold transition-colors shadow-sm shadow-[#635BFF]/20 cursor-pointer text-center"
          >
            Yes, continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}
