"use client";

import React, { useState } from "react";
import { employeeStats } from "@/components/Statistics/data";
import { StatCard } from "@/components/Statistics/StatCard";
import { DashboardHeader } from "@/components/Statistics/DashboardHeader";
import { DailyProductionChart } from "@/components/Statistics/DailyProductionChart";
import { ProductionTrendsChart } from "@/components/Statistics/ProductionTrendsChart";
import { EmployeeInfoCards } from "@/components/Statistics/EmployeeInfoCards";
import { PaymentsPerYearChart } from "@/components/Statistics/PaymentsPerYearChart";

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

export default function StatisticsPage() {
  const [teamSelection, setTeamSelection] = useState("All Team");

  // --- Daily Production (Monthly) Bar Chart Data ---
  const dailyProductionData = employeeStats.dailyProductionData;
  const dailyProductionOptions = employeeStats.dailyProductionOptions;

  // --- Production Trends (Yearly) Line Chart Data ---
  const productionTrendsData = employeeStats.productionTrendsData;
  const productionTrendsOptions = employeeStats.productionTrendsOptions;

  // --- Payments per Year Bar Chart Data ---
  const paymentsPerYearData = employeeStats.paymentsPerYearData;
  const paymentsPerYearOptions = employeeStats.paymentsPerYearOptions;

  return (
    <div className="w-full space-y-8 pb-12 font-manrope">
      <DashboardHeader
        title="Employee Status"
        teamOptions={employeeStats.teamOptions}
        selected={teamSelection}
        onSelect={setTeamSelection}
      />

      {/* --- Section 1: Production --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5 sm:p-6 md:p-8">
        <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">Production</h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {employeeStats.productionCards.map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              value={card.value}
              IconComponent={card.icon}
              iconBgClass={card.iconBgClass}
              badge={card.badge}
              badgeColor={card.badgeColor}
            />
          ))}
        </div>

        {/* Daily Production (Monthly) Chart */}
        <DailyProductionChart
          data={dailyProductionData}
          options={dailyProductionOptions}
        />

        {/* Production Trends (Yearly) Chart */}
        <ProductionTrendsChart
          data={productionTrendsData}
          options={productionTrendsOptions}
        />

        {/* Info Cards Grid */}
        <EmployeeInfoCards
          performanceMetrics={employeeStats.performanceMetrics}
          operationStatics={employeeStats.operationStatics}
        />
      </div>

      {/* --- Section 2: Remuneration --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5 sm:p-6 md:p-8">
        <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">Remuneration</h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {employeeStats.remunerationCards.map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              value={card.value}
              IconComponent={card.icon}
              iconBgClass={card.iconBgClass}
              subtitle={card.subtitle}
            />
          ))}
        </div>

        {/* Payments per Year Chart */}
        <PaymentsPerYearChart
          data={paymentsPerYearData}
          options={paymentsPerYearOptions}
        />
      </div>
    </div>
  );
}
