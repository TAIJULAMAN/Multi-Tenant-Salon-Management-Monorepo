"use client";

import React, { useState } from "react";
import { Download, Compass, Building2 } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { CustomSelect } from "@/components/common/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import { GeographyStatCards } from "@/components/Statistics/GeographyStatCards";
import { GeographyRevenueByRegionChart } from "@/components/Statistics/GeographyRevenueByRegionChart";
import { GeographyClientsAndTicketCharts } from "@/components/Statistics/GeographyClientsAndTicketCharts";
import { GeographyNewVsReturningChart } from "@/components/Statistics/GeographyNewVsReturningChart";
import { GeographyRegionDetailsTable } from "@/components/Statistics/GeographyRegionDetailsTable";

export default function GeographyStatisticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [viewBy, setViewBy] = useState<"regions" | "cities">("regions");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12 text-left relative font-manrope max-w-full">
      {/* 1. Header with Title, Date Range Selector & Export Data Button */}
      <CustomPageHeader
        title="Geographic Analysis"
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

      {/* 2. Sub Toolbar: View by (Regions / Cities) Toggle & Export PDF Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-[#64748B]">View by:</span>
          <div className="inline-flex bg-white border border-[#E2E8F0] p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewBy("regions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewBy === "regions"
                  ? "bg-[#635BFF] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Regions</span>
            </button>
            <button
              onClick={() => setViewBy("cities")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewBy === "cities"
                  ? "bg-[#635BFF] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Cities</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsExportPdfOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* 3. Stat Cards */}
      <GeographyStatCards viewBy={viewBy} />

      {/* 4. Horizontal Revenue Bar Chart */}
      <GeographyRevenueByRegionChart viewBy={viewBy} />

      {/* 5. Clients and Avg Ticket Charts */}
      <GeographyClientsAndTicketCharts viewBy={viewBy} />

      {/* 6. Stacked New vs Returning Clients Chart */}
      <GeographyNewVsReturningChart viewBy={viewBy} />

      {/* 7. Region Details Table with Previous Design Style and Pagination */}
      <GeographyRegionDetailsTable viewBy={viewBy} />

      {/* Modals for Export */}
      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Geographic Data"
        description="Choose your preferred file format to download the geographic analytics report."
      />

      <CustomExportModal
        isOpen={isExportPdfOpen}
        onClose={() => setIsExportPdfOpen(false)}
        title="Export Geographic Report (PDF)"
        description="Your PDF report includes region performance breakdowns and client distribution statistics."
      />
    </div>
  );
}
