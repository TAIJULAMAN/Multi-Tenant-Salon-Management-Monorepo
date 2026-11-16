import { CalendarCheck, CalendarPlus, RefreshCw, Award } from "lucide-react";
import { ReceiptAppointment, Appointment, PaymentPeriodType, PaymentPeriodConfig } from "./types";

export const statCardsDemoData = [
    {
        id: 1,
        title: "Appointments Completed (Last 30 days)",
        value: "45",
        change: "+10.5% from last month",
        icon: <CalendarCheck className="w-5 h-5 text-white" />,
        iconBgColor: "bg-[#635BFF]",
        iconColor: "text-white",
        badge: null,
    },
    {
        id: 2,
        title: "Appointments Book Now (Last 30 days)",
        value: "52",
        change: "+20% from last month",
        icon: <CalendarPlus className="w-5 h-5 text-white" />,
        iconBgColor: "bg-[#06B6D4]",
        iconColor: "text-white",
        badge: null,
    },
    {
        id: 3,
        title: "Retention Rate",
        value: "68%",
        change: "+20% from last month",
        icon: <RefreshCw className="w-5 h-5 text-white" />,
        iconBgColor: "bg-[#F59E0B]",
        iconColor: "text-white",
        badge: null,
    },
    {
        id: 4,
        title: "Performance",
        value: "133%",
        change: null,
        badge: "Goal Achieved",
        icon: <Award className="w-5 h-5 text-white" />,
        iconBgColor: "bg-[#10B981]",
        iconColor: "text-white",
    }
];

export const clientsData = [
    {
        id: "#000",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1",
        service: "Haircut",
        date: "5 Aug 2025 (12:00 AM - 12:15 AM)",
        price: "€ 170",
        status: "Booked",
        statusColor: "bg-[#E0E7FF] text-[#635BFF]",
    },
    {
        id: "#001",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2",
        service: "Haircut",
        date: "5 Aug 2025 (12:00 AM - 12:15 AM)",
        price: "€ 170",
        status: "Started",
        statusColor: "bg-[#F1F5F9] text-[#1E293B]",
    },
    {
        id: "#002",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3",
        service: "Haircut",
        date: "5 Aug 2025 (12:00 AM - 12:15 AM)",
        price: "€ 170",
        status: "Canceled",
        statusColor: "bg-[#FFE4E6] text-[#FF4C6A]",
    },
    {
        id: "#003",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria4",
        service: "Haircut",
        date: "5 Aug 2025 (12:00 AM - 12:15 AM)",
        price: "€ 170",
        status: "Confirmed",
        statusColor: "bg-[#D1FAE5] text-[#10B981]",
    },
    {
        id: "#004",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria5",
        service: "Haircut",
        date: "5 Aug 2025 (12:00 AM - 12:15 AM)",
        price: "€ 170",
        status: "Arrived",
        statusColor: "bg-[#FEF3C7] text-[#D97706]",
    },
];

export const clientsGrowthChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Dataset 1",
            data: [260, 250, 190, 180, 175, 120, 95, 100, 140, 150, 140, 125],
            borderColor: "#635BFF",
            backgroundColor: "#635BFF",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
        },
        {
            label: "Dataset 2",
            data: [110, 120, 140, 130, 115, 115, 120, 140, 150, 140, 110, 95],
            borderColor: "#2DD4BF",
            backgroundColor: "#2DD4BF",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
        },
    ],
};

export const revenueTrendChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [32, 35, 38, 38, 32, 33, 35, 41, 38, 45, 50, 55],
};

export const appointmentsChartCompletedData = [70, 56, 80, 58, 28, 28, 28, 28, 28, 28, 28, 28];
export const appointmentsChartCancelledData = [28, 36, 48, 26, 48, 48, 48, 48, 48, 48, 48, 48];

export const onlinePaymentChartData = {
    labels: ["To Confirm", "Overdue"],
    datasets: [
        {
            data: [4, 4],
            backgroundColor: ["#635BFF", "#F43F5E"],
            borderWidth: 0,
            cutout: "85%",
            circumference: 180,
            rotation: 270,
            borderRadius: 30,
        },
    ],
};

