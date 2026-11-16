"use client";

import React, { useEffect, useRef } from "react";
import { IconEye, IconPencil, IconTrash } from "./PreviewCardIcons";

interface PreviewCardDropdownMenuProps {
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function PreviewCardDropdownMenu({
  onViewDetails,
  onEdit,
  onDelete,
  onClose,
}: PreviewCardDropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-7 z-10 bg-white rounded-[12px] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] border border-[#EFF4FA] py-1.5 w-[148px]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onViewDetails?.();
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-manrope text-[#29343D] hover:bg-[#F5F8FB] transition-colors"
      >
        <span className="text-[#29343D]">
          <IconEye />
        </span>
        View details
      </button>
      <button
        onClick={() => {
          onEdit?.();
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-manrope text-[#29343D] hover:bg-[#F5F8FB] transition-colors"
      >
        <span className="text-[#29343D]">
          <IconPencil />
        </span>
        Edit
      </button>
      <button
        onClick={() => {
          onDelete?.();
          onClose();
        }}
        className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm font-manrope text-[#E53535] hover:bg-[#FFF1F1] transition-colors"
      >
        <span className="text-[#E53535]">
          <IconTrash />
        </span>
        Delete
      </button>
    </div>
  );
}
