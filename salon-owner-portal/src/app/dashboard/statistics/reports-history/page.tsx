"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardHeader } from "../../../../components/Statistics/DashboardHeader";
import { ReportsStatCards } from "../../../../components/Statistics/ReportsStatCards";
import { ReportsHistoryTable } from "../../../../components/Statistics/ReportsHistoryTable";

export default function ReportsHistoryPage() {
  const [reportType, setReportType] = useState("All Reports");



  return (
    <div className="space-y-8 pb-12 text-left relative font-manrope">
      <DashboardHeader
        title="Reports History"
        teamOptions={["All Reports", "Financial", "Inventory", "Staff", "Geography"]}
        selected={reportType}
        onSelect={setReportType}
        actionButtonText="Generate Report"
        ActionButtonIcon={RefreshCw}
      />

      <ReportsStatCards />

      <ReportsHistoryTable reportType={reportType} />
    </div>
  );
}