export const receiptAppointmentsData: ReceiptAppointment[] = [
    {
        id: 1,
        name: "Maria Rodriguez",
        time: "11:00",
        service: "Haircut",
        teamMember: "Mada",
        estimatedPrice: "€ 350",
        avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
        id: 2,
        name: "Maria Rodriguez",
        time: "11:00",
        service: "Haircut",
        teamMember: "Mada",
        estimatedPrice: "€ 350",
        avatar: "https://i.pravatar.cc/100?img=9",
    },
    {
        id: 3,
        name: "Maria Rodriguez",
        time: "11:00",
        service: "Haircut",
        teamMember: "Mada",
        estimatedPrice: "€ 350",
        avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
        id: 4,
        name: "Maria Rodriguez",
        time: "11:00",
        service: "Haircut",
        teamMember: "Mada",
        estimatedPrice: "€ 350",
        avatar: "https://i.pravatar.cc/100?img=17",
    },
];
export const agendaAppointmentsData: Appointment[] = [
    {
        id: "1",
        clientId: "1",
        photo: "/avatar/icon1.png",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        time: "12:00 AM - 12:15 AM",
        status: "Booked",
    },
    {
        id: "2",
        clientId: "2",
        photo: "/avatar/icon2.png",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        time: "12:00 AM - 12:15 AM",
        status: "Booked",
    },
    {
        id: "3",
        clientId: "3",
        photo: "/avatar/icon1.png",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        time: "12:00 AM - 12:15 AM",
        status: "Booked",
    },
    {
        id: "4",
        clientId: "4",
        photo: "/avatar/icon1.png",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        time: "12:00 AM - 12:15 AM",
        status: "Booked",
    },
    {
        id: "5",
        clientId: "5",
        photo: "/avatar/icon1.png",
        name: "Maria Rodriguez",
        phone: "+39 345 678 9123",
        time: "12:00 AM - 12:15 AM",
        status: "Booked",
    }
];

export const agendaOptions = [
    "Sep 16, 2025",
    "Sep 17, 2025",
    "Sep 18, 2025",
    "Sep 19, 2025",
];

export const appointmentsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Completed",
            data: appointmentsChartCompletedData,
            backgroundColor: "#635BFF",
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.5,
        },
        {
            label: "Cancelled",
            data: appointmentsChartCancelledData,
            backgroundColor: "#F43F5E",
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.5,
        },
    ],
};

export const appointmentsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#94A3B8", font: { size: 10, family: "'Manrope', sans-serif" } }
        },
        y: {
            grid: { color: "#F1F5F9", borderDash: [4, 4] },
            border: { display: false },
            ticks: { color: "#94A3B8", font: { size: 10, family: "'Manrope', sans-serif" }, stepSize: 20 },
            min: 0,
            max: 100
        },
    },
};

export const revenueData = {
    labels: revenueTrendChartData.labels,
    datasets: [
        {
            label: "Revenue",
            data: revenueTrendChartData.data,
            borderColor: "#2DD4BF",
            backgroundColor: "rgba(45, 212, 191, 0.0)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#2DD4BF",
            fill: false,
        },
    ],
};

export const revenueOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            backgroundColor: "#1E293B",
            titleFont: { size: 13, family: "'Manrope', sans-serif" },
            bodyFont: { size: 12, family: "'Manrope', sans-serif" },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            mode: 'index',
            intersect: false,
            callbacks: {
                label: (context: any) => `Revenue: € ${context.raw}K`
            }
        }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#94A3B8", font: { size: 10, family: "'Manrope', sans-serif" } }
        },
        y: {
            grid: { color: "#F1F5F9" },
            border: { display: false },
            ticks: {
                color: "#94A3B8",
                font: { size: 10, family: "'Manrope', sans-serif" },
                stepSize: 10,
                callback: (value: any) => value + "K"
            },
            min: 20,
            max: 70,
        },
    },
};

