"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import ReceiptIllustration from "../icons/ReceiptIllustration";
import { PrintReceiptModalProps } from "../types";

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
        }, 1600);
      }, 1500);
    } else {
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
        onComplete?.();
      }, 1600);
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} title="Print Receipt" maxWidth="max-w-[420px]">
      <div className="p-4 flex flex-col items-center text-center">
        {printing ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#E0E7FF] flex items-center justify-center mb-4">
              <Loader2 size={32} className="animate-spin text-[#635BFF]" />
            </div>
            <p className="text-base font-bold text-[#29343D]">Printing...</p>
          </>
        ) : done ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#DDDBFF] flex items-center justify-center mb-4">
              <Check size={28} color="#635BFF" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-[#29343D]">Done!</p>
          </>
        ) : (
          <>
            <div className="mb-5">
              <ReceiptIllustration />
            </div>
            <p className="text-base font-bold text-[#29343D] mb-1">Print Receipt</p>

            {twoOptions ? (
              <>
                <p className="text-xs text-[#98A4AE] mb-6">
                  Online payment is part of this transaction. Choose what to print now.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => handleAction(true)}
                    className="flex-1 py-2.5 border border-[#E0E6EB] rounded-lg text-xs font-semibold text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                  >
                    Entirely (Including what will be paid later)
                  </button>
                  <button
                    onClick={() => handleAction(true)}
                    className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Print online payment part once received
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-[#98A4AE] mb-6">
                  Would you like to print a receipt?
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => handleAction(false)}
                    className="flex-1 py-2.5 border border-[#E0E6EB] rounded-lg text-sm font-semibold text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                  >
                    No Print
                  </button>
                  <button
                    onClick={() => handleAction(true)}
                    className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Print Now
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
export { PrintReceiptModal };
