import React from "react";
import Modal from "@/components/customComponent/Modal";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";

import { DownloadModalProps } from "./types";

export default function DownloadModal({ isOpen, onClose, selectedItemName }: DownloadModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download">
      <div className="flex flex-col gap-6 pt-2">
        <p className="text-[#64748B] text-[13px] font-medium leading-relaxed">
          Do you want to download <span className="font-bold text-[#1E293B]">{selectedItemName}</span> to your device?
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <CancelButton onClick={onClose} />
          <SubmitButton onClick={onClose} type="button">
            Download
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
