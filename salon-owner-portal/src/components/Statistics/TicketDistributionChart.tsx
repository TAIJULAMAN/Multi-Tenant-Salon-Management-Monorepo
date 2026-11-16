"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { ticketDistributionBase } from "./data";

export default function TicketDistributionChart() {
  const [ticketDistributionFilter, setTicketDistributionFilter] = useState("All Tickets");

  const getTicketDistributionData = () => {
    let data = [...ticketDistributionBase];

    if (ticketDistributionFilter === "Services Only") {
      data = [12, 54, 58, 63, 52, 6];
    } else if (ticketDistributionFilter === "Products Only") {
      data = [24, 20, 4, 2, 6, 1];
    }

    return {
      labels: ["€0-50", "€50-100", "€100-150", "€150-200", "€200-300", "€300+"],
      datasets: [
        {
          data: data,
          backgroundColor: "#14B8A6",
          borderRadius: 4,
          barThickness: 20,
        },
      ],
    };
  };

  const ticketDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: { color: "#F8FAFC" },
      },
      x: {
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Ticket Distribution</h3>
        <CustomSelect
          value={ticketDistributionFilter}
          onChange={setTicketDistributionFilter}
          options={["All Tickets", "Services Only", "Products Only"]}
          buttonClassName="!bg-white !border-[#E2E8F0] !text-[#64748B] !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg"
        />
      </div>
      <div className="h-[240px]">
        <Bar data={getTicketDistributionData()} options={ticketDistributionOptions} />
      </div>
    </div>
  );
}
