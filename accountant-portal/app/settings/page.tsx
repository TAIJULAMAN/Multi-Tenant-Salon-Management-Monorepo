"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SecurityTab from "@/components/settings/SecurityTab";
import ProfileTab from "@/components/settings/ProfileTab";

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam?.toLowerCase() === "security" ? "Security" : "Profile";

  const [userSelectedTab, setUserSelectedTab] = useState<string | null>(null);
  const activeTab = userSelectedTab ?? defaultTab;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8 space-y-6">
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm pt-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#1E293B]">Settings</h1>
        </div>

        <div className="flex items-center gap-8">
          {["Profile", "Security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setUserSelectedTab(tab)}
              className={`pb-4 text-sm font-bold transition-colors relative cursor-pointer ${
                activeTab === tab
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8 text-slate-400">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

