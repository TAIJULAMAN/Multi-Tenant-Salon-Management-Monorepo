import React from "react";
import Modal from "@/components/customComponent/Modal";
import { Download } from "lucide-react";
import CancelButton from "@/components/customComponent/CancelButton";
import { DownloadDetailsModalProps } from "./types";

export default function DownloadDetailsModal({ isOpen, onClose, selectedClient }: DownloadDetailsModalProps) {
  if (!selectedClient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Details">
      <div className="space-y-5">
        <p className="text-[13px] text-[#64748B]">
          Download a detailed report for{" "}
          <span className="font-bold text-[#1E293B]">{selectedClient.name}</span>
          .
        </p>
        <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-3">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#64748B] font-medium">Telephone</span>
            <span className="font-bold text-[#1E293B]">
              {selectedClient.telephone}
            </span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#64748B] font-medium">Email</span>
            <span className="font-bold text-[#1E293B]">
              {selectedClient.email}
            </span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#64748B] font-medium">Joined</span>
            <span className="font-bold text-[#1E293B]">
              {selectedClient.createdAt}
            </span>
          </div>
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <CancelButton onClick={onClose} className="px-5 bg-transparent hover:bg-[#F1F5F9]">
            Cancel
          </CancelButton>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#06B6D4] hover:bg-[#0891B2] rounded-lg transition-colors shadow-sm shadow-[#06B6D4]/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
