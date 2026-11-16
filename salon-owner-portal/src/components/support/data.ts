import { Ticket, FAQItem } from "./types";

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TCK-8921",
    subject: "Payout delayed for last weekend's bookings",
    category: "Billing & Subscriptions",
    priority: "High",
    status: "Replied",
    date: "2026-06-14",
    description: "My payout for June 12-13 has not arrived in my bank account yet. Usually, payouts clear by Monday morning. Please check on this.",
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
        text: "Hi Felix, we experienced a minor delay with our payment gateway partner processor over the weekend. All pending transactions have been processed and should clear in your bank account within the next 24 hours. Sorry for the inconvenience!",
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
    date: "2026-06-10",
    description: "One of my stylists (Sarah) is not seeing client bookings sync to her Google Calendar. The sync has been working fine for others.",
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
        text: "Hello, please try disconnected Sarah's profile from the Google Calendar integration panel and reconnecting it. This will reset the OAuth token. Let us know if that doesn't fix it.",
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
];

export const FAQS: FAQItem[] = [
  {
    question: "How do I change my subscription plan?",
    answer: "You can change your subscription plan at any time by going to Dashboard > Settings > Subscription & Plans. From there, select your desired tier and your billing cycle will automatically adjust on the next statement.",
  },
  {
    question: "How do I set custom working hours for individual stylists?",
    answer: "Go to Dashboard > Team, select the stylist's profile, and click on 'Working Hours'. You can set different start/end times, custom break intervals, and assign specific days off for each team member.",
  },
  {
    question: "Why is my client's payment showing as pending?",
    answer: "A pending status usually means the bank is authorizing the client's credit card or the payout system is verifying the transaction. This usually resolves within 1-2 hours. If it takes longer than 24 hours, please submit a billing ticket above.",
  },
  {
    question: "Can I import my client database from another software?",
    answer: "Yes! We support CSV and Excel spreadsheet uploads. Go to Dashboard > Clients and click the 'Import Clients' button on the top right. We provide a downloadable template to map your fields correctly.",
  },
];
