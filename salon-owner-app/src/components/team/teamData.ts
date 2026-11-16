export interface MemberData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Manager" | "Staff" | "Accountant";
  status: "Active" | "Pending" | "Inactive";
  employmentStatus: string;
  contractType: "Full Time" | "Part Time" | "Stage" | "Vat collaboration";
  lastActive: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  revenueGenerated: string;
  completedBookings: number;
  clientRetention: string;
}

export const initialTeamMembers: MemberData[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    email: "maria@beautywellness.com",
    phone: "+39 345 678 9123",
    role: "Manager",
    status: "Active",
    employmentStatus: "Currently Hired",
    contractType: "Full Time",
    lastActive: "1h ago",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    rating: 5.0,
    reviewsCount: 124,
    revenueGenerated: "€ 14,250",
    completedBookings: 182,
    clientRetention: "92%",
  },
  {
    id: "2",
    name: "Leslie Alexander",
    email: "leslie@beautywellness.com",
    phone: "+39 348 912 3456",
    role: "Staff",
    status: "Active",
    employmentStatus: "Currently Hired",
    contractType: "Part Time",
    lastActive: "2h ago",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
    rating: 4.9,
    reviewsCount: 98,
    revenueGenerated: "€ 9,800",
    completedBookings: 145,
    clientRetention: "88%",
  },
  {
    id: "3",
    name: "Robert Fox",
    email: "robert@beautywellness.com",
    phone: "+39 340 555 7890",
    role: "Staff",
    status: "Active",
    employmentStatus: "Currently Hired",
    contractType: "Full Time",
    lastActive: "3h ago",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    rating: 4.8,
    reviewsCount: 76,
    revenueGenerated: "€ 8,450",
    completedBookings: 112,
    clientRetention: "85%",
  },
  {
    id: "4",
    name: "Emma Watson",
    email: "emma@beautywellness.com",
    phone: "+39 333 444 5555",
    role: "Accountant",
    status: "Active",
    employmentStatus: "Currently Hired",
    contractType: "Stage",
    lastActive: "1d ago",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    rating: 5.0,
    reviewsCount: 45,
    revenueGenerated: "€ 0",
    completedBookings: 0,
    clientRetention: "N/A",
  },
  {
    id: "5",
    name: "Oliver Twist",
    email: "oliver@beautywellness.com",
    phone: "+39 349 888 1234",
    role: "Staff",
    status: "Pending",
    employmentStatus: "Currently Hired",
    contractType: "Vat collaboration",
    lastActive: "5m ago",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    rating: 4.7,
    reviewsCount: 32,
    revenueGenerated: "€ 4,120",
    completedBookings: 56,
    clientRetention: "80%",
  },
  {
    id: "6",
    name: "Sophia Loren",
    email: "sophia@beautywellness.com",
    phone: "+39 338 777 6655",
    role: "Staff",
    status: "Inactive",
    employmentStatus: "Out of Team: 02/02/2025",
    contractType: "Full Time",
    lastActive: "1w ago",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    rating: 4.6,
    reviewsCount: 88,
    revenueGenerated: "€ 7,300",
    completedBookings: 94,
    clientRetention: "79%",
  },
];

export interface SalaryRecord {
  id: string;
  name: string;
  uploader: string;
  avatarUrl: string;
  role: string;
  netAmount: string;
  month?: string;
  date: string;
  status: "pending" | "paid" | "Approved" | "Under Review" | "Paid";
  grossSalary: string;
  netSalary: string;
  trfMonthly: string;
  cumulativeTrf: string;
  iban: string;
}

export const initialPendingSalaries: SalaryRecord[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 123",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
  },
  {
    id: "2",
    name: "Leslie Alexander",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 124",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
  },
  {
    id: "3",
    name: "Robert Fox",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 125",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
  },
  {
    id: "4",
    name: "Emma Watson",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    role: "Accountant",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 126",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
  },
  {
    id: "5",
    name: "Oliver Twist",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 127",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
  },
];

export const initialApprovedSalaries: SalaryRecord[] = [
  {
    id: "6",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    netAmount: "€ 3,200.00",
    grossSalary: "€ 3,200.00",
    netSalary: "€ 2,600.00",
    trfMonthly: "€ 600.00",
    cumulativeTrf: "€ 3,800.00",
    iban: "IT60 X054 ******** 123",
    date: "Dec 01, 2024",
    status: "Approved",
  },
];

export interface SalaryMonthGroup {
  month: string;
  totalAmount: string;
  paymentsCount: number;
  averageSalary: string;
  records: SalaryRecord[];
}

