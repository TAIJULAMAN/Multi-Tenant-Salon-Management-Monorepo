"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/customComponent/Modal";

interface UploadClientMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (data: { title: string; file: File | null }) => void;
}

export default function UploadClientMediaModal({
  isOpen,
  onClose,
  onUpload,
}: UploadClientMediaModalProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (onUpload) {
      onUpload({ title, file });
    }
    setTitle("");
    setFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Media" maxWidth="max-w-[500px]">
      <div className="space-y-5">
        <div>
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
          />
        </div>

        <label className="border border-dashed border-[#635BFF] bg-[#F8F9FE] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#EEF2FF] transition-colors group block">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm text-[#635BFF] group-hover:scale-105 transition-transform border border-[#E2E8F0]">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-[13px] font-bold text-[#635BFF]">
            {file ? file.name : "Drop here or click to browse"}
          </p>
        </label>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
          >
            Save Media
          </button>
        </div>
      </div>
    </Modal>
  );
}
