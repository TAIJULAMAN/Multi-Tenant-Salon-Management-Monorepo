"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { MOCK_FOLLOWERS_ACTIVE } from "../../data";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function FollowersActiveChart() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const barThickness = isMobile ? 18 : 50;

  const followersActiveData = {
    labels: MOCK_FOLLOWERS_ACTIVE.map(d => isMobile ? d.day.slice(0, 3) : d.day),
    datasets: [
      {
        label: "Background",
        data: MOCK_FOLLOWERS_ACTIVE.map(() => 21),
        backgroundColor: "#F8FAFC",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: barThickness,
        grouped: false,
        order: 2,
      },
      {
        label: "Active Hours",
        data: MOCK_FOLLOWERS_ACTIVE.map(d => d.value),
        backgroundColor: "#635BFF",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: barThickness,
        grouped: false,
        order: 1,
      }
    ]
  };

  const followersActiveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#1E293B",
        bodyFont: { weight: 'bold' as const },
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        boxPadding: 8,
        filter: (tooltipItem: any) => tooltipItem.dataset.label !== 'Background',
        callbacks: {
          title: () => null as any,
          label: (context: any) => `${context.raw}h`,
          afterLabel: () => `Total      100` // Mock matching design
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94A3B8", font: { size: 11 }, padding: 10 }
      },
      y: {
        grid: { color: "#F8FAFC", drawBorder: false },
        border: { display: false },
        ticks: {
          color: "#94A3B8",
          font: { size: 11 },
          padding: 15,
          callback: (value: any) => `${value}h`,
          stepSize: 3
        },
        min: 0,
        max: 21
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 sm:p-6">
      <h3 className="text-[14px] font-bold text-[#1E293B] mb-6">Followers Active by Hour/Day</h3>
      <div className="h-[250px] w-full mt-4 relative">
        <div className="relative h-full w-full">
          <Bar data={followersActiveData} options={followersActiveOptions} />
        </div>
      </div>
    </div>
  );
}
