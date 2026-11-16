import React from "react";
import { Upload, Plus } from "lucide-react";

import { TopActionButtonsProps } from "./types";

export default function TopActionButtons({ setIsUploadOpen, setIsCreateFolderOpen }: TopActionButtonsProps) {
  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => setIsUploadOpen(true)}
        className="bg-[#635BFF] hover:bg-[#524be0] text-white rounded-lg p-4 flex flex-col justify-between gap-5 w-40 shadow-sm transition-colors items-start text-left"
      >
        <Upload className="w-5 h-5" />
        <span className="font-bold text-[14px]">Upload</span>
      </button>
      <button
        onClick={() => setIsCreateFolderOpen(true)}
        className="bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#635BFF] rounded-lg p-4 flex flex-col justify-between gap-5 w-40 transition-colors items-start text-left"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold text-[14px]">Create Folder</span>
      </button>
    </div>
  );
}
