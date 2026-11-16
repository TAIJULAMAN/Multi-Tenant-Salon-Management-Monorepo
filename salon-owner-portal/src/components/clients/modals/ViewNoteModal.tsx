"use client";

import React from "react";
import { X, FileText, Eye, Download } from "lucide-react";
import { ClientNote } from "@/components/clients/data";

interface ViewNoteModalProps {
  isOpen: boolean;
  selectedNote: ClientNote | null;
  onClose: () => void;
}

export default function ViewNoteModal({
  isOpen,
  selectedNote,
  onClose,
}: ViewNoteModalProps) {
  if (!isOpen || !selectedNote) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            View Note
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Title
            </label>
            <p className="text-[14px] font-bold text-[#1E293B]">
              {selectedNote.title}
            </p>
            {selectedNote.date && (
              <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                Recorded on {selectedNote.date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Description
            </label>
            <p className="text-[13px] font-medium text-[#64748B] leading-[1.6]">
              {selectedNote.description}
            </p>
          </div>

          {selectedNote.attachmentName && (
            <div>
              <label className="block text-[12px] font-bold text-[#1E293B] mb-3">
                Attachments
              </label>
              <div className="border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#635BFF] border border-[#E2E8F0] shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#635BFF]">
                      {selectedNote.attachmentName}
                    </h4>
                    <p className="text-[11px] font-medium text-[#94A3B8]">
                      Document
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#635BFF] flex items-center justify-center hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-[#F8FAFC] text-[#635BFF] flex items-center justify-center hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

