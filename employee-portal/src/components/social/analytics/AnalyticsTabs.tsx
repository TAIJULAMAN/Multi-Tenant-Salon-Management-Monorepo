import React from "react";

import { AnalyticsTab } from "../types";

interface AnalyticsTabsProps {
  activeTab: AnalyticsTab;
  setActiveTab: (tab: AnalyticsTab) => void;
}

export function AnalyticsTabs({ activeTab, setActiveTab }: AnalyticsTabsProps) {
  return (
    <div className="flex items-center px-6 gap-10 border-b border-[#F1F5F9] overflow-x-auto scrollbar-none whitespace-nowrap">
      {(["Account", "Posts", "Reels", "Story"] as AnalyticsTab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab
            ? "border-[#635BFF] text-[#635BFF]"
            : "border-transparent text-[#64748B] hover:text-[#1E293B]"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
