import { NotificationItem } from "./types";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "appointment",
    title: "New Appointment",
    message: "Maria Fernandez booked a Haircut for tomorrow at 11:00 AM.",
    time: "10 mins ago",
    isRead: false,
  },
  {
    id: "2",
    type: "sale",
    title: "Product Sold",
    message: "Moroccanoil Treatment 100ml was sold. 4 items remaining in stock.",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Low Stock Alert",
    message: "Olaplex No.4 Bond Maintenance Shampoo is running low (2 left).",
    time: "5 hours ago",
    isRead: true,
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment Cancelled",
    message: "Jessica Alba cancelled their appointment for Friday, 24th Oct.",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "Platform maintenance scheduled for Sunday at 02:00 AM UTC.",
    time: "2 days ago",
    isRead: true,
  },
];
