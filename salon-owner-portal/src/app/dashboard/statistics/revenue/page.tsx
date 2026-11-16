"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { CustomSelect } from "@/components/common/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import { RevenueStatCards } from "@/components/Statistics/RevenueStatCards";
import { RevenueOverTimeFullChart } from "@/components/Statistics/RevenueOverTimeFullChart";
import { RevenueByDayOfWeekChart } from "@/components/Statistics/RevenueByDayOfWeekChart";
import { RevenuePaymentMethodsChart } from "@/components/Statistics/RevenuePaymentMethodsChart";
import { RevenueTicketDistributionChart } from "@/components/Statistics/RevenueTicketDistributionChart";
import { RevenueByServiceCategoryChart } from "@/components/Statistics/RevenueByServiceCategoryChart";
import { RecentReceiptsTable } from "@/components/Statistics/RecentReceiptsTable";

export default function RevenueStatisticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12 text-left relative font-manrope max-w-full">
      <CustomPageHeader
        title="Revenue Analytics"
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

      <RevenueStatCards />
      <RevenueOverTimeFullChart />
      <RevenueByDayOfWeekChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenuePaymentMethodsChart />
        <RevenueTicketDistributionChart />
      </div>
      <RevenueByServiceCategoryChart />
      <RecentReceiptsTable />

      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Revenue Analytics"
        description="Choose the format to export your revenue analytics report."
      />
    </div>
  );
}

