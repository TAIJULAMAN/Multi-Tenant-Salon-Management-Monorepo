"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon, FileText } from "lucide-react";

interface CustomFileUploadProps {
  label?: string;
  accept?: string;
  icon?: React.ReactNode;
  onFileSelect?: (file: File) => void;
  selectedFile?: File | null;
  previewUrl?: string | null;
  onRemoveFile?: () => void;
  hintText?: string;
  className?: string;
}

export default function CustomFileUpload({
  label,
  accept,
  icon,
  onFileSelect,
  selectedFile: controlledFile,
  previewUrl: controlledPreview,
  onRemoveFile,
  hintText,
  className = "",
}: CustomFileUploadProps) {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentFile = controlledFile !== undefined ? controlledFile : internalFile;
  const currentPreview = controlledPreview !== undefined ? controlledPreview : internalPreview;

  const handleFile = (file: File) => {
    if (controlledFile === undefined) {
      setInternalFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setInternalPreview(url);
      } else {
        setInternalPreview(null);
      }
    }
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (controlledFile === undefined) {
      if (internalPreview) {
        URL.revokeObjectURL(internalPreview);
      }
      setInternalFile(null);
      setInternalPreview(null);
    }
    if (onRemoveFile) {
      onRemoveFile();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
          {label}
        </label>
      )}

      {currentFile ? (
        <div className="relative border border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC] flex items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            {currentPreview ? (
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0 bg-white shadow-sm">
                <img
                  src={currentPreview}
                  alt={currentFile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] shrink-0 flex items-center justify-center text-[#635BFF]">
                {currentFile.type.startsWith("image/") ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#1E293B] truncate">
                {currentFile.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-[#94A3B8]">
                  {formatFileSize(currentFile.size)}
                </span>
                <span className="text-[#E2E8F0]">•</span>
                <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-[12px] font-bold text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`relative border-2 border-dashed rounded-xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-[#635BFF] bg-[#EEF2FF]"
              : "border-[#818CF8]/50 hover:border-[#635BFF] bg-[#F8FAFF] hover:bg-[#F0F5FF]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-[#E0E7FF] flex items-center justify-center mb-3 pointer-events-none transition-transform group-hover:scale-105">
            {icon || <Upload className="w-6 h-6 text-[#635BFF]" />}
          </div>
          <p className="text-[13px] font-bold text-[#635BFF] pointer-events-none text-center">
            Drop here or click to browse
          </p>
          {hintText && (
            <p className="text-[11px] text-[#94A3B8] font-medium mt-1 pointer-events-none text-center">
              {hintText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
