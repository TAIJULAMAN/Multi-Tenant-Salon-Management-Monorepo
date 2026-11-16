import React from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomFileUpload from "@/components/customComponent/CustomFileUpload";
import SubmitButton from "@/components/customComponent/SubmitButton";

interface UploadAttachmentModalProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (isOpen: boolean) => void;
  newAttachmentName: string;
  setNewAttachmentName: (name: string) => void;
  selectedFile: File | null;
  handleFileSelect: (file: File) => void;
  handleUploadDocument: () => void;
}

export default function UploadAttachmentModal({
  isUploadModalOpen,
  setIsUploadModalOpen,
  newAttachmentName,
  setNewAttachmentName,
  selectedFile,
  handleFileSelect,
  handleUploadDocument,
}: UploadAttachmentModalProps) {
  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => setIsUploadModalOpen(false)}
      title="Attachment To Contract"
      maxWidth="max-w-[500px]"
    >
      <div className="space-y-6 pt-2">
        <CustomInput
          label="Name *"
          placeholder="Enter name"
          value={newAttachmentName}
          onChange={(val) => setNewAttachmentName(val)}
        />

        <div>
          <CustomFileUpload
            label=""
            onFileSelect={handleFileSelect}
          />
          {selectedFile && (
            <p className="text-[13px] font-medium text-[#635BFF] mt-3 text-center">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <SubmitButton onClick={handleUploadDocument}>
            Upload Document
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
