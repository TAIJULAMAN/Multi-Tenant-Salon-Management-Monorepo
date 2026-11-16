import React from "react";
import { LucideIcon } from "lucide-react";

export type StatCardProps = {
  title: string;
  value: string;
  IconComponent: React.ElementType | LucideIcon;
  bgClass?: string;
  iconBgClass?: string;
  badge?: string;
  badgeColor?: string;
  subtitle?: React.ReactNode;
  className?: string;
  sparkline?: React.ReactNode;
};

export type DailyProductionChartProps = {
  data: any;
  options: any;
};

export type ProductionTrendsChartProps = {
  data: any;
  options: any;
};

export type PaymentsPerYearChartProps = {
  data: any;
  options: any;
};

export interface PerformanceMetrics {
  targetThreshold: string;
  monthlySalary: string;
  thresholdCalculation: string;
  performanceStatus: string;
  statusColor: string;
}

export interface OperationStatics {
  completedAppointments: string | number;
  revenueAppointment: string;
  workingDays: string | number;
  performanceStatus: string;
}

export type EmployeeInfoCardsProps = {
  performanceMetrics: PerformanceMetrics;
  operationStatics: OperationStatics;
};

export type DashboardHeaderProps = {
  title: string;
  teamOptions?: string[];
  selected: string | string[];
  onSelect: (value: any) => void;
  actionButtonText?: string;
  ActionButtonIcon?: React.ElementType | LucideIcon;
};
