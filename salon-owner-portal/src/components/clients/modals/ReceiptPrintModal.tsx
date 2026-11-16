"use client";

import React from "react";
import { X, Loader2, Printer } from "lucide-react";

interface ReceiptPrintModalProps {
  isOpen: boolean;
  selectedReceipt: any;
  isPrinting: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export default function ReceiptPrintModal({
  isOpen,
  selectedReceipt,
  isPrinting,
  onClose,
  onPrint,
}: ReceiptPrintModalProps) {
  if (!isOpen || !selectedReceipt) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[400px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            Print Receipt
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPrinting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#635BFF]" />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">
              Printing...
            </h4>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#EEF2FF] text-[#635BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8" />
              </div>
              <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">
                Receipt {selectedReceipt.id}
              </h4>
              <p className="text-[13px] font-medium text-[#64748B]">
                Ready to print receipt for {selectedReceipt.price}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white border border-[#E2E8F0] text-[#1E293B] py-3 rounded-lg text-[14px] font-bold hover:bg-[#F8FAFC] transition-colors shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onPrint}
                className="flex-1 flex items-center justify-center gap-2 bg-[#635BFF] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

