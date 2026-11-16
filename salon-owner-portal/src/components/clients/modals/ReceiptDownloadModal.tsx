"use client";

import React from "react";
import { X, Loader2, Check, FileText, Download } from "lucide-react";

interface ReceiptDownloadModalProps {
  isOpen: boolean;
  selectedReceipt: any;
  isDownloading: boolean;
  downloadSuccess: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function ReceiptDownloadModal({
  isOpen,
  selectedReceipt,
  isDownloading,
  downloadSuccess,
  onClose,
  onDownload,
}: ReceiptDownloadModalProps) {
  if (!isOpen || !selectedReceipt) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[400px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            Download Receipt
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDownloading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">
              Downloading...
            </h4>
          </div>
        ) : downloadSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-[#10B981] stroke-[3]" />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">
              Done!
            </h4>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">
                Receipt {selectedReceipt.id}
              </h4>
              <p className="text-[13px] font-medium text-[#64748B]">
                Download PDF receipt for {selectedReceipt.price}
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
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-[#16A34A] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-[#15803d] transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

