"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import { ReceiptIllustration } from "../components/CheckoutIcons";

interface PrintReceiptModalProps {
  open: boolean;
  onClose: () => void;
  twoOptions?: boolean;
  onComplete?: () => void;
}

export default function PrintReceiptModal({
  open,
  onClose,
  twoOptions = false,
  onComplete,
}: PrintReceiptModalProps) {
  const [printing, setPrinting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  function handleAction(isPrint: boolean): void {
    if (isPrint) {
      setPrinting(true);
      setTimeout(() => {
        setPrinting(false);
        setDone(true);
        setTimeout(() => {
          setDone(false);
          onClose();
          onComplete?.();
        }, 1200);
      }, 1500);
    } else {
      onClose();
      onComplete?.();
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-[400px]">
      <div className="flex flex-col items-center text-center p-2">
        <ReceiptIllustration />

        <h3 className="text-[17px] font-bold text-[#1E293B] mt-5 mb-1.5">
          Receipt Options
        </h3>
        <p className="text-[13px] text-[#64748B] mb-6">
          Would you like to print a receipt for this transaction?
        </p>

        {done ? (
          <div className="flex items-center gap-2 text-[#22C55E] font-semibold text-[14px] py-2">
            <Check size={18} /> Receipt Printed!
          </div>
        ) : printing ? (
          <div className="flex items-center gap-2 text-[#635BFF] font-semibold text-[14px] py-2">
            <Loader2 size={18} className="animate-spin" /> Printing receipt...
          </div>
        ) : twoOptions ? (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleAction(false)}
              className="flex-1 py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              No, Skip
            </button>
            <button
              onClick={() => handleAction(true)}
              className="flex-1 py-2.5 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5248e5] transition-colors"
            >
              Print
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={() => handleAction(true)}
              className="w-full py-2.5 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5248e5] transition-colors"
            >
              Print
            </button>
            <button
              onClick={() => handleAction(false)}
              className="w-full py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Don't Print
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
