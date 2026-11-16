import React from "react";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";

export function AddPostHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] bg-white">
      <div className="flex items-center gap-3">
        <h2 className="text-[16px] font-bold text-[#1E293B]">Create Post</h2>
      </div>

      <div className="flex items-center gap-4 relative pr-10">
        <CustomCloseButton 
          onClick={onClose} 
          className="absolute top-1/2 -translate-y-1/2 right-0 text-[#94A3B8] hover:text-[#1E293B] transition-colors"
        />
      </div>
    </div>
  );
}
