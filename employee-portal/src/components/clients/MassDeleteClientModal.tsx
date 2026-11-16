import React from "react";
import Modal from "@/components/customComponent/Modal";
import CancelButton from "@/components/customComponent/CancelButton";
import { MassDeleteClientModalProps } from "./types";

export default function MassDeleteClientModal({
  isOpen,
  onClose,
  selectedCount,
  onConfirm,
}: MassDeleteClientModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mass Deletion">
      <div className="space-y-4 text-center pb-2">
        <h3 className="text-xl font-bold text-[#1E293B] font-manrope">
          Are you sure?
        </h3>
        <p className="text-[13px] text-[#64748B] px-2 font-medium leading-relaxed">
          This will permanently delete{" "}
          <span className="font-bold text-[#1E293B]">
            {selectedCount} selected {selectedCount === 1 ? "client" : "clients"}
          </span>
          . This action cannot be undone.
        </p>
        <div className="pt-6 flex items-center justify-center gap-3">
          <CancelButton onClick={onClose} className="px-6 py-2.5">
            Cancel
          </CancelButton>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </Modal>
  );
}
