"use client";

import React from "react";
import Modal from "@/components/customComponent/Modal";

interface CustomExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function CustomExportModal({ 
  isOpen, 
  onClose,
  title = "Export Data",
  description = "Choose the format to export your data."
}: CustomExportModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-[13px] text-[#64748B]">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-2 p-4 border border-[#E2E8F0] rounded-lg hover:border-[#635BFF] hover:bg-[#EEF2FF] transition-all text-[#1E293B]"
          >
            <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#635BFF] flex items-center justify-center">
              <span className="font-bold text-sm">CSV</span>
            </div>
            <span className="text-[13px] font-bold">Export as CSV</span>
          </button>
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-2 p-4 border border-[#E2E8F0] rounded-lg hover:border-[#10B981] hover:bg-[#ECFDF5] transition-all text-[#1E293B]"
          >
            <div className="w-10 h-10 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center">
              <span className="font-bold text-sm">PDF</span>
            </div>
            <span className="text-[13px] font-bold">Export as PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
