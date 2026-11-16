export interface ContractItem {
  id: string;
  employee: {
    name: string;
    avatarEmoji: string;
    role: string;
  };
  salon: {
    name: string;
    city: string;
  };
  type: "Full Time" | "Part Time" | "Vat collaboration" | "Stage";
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive" | "Pending";
  salary?: string;
  ccnlLevel?: string;
  trialPeriod?: string;
  weeklyHours?: string;
}

export interface EmployeeNoticeItem {
  id: string;
  title: string;
  recipient: {
    name: string;
    email: string;
    avatar?: string;
    avatarEmoji?: string;
  };
  dateSent: string;
  status: "Read" | "Unread";
  message?: string;
  attachmentName?: string;
  attachmentSize?: string;
}

export interface OwnerDocumentItem {
  id: string;
  title: string;
  category: "Corporate Bylaws" | "Trade License" | "Lease Agreement" | "Chamber of Commerce" | "Insurance";
  salon: string;
  issueDate: string;
  expiryDate?: string;
  status: "Verified" | "Pending Review" | "Expired";
  size: string;
}

export const OVERVIEW_METRIC_CARDS = [
  {
    id: "notices",
    title: "Employee Notices",
    value: "24",
    icon: "people",
    bgColor: "#FFFBEB",
    iconBg: "#F8C209",
    iconColor: "#FFFFFF",
    targetTab: "Notices" as const,
  },
  {
    id: "contracts",
    title: "Contracts",
    value: "142",
    icon: "documents",
    bgColor: "#EEECFF",
    iconBg: "#635BFF",
    iconColor: "#FFFFFF",
    targetTab: "Contracts" as const,
  },
  {
    id: "ownerDocs",
    title: "Owner Documents",
    value: "86",
    icon: "shield-checkmark",
    bgColor: "#F0FDF4",
    iconBg: "#22C55E",
    iconColor: "#FFFFFF",
    targetTab: "OwnerDocs" as const,
  },
  {
    id: "receipts",
    title: "Receipts",
    value: "1,240",
    icon: "receipt",
    bgColor: "#F8FAFC",
    iconBg: "#64748B",
    iconColor: "#FFFFFF",
    targetTab: "OwnerDocs" as const,
  },
];

export const DOC_TYPE_DATA_MAP: Record<string, { total: string; values: number[] }> = {
  Daily: { total: "10", values: [25, 25, 25, 25] },
  Weekly: { total: "45", values: [40, 20, 15, 25] },
  Monthly: { total: "128", values: [30, 35, 10, 25] },
};

export const NOTICES_DATA_MAP: Record<string, { total: string; unread: number; read: number }> = {
  Daily: { total: "2", unread: 50, read: 50 },
  Weekly: { total: "14", unread: 70, read: 30 },
  Monthly: { total: "24", unread: 60, read: 40 },
};

export const CONTRACTS_DISTRIBUTION_DATA_MAP: Record<
  string,
  { active: number; expiring: number; expired: number; max: number }
> = {
  Daily: { active: 30, expiring: 12, expired: 6, max: 35 },
  Weekly: { active: 55, expiring: 20, expired: 10, max: 70 },
  Monthly: { active: 142, expiring: 34, expired: 18, max: 180 },
};

export const MOCK_CONTRACTS: ContractItem[] = [
  {
    id: "c1",
    employee: { name: "Maria Rodriguez", avatarEmoji: "👩", role: "Senior Stylist" },
    salon: { name: "Glamour Beauty Roma", city: "Rome" },
    type: "Full Time",
    startDate: "01 Jan 2024",
    endDate: "31 Dec 2026",
    status: "Active",
    salary: "€ 1,850 / mo",
    ccnlLevel: "Level 1 (Super)",
    trialPeriod: "3 Months",
    weeklyHours: "40 hrs / week",
  },
  {
    id: "c2",
    employee: { name: "Marco Rossi", avatarEmoji: "👨", role: "Colorist Master" },
    salon: { name: "Glamour Beauty Roma", city: "Rome" },
    type: "Part Time",
    startDate: "15 Feb 2024",
    endDate: "15 Feb 2025",
    status: "Active",
    salary: "€ 1,200 / mo",
    ccnlLevel: "Level 2",
    trialPeriod: "2 Months",
    weeklyHours: "24 hrs / week",
  },
  {
    id: "c3",
    employee: { name: "Sofia Bianchi", avatarEmoji: "👩", role: "Nail Artist" },
    salon: { name: "Milano Hair Lounge", city: "Milan" },
    type: "Vat collaboration",
    startDate: "01 Mar 2024",
    endDate: "28 Feb 2025",
    status: "Active",
    salary: "€ 2,100 / mo",
    ccnlLevel: "Autonomous",
    trialPeriod: "None",
    weeklyHours: "35 hrs / week",
  },
  {
    id: "c4",
    employee: { name: "Luca Conti", avatarEmoji: "👨", role: "Junior Barber" },
    salon: { name: "Milano Hair Lounge", city: "Milan" },
    type: "Stage",
    startDate: "01 Jun 2024",
    endDate: "30 Nov 2024",
    status: "Pending",
    salary: "€ 800 / mo",
    ccnlLevel: "Trainee",
    trialPeriod: "1 Month",
    weeklyHours: "30 hrs / week",
  },
  {
    id: "c5",
    employee: { name: "Francesca Neri", avatarEmoji: "👩", role: "Receptionist" },
    salon: { name: "Glamour Beauty Roma", city: "Rome" },
    type: "Full Time",
    startDate: "01 Jan 2023",
    endDate: "31 Dec 2023",
    status: "Inactive",
    salary: "€ 1,450 / mo",
    ccnlLevel: "Level 3",
    trialPeriod: "3 Months",
    weeklyHours: "40 hrs / week",
  },
];

