"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { WeeklyAppointmentsChartProps } from "./types";

export const WeeklyAppointmentsChart: React.FC<WeeklyAppointmentsChartProps> = ({ data, options }) => {
  const [period, setPeriod] = useState("This Month");

  const dataLastMonth = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => Math.max(0, v - 10))
    })) : []
  };

  const dataThisYear = {
    ...data,
    datasets: data.datasets ? data.datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((v: number) => v * 4)
    })) : []
  };

  const currentData = period === "This Month" ? data : period === "Last Month" ? dataLastMonth : dataThisYear;

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#1E293B] text-[14px]">Weekly Appoinments</h3>
        <CustomSelect
          value={period}
          onChange={setPeriod}
          options={["This Month", "Last Month", "This Year"]}
        />
      </div>
      <div className="h-[280px] relative w-full mt-4 select-none">
        <Line data={currentData} options={options} />
      </div>
    </div>
  );
};
