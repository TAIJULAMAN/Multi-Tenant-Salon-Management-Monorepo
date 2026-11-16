"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { CustomSelect } from "@/components/common/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import OverviewStatCards from "@/components/Statistics/OverviewStatCards";
import RevenueOverTimeChart from "@/components/Statistics/RevenueOverTimeChart";
import ClientSegmentsChart from "@/components/Statistics/ClientSegmentsChart";
import RevenueByStaffChart from "@/components/Statistics/RevenueByStaffChart";
import TicketDistributionChart from "@/components/Statistics/TicketDistributionChart";
import PaymentMethodsChart from "@/components/Statistics/PaymentMethodsChart";

export default function OverviewStatisticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12 text-left relative font-manrope">
      <CustomPageHeader
        title="Statistics"
        action={
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Calendar dropdown */}
            <CustomSelect
              value={timeRange}
              onChange={setTimeRange}
              options={["This Week", "This Month", "This Year"]}
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
      <OverviewStatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueOverTimeChart />
        <ClientSegmentsChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueByStaffChart />
        <TicketDistributionChart />
        <PaymentMethodsChart />
      </div>
      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Statistics"
        description="Choose the format to export your statistics report."
      />
    </div>
  );
}
