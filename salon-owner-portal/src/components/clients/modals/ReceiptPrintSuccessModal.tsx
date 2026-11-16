"use client";

import React from "react";
import { Check } from "lucide-react";

interface ReceiptPrintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptPrintSuccessModal({
  isOpen,
  onClose,
}: ReceiptPrintSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200 mx-4 text-center">
        <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-[#10B981] stroke-[3]" />
        </div>

        <h2 className="text-[20px] font-bold text-[#1E293B] mb-2">
          Success!
        </h2>
        <p className="text-[13px] text-[#64748B] font-medium mb-8">
          Receipt printed successfully.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm shadow-[#635BFF]/20 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}