export const paymentPeriodsData: Record<PaymentPeriodType, PaymentPeriodConfig> = {
  Yearly: {
    title: "Payments per Year",
    yLabels: [
      "€ 4.000",
      "€ 3.500",
      "€ 3.000",
      "€ 2.500",
      "€ 2.000",
      "€ 1.500",
      "€ 1.000",
    ],
    pages: [
      [
        { label: "2014", amount: 900, displayAmount: "€ 900", total: "€ 5,400", monthlyMean: "€ 450", percentHeight: 22 },
        { label: "2015", amount: 1000, displayAmount: "€ 1,000", total: "€ 6,000", monthlyMean: "€ 500", percentHeight: 25 },
        { label: "2016", amount: 1100, displayAmount: "€ 1,100", total: "€ 6,600", monthlyMean: "€ 550", percentHeight: 27 },
        { label: "2017", amount: 1150, displayAmount: "€ 1,150", total: "€ 6,900", monthlyMean: "€ 575", percentHeight: 28 },
        { label: "2018", amount: 1200, displayAmount: "€ 1,200", total: "€ 7,200", monthlyMean: "€ 600", percentHeight: 30 },
        { label: "2019", amount: 1250, displayAmount: "€ 1,250", total: "€ 7,500", monthlyMean: "€ 625", percentHeight: 31 },
      ],
      [
        { label: "2020", amount: 1300, displayAmount: "€ 1,300", total: "€ 7,800", monthlyMean: "€ 650", percentHeight: 28 },
        { label: "2021", amount: 1400, displayAmount: "€ 1,400", total: "€ 8,400", monthlyMean: "€ 700", percentHeight: 32 },
        { label: "2022", amount: 1500, displayAmount: "€ 1,500", total: "€ 9,000", monthlyMean: "€ 750", percentHeight: 35 },
        { label: "2023", amount: 1500, displayAmount: "€ 1,500", total: "€ 9,600", monthlyMean: "€ 800", percentHeight: 35 },
        { label: "2024", amount: 1600, displayAmount: "€ 1,600", total: "€ 10,200", monthlyMean: "€ 850", percentHeight: 38 },
        { label: "2025", amount: 2100, displayAmount: "€ 2,100", total: "€ 12,400", monthlyMean: "€ 1,050", percentHeight: 52 },
      ],
    ],
  },
  Quarterly: {
    title: "Payments per Quarter",
    yLabels: [
      "€ 4.000",
      "€ 3.500",
      "€ 3.000",
      "€ 2.500",
      "€ 2.000",
      "€ 1.500",
      "€ 1.000",
    ],
    pages: [
      [
        { label: "Q1 2024", amount: 2600, displayAmount: "€ 2,600", total: "€ 7,800", monthlyMean: "€ 866", percentHeight: 65 },
        { label: "Q2 2024", amount: 2900, displayAmount: "€ 2,900", total: "€ 8,700", monthlyMean: "€ 966", percentHeight: 72 },
        { label: "Q3 2024", amount: 3200, displayAmount: "€ 3,200", total: "€ 9,600", monthlyMean: "€ 1,066", percentHeight: 80 },
        { label: "Q4 2024", amount: 3100, displayAmount: "€ 3,100", total: "€ 9,300", monthlyMean: "€ 1,033", percentHeight: 77 },
        { label: "Q1 2025", amount: 3400, displayAmount: "€ 3,400", total: "€ 10,200", monthlyMean: "€ 1,133", percentHeight: 85 },
        { label: "Q2 2025", amount: 3800, displayAmount: "€ 3,800", total: "€ 11,400", monthlyMean: "€ 1,266", percentHeight: 95 },
      ],
    ],
  },
  Monthly: {
    title: "Payments per Month",
    yLabels: [
      "€ 2.500",
      "€ 2.000",
      "€ 1.500",
      "€ 1.000",
      "€ 500",
      "€ 250",
      "€ 0",
    ],
    pages: [
      [
        { label: "Jan", amount: 1400, displayAmount: "€ 1,400", total: "€ 1,400", monthlyMean: "€ 1,400", percentHeight: 56 },
        { label: "Feb", amount: 1550, displayAmount: "€ 1,550", total: "€ 1,550", monthlyMean: "€ 1,550", percentHeight: 62 },
        { label: "Mar", amount: 1700, displayAmount: "€ 1,700", total: "€ 1,700", monthlyMean: "€ 1,700", percentHeight: 68 },
        { label: "Apr", amount: 1650, displayAmount: "€ 1,650", total: "€ 1,650", monthlyMean: "€ 1,650", percentHeight: 66 },
        { label: "May", amount: 1800, displayAmount: "€ 1,800", total: "€ 1,800", monthlyMean: "€ 1,800", percentHeight: 72 },
        { label: "Jun", amount: 1950, displayAmount: "€ 1,950", total: "€ 1,950", monthlyMean: "€ 1,950", percentHeight: 78 },
      ],
      [
        { label: "Jul", amount: 2000, displayAmount: "€ 2,000", total: "€ 2,000", monthlyMean: "€ 2,000", percentHeight: 80 },
        { label: "Aug", amount: 1850, displayAmount: "€ 1,850", total: "€ 1,850", monthlyMean: "€ 1,850", percentHeight: 74 },
        { label: "Sep", amount: 2100, displayAmount: "€ 2,100", total: "€ 2,100", monthlyMean: "€ 2,100", percentHeight: 84 },
        { label: "Oct", amount: 2250, displayAmount: "€ 2,250", total: "€ 2,250", monthlyMean: "€ 2,250", percentHeight: 90 },
        { label: "Nov", amount: 2150, displayAmount: "€ 2,150", total: "€ 2,150", monthlyMean: "€ 2,150", percentHeight: 86 },
        { label: "Dec", amount: 2400, displayAmount: "€ 2,400", total: "€ 2,400", monthlyMean: "€ 2,400", percentHeight: 96 },
      ],
    ],
  },
};
