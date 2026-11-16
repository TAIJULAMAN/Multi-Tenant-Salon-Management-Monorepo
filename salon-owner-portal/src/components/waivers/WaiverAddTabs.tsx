import React from "react";

interface WaiverAddTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  children?: React.ReactNode;
}

export default function WaiverAddTabs({
  activeTab,
  setActiveTab,
  tabs,
  children,
}: WaiverAddTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-visible">
      <div className="flex items-center border-b border-[#E2E8F0] overflow-x-auto px-4 sm:px-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-4 text-[14px] font-bold whitespace-nowrap border-b-[3px] transition-colors ${
              activeTab === tab
                ? "border-[#635BFF] text-[#635BFF]"
                : "border-transparent text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-6 sm:p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}
