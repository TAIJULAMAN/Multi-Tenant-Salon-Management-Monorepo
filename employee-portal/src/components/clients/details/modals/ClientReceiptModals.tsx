"use client";

import React from "react";
import { Printer, Download, Check, Loader2 } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import { ReceiptItem } from "../tabs/ClientFinancialTab";

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptItem | null;
  onPrint: () => void;
  isPrinting: boolean;
}

export function PrintReceiptModal({
  isOpen,
  onClose,
  receipt,
  onPrint,
  isPrinting,
}: PrintReceiptModalProps) {
  if (!receipt) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Print Receipt" maxWidth="max-w-[400px]">
      {isPrinting ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#635BFF]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">Printing...</h4>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#EEF2FF] text-[#635BFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Printer className="w-8 h-8" />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">Receipt {receipt.id}</h4>
            <p className="text-[13px] font-medium text-[#64748B]">Ready to print receipt for {receipt.price}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-[#E2E8F0] text-[#1E293B] py-2.5 rounded-lg text-[14px] font-bold hover:bg-[#F8FAFC] transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onPrint}
              className="flex-1 flex items-center justify-center gap-2 bg-[#635BFF] text-white py-2.5 rounded-lg text-[14px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

interface PrintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrintSuccessModal({ isOpen, onClose }: PrintSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-[400px]">
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-[#10B981] stroke-[3]" />
        </div>
        <h4 className="text-[20px] font-bold text-[#1E293B] mb-2 font-manrope">Printed Successfully</h4>
        <p className="text-[13px] font-medium text-[#64748B] mb-8">Your receipt has been printed successfully.</p>
        <button
          onClick={onClose}
          className="w-full bg-[#635BFF] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

interface DownloadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptItem | null;
  onDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
}

export function DownloadReceiptModal({
  isOpen,
  onClose,
  receipt,
  onDownload,
  isDownloading,
  downloadSuccess,
}: DownloadReceiptModalProps) {
  if (!receipt) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Receipt" maxWidth="max-w-[400px]">
      {isDownloading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#635BFF]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">Downloading...</h4>
        </div>
      ) : downloadSuccess ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h4 className="text-[18px] font-bold text-[#1E293B] mb-1 font-manrope">Downloaded!</h4>
          <p className="text-[13px] font-medium text-[#64748B]">Receipt {receipt.id} saved to your device.</p>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#EEF2FF] text-[#635BFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8" />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B] mb-1">Receipt {receipt.id}</h4>
            <p className="text-[13px] font-medium text-[#64748B]">Download PDF receipt for {receipt.price}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-[#E2E8F0] text-[#1E293B] py-2.5 rounded-lg text-[14px] font-bold hover:bg-[#F8FAFC] transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-[#635BFF] text-white py-2.5 rounded-lg text-[14px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
