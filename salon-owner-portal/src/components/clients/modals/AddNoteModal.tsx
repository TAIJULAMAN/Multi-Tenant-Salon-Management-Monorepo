"use client";

import React from "react";
import { X, Plus } from "lucide-react";

interface AddNoteModalProps {
  isOpen: boolean;
  newNoteTitle: string;
  setNewNoteTitle: (val: string) => void;
  newNoteDescription: string;
  setNewNoteDescription: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function AddNoteModal({
  isOpen,
  newNoteTitle,
  setNewNoteTitle,
  newNoteDescription,
  setNewNoteDescription,
  onClose,
  onSave,
}: AddNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            Add Note
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Title *
            </label>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              value={newNoteDescription}
              onChange={(e) => setNewNoteDescription(e.target.value)}
              placeholder="Enter note"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all resize-none"
            />
          </div>

          <div className="border border-dashed border-[#635BFF] bg-[#F8F9FE] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#EEF2FF] transition-colors group">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm text-[#635BFF] group-hover:scale-105 transition-transform border border-[#E2E8F0]">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-[13px] font-bold text-[#635BFF]">
              Drop here or click to browse
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

