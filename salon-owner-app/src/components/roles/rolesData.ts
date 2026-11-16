export interface RoleUser {
  id: string;
  name: string;
  role: string;
  email: string;
  date: string;
  createdBy: string;
  creatorRole: string;
  avatarBg: string;
  avatarUrl: string;
  lastUpdate: string;
}

export interface PermissionItemData {
  id: string;
  title: string;
  subtitle: string;
  defaultChecked: boolean;
}

export interface PermissionCategoryData {
  id: string;
  title: string;
  items: PermissionItemData[];
}

export const INITIAL_ROLES_DATA: RoleUser[] = [
  {
    id: "1",
    name: "Shah Aman",
    role: "Owner",
    email: "aman@gmail.com",
    date: "05/05/2026",
    createdBy: "Maria Rodriguez",
    creatorRole: "Owner",
    avatarBg: "#FCE7F3",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=ffdfbf",
    lastUpdate: "1 h ago",
  },
  {
    id: "2",
    name: "Shovon Ali",
    role: "Admin",
    email: "shovon@gmail.com",
    date: "05/05/2026",
    createdBy: "Maria Rodriguez",
    creatorRole: "Owner",
    avatarBg: "#E2E8F0",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2&backgroundColor=c0aede",
    lastUpdate: "1 h ago",
  },
  {
    id: "3",
    name: "Tanvir Hasan",
    role: "Accountant",
    email: "tanvir@gmail.com",
    date: "05/05/2026",
    createdBy: "Maria Rodriguez",
    creatorRole: "Owner",
    avatarBg: "#CCFBF1",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3&backgroundColor=b6e3f4",
    lastUpdate: "1 h ago",
  },
  {
    id: "4",
    name: "MD Razu",
    role: "Admin",
    email: "razu@gmail.com",
    date: "05/05/2026",
    createdBy: "Maria Rodriguez",
    creatorRole: "Owner",
    avatarBg: "#FEE2E2",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria4&backgroundColor=ffdfbf",
    lastUpdate: "1 h ago",
  },
  {
    id: "5",
    name: "Elena Rostova",
    role: "Stylist",
    email: "elena@gmail.com",
    date: "04/28/2026",
    createdBy: "Shah Aman",
    creatorRole: "Owner",
    avatarBg: "#EDE9FE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=c0aede",
    lastUpdate: "2 d ago",
  },
];

export const PERMISSION_CATEGORIES: PermissionCategoryData[] = [
  {
    id: "tenant",
    title: "Tenant & Users",
    items: [
      {
        id: "manageSalonProfile",
        title: "Manage salon profile",
        subtitle: "Branding, name, header and business info",
        defaultChecked: true,
      },
      {
        id: "manageSubscription",
        title: "Manage subscription & toggles",
        subtitle: "Allow subscription tier & feature toggles",
        defaultChecked: true,
      },
      {
        id: "manageRoles",
        title: "Manage user roles & permissions",
        subtitle: "Create, edit and assign staff role permissions",
        defaultChecked: true,
      },
      {
        id: "viewAuditLog",
        title: "View audit logs",
        subtitle: "Access sensitive activity and security history",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "appointments",
    title: "Appointments & Scheduling",
    items: [
      {
        id: "viewTeamCalendars",
        title: "View team calendars",
        subtitle: "See schedules of all stylists and treatment rooms",
        defaultChecked: true,
      },
      {
        id: "createAppointments",
        title: "Create new bookings",
        subtitle: "Schedule appointments on the salon calendar",
        defaultChecked: true,
      },
      {
        id: "editOthersAppointments",
        title: "Edit other staff appointments",
        subtitle: "Reschedule or modify bookings assigned to other team members",
        defaultChecked: true,
      },
      {
        id: "overrideConflicts",
        title: "Override double-booking conflicts",
        subtitle: "Allow bookings that overlap with existing slots",
        defaultChecked: false,
      },
      {
        id: "manageShiftScheduling",
        title: "Manage shifts & working hours",
        subtitle: "Define roster schedules and break hours",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "clients",
    title: "Clients & CRM",
    items: [
      {
        id: "viewClientNotes",
        title: "View client formulas & private notes",
        subtitle: "Access confidential client records and color history",
        defaultChecked: true,
      },
      {
        id: "exportClients",
        title: "Export client database",
        subtitle: "Download CSV of client contact details",
        defaultChecked: false,
      },
      {
        id: "manageWaivers",
        title: "Manage digital consent waivers",
        subtitle: "Create, send and approve signed liability waivers",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "finance",
    title: "Financial & Point of Sale",
    items: [
      {
        id: "processCheckout",
        title: "Process POS transactions",
        subtitle: "Ring up sales, accept card/cash, issue receipts",
        defaultChecked: true,
      },
      {
        id: "issueRefunds",
        title: "Issue refunds & voids",
        subtitle: "Authorize refunds on paid appointments and items",
        defaultChecked: false,
      },
      {
        id: "viewRevenueReports",
        title: "View financial reports",
        subtitle: "Access daily revenue, gross profit, and salary logs",
        defaultChecked: false,
      },
    ],
  },
];

export const ROLE_OPTIONS = ["Owner", "Admin", "Accountant", "Stylist", "Receptionist"];

export function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "Owner":
      return { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" };
    case "Admin":
      return { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" };
    case "Accountant":
      return { bg: "#CCFBF1", text: "#0D9488", border: "#99F6E4" };
    case "Stylist":
      return { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" };
    case "Receptionist":
      return { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };
    default:
      return { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" };
  }
}
