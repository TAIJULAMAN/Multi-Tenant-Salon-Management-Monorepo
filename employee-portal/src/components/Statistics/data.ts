import {
  BriefcaseBusiness,
  Target,
  Award,
  Wallet,
  DollarSign,
  Database,
} from "lucide-react";
import {
  PerformanceMetrics,
  OperationStatics,
} from "./types";

export const teamOptions = ["All Team", "Sarah", "Michael"];

export const dailyProductionData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Above Threshold",
      data: [1200, 2500, 800, 2800, 0, 2600, 2600],
      backgroundColor: "#2DD4BF",
      borderRadius: 20,
      barPercentage: 0.2,
    },
    {
      label: "Below Threshold",
      data: [-1800, -800, -1600, -1200, -1200, -1800, -1200],
      backgroundColor: "#F43F5E",
      borderRadius: 20,
      barPercentage: 0.2,
    },
  ],
};

export const dailyProductionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          return `  ${context.dataset.label}: € ${Math.abs(context.raw)}`;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      stacked: true,
      grid: { color: "#F1F5F9", drawBorder: false },
      ticks: {
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        stepSize: 1000,
        callback: (value: any) => {
          if (value === 0) return "0";
          return `€ ${Math.abs(value / 1000)}k`;
        },
      },
      border: { display: false },
    },
  },
};

const thresholdValue = 2000;
export const productionTrendsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Production",
      data: [1900, 2100, 2200, 1800, 1500, 1100, 1800, 2800, 2700, 2600, 2500, 2400],
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
      segment: {
        borderColor: (ctx: any) => {
          return ctx.p1.parsed.y >= thresholdValue ? "#22C55E" : "#F43F5E";
        },
      },
    },
  ],
};

export const productionTrendsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => `  € ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 0,
      max: 3000,
      ticks: {
        stepSize: 1000,
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        callback: (value: any) => {
          if (value === 0) return "0";
          return `€ ${value / 1000}k`;
        },
      },
      grid: { color: "#F8FAFC" },
      border: { display: false },
    },
  },
};

export const paymentsPerYearData = {
  labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
  datasets: [
    {
      label: "Payments",
      data: [1200, 1500, 1800, 1600, 3200, 3500],
      backgroundColor: "#635BFF",
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
      barPercentage: 0.6,
    },
    {
      label: "Background",
      data: [4500, 4500, 4500, 4500, 4500, 4500],
      backgroundColor: "#F8FAFC",
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
      grouped: false,
      barPercentage: 0.6,
      order: 2,
    },
  ],
};

export const paymentsPerYearOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      filter: (tooltipItem: any) => tooltipItem.datasetIndex === 0,
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => `  Total: € ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 0,
      max: 4500,
      ticks: {
        stepSize: 500,
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        callback: (value: any) => `€ ${value}`,
      },
      grid: { display: false },
      border: { display: false },
    },
  },
};

export const employeeProductionCards = [
  {
    id: "monthly-turnover",
    value: "€ 8,500",
    title: "Monthly Turnover",
    icon: BriefcaseBusiness,
    iconBgClass: "bg-[#635BFF]",
  },
  {
    id: "target-threshold",
    value: "€ 6,400",
    title: "Target Threshold",
    icon: Target,
    iconBgClass: "bg-[#FBBF24]",
  },
  {
    id: "performance",
    value: "133%",
    title: "Performance",
    icon: Award,
    iconBgClass: "bg-[#2DD4BF]",
    badge: "Goal Achieved",
    badgeColor: "bg-[#D1FAE5] text-[#10B981]",
  },
];

export const employeeRemunerationCards = [
  {
    id: "last-payslip",
    value: "€ 1,700",
    title: "Last Payslip",
    subtitle: "Gross: € 4,300.00\nNovember 20, 2024",
    icon: Wallet,
    iconBgClass: "bg-[#635BFF]",
  },
  {
    id: "average-salary",
    value: "€ 2,200",
    title: "Average Salary",
    subtitle: "Last 12 months",
    icon: DollarSign,
    iconBgClass: "bg-[#2DD4BF]",
  },
  {
    id: "accumulated-tfr",
    value: "€ 5,500",
    title: "Accumulated TFR",
    icon: Database,
    iconBgClass: "bg-[#FBBF24]",
  },
];

export const employeePerformanceMetrics: PerformanceMetrics = {
  targetThreshold: "€ 1,700",
  monthlySalary: "€ 3,200",
  thresholdCalculation: "€ 1,700",
  performanceStatus: "Goal Achieved",
  statusColor: "bg-[#D1FAE5] text-[#10B981]",
};

export const employeeOperationStatics: OperationStatics = {
  completedAppointments: "38",
  revenueAppointment: "€ 223.68",
  workingDays: "3",
  performanceStatus: "€ 2,633.33",
};

export const employeeStats = {
  teamOptions,
  productionCards: employeeProductionCards,
  remunerationCards: employeeRemunerationCards,
  dailyProductionData,
  dailyProductionOptions,
  productionTrendsData,
  productionTrendsOptions,
  paymentsPerYearData,
  paymentsPerYearOptions,
  performanceMetrics: employeePerformanceMetrics,
  operationStatics: employeeOperationStatics,
};