"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import InactiveClientsTab from "@/components/Statistics/InactiveClientsTab";
import NewClientsTab from "@/components/Statistics/NewClientsTab";
import ReturningClientsTab from "@/components/Statistics/ReturningClientsTab";
import HighSpendersTab from "@/components/Statistics/HighSpendersTab";
import TagSegmentationTab from "@/components/Statistics/TagSegmentationTab";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ClientTab =
  | "inactive"
  | "new"
  | "returning"
  | "high-spenders"
  | "tag-segmentation";

export default function ClientAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ClientTab>("inactive");
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const tabs = [
    { id: "inactive" as const, label: "Inactive Clients" },
    { id: "new" as const, label: "New Clients" },
    { id: "returning" as const, label: "Returning Clients" },
    { id: "high-spenders" as const, label: "High Spenders" },
    { id: "tag-segmentation" as const, label: "Tag Segmentation" },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "inactive":
        return <InactiveClientsTab />;
      case "new":
        return <NewClientsTab />;
      case "returning":
        return <ReturningClientsTab />;
      case "high-spenders":
        return <HighSpendersTab />;
      case "tag-segmentation":
        return <TagSegmentationTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 text-left relative font-manrope">
      <CustomPageHeader
        title="Client Analytics"
        action={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Calendar dropdown */}
            <CustomSelect
              value={timeRange}
              onChange={setTimeRange}
              options={["Last 7 days", "Last 30 days", "Last 90 days", "All Time"]}
              buttonClassName="!w-[140px] !bg-white !border-[#E2E8F0] !text-[#1E293B] !text-xs !font-semibold !px-3.5 !py-2 !rounded-lg"
            />

            {/* Export Data button */}
            <SubmitButton
              onClick={() => setIsExportOpen(true)}
              className="!px-4 !py-2 rounded-lg !text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              Export Data
            </SubmitButton>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                ? "bg-[#635BFF] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">{renderActiveTabContent()}</div>

      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Client Analytics"
        description="Choose the format to export your client analytics report."
      />
    </div>
  );
}
