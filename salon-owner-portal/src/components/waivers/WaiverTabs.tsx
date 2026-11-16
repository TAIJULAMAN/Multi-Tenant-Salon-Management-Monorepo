interface WaiverTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

export default function WaiverTabs({ activeTab, setActiveTab, tabs }: WaiverTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-colors ${
            activeTab === tab
              ? "border border-[#635BFF] text-[#635BFF] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
