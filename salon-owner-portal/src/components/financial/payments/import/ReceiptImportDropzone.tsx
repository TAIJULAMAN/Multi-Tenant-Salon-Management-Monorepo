"use client";

import React, { useRef } from "react";
import { Download, Upload, File, Trash2, FileText, Eye } from "lucide-react";

interface ReceiptImportDropzoneProps {
  fileName: string | null;
  fileSize: string;
  onFileSelect: (file: globalThis.File) => void;
  onRemoveFile: () => void;
}

export const ReceiptImportDropzone: React.FC<ReceiptImportDropzoneProps> = ({
  fileName,
  fileSize,
  onFileSelect,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-bold text-[#1E293B] block">
          File Upload
        </label>
        <button className="text-[12px] font-bold text-[#635BFF] flex items-center gap-1.5 hover:underline">
          <Download className="w-3.5 h-3.5" />
          <span>Download sample CSV/XLSX template</span>
        </button>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#CBD5E1] hover:border-[#635BFF] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFC]/50 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-[13px] font-bold text-[#1E293B]">
          Drag and drop file here, or{" "}
          <span className="text-[#635BFF]">Browse</span>
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-1">
          Supports CSV, XLSX up to 10MB
        </p>
      </div>

      {fileName && (
        <div className="border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center shrink-0">
              <File className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1E293B] flex items-center gap-2">
                <span>{fileName}</span>
                <span className="text-[11px] font-medium text-[#94A3B8]">
                  ({fileSize})
                </span>
              </div>
              <span className="text-[11px] text-[#10B981] font-semibold">
                Ready for import
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRemoveFile}
              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg hover:bg-[#FEE2E2] transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
