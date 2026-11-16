"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CustomSelect } from "@/components/common/CustomSelect";
import { paymentMethodsBase } from "./data";

export default function PaymentMethodsChart() {
  const [paymentMethodsFilter, setPaymentMethodsFilter] = useState("All Payments");

  const getPaymentMethodsData = () => {
    let data = [...paymentMethodsBase];

    if (paymentMethodsFilter === "Retail Sales") {
      data = [1200, 2600, 3500, 1800];
    } else if (paymentMethodsFilter === "Service Bookings") {
      data = [8000, 7000, 10000, 8000];
    }

    return {
      labels: ["Satispay", "Contanti", "Bancomat", "Carta"],
      datasets: [
        {
          data: data,
          backgroundColor: "#FF5656",
          borderRadius: 4,
          barThickness: 20,
        },
      ],
    };
  };

  const paymentMethodsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (val: any) => `€${val}`,
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
        <h3 className="text-sm font-bold text-[#1E293B]">Payment Methods</h3>
        <CustomSelect
          value={paymentMethodsFilter}
          onChange={setPaymentMethodsFilter}
          options={["All Payments", "Retail Sales", "Service Bookings"]}
          buttonClassName="!bg-white !border-[#E2E8F0] !text-[#64748B] !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg"
        />
      </div>
      <div className="h-[240px]">
        <Bar data={getPaymentMethodsData()} options={paymentMethodsOptions} />
      </div>
    </div>
  );
}
