import React from "react";
import { createPortal } from "react-dom";
import { Globe, Trash2, X } from "lucide-react";

interface GridMassActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  onUseMedia: () => void;
}

export function GridMassActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
  onDelete,
  onUseMedia
}: GridMassActionsProps) {
  if (selectedCount === 0 || typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E2E8F0] px-4 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 pr-4 border-r border-[#E2E8F0]">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EEF2FF] text-[#635BFF] text-[12px] font-bold">
          {selectedCount}
        </span>
        <span className="text-[14px] font-bold text-[#1E293B]">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 text-[13px] font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
        >
          {selectedCount === totalCount ? "Unselect All" : "Select All"}
        </button>
        <button
          onClick={onUseMedia}
          className="px-4 py-2 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] text-[13px] font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          Use Media
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-[#FFF1F2] text-[#F43F5E] hover:bg-[#FFE4E6] text-[13px] font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected
        </button>
        <button
          onClick={onClear}
          className="ml-2 p-1.5 text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
