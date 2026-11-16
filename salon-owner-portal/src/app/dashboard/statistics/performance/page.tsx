"use client";

import React from "react";
import { DashboardHeader } from "../../../../components/Statistics/DashboardHeader";
import { PerformanceStatCards } from "../../../../components/Statistics/PerformanceStatCards";
import { WeeklyAppointmentsChart } from "../../../../components/Statistics/WeeklyAppointmentsChart";
import { AverageTicketChart } from "../../../../components/Statistics/AverageTicketChart";
import { RevenuePerServiceChart } from "../../../../components/Statistics/RevenuePerServiceChart";
import { RevenuePerCategoryChart } from "../../../../components/Statistics/RevenuePerCategoryChart";
import { TopServicesList } from "../../../../components/Statistics/TopServicesList";
import { CostsVsSalariesChart } from "../../../../components/Statistics/CostsVsSalariesChart";

import {
  SERVICE_REVENUE_PAGE_1,
  SERVICE_REVENUE_PAGE_2,
  performanceCategoryData,
  performanceCategoryOptions,
  performanceLineData,
  performanceLineOptions,
  weeklyAppointmentsData,
  weeklyAppointmentsOptions,
  averageTicketData,
  averageTicketOptions,
} from "../../../../components/Statistics/data";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


export default function PerformanceDashboard() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <DashboardHeader
        title="Performance Dashboard"
        teamOptions={["All Team", "Sarah", "Michael"]}
        selected="All Team"
        onSelect={() => { }}
      />
      <PerformanceStatCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
        <WeeklyAppointmentsChart data={weeklyAppointmentsData} options={weeklyAppointmentsOptions} />
        <AverageTicketChart data={averageTicketData} options={averageTicketOptions} />
      </div>
      <RevenuePerServiceChart page1Data={SERVICE_REVENUE_PAGE_1} page2Data={SERVICE_REVENUE_PAGE_2} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenuePerCategoryChart data={performanceCategoryData} options={performanceCategoryOptions} />
        <TopServicesList />
      </div>
      <CostsVsSalariesChart data={performanceLineData} options={performanceLineOptions} />
    </div>
  );
}
