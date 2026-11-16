import { LucideIcon } from "lucide-react";

export interface Row1Card {
  id: string;
  value: string;
  title: string;
  change?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  cardStyle: string;
}

export interface Row2SparklineCard {
  id: string;
  type: "sparkline";
  value: string;
  title: string;
  change?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  cardStyle: string;
}

export interface Row2InactiveCard {
  id: string;
  type: "inactive";
  valueLeft: string;
  labelLeft: string;
  valueRight: string;
  labelRight: string;
  title: string;
  change?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  cardStyle: string;
}

export interface Row2StaffCard {
  id: string;
  type: "staff";
  valueLeft: string;
  labelLeft: string;
  nameLeft: string;
  valueRight: string;
  labelRight: string;
  nameRight: string;
  title: string;
  change?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  cardStyle: string;
}

export type Row2Card = Row2SparklineCard | Row2InactiveCard | Row2StaffCard;

export interface InactiveClientSettingsProps {
  filterMode: string;
  setFilterMode: (val: string) => void;
  days: string;
  setDays: (val: string) => void;
  periodStart: string;
  setPeriodStart: (val: string) => void;
  periodEnd: string;
  setPeriodEnd: (val: string) => void;
}

export interface InactiveClient {
  name: string;
  lastVisit: string;
  visits: number;
  totalSpent: number;
  avgTicket: number;
  tags: string[];
  city: string;
  region: string;
}

export type ClientRow = InactiveClient;

export interface InactiveClientsCardsProps {
  filterMode: string;
  days: string;
  periodStart: string;
  periodEnd: string;
}

export type InactiveClientsTableProps = InactiveClientsCardsProps;

export interface InactiveClientsChartProps {
  filterMode: string;
  days: string;
  periodStart: string;
  periodEnd: string;
}

export type WeeklyAppointmentsChartProps = { data: any; options: any; };
export type AverageTicketChartProps = { data: any; options: any; };
export type RevenuePerCategoryChartProps = { data: any; options: any; };
export type ProductionTrendsChartProps = { data: any; options: any; };
export type PaymentsPerYearChartProps = { data: any; options: any; };
export type DailyProductionChartProps = { data: any; options: any; };
export type CostsVsSalariesChartProps = { data: any; options: any; };



export interface TagSegmentationTableProps { filteredList: ClientRow[]; }
export interface TagSegmentationCardsProps { filteredList: ClientRow[]; }
export interface HighSpendersTableProps { filteredSpenders: ClientRow[]; }
export interface HighSpendersCardsProps { filteredSpenders: ClientRow[]; }

export type StatCardProps = {
  title: string;
  value: string;
  IconComponent: React.ElementType;
  bgClass?: string;
  iconBgClass?: string;
  badge?: string;
  badgeColor?: string;
  subtitle?: React.ReactNode;
  className?: string;
  sparkline?: React.ReactNode;
};

export type ServiceRevenue = { name: string; value: number; };
export type RevenuePerServiceChartProps = { page1Data: ServiceRevenue[]; page2Data: ServiceRevenue[]; };
export type ReportsHistoryTableProps = { reportType: string; };
export type EmployeeInfoCardsProps = { performanceMetrics: any; operationStatics: any; };

export type DashboardHeaderProps = {
  title: string;
  teamOptions: string[];
  selected: string;
  onSelect: (value: string) => void;
  actionButtonText?: string;
  ActionButtonIcon?: React.ElementType;
};
