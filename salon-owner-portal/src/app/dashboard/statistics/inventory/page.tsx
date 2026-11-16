"use client";

import React, { useState } from "react";
import { Download, Boxes, ShoppingBag } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { CustomSelect } from "@/components/common/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import { InventoryStatCards } from "@/components/Statistics/InventoryStatCards";
import { InternalUsageRestockCard } from "@/components/Statistics/InternalUsageRestockCard";
import { StockByCategoryCard } from "@/components/Statistics/StockByCategoryCard";
import { RecentMovementsLogCard } from "@/components/Statistics/RecentMovementsLogCard";
import { RetailSalesPerformanceCard } from "@/components/Statistics/RetailSalesPerformanceCard";
import { TopSellersCard } from "@/components/Statistics/TopSellersCard";
import { RecentSalesHistoryCard } from "@/components/Statistics/RecentSalesHistoryCard";
import { FullProductInventoryTable } from "@/components/Statistics/FullProductInventoryTable";

export default function InventoryStatisticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"movements" | "retail">("movements");

  return (
    <div className="space-y-6 pb-12 text-left relative font-manrope max-w-full">
      <CustomPageHeader
        title="Inventory Analytics"
        action={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <CustomSelect
              value={timeRange}
              onChange={setTimeRange}
              options={["This Week", "This Month", "Last 30 days", "This Year"]}
              className="w-full sm:w-auto"
              buttonClassName="!w-full sm:!w-[140px] !bg-white !border-[#E2E8F0] !text-[#1E293B] !text-xs !font-semibold !px-3.5 !py-2 !rounded-lg justify-between"
            />
            <SubmitButton
              onClick={() => setIsExportOpen(true)}
              className="!w-full sm:!w-auto !px-4 !py-2 rounded-lg !text-xs font-bold flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              Export Data
            </SubmitButton>
          </div>
        }
      />
      <InventoryStatCards timeRange={timeRange} />

      {/* Center Toggle Switch */}
      <div className="flex justify-center pt-2 pb-1 px-2">
        <div className="inline-flex bg-[#F1F5F9] p-1 rounded-2xl sm:rounded-full shadow-sm max-w-full">
          <button
            onClick={() => setActiveTab("movements")}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === "movements"
                ? "bg-white text-[#635BFF] shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            <Boxes className="w-4 h-4 shrink-0" />
            <span>Stock Movements <span className="hidden sm:inline">(Internal)</span></span>
          </button>
          <button
            onClick={() => setActiveTab("retail")}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === "retail"
                ? "bg-white text-[#635BFF] shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Retail Sales</span>
          </button>
        </div>
      </div>

      {activeTab === "movements" ? (
        <div className="space-y-6">
          <InternalUsageRestockCard />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="w-full lg:col-span-5">
              <StockByCategoryCard />
            </div>
            <div className="w-full lg:col-span-7">
              <RecentMovementsLogCard />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <RetailSalesPerformanceCard />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="w-full lg:col-span-5">
              <TopSellersCard />
            </div>
            <div className="w-full lg:col-span-7">
              <RecentSalesHistoryCard />
            </div>
          </div>
        </div>
      )}
      <FullProductInventoryTable />

      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Inventory Analytics"
        description="Choose the format to export your inventory analytics report."
      />
    </div>
  );
}
