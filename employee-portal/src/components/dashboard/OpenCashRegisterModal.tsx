import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomTextarea from "@/components/customComponent/CustomTextarea";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { OpenCashRegisterModalProps } from "./types";

export default function OpenCashRegisterModal({ isOpen, onClose, onConfirm }: OpenCashRegisterModalProps) {
  const [balance, setBalance] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open Cash Register" maxWidth="max-w-xl">
      <div className="pt-2 pb-2">
        <p className="text-[13px] text-[#94A3B8] font-medium mb-6">
          Enter the initial cash balance to start today's session.
        </p>
        <div className="mb-6">
          <CustomInput
            label="Opening Balance (optional)"
            value={balance}
            onChange={setBalance}
            placeholder="Enter balance"
          />
        </div>
        <div className="mb-8">
          <CustomTextarea
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
            placeholder="Add a note"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <CancelButton onClick={onClose} />
          <SubmitButton onClick={onConfirm}>
            Open Cash Register
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
