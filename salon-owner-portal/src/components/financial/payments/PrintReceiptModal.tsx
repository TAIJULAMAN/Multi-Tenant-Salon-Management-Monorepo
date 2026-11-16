import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "received" | "not_received";
  onPrint: () => void;
}

export default function PrintReceiptModal({ isOpen, onClose, status, onPrint }: PrintReceiptModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsPrinting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      onPrint();
      onClose();
    }, 1500); // Simulate 1.5 seconds of printing
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-[550px] shadow-xl p-8 relative animate-in zoom-in-95 duration-200">

        <h2 className="text-[20px] font-bold text-[#1E293B] mb-6 font-manrope">Print Receipt</h2>

        <p className="text-[14px] font-medium text-[#475569] mb-10 leading-relaxed">
          {status === "not_received"
            ? "The online payment has not been received yet, do you want to print anyway?"
            : "The online payment has been correctly received, do you want to proceed printing and sending the copy to the client?"
          }
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPrinting}
            className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-[#635BFF] px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors disabled:opacity-50 min-w-[120px] justify-center"
          >
            {isPrinting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPrinting ? "Printing..." : status === "not_received" ? "Print Now" : "Print and Send Copy"}
          </button>
        </div>

      </div>
    </div>
  );
}
