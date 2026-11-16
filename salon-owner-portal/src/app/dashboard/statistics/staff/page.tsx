"use client";

import React, { useState } from "react";
import { DashboardHeader } from "../../../../components/Statistics/DashboardHeader";
import { StaffStatCards } from "../../../../components/Statistics/StaffStatCards";
import { StaffHoursLoggedChart } from "../../../../components/Statistics/StaffHoursLoggedChart";
import { StylistReviewShareChart } from "../../../../components/Statistics/StylistReviewShareChart";
import { StaffUtilizationDetail } from "../../../../components/Statistics/StaffUtilizationDetail";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function StaffStatisticsPage() {
  const [filterType, setFilterType] = useState("All Staff");



  return (
    <div className="space-y-8 pb-12 text-left relative font-manrope">
      <DashboardHeader
        title="Staff Statistics"
        teamOptions={["All Staff", "Stylists", "Receptionist", "Technicians"]}
        selected={filterType}
        onSelect={setFilterType}
      />

      <StaffStatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaffHoursLoggedChart />
        <StylistReviewShareChart />
      </div>

      <StaffUtilizationDetail />
    </div>
  );
}
