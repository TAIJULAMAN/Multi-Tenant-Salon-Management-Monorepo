import React, { useState, useRef } from "react";
import { Plus, Inbox, File, Eye, Trash2, Download } from "lucide-react";
import UploadAttachmentModal from "./UploadAttachmentModal";
import { ContractAttachment } from "./types";

interface ContractAttachmentsProps {
  contractAttachments: ContractAttachment[];
  setContractAttachments: (attachments: ContractAttachment[]) => void;
}

export default function ContractAttachments({
  contractAttachments,
  setContractAttachments,
}: ContractAttachmentsProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setNewAttachmentName("");
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUploadDocument = () => {
    if (!newAttachmentName || !selectedFile) return;

    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1);

    setContractAttachments([
      ...contractAttachments,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newAttachmentName,
        type: selectedFile.name.split('.').pop()?.toUpperCase() || "DOC",
        size: `${sizeInMB} MB`,
        updatedAt: date,
        file: selectedFile
      }
    ]);

    setIsUploadModalOpen(false);
    setNewAttachmentName("");
    setSelectedFile(null);
  };

  const handleViewAttachment = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const handleDownloadAttachment = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-medium text-[#1E293B]">Contract Attachments</h3>
          {contractAttachments.length > 0 && (
            <button
              onClick={openUploadModal}
              className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Attachment to contract
            </button>
          )}
        </div>

        {contractAttachments.length === 0 ? (
          <div className="border border-[#E2E8F0] rounded-[16px] py-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 text-[#475569]">
              <Inbox className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <h4 className="text-[14px] font-medium text-[#1E293B] mb-4">No files added</h4>
            <button
              onClick={openUploadModal}
              className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-5 py-2.5 rounded-lg font-medium text-[13px] flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add contract attachments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractAttachments.map((attachment) => (
              <div key={attachment.id} className="border border-[#E2E8F0] rounded-[16px] p-6 flex flex-col items-center text-center bg-white shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-4">
                  <File className="w-6 h-6 text-[#635BFF]" />
                </div>
                <h4 className="text-[14px] font-bold text-[#1E293B] mb-1">{attachment.name}</h4>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-1">{attachment.type} - {attachment.size}</p>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-6">Updated: {attachment.updatedAt}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => attachment.file && handleViewAttachment(attachment.file)}
                    className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setContractAttachments(contractAttachments.filter(a => a.id !== attachment.id))}
                    className="w-10 h-10 rounded-lg bg-[#FDF2F8] text-[#F43F5E] flex items-center justify-center hover:bg-[#FCE7F3] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => attachment.file && handleDownloadAttachment(attachment.file)}
                    className="w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#475569] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UploadAttachmentModal
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
        newAttachmentName={newAttachmentName}
        setNewAttachmentName={setNewAttachmentName}
        selectedFile={selectedFile}
        handleFileSelect={handleFileSelect}
        handleUploadDocument={handleUploadDocument}
      />
    </>
  );
}