export const initialSalaryHistoryGroups: SalaryMonthGroup[] = [
  {
    month: "December 2024",
    totalAmount: "€ 16,000.00",
    paymentsCount: 5,
    averageSalary: "€ 16,000.00",
    records: [
      {
        id: "h1",
        name: "Maria Rodriguez",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "December 2024",
        date: "Dec 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,800.00",
        iban: "IT60 X054 ******** 123",
      },
      {
        id: "h2",
        name: "Leslie Alexander",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "December 2024",
        date: "Dec 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,800.00",
        iban: "IT60 X054 ******** 124",
      },
      {
        id: "h3",
        name: "Robert Fox",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "December 2024",
        date: "Dec 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,800.00",
        iban: "IT60 X054 ******** 125",
      },
      {
        id: "h4",
        name: "Emma Watson",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        role: "Accountant",
        netAmount: "€ 3,200.00",
        month: "December 2024",
        date: "Dec 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,800.00",
        iban: "IT60 X054 ******** 126",
      },
      {
        id: "h5",
        name: "Oliver Twist",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "December 2024",
        date: "Dec 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,800.00",
        iban: "IT60 X054 ******** 127",
      },
    ],
  },
  {
    month: "November 2024",
    totalAmount: "€ 16,000.00",
    paymentsCount: 5,
    averageSalary: "€ 16,000.00",
    records: [
      {
        id: "h6",
        name: "Maria Rodriguez",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "November 2024",
        date: "Nov 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,200.00",
        iban: "IT60 X054 ******** 123",
      },
      {
        id: "h7",
        name: "Leslie Alexander",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "November 2024",
        date: "Nov 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,200.00",
        iban: "IT60 X054 ******** 124",
      },
      {
        id: "h8",
        name: "Robert Fox",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "November 2024",
        date: "Nov 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,200.00",
        iban: "IT60 X054 ******** 125",
      },
      {
        id: "h9",
        name: "Emma Watson",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "November 2024",
        date: "Nov 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,200.00",
        iban: "IT60 X054 ******** 126",
      },
      {
        id: "h10",
        name: "Oliver Twist",
        uploader: "Mario Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        role: "Staff",
        netAmount: "€ 3,200.00",
        month: "November 2024",
        date: "Nov 01, 2024",
        status: "Paid",
        grossSalary: "€ 3,200.00",
        netSalary: "€ 2,600.00",
        trfMonthly: "€ 600.00",
        cumulativeTrf: "€ 3,200.00",
        iban: "IT60 X054 ******** 127",
      },
    ],
  },
];

export interface ScheduledShiftRecord {
  id: string;
  name: string;
  role: string;
  day: string;
  time: string;
  weeklyTotal: string;
  avatarUrl: string;
}

