"use client";

import React from "react";
import { File, Eye, Trash2, Download, UploadCloud } from "lucide-react";

export default function ContractAttachmentSection() {
  return (
    <>
      {/* Contract Attachments */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold text-[#1E293B] mb-4">
          Contract Attachments
        </h2>
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
          <div className="border border-[#E2E8F0] rounded-[16px] p-6 flex flex-col items-center text-center bg-[#F8FAFC] w-full max-w-[280px]">
            <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-4">
              <File className="w-6 h-6 text-[#635BFF]" />
            </div>
            <h4 className="text-[14px] font-bold text-[#1E293B] mb-1">
              Chamber of commerce certificate
            </h4>
            <p className="text-[12px] font-medium text-[#94A3B8] mb-1">
              PDF - 2.1 MB
            </p>
            <p className="text-[12px] font-medium text-[#94A3B8] mb-6">
              Updated: March 15, 2024
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#F43F5E] flex items-center justify-center hover:bg-[#FCE7F3] transition-colors"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#475569] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors"
                title="Download document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Requirement */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold text-[#1E293B] mb-4">
          Attachment Requirement
        </h2>
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
          <label className="block text-[13px] font-medium text-[#1E293B] mb-2">
            Requirement 1 *
          </label>
          <div className="border border-dashed border-[#CBD5E1] rounded-[16px] p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8FAFC] transition-colors">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#635BFF] mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-[14px] font-medium text-[#635BFF]">
              Drop here or click to browse
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
