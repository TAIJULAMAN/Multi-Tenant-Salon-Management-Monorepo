"use client";

import React, { useState } from "react";
import { X, Twitter, Facebook, Instagram, Linkedin, Hash, Youtube, Check } from "lucide-react";
import Modal from "@/components/customComponent/Modal";

interface ConnectSocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS = [
  { id: "tw", name: "X (Twitter)", icon: <Twitter className="w-5 h-5" />, color: "bg-black", textColor: "text-white" },
  { id: "fb", name: "Facebook", icon: <Facebook className="w-5 h-5" />, color: "bg-[#1877F2]", textColor: "text-white" },
  { id: "ig", name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "bg-gradient-to-tr from-[#FFD600] via-[#FF0100] to-[#D500BA]", textColor: "text-white" },
  { id: "in", name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "bg-[#0A66C2]", textColor: "text-white" },
  { id: "tk", name: "TikTok", icon: <Hash className="w-5 h-5" />, color: "bg-black", textColor: "text-white" },
  { id: "yt", name: "YouTube", icon: <Youtube className="w-5 h-5" />, color: "bg-[#FF0000]", textColor: "text-white" },
];

export default function ConnectSocialMediaModal({ isOpen, onClose }: ConnectSocialMediaModalProps) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(["tw", "fb", "ig", "in"]);

  if (!isOpen) return null;

  const toggleConnection = (id: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Social Media" maxWidth="max-w-md">
      <p className="text-[13px] text-[#64748B] mb-6">
        Connect your social media accounts to manage posts, media, and analytics directly from the dashboard.
      </p>

      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const isConnected = connectedPlatforms.includes(platform.id);
          return (
            <div
              key={platform.id}
              className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${platform.color} ${platform.textColor}`}>
                  {platform.icon}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1E293B]">{platform.name}</h4>
                  <p className="text-[12px] text-[#94A3B8] font-medium">
                    {isConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleConnection(platform.id)}
                className={`px-4 py-2 text-[12px] font-bold rounded-lg transition-colors ${
                  isConnected
                    ? "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    : "bg-[#635BFF] text-white hover:bg-[#524be0]"
                }`}
              >
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] rounded-lg text-[13px] font-bold transition-colors"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
