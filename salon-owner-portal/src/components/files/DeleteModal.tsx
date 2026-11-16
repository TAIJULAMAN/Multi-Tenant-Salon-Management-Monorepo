import React from "react";
import Modal from "@/components/customComponent/Modal";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";

import { DeleteModalProps } from "./types";

export default function DeleteModal({ isOpen, onClose, selectedItemName }: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete">
      <div className="flex flex-col gap-6 pt-2">
        <p className="text-[#64748B] text-[13px] font-medium leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-[#1E293B]">{selectedItemName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <CancelButton onClick={onClose} />
          <SubmitButton onClick={onClose} className="!bg-[#EF4444] hover:!bg-[#DC2626] !shadow-[#EF4444]/20" type="button">
            Yes, Delete
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