export const initialScheduledShiftsData: ScheduledShiftRecord[] = [
  {
    id: "shift1",
    name: "Maria Rodriguez",
    role: "Manager",
    day: "Monday - Friday",
    time: "10:00 - 19:00",
    weeklyTotal: "52h",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "shift2",
    name: "Leslie Alexander",
    role: "Staff",
    day: "Tuesday - Saturday",
    time: "10:00 - 19:00",
    weeklyTotal: "52h",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "shift3",
    name: "Robert Fox",
    role: "Staff",
    day: "Monday - Friday",
    time: "10:00 - 19:00",
    weeklyTotal: "52h",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "shift4",
    name: "Emma Watson",
    role: "Accountant",
    day: "Monday - Friday",
    time: "09:00 - 17:00",
    weeklyTotal: "40h",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "shift5",
    name: "Oliver Twist",
    role: "Staff",
    day: "Wednesday - Sunday",
    time: "11:00 - 20:00",
    weeklyTotal: "45h",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
];

export interface WorkedShiftRecord {
  id: string;
  name: string;
  role: string;
  date: string;
  totalHours: string;
  daysWorked: number;
  avgDay: string;
  clockIn: string;
  clockOut: string;
  breakDuration: string;
  overtime: string;
  avatarUrl: string;
}

export const initialWorkedShiftsData: WorkedShiftRecord[] = [
  {
    id: "work1",
    name: "Maria Rodriguez",
    role: "Manager",
    date: "Dec 01, 2024",
    totalHours: "78h 30m",
    daysWorked: 10,
    avgDay: "7.8h",
    clockIn: "08:55 AM",
    clockOut: "06:10 PM",
    breakDuration: "45 min",
    overtime: "2.5h",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "work2",
    name: "Leslie Alexander",
    role: "Staff",
    date: "Dec 01, 2024",
    totalHours: "72h 15m",
    daysWorked: 9,
    avgDay: "8.0h",
    clockIn: "09:58 AM",
    clockOut: "07:05 PM",
    breakDuration: "30 min",
    overtime: "1.0h",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "work3",
    name: "Robert Fox",
    role: "Staff",
    date: "Dec 01, 2024",
    totalHours: "68h 45m",
    daysWorked: 9,
    avgDay: "7.6h",
    clockIn: "10:50 AM",
    clockOut: "08:12 PM",
    breakDuration: "45 min",
    overtime: "0.5h",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "work4",
    name: "Emma Watson",
    role: "Accountant",
    date: "Dec 01, 2024",
    totalHours: "40h 00m",
    daysWorked: 5,
    avgDay: "8.0h",
    clockIn: "08:58 AM",
    clockOut: "05:02 PM",
    breakDuration: "60 min",
    overtime: "0.0h",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
];


// ==========================================
// Matrix Scheduled Shifts (matching Dashboard Image 1)
// ==========================================
export interface MatrixScheduledShift {
  id: string;
  name: string;
  avatarUrl: string;
  weeklyTotal: string;
  shifts: {
    sun?: string | null;
    mon?: string | null;
    tue?: string | null;
    wed?: string | null;
    thu?: string | null;
    fri?: string | null;
    sat?: string | null;
  };
}

export const initialMatrixScheduledShifts: MatrixScheduledShift[] = [
  {
    id: "m1",
    name: "Maria Rodriguez",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "40h",
    shifts: {
      sun: "09:00 - 17:00",
      mon: "09:00 - 17:00",
      tue: "10:00 - 19:00",
      wed: "Closed",
      thu: "Closed",
      fri: null,
      sat: null,
    },
  },
  {
    id: "m2",
    name: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "32h",
    shifts: {
      sun: null,
      mon: "12:00 - 20:00",
      tue: "12:00 - 20:00",
      wed: "Closed",
      thu: "Closed",
      fri: null,
      sat: null,
    },
  },
  {
    id: "m3",
    name: "James Wilson",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "45h",
    shifts: {
      sun: "08:00 - 16:00",
      mon: "08:00 - 16:00",
      tue: "08:00 - 16:00",
      wed: "Closed",
      thu: "Closed",
      fri: "08:00 - 16:00",
      sat: null,
    },
  },
  {
    id: "m4",
    name: "Elena Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "24h",
    shifts: {
      sun: null,
      mon: null,
      tue: "14:00 - 20:00",
      wed: "Closed",
      thu: "Closed",
      fri: "14:00 - 20:00",
      sat: null,
    },
  },
  {
    id: "m5",
    name: "David Kim",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "40h",
    shifts: {
      sun: "10:00 - 18:00",
      mon: "10:00 - 18:00",
      tue: null,
      wed: "Closed",
      thu: "Closed",
      fri: "10:00 - 18:00",
      sat: null,
    },
  },
  {
    id: "m6",
    name: "Oliver Twist",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "35h",
    shifts: {
      sun: null,
      mon: "09:00 - 17:00",
      tue: "09:00 - 17:00",
      wed: "Closed",
      thu: "Closed",
      fri: "09:00 - 17:00",
      sat: null,
    },
  },
  {
    id: "m7",
    name: "Emma Watson",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "38h",
    shifts: {
      sun: null,
      mon: "10:00 - 18:00",
      tue: "10:00 - 18:00",
      wed: "Closed",
      thu: "Closed",
      fri: "10:00 - 18:00",
      sat: null,
    },
  },
  {
    id: "m8",
    name: "Sophia Loren",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
    weeklyTotal: "40h",
    shifts: {
      sun: "09:00 - 17:00",
      mon: "09:00 - 17:00",
      tue: null,
      wed: "Closed",
      thu: "Closed",
      fri: "09:00 - 17:00",
      sat: null,
    },
  },
];

// ==========================================
// Dashboard Worked Shifts (matching Dashboard Image 2)
// ==========================================
export interface DashboardWorkedShift {
  id: string;
  name: string;
  uploader: string;
  avatarUrl: string;
  role: string;
  hours: string;
  daysWorked: number;
  avgHoursDay: string;
  clockIn: string;
  clockOut: string;
  breakDuration: string;
  overtime: string;
}

export const initialDashboardWorkedShifts: DashboardWorkedShift[] = [
  {
    id: "ws1",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws2",
    name: "Sarah Chen",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws3",
    name: "James Wilson",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "08:00 AM",
    clockOut: "04:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws4",
    name: "Elena Rossi",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "02:00 PM",
    clockOut: "08:00 PM",
    breakDuration: "30 min",
    overtime: "0.0h",
  },
  {
    id: "ws5",
    name: "David Kim",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "10:00 AM",
    clockOut: "06:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws6",
    name: "Oliver Twist",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws7",
    name: "Emma Watson",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    role: "Accountant",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "60 min",
    overtime: "0.0h",
  },
  {
    id: "ws8",
    name: "Sophia Loren",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws9",
    name: "Lucas Silva",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "10:00 AM",
    clockOut: "06:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
  {
    id: "ws10",
    name: "Chloe Bennett",
    uploader: "Mario Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    role: "Staff",
    hours: "160h",
    daysWorked: 21,
    avgHoursDay: "Dec 01, 2024",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    breakDuration: "45 min",
    overtime: "0.0h",
  },
];
