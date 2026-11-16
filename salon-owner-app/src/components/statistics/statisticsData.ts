export interface StatCardItem {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  bgGradient: [string, string];
}

export const PERFORMANCE_STAT_CARDS: StatCardItem[] = [
  {
    id: 1,
    title: "Year-over-Year Growth",
    value: "+15.2%",
    change: "Current vs last year",
    icon: "trending-up",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
    bgGradient: ["rgba(16, 185, 129, 0.13)", "rgba(16, 185, 129, 0.03)"],
  },
  {
    id: 2,
    title: "Top Employee (Month)",
    value: "Sarah J.",
    change: "Highest client retention",
    icon: "trophy",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
    bgGradient: ["rgba(245, 158, 11, 0.13)", "rgba(245, 158, 11, 0.03)"],
  },
  {
    id: 3,
    title: "Client Satisfaction",
    value: "4.9/5",
    change: "Based on 142 reviews",
    icon: "star",
    iconColor: "#3B82F6",
    iconBg: "#DBEAFE",
    bgGradient: ["rgba(59, 130, 246, 0.13)", "rgba(59, 130, 246, 0.03)"],
  },
  {
    id: 4,
    title: "Appointments Completed",
    value: "45",
    change: "Last 30-days",
    icon: "wallet",
    iconColor: "#635BFF",
    iconBg: "#EEF2FF",
    bgGradient: ["rgba(99, 91, 255, 0.13)", "rgba(99, 91, 255, 0.03)"],
  },
  {
    id: 5,
    title: "Appointments Book Now",
    value: "52",
    change: "Last 30-days",
    icon: "calendar",
    iconColor: "#14B8A6",
    iconBg: "#CCFBF1",
    bgGradient: ["rgba(20, 184, 166, 0.13)", "rgba(20, 184, 166, 0.03)"],
  },
  {
    id: 6,
    title: "Average Ticket",
    value: "€ 100",
    change: "Average spend",
    icon: "pricetag",
    iconColor: "#22C55E",
    iconBg: "#DCFCE7",
    bgGradient: ["rgba(34, 197, 94, 0.13)", "rgba(34, 197, 94, 0.03)"],
  },
];

export const SERVICE_REVENUE_PAGE_1 = [
  { name: "Haircut", value: 1700, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 1800, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 2000, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 2000, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 2000, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 2100, max: 2800, color: "#635BFF" },
  { name: "Haircut", value: 2400, max: 2800, color: "#635BFF" },
];

export const SERVICE_REVENUE_PAGE_2 = [
  { name: "Coloring", value: 2800, max: 2800, color: "#EC4899" },
  { name: "Styling", value: 2200, max: 2800, color: "#06B6D4" },
  { name: "Nail Care", value: 1900, max: 2800, color: "#FBBF24" },
  { name: "Facial", value: 2600, max: 2800, color: "#2DD4BF" },
  { name: "Waxing", value: 1500, max: 2800, color: "#8B5CF6" },
  { name: "Massage", value: 2300, max: 2800, color: "#10B981" },
  { name: "Makeup", value: 1800, max: 2800, color: "#F43F5E" },
];

export const CATEGORY_DONUT_DATA = [
  { name: "Category 1", value: 2500, percentage: "25%", color: "#635BFF" },
  { name: "Category 2", value: 2000, percentage: "20%", color: "#06B6D4" },
  { name: "Category 3", value: 1500, percentage: "15%", color: "#FBBF24" },
  { name: "Category 4", value: 1500, percentage: "15%", color: "#2DD4BF" },
  { name: "Category 5", value: 1000, percentage: "10%", color: "#EC4899" },
  { name: "Category 6", value: 800, percentage: "8%", color: "#10B981" },
  { name: "Category 7", value: 700, percentage: "7%", color: "#1E293B" },
];

export const MONTHLY_COSTS_VS_SALARIES = [
  { month: "Jan", salaries: 1400, costs: 3200 },
  { month: "Feb", salaries: 1650, costs: 3100 },
  { month: "Mar", salaries: 1750, costs: 2450 },
  { month: "Apr", salaries: 1950, costs: 2400 },
  { month: "May", salaries: 1900, costs: 2100 },
  { month: "Jun", salaries: 1850, costs: 1500 },
  { month: "Jul", salaries: 1800, costs: 1450 },
  { month: "Aug", salaries: 1850, costs: 1500 },
  { month: "Sep", salaries: 1900, costs: 1400 },
  { month: "Oct", salaries: 2050, costs: 1300 },
  { month: "Nov", salaries: 2000, costs: 1350 },
  { month: "Dec", salaries: 1900, costs: 1300 },
];

export const CLIENT_LOYAL_CUSTOMERS = [
  {
    id: 1,
    name: "Sofa Biachi",
    lastVisit: "November 27, 2024",
    appointments: 25,
    spent: "€ 1,700",
  },
  {
    id: 2,
    name: "Guy Hawkins",
    lastVisit: "October 04, 2024",
    appointments: 24,
    spent: "€ 1,500",
  },
  {
    id: 3,
    name: "Cameron Williamson",
    lastVisit: "December 20, 2024",
    appointments: 20,
    spent: "€ 1,200",
  },
];

export const AGE_GROUP_DATA = [
  { label: "18-25", percentage: 15, color: "#635BFF" },
  { label: "26-33", percentage: 25, color: "#06B6D4" },
  { label: "34-41", percentage: 20, color: "#FBBF24" },
  { label: "42-49", percentage: 15, color: "#2DD4BF" },
  { label: "50-57", percentage: 15, color: "#F43F5E" },
  { label: ">58", percentage: 10, color: "#22C55E" },
];

export const VISIT_FREQ_DAILY = [
  { label: "Sun", visits: 4 },
  { label: "Mon", visits: 3 },
  { label: "Tue", visits: 3 },
  { label: "Wed", visits: 5 },
  { label: "Thu", visits: 4 },
  { label: "Fri", visits: 2 },
  { label: "Sat", visits: 3 },
];

export const VISIT_FREQ_WEEKLY = [
  { label: "Week 1", visits: 15 },
  { label: "Week 2", visits: 20 },
  { label: "Week 3", visits: 18 },
  { label: "Week 4", visits: 25 },
];

export const DAILY_PRODUCTION_DATA = [
  { month: "Jan", above: 1200, below: 1800 },
  { month: "Feb", above: 2500, below: 800 },
  { month: "Mar", above: 800, below: 1600 },
  { month: "Apr", above: 2800, below: 1200 },
  { month: "May", above: 0, below: 1200 },
  { month: "Jun", above: 2600, below: 1800 },
  { month: "Jul", above: 2600, below: 1200 },
];

export const PRODUCTION_TRENDS_YEARLY = [
  { month: "Jan", val: 1900 },
  { month: "Feb", val: 2100 },
  { month: "Mar", val: 2200 },
  { month: "Apr", val: 1800 },
  { month: "May", val: 1500 },
  { month: "Jun", val: 1100 },
  { month: "Jul", val: 1800 },
  { month: "Aug", val: 2800 },
  { month: "Sep", val: 2700 },
  { month: "Oct", val: 2600 },
  { month: "Nov", val: 2500 },
  { month: "Dec", val: 2400 },
];

export const PAYMENTS_PER_YEAR_DATA = [
  { year: "2020", amount: 1200 },
  { year: "2021", amount: 1500 },
  { year: "2022", amount: 1800 },
  { year: "2023", amount: 1600 },
  { year: "2024", amount: 3200 },
  { year: "2025", amount: 3500 },
];
