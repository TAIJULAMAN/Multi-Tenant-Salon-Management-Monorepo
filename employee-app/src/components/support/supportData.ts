export interface MessageItem {
  id: string;
  sender: "User" | "Admin";
  text: string;
  time: string;
}

export const TICKET_CATEGORIES = [
  "Technical Issue",
  "Schedule & Shifts",
  "Remuneration",
  "Account & Access",
  "General Inquiry",
] as const;

export const TICKET_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export interface SupportTicket {
  id: string;
  subject: string;
  category: (typeof TICKET_CATEGORIES)[number];
  priority: (typeof TICKET_PRIORITIES)[number];
  status: "Pending Admin" | "Replied" | "Closed";
  date: string;
  description: string;
  attachmentName?: string;
  messages: MessageItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TCK-9104",
    subject: "Commission missing from last month's payslip",
    category: "Remuneration",
    priority: "High",
    status: "Replied",
    date: "Sep 22, 2026",
    description:
      "My August payslip doesn't include the commission for the color treatments I did during the last week of the month. Could you check?",
    attachmentName: "payslip_august.pdf",
    messages: [
      {
        id: "m1",
        sender: "User",
        text: "My August payslip doesn't include the commission for the color treatments I did during the last week of the month. Could you check?",
        time: "10:15 AM, Sep 22",
      },
      {
        id: "m2",
        sender: "Admin",
        text: "Hi Angelica, the appointments from Aug 26-31 were closed after the payroll cut-off. The commission will be added as an adjustment to your September payslip.",
        time: "02:30 PM, Sep 22",
      },
      {
        id: "m3",
        sender: "User",
        text: "Great, thank you for the quick answer!",
        time: "03:10 PM, Sep 22",
      },
    ],
  },
  {
    id: "TCK-9012",
    subject: "Calendar not syncing with my Google Calendar",
    category: "Technical Issue",
    priority: "Medium",
    status: "Closed",
    date: "Sep 10, 2026",
    description:
      "New bookings are not showing up in my personal Google Calendar since the last app update.",
    messages: [
      {
        id: "m4",
        sender: "User",
        text: "New bookings are not showing up in my personal Google Calendar since the last app update.",
        time: "09:00 AM, Sep 10",
      },
      {
        id: "m5",
        sender: "Admin",
        text: "Hello, please disconnect Google Calendar from your calendar settings and connect it again. This refreshes the access token.",
        time: "11:45 AM, Sep 10",
      },
      {
        id: "m6",
        sender: "User",
        text: "That worked perfectly. Thanks!",
        time: "01:20 PM, Sep 10",
      },
    ],
  },
  {
    id: "TCK-8977",
    subject: "Request to swap Saturday shift",
    category: "Schedule & Shifts",
    priority: "Low",
    status: "Pending Admin",
    date: "Sep 04, 2026",
    description:
      "I can't find the option to request a shift swap with a colleague for Saturday Oct 3. Is this available in the app?",
    messages: [
      {
        id: "m7",
        sender: "User",
        text: "I can't find the option to request a shift swap with a colleague for Saturday Oct 3. Is this available in the app?",
        time: "04:45 PM, Sep 04",
      },
    ],
  },
];

export const SUPPORT_FAQS: FAQItem[] = [
  {
    id: "faq_1",
    question: "How do I see my upcoming appointments?",
    answer:
      "Open the Calendar tab to see your day, week or month view. Tap any appointment to view the client, services, notes and to update its status (arrived, started, completed).",
  },
  {
    id: "faq_2",
    question: "Where can I check my scheduled and worked shifts?",
    answer:
      "Go to the Shifts tab. 'Scheduled' shows your upcoming shifts set by the salon manager, while 'Worked' lists the hours you have already completed, including breaks and overtime.",
  },
  {
    id: "faq_3",
    question: "How is my remuneration calculated?",
    answer:
      "Your remuneration combines your base salary with commissions on services and products and any bonuses. You can see a breakdown per period in Remuneration from the side menu.",
  },
  {
    id: "faq_4",
    question: "Can I edit a client's details?",
    answer:
      "Yes. Open Clients, select the client and tap Edit on the section you want to update. Changes are shared with the salon so everyone works with the same information.",
  },
  {
    id: "faq_5",
    question: "How do I change my password or enable 2FA?",
    answer:
      "Go to Settings > Security. From there you can update your password, turn on two-factor authentication and sign out of other devices.",
  },
];

export function getStatusPillStyle(status: SupportTicket["status"]) {
  switch (status) {
    case "Replied":
      return { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" };
    case "Pending Admin":
      return { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" };
    case "Closed":
      return { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" };
  }
}

export function getPriorityBadgeStyle(priority: SupportTicket["priority"]) {
  switch (priority) {
    case "Urgent":
      return { bg: "#FEE2E2", text: "#DC2626" };
    case "High":
      return { bg: "#FFEDD5", text: "#EA580C" };
    case "Medium":
      return { bg: "#FEF9C3", text: "#CA8A04" };
    case "Low":
      return { bg: "#F0FDF4", text: "#16A34A" };
  }
}
