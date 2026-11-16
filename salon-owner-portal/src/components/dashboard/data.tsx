import { Briefcase, Calendar, User, Users } from "lucide-react";
import { ReceiptAppointment, Appointment } from "./types";

export const statCardsDemoData = [
    {
        id: 1,
        title: "Monthly Processed Sales",
        value: "€ 23,850",
        change: "+12.5% from last month",
        icon: <Briefcase className="w-5 h-5 text-[#635BFF]" />,
        iconBgColor: "bg-[#E0E7FF]",
        iconShadowColor: "",
        cardStyle: "bg-gradient-to-b from-[#635BFF]/[12%] to-[#635BFF]/[3%]",
    },
    {
        id: 2,
        title: "Appointments",
        value: "23",
        change: "+18.5% from last month",
        icon: <Calendar className="w-5 h-5 text-[#F8C209]" />,
        iconBgColor: "bg-[#FEF3C7]",
        iconShadowColor: "",
        cardStyle: "bg-gradient-to-b from-[#F8C209]/[13%] to-[#F8C209]/[3%]",
    },
    {
        id: 3,
        title: "Clients",
        value: "44",
        change: "+10% from last month",
        icon: <User className="w-5 h-5 text-[#16CDC7]" />,
        iconBgColor: "bg-[#CCFBF1]",
        iconShadowColor: "",
        cardStyle: "bg-gradient-to-b from-[#16CDC7]/[13%] to-[#16CDC7]/[3%]",
    },
    {
        id: 4,
        title: "Team Members",
        value: "10",
        change: "",
        icon: <Users className="w-5 h-5 text-[#10B981]" />,
        iconBgColor: "bg-[#D1FAE5]",
        iconShadowColor: "",
        cardStyle: "bg-gradient-to-b from-[#10B981]/[13%] to-[#10B981]/[3%]",
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
