import { Clock, Calendar, DollarSign, CheckCircle, LucideIcon } from "lucide-react";

export interface TaxesKPICardConfig {
  title: string;
  metricKey: string;
  icon: LucideIcon;
  gradientColor: string;
  bgClass: string;
  subtext: string;
}

export const taxesKPICardsConfig: TaxesKPICardConfig[] = [
  {
    title: "Awaiting Approval",
    metricKey: "awaitingApproval",
    icon: Clock,
    gradientColor: "#F8C209",
    bgClass: "border-[#F8C209]/20",
    subtext: "Avg. 2.1 days waiting",
  },
  {
    title: "Due Soon",
    metricKey: "dueSoon",
    icon: Calendar,
    gradientColor: "#FF6692",
    bgClass: "border-[#FF6692]/20",
    subtext: "Next 14 days",
  },
  {
    title: "Total Paid This Year",
    metricKey: "totalPaid",
    icon: DollarSign,
    gradientColor: "#16CDC7",
    bgClass: "border-[#16CDC7]/20",
    subtext: "15 payments",
  },
  {
    title: "Avg Approval Time",
    metricKey: "avgApprovalTime",
    icon: CheckCircle,
    gradientColor: "#635BFF",
    bgClass: "border-[#635BFF]/20",
    subtext: "-0.3 days from last quarter",
  },
];

export const getTaxesMetrics = () => {
  return {
    awaitingApproval: 5,
    dueSoon: 3,
    totalPaid: 48200,
    avgApprovalTime: 1.8,
  };
};
