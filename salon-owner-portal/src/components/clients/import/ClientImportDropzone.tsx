"use client";

import React, { useRef, useState } from "react";
import { Download, UploadCloud, FileText, Trash2 } from "lucide-react";

interface ClientImportDropzoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
}

export const ClientImportDropzone: React.FC<ClientImportDropzoneProps> = ({
  selectedFile,
  onFileSelect,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDropzone(true);
  };

  const handleDragLeave = () => {
    setIsHoveringDropzone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDropzone(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-[14px] font-bold text-[#1E293B]">
          File Upload
        </label>
        <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#635BFF] hover:underline self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Download sample CSV/XLSX template</span>
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isHoveringDropzone
            ? "border-[#635BFF] bg-[#EEF2FF]/40"
            : "border-[#CBD5E1] bg-[#F8FAFC]/50 hover:border-[#635BFF]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".csv, .xlsx, .xls"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-[13px] font-bold text-[#1E293B] text-center">
          Drag and drop file here, or{" "}
          <span className="text-[#635BFF]">Browse</span>
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-1 text-center">
          Supports CSV, XLSX up to 10MB
        </p>
      </div>

      {selectedFile && (
        <div className="border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1E293B] flex items-center gap-2">
                <span>{selectedFile.name}</span>
                <span className="text-[11px] font-medium text-[#94A3B8]">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <span className="text-[11px] text-[#10B981] font-semibold">
                Ready for import
              </span>
            </div>
          </div>
          <button
            onClick={onRemoveFile}
            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg hover:bg-[#FEE2E2] transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
