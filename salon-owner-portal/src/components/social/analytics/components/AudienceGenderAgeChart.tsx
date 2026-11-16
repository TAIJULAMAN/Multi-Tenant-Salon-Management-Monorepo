"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { MOCK_AUDIENCE_GENDER_AGE } from "../../data";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function AudienceGenderAgeChart() {
  const genderAgeData = {
    labels: MOCK_AUDIENCE_GENDER_AGE.map(d => d.ageGroup),
    datasets: [
      {
        label: "Man (50%)",
        data: MOCK_AUDIENCE_GENDER_AGE.map(d => d.man),
        backgroundColor: "#635BFF",
        borderRadius: { topLeft: 4, topRight: 4 },
        barThickness: 6,
      },
      {
        label: "Woman (30%)",
        data: MOCK_AUDIENCE_GENDER_AGE.map(d => d.woman),
        backgroundColor: "#F472B6",
        borderRadius: { topLeft: 4, topRight: 4 },
        barThickness: 6,
      },
      {
        label: "Unspecified (20%)",
        data: MOCK_AUDIENCE_GENDER_AGE.map(d => d.unspecified),
        backgroundColor: "#FBBF24",
        borderRadius: { topLeft: 4, topRight: 4 },
        barThickness: 6,
      }
    ]
  };

  const genderAgeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          color: '#64748B',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#64748B",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94A3B8", font: { size: 12 }, padding: 10 }
      },
      y: {
        grid: { color: "#F1F5F9", drawBorder: false },
        border: { display: false },
        ticks: { color: "#94A3B8", font: { size: 12 }, padding: 10 }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-5">
      <h3 className="text-[14px] font-bold text-[#1E293B] mb-6">Audience by Gender/Age</h3>
      <div className="h-[220px] w-full">
        <Bar data={genderAgeData} options={genderAgeOptions} />
      </div>
    </div>
  );
}
