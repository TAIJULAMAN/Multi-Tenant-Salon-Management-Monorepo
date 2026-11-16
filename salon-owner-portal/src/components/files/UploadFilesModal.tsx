import React, { useRef, useState } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import SubmitButton from "@/components/customComponent/SubmitButton";

import { UploadFilesModalProps } from "./types";

export default function UploadFilesModal({ isOpen, onClose, onUpload }: UploadFilesModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleClose = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpload && selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full border-2 border-dashed border-[#A5B4FC] rounded-lg p-10 flex flex-col items-center justify-center gap-4 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <div className="w-14 h-14 bg-[#EEF2FF] rounded-lg flex items-center justify-center pointer-events-none">
            <Upload className="w-6 h-6 text-[#635BFF]" />
          </div>
          <span className="text-[13.5px] font-bold text-[#635BFF] pointer-events-none">Drop here or click to browse</span>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
            <span className="text-[13px] font-bold text-[#1E293B] sticky top-0 bg-white z-10 pb-1">Selected Files ({selectedFiles.length}):</span>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="w-5 h-5 text-[#94A3B8] shrink-0" />
                  <span className="text-[13px] font-medium text-[#1E293B] truncate">{file.name}</span>
                </div>
                <button type="button" onClick={(e) => removeFile(index, e)} className="p-1 hover:bg-[#E2E8F0] rounded-full transition-colors shrink-0">
                  <X className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <SubmitButton type="submit">
            Upload
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
