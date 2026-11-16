"use client";

import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { clientSegmentsBase } from "./data";

export default function ClientSegmentsChart() {
  const [clientSegmentsFilter, setClientSegmentsFilter] = useState("All Clients");

  const getClientSegmentsData = () => {
    let newClients = [...clientSegmentsBase.new];
    let reactivated = [...clientSegmentsBase.reactivated];
    let returning = [...clientSegmentsBase.returning];

    if (clientSegmentsFilter === "VIP Clients") {
      newClients = newClients.map(v => +(v * 0.2).toFixed(1));
      reactivated = reactivated.map(v => +(v * 0.35).toFixed(1));
      returning = returning.map(v => +(v * 0.3).toFixed(1));
    } else if (clientSegmentsFilter === "Regulars") {
      newClients = newClients.map(v => +(v * 0.8).toFixed(1));
      reactivated = reactivated.map(v => +(v * 0.65).toFixed(1));
      returning = returning.map(v => +(v * 0.7).toFixed(1));
    }

    return {
      labels: ["Jul 26", "Aug 02", "Aug 09", "Aug 16", "Aug 23"],
      datasets: [
        {
          label: "New",
          data: newClients,
          backgroundColor: "#635BFF",
        },
        {
          label: "Reactivated",
          data: reactivated,
          backgroundColor: "#FF5656",
        },
        {
          label: "Returning",
          data: returning,
          backgroundColor: "#14B8A6",
        },
      ],
    };
  };

  const clientSegmentsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rect" as const,
          boxWidth: 8,
          font: { family: "Manrope", size: 11, weight: 600 as any },
          color: "#64748B",
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          color: "#F8FAFC",
        },
      },
      x: {
        stacked: true,
        ticks: {
          font: { family: "Manrope", size: 10, weight: 600 as any },
          color: "#94A3B8",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Client Segments</h3>
        <CustomSelect
          value={clientSegmentsFilter}
          onChange={setClientSegmentsFilter}
          options={["All Clients", "VIP Clients", "Regulars"]}
          buttonClassName="!bg-white !border-[#E2E8F0] !text-[#64748B] !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg"
        />
      </div>
      <div className="h-[280px]">
        <Bar data={getClientSegmentsData()} options={clientSegmentsOptions} />
      </div>
    </div>
  );
}
