export interface MessageItem {
  id: string;
  sender: "User" | "Admin";
  text: string;
  time: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: "Technical Issue" | "Billing & Subscriptions" | "Feature Request" | "General Inquiry";
  priority: "Low" | "Medium" | "High" | "Urgent";
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
    id: "TCK-8921",
    subject: "Payout delayed for last weekend's bookings",
    category: "Billing & Subscriptions",
    priority: "High",
    status: "Replied",
    date: "Jun 14, 2026",
    description:
      "My payout for June 12-13 has not arrived in my bank account yet. Usually, payouts clear by Monday morning. Please check on this.",
    attachmentName: "payout_history.pdf",
    messages: [
      {
        id: "m1",
        sender: "User",
        text: "My payout for June 12-13 has not arrived in my bank account yet. Usually, payouts clear by Monday morning. Please check on this.",
        time: "10:15 AM, Jun 14",
      },
      {
        id: "m2",
        sender: "Admin",
        text: "Hi Felix, we experienced a minor delay with our payment gateway processor over the weekend. All pending transactions have been processed and should clear in your bank account within the next 24 hours.",
        time: "02:30 PM, Jun 14",
      },
      {
        id: "m3",
        sender: "User",
        text: "Perfect, thank you! I will keep an eye out for it tomorrow.",
        time: "03:10 PM, Jun 14",
      },
    ],
  },
  {
    id: "TCK-8740",
    subject: "Stylist calendar sync error with Google Calendar",
    category: "Technical Issue",
    priority: "Medium",
    status: "Closed",
    date: "Jun 10, 2026",
    description:
      "One of my stylists (Sarah) is not seeing client bookings sync to her Google Calendar. The sync has been working fine for others.",
    messages: [
      {
        id: "m4",
        sender: "User",
        text: "One of my stylists (Sarah) is not seeing client bookings sync to her Google Calendar. The sync has been working fine for others.",
        time: "09:00 AM, Jun 10",
      },
      {
        id: "m5",
        sender: "Admin",
        text: "Hello, please try disconnecting Sarah's profile from the Google Calendar integration panel and reconnecting it. This will refresh the OAuth token.",
        time: "11:45 AM, Jun 10",
      },
      {
        id: "m6",
        sender: "User",
        text: "That worked perfectly. Thank you for the quick support!",
        time: "01:20 PM, Jun 10",
      },
    ],
  },
  {
    id: "TCK-8610",
    subject: "Custom loyalty rewards tiers for VIP clients",
    category: "Feature Request",
    priority: "Low",
    status: "Pending Admin",
    date: "Jun 02, 2026",
    description:
      "Can we request a tier-based loyalty point multiplier (e.g. Gold clients get 2x points on haircut services)?",
    messages: [
      {
        id: "m7",
        sender: "User",
        text: "Can we request a tier-based loyalty point multiplier (e.g. Gold clients get 2x points on haircut services)?",
        time: "04:45 PM, Jun 02",
      },
    ],
  },
];

export const SUPPORT_FAQS: FAQItem[] = [
  {
    id: "faq_1",
    question: "How do I change my subscription plan?",
    answer:
      "You can change your subscription plan at any time by going to Dashboard > Settings > Subscription & Plans. From there, select your desired tier and your billing cycle will automatically adjust on the next statement.",
  },
  {
    id: "faq_2",
    question: "How do I set custom working hours for individual stylists?",
    answer:
      "Go to Dashboard > Team, select the stylist's profile, and click on 'Working Hours'. You can set different start/end times, custom break intervals, and assign specific days off for each team member.",
  },
  {
    id: "faq_3",
    question: "Why is my client's payment showing as pending?",
    answer:
      "A pending status usually means the bank is authorizing the client's credit card or the payout system is verifying the transaction. This usually resolves within 1-2 hours. If it takes longer than 24 hours, please submit a billing ticket.",
  },
  {
    id: "faq_4",
    question: "Can I import my client database from another software?",
    answer:
      "Yes! We support CSV and Excel spreadsheet uploads. Go to Dashboard > Clients and click the 'Import Clients' button on the top right. We provide a downloadable template to map your fields correctly.",
  },
  {
    id: "faq_5",
    question: "How do digital consent waivers work with appointments?",
    answer:
      "When a client books a service linked with a required waiver, an invitation link is automatically sent via SMS/Email. Once signed, the certificate is attached to the client profile and appointment record.",
  },
];

export const TICKET_CATEGORIES = [
  "Technical Issue",
  "Billing & Subscriptions",
  "Feature Request",
  "General Inquiry",
] as const;

export const TICKET_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

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
