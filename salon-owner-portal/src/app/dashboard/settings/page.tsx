"use client";

import React, { useState } from "react";
import SecurityTab from "@/components/settings/SecurityTab";
import ProfileTab from "@/components/settings/ProfileTab";


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm pt-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#1E293B]">Settings</h1>
        </div>

        <div className="flex items-center gap-8">
          {["Profile", "Security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === tab
                ? "text-[#635BFF]"
                : "text-[#64748B] hover:text-[#1E293B]"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#635BFF] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "Profile" && (
        <ProfileTab />
      )}
      {activeTab === "Security" && (
        <SecurityTab />
      )}
    </div>
  );
}
