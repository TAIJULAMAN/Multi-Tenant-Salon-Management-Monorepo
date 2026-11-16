"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  itemType?: string;
}

export function BulkDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  count,
  itemType = "media items",
}: BulkDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 mt-2">
          <Trash2 size={26} />
        </div>

        <h3 className="text-xl font-bold text-[#1E293B] mb-2 font-manrope">
          Mass Deletion
        </h3>
        <p className="text-[13px] text-[#64748B] mb-6 px-4 leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <strong className="text-[#1E293B]">{count}</strong> {itemType}? This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-[13px] rounded-xl shadow-lg shadow-rose-500/20 transition-colors"
          >
            Delete {count} Items
          </button>
        </div>
      </div>
    </div>
  );
}
