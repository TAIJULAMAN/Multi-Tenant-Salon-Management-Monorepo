"use client";

import React, { useState } from "react";
import { X, Camera, Upload, Check } from "lucide-react";

interface UpdateClientAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSave: (newUrl: string) => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
];

export default function UpdateClientAvatarModal({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
}: UpdateClientAvatarModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUploadedUrl(url);
      setSelectedAvatar(url);
    }
  };

  const handleSave = () => {
    onSave(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1E293B] font-manrope">
              Update Profile Picture
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Choose a photo or upload from your computer
            </p>
          </div>
        </div>

        {/* Current Preview */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-[#EEF2FF] overflow-hidden shadow-sm relative">
            <img
              src={selectedAvatar}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-bold text-[#64748B] mt-2">
            Selected Preview
          </span>
        </div>

        {/* Upload Button */}
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#CBD5E1] hover:border-[#635BFF] p-3 rounded-xl cursor-pointer text-[13px] font-bold text-[#475569] hover:text-[#635BFF] hover:bg-[#F8FAFC] transition-colors mb-6">
          <Upload size={16} />
          <span>Upload Custom Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Presets */}
        <div className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2.5">
            Or choose an avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedAvatar(url)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all relative ${
                  selectedAvatar === url
                    ? "border-[#635BFF] scale-105 shadow-sm"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`Preset ${i}`}
                  className="w-full h-full object-cover"
                />
                {selectedAvatar === url && (
                  <div className="absolute inset-0 bg-[#635BFF]/30 flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white font-bold text-[13px] rounded-xl shadow-lg shadow-[#635BFF]/20 transition-colors"
          >
            Save Picture
          </button>
        </div>
      </div>
    </div>
  );
}
