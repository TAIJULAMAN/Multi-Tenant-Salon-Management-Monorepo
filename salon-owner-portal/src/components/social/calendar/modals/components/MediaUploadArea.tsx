import React from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

export function MediaUploadArea({ 
  uploadedMediaUrl, 
  setUploadedMediaUrl, 
  fileInputRef, 
  handleFileChange 
}: {
  uploadedMediaUrl: string | null;
  setUploadedMediaUrl: (url: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mt-3 mb-5">
      {uploadedMediaUrl ? (
        <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm group">
          <Image
            src={uploadedMediaUrl}
            alt="Upload"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setUploadedMediaUrl(null)}
              className="bg-white hover:bg-red-50 text-red-500 rounded-full p-2.5 shadow-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-[140px] h-[140px] rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 hover:bg-[#F1F5F9] hover:border-[#94A3B8] transition-colors cursor-pointer"
        >
          <ImageIcon className="w-7 h-7 text-[#94A3B8]" />
          <span className="text-[13px] font-semibold text-[#64748B] text-center leading-tight">
            Drag & drop or
            <br />
            <span className="text-[#635BFF]">select a file</span>
          </span>
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />
    </div>
  );
}
