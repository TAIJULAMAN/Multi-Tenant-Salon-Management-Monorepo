import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";

import { CreateFolderModalProps } from "./types";

export default function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Folder">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#1E293B]">Name <span className="text-[#1E293B]">*</span></label>
          <CustomInput
            value={folderName}
            onChange={setFolderName}
            placeholder="Enter name"
          />
        </div>
        <div className="pt-2 flex justify-end">
          <SubmitButton onClick={onClose} type="button">
            Save
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
