"use client";

import React from "react";
import { Paperclip, X } from "lucide-react";
import { SupportAttachmentUploadProps } from "./types";

export default function SupportAttachmentUpload({
  attachment,
  onFileSelect,
}: SupportAttachmentUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">
        Screenshot or Documents (Optional)
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-lg text-sm font-semibold text-[#475569] transition-colors w-full sm:w-auto">
          <Paperclip className="w-4 h-4 text-[#64748B]" />
          <span>Upload file</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx"
          />
        </label>
        {attachment ? (
          <div className="flex items-center justify-between gap-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg py-2 px-3 text-xs font-medium text-[#475569] animate-fadeIn w-full sm:w-auto">
            <span className="truncate max-w-[200px] sm:max-w-[150px]">{attachment.name}</span>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-[#EF4444] hover:text-red-700 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-[#94A3B8]">Supports PNG, JPG, PDF up to 5MB</span>
        )}
      </div>
    </div>
  );
}
