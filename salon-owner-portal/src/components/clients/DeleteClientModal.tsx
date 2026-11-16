import React from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import CancelButton from "@/components/customComponent/CancelButton";
import { DeleteClientModalProps } from "./types";

export default function DeleteClientModal({ isOpen, onClose, selectedClient }: DeleteClientModalProps) {
  if (!selectedClient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Client">
      <div className="space-y-4 text-center pb-2">
        <h3 className="text-xl font-bold text-[#1E293B] font-manrope">
          Are you sure?
        </h3>
        <p className="text-[13px] text-[#64748B] px-2 font-medium leading-relaxed">
          This will permanently delete the client{" "}
          <span className="font-bold text-[#1E293B]">{selectedClient.name}</span>
          . This action cannot be undone.
        </p>
        <div className="pt-6 flex items-center justify-center gap-3">
          <CancelButton onClick={onClose} className="px-6 py-2.5">
            Cancel
          </CancelButton>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20 rounded-lg transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
