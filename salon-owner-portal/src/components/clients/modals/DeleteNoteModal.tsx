"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import { ClientNote } from "@/components/clients/data";

interface DeleteNoteModalProps {
  isOpen: boolean;
  selectedNoteForDelete: ClientNote | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export default function DeleteNoteModal({
  isOpen,
  selectedNoteForDelete,
  onClose,
  onConfirmDelete,
}: DeleteNoteModalProps) {
  if (!isOpen || !selectedNoteForDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[440px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-[17px] font-bold text-[#1E293B] mb-2 font-manrope">
            Delete Note?
          </h3>
          <p className="text-[13px] text-[#64748B] leading-relaxed">
            Are you sure you want to delete note{" "}
            <span className="font-bold text-[#1E293B]">
              "{selectedNoteForDelete.title}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="px-6 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm shadow-[#EF4444]/20 cursor-pointer"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}

