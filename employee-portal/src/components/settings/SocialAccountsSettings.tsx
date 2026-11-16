"use client";

import React, { useState } from "react";
import { Facebook, Instagram, Music } from "lucide-react";
import SocialConnectModal from "./SocialConnectModal";
import { DEFAULT_SOCIAL_CONNECTIONS } from "./data";

export default function SocialAccountsSettings() {
  const [connections, setConnections] = useState(DEFAULT_SOCIAL_CONNECTIONS);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    platform: string;
    action: "connect" | "disconnect" | null;
    platformKey: keyof typeof connections | null;
  }>({
    isOpen: false,
    platform: "",
    action: null,
    platformKey: null,
  });

  const toggleConnection = (platform: keyof typeof connections) => {
    setConnections((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleActionClick = (platformName: string, platformKey: keyof typeof connections) => {
    const isCurrentlyConnected = connections[platformKey];
    setModalState({
      isOpen: true,
      platform: platformName,
      action: isCurrentlyConnected ? "disconnect" : "connect",
      platformKey,
    });
  };

  const handleConfirm = () => {
    if (modalState.platformKey) {
      toggleConnection(modalState.platformKey);
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm">
      <h2 className="text-lg font-bold text-[#1E293B] mb-6">Social Media Accounts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facebook */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#E2E8F0] rounded-lg gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-[#1877F2] shrink-0">
              <Facebook className="w-5 h-5" fill="currentColor" />
            </div>
            <span className="font-bold text-sm text-[#1E293B]">Facebook</span>
            {connections.facebook ? (
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold rounded-lg whitespace-nowrap">Connected</span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-bold rounded-lg whitespace-nowrap">Not Connected</span>
            )}
          </div>
          <button
            onClick={() => handleActionClick("Facebook", "facebook")}
            className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              connections.facebook
                ? "bg-[#FFE4E6] text-[#FF4C6A] hover:bg-[#FECDD3]"
                : "bg-[#E0E7FF] text-[#635BFF] hover:bg-[#C7D2FE]"
            }`}
          >
            {connections.facebook ? "Disconnect" : "Connect"}
          </button>
        </div>

        {/* Instagram */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#E2E8F0] rounded-lg gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-[#E4405F] shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-[#1E293B]">Instagram</span>
            {connections.instagram ? (
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold rounded-lg whitespace-nowrap">Connected</span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-bold rounded-lg whitespace-nowrap">Not Connected</span>
            )}
          </div>
          <button
            onClick={() => handleActionClick("Instagram", "instagram")}
            className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              connections.instagram
                ? "bg-[#FFE4E6] text-[#FF4C6A] hover:bg-[#FECDD3]"
                : "bg-[#E0E7FF] text-[#635BFF] hover:bg-[#C7D2FE]"
            }`}
          >
            {connections.instagram ? "Disconnect" : "Connect"}
          </button>
        </div>

        {/* X (Twitter) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#E2E8F0] rounded-lg gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-[#000000] shrink-0">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </div>
            <span className="font-bold text-sm text-[#1E293B]">X</span>
            {connections.x ? (
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold rounded-lg whitespace-nowrap">Connected</span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-bold rounded-lg whitespace-nowrap">Not Connected</span>
            )}
          </div>
          <button
            onClick={() => handleActionClick("X (Twitter)", "x")}
            className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              connections.x
                ? "bg-[#FFE4E6] text-[#FF4C6A] hover:bg-[#FECDD3]"
                : "bg-[#E0E7FF] text-[#635BFF] hover:bg-[#C7D2FE]"
            }`}
          >
            {connections.x ? "Disconnect" : "Connect"}
          </button>
        </div>

        {/* TikTok */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#E2E8F0] rounded-lg gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-[#000000] shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-[#1E293B]">TikTok</span>
            {connections.tiktok ? (
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold rounded-lg whitespace-nowrap">Connected</span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-bold rounded-lg whitespace-nowrap">Not Connected</span>
            )}
          </div>
          <button
            onClick={() => handleActionClick("TikTok", "tiktok")}
            className={`w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              connections.tiktok
                ? "bg-[#FFE4E6] text-[#FF4C6A] hover:bg-[#FECDD3]"
                : "bg-[#E0E7FF] text-[#635BFF] hover:bg-[#C7D2FE]"
            }`}
          >
            {connections.tiktok ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>

      <SocialConnectModal
        isOpen={modalState.isOpen}
        platform={modalState.platform}
        action={modalState.action}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
