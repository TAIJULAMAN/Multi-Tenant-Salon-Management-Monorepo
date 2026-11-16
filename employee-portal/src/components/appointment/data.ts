export type Status =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled";

export type Appointment = {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone: string;
  service: string;
  scheduledDate: string;
  price: string;
  status: Status;
};

export const allAppointments: Appointment[] = [
  {
    id: "001",
    clientName: "Shah Aman",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+39 345 678 9123",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Booked",
  },
  {
    id: "002",
    clientName: "John Doe",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+1 234 567 8901",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Started",
  },
  {
    id: "003",
    clientName: "Elena Rossi",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+39 123 456 7890",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Canceled",
  },
  {
    id: "004",
    clientName: "Alex Smith",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+44 7700 900077",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Confirmed",
  },
  {
    id: "005",
    clientName: "Sophie Chen",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+86 138 0013 8000",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "006",
    clientName: "Saeed",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+971 50 123 4567",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Completed",
  },
  {
    id: "007",
    clientName: "Hasan",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+20 10 9876 5432",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "008",
    clientName: "Aisha",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+92 300 1234567",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "009",
    clientName: "Fatima",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+971 55 987 6543",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Canceled",
  },
  {
    id: "010",
    clientName: "Ali",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+92 333 9876543",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Booked",
  },
];

export const statusStyles: Record<Status, string> = {
  Booked: "bg-[#DDDBFF] text-[#635BFF]",
  Confirmed: "bg-[#ECFDFD] text-[#16CDC7]",
  Arrived: "bg-[#FFF9E5] text-[#FFD648]",
  Started: "bg-[#F6F7F9] text-[#0A2540]",
  Completed: "bg-[#EBFAF0] text-[#36C76C]",
  Canceled: "bg-[#FFE5ED] text-[#FF6692]",
};

export const recentMembers = [
  {
    name: "Shah Aman",
    phone: "+39 345 678 9123",
    clientAvatar: "/avatar/icon1.png",
  },
  {
    name: "John Doe",
    phone: "+1 234 567 8901",
    clientAvatar: "/avatar/icon2.png",
  },
  {
    name: "Elena Rossi",
    phone: "+39 123 456 7890",
    clientAvatar: "/avatar/icon3.png",
  },
  {
    name: "Alex Smith",
    phone: "+44 7700 900077",
    clientAvatar: "/avatar/icon1.png",
  },
  {
    name: "Sophie Chen",
    phone: "+86 138 0013 8000",
    clientAvatar: "/avatar/icon2.png",
  },
];

export const statusFilters: (Status | "All")[] = [
  "All",
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "Completed",
  "Canceled",
];

export const LANGUAGES = ["English (US)", "Spanish", "French"];

export const COUNTRIES = ["United States", "United Kingdom", "Canada"];

export const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

export const TIME_FORMATS = ["12h", "24h"];

export const TIMEZONES = ["EST", "PST", "CST", "MST", "GMT"];

export const DURATIONS = ["15", "30", "45", "60"];

export const WEEKDAYS = ["Saturday", "Sunday", "Monday"];