export const MOCK_EMPLOYEE_NOTICES: EmployeeNoticeItem[] = [
  {
    id: "n1",
    title: "Annual Leave Policy 2025",
    recipient: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      avatarEmoji: "👩",
    },
    dateSent: "06/15/2025",
    status: "Read",
    message:
      "Please review the attached document regarding the Annual Leave Policy 2025. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "annual_leave_policy_2025.pdf",
    attachmentSize: "1.2 MB",
  },
  {
    id: "n2",
    title: "Health & Safety Guidelines",
    recipient: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      avatarEmoji: "👨",
    },
    dateSent: "06/15/2025",
    status: "Unread",
    message:
      "Please review the attached document regarding the Health & Safety Guidelines. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "health_and_safety_guidelines.pdf",
    attachmentSize: "2.4 MB",
  },
  {
    id: "n3",
    title: "Updated Working Hours",
    recipient: {
      name: "Alice Johnson",
      email: "alice.j@example.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      avatarEmoji: "👩",
    },
    dateSent: "06/15/2025",
    status: "Read",
    message:
      "Please review the attached document regarding the Updated Working Hours. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "working_hours_schedule.pdf",
    attachmentSize: "850 KB",
  },
  {
    id: "n4",
    title: "Performance Review Schedule",
    recipient: {
      name: "Bob Williams",
      email: "bob.w@example.com",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      avatarEmoji: "👨",
    },
    dateSent: "06/15/2025",
    status: "Unread",
    message:
      "Please review the attached document regarding the Performance Review Schedule. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "q2_performance_review.pdf",
    attachmentSize: "1.1 MB",
  },
  {
    id: "n5",
    title: "Code of Conduct Update",
    recipient: {
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      avatarEmoji: "👨",
    },
    dateSent: "06/15/2025",
    status: "Read",
    message:
      "Please review the attached document regarding the Code of Conduct Update. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "code_of_conduct_2025.pdf",
    attachmentSize: "1.8 MB",
  },
  {
    id: "n6",
    title: "Emergency Procedures",
    recipient: {
      name: "Diana Prince",
      email: "diana.p@example.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      avatarEmoji: "👩",
    },
    dateSent: "06/15/2025",
    status: "Unread",
    message:
      "Please review the attached document regarding the Emergency Procedures. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "emergency_protocols_salon.pdf",
    attachmentSize: "3.2 MB",
  },
  {
    id: "n7",
    title: "Benefits Package Overview",
    recipient: {
      name: "Ethan Hunt",
      email: "ethan.h@example.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      avatarEmoji: "👨",
    },
    dateSent: "06/15/2025",
    status: "Read",
    message:
      "Please review the attached document regarding the Benefits Package Overview. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.",
    attachmentName: "benefits_handbook_2025.pdf",
    attachmentSize: "2.1 MB",
  },
];

export const MOCK_OWNER_DOCUMENTS: OwnerDocumentItem[] = [
  {
    id: "od1",
    title: "Chamber of Commerce Registration (Visura Camerale)",
    category: "Chamber of Commerce",
    salon: "Glamour Beauty Roma S.r.l.",
    issueDate: "15 Jan 2024",
    expiryDate: "15 Jan 2026",
    status: "Verified",
    size: "2.4 MB",
  },
  {
    id: "od2",
    title: "Commercial Lease Agreement - Via Veneto 42",
    category: "Lease Agreement",
    salon: "Glamour Beauty Roma S.r.l.",
    issueDate: "01 Sep 2023",
    expiryDate: "31 Aug 2029",
    status: "Verified",
    size: "4.8 MB",
  },
  {
    id: "od3",
    title: "Sanitary Municipal Authorization (SCIA Sanitaria)",
    category: "Trade License",
    salon: "Glamour Beauty Roma S.r.l.",
    issueDate: "10 Oct 2023",
    status: "Verified",
    size: "1.8 MB",
  },
  {
    id: "od4",
    title: "Civil Liability Insurance Policy (RC Terzi)",
    category: "Insurance",
    salon: "Glamour Beauty Roma S.r.l.",
    issueDate: "01 Jan 2024",
    expiryDate: "31 Dec 2024",
    status: "Pending Review",
    size: "3.1 MB",
  },
  {
    id: "od5",
    title: "Corporate Bylaws & Articles of Incorporation",
    category: "Corporate Bylaws",
    salon: "Glamour Beauty Roma S.r.l.",
    issueDate: "20 Aug 2022",
    status: "Verified",
    size: "5.6 MB",
  },
];
