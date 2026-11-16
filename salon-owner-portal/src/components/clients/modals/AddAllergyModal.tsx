"use client";

import React from "react";
import { X, ChevronDown } from "lucide-react";

interface AddAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAllergyModal({
  isOpen,
  onClose,
}: AddAllergyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            Add Allergie
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
              placeholder="e.g. Fragrances Allergie"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              placeholder="Enter allergie details..."
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
              Severity *
            </label>
            <div className="relative">
              <select
                defaultValue=""
                className="appearance-none w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all bg-white pr-10"
              >
                <option value="" disabled>
                  Select severity...
                </option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
            >
              Save Allergie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

