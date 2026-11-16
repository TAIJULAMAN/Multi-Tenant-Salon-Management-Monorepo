"use client";

import React from "react";
import { CheckCircle, X } from "lucide-react";

interface SettingsSavedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSavedModal({
  isOpen,
  onClose,
}: SettingsSavedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#1E293B] cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>
        <div className="w-16 h-16 rounded-full bg-[#EBFAF0] flex items-center justify-center mb-4">
          <CheckCircle className="text-[#36C76C]" size={32} />
        </div>
        <h3 className="text-[#29343D] text-lg font-bold font-manrope mb-2">
          Settings Saved
        </h3>
        <p className="text-[#64748B] text-sm font-manrope text-center mb-6">
          Your general settings have been updated successfully.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#635BFF] hover:bg-[#4f49e0] transition-colors text-white text-sm font-semibold font-manrope py-3 rounded-xl cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

