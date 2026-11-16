"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { staffRevenueBase } from "./data";

export default function RevenueByStaffChart() {
  const [revenueByStaffFilter, setRevenueByStaffFilter] = useState("All Staff");

  const getRevenueByStaffData = () => {
    let labels = [...staffRevenueBase.labels];
    let data = [...staffRevenueBase.data];

    if (revenueByStaffFilter === "Stylists") {
      labels = ["Alessandra Conti", "Valentina Ricci", "Francesca Romano"];
      data = [10613, 9800, 8900];
    } else if (revenueByStaffFilter === "Technicians") {
      labels = ["Luca Marino", "Marco Bianchi"];
      data = [8300, 6309];
    }

    return {
      labels: [...labels].reverse(),
      datasets: [
        {
          data: [...data].reverse(),
          backgroundColor: "#635BFF",
          borderRadius: 4,
          barThickness: 10,
        },
      ],
    };
  };

  const revenueByStaffOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        ticks: {
          font: { family: "Manrope", size: 10, weight: 700 as any },
          color: "#1E293B",
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Revenue by Staff</h3>
        <CustomSelect
          value={revenueByStaffFilter}
          onChange={setRevenueByStaffFilter}
          options={["All Staff", "Stylists", "Technicians"]}
          buttonClassName="!bg-white !border-[#E2E8F0] !text-[#64748B] !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg"
        />
      </div>
      <div className="h-[240px]">
        <Bar data={getRevenueByStaffData()} options={revenueByStaffOptions} />
      </div>
    </div>
  );
}
