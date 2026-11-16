"use client";

import React, { useState } from "react";
import {
  X,
  Globe,
  Share2,
  Calendar,
  Download,
  Check,
  Sparkles,
} from "lucide-react";

interface UseMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
}

export function UseMediaModal({
  isOpen,
  onClose,
  selectedCount,
}: UseMediaModalProps) {
  const [destination, setDestination] = useState<
    "social" | "story" | "download"
  >("social");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Instagram",
    "Facebook",
  ]);
  const [caption, setCaption] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-[#E2E8F0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1E293B] font-manrope">
              Use Selected Media
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Publish or export {selectedCount} selected media{" "}
              {selectedCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="text-[16px] font-bold text-[#1E293B]">
              Media Action Queued!
            </h4>
            <p className="text-[13px] text-[#64748B]">
              Your content is being processed.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Action destination */}
            <div>
              <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
                What do you want to do?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDestination("social")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    destination === "social"
                      ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF] font-bold"
                      : "border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] font-medium"
                  }`}
                >
                  <Share2 className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[12px]">Post to Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDestination("story")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    destination === "story"
                      ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF] font-bold"
                      : "border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] font-medium"
                  }`}
                >
                  <Calendar className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[12px]">Schedule Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDestination("download")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    destination === "download"
                      ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF] font-bold"
                      : "border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] font-medium"
                  }`}
                >
                  <Download className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[12px]">Export ZIP</span>
                </button>
              </div>
            </div>

            {/* Social channels */}
            {destination !== "download" && (
              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
                  Select Channels
                </label>
                <div className="flex gap-2">
                  {["Instagram", "Facebook", "TikTok"].map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
                          isSelected
                            ? "bg-[#635BFF] text-white border-[#635BFF]"
                            : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
                        }`}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Caption */}
            {destination !== "download" && (
              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                  Caption / Note
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a salon post caption or styling description..."
                  rows={3}
                  className="w-full text-[13px] border border-[#E2E8F0] rounded-xl p-3 focus:outline-none focus:border-[#635BFF]"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white font-bold text-[13px] rounded-xl shadow-lg shadow-[#635BFF]/20 transition-colors"
              >
                {destination === "download"
                  ? "Download Now"
                  : "Proceed & Publish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
