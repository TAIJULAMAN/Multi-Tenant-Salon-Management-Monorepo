import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";

import { RenameModalProps } from "./types";

export default function RenameModal({ isOpen, onClose, selectedItemName }: RenameModalProps) {
  const [newName, setNewName] = useState(selectedItemName);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#1E293B]">New Name <span className="text-[#1E293B]">*</span></label>
          <CustomInput
            value={newName}
            onChange={setNewName}
            placeholder="Enter new name"
          />
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <CancelButton onClick={onClose} />
          <SubmitButton onClick={onClose} type="button">
            Save Changes
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
