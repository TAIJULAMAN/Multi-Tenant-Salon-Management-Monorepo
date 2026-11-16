export interface UserProfileData {
  fullName: string;
  jobTitle: string;
  salonName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
}

export interface ActiveSessionData {
  id: string;
  device: string;
  iconName: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  iconName: string;
  enabled: boolean;
}

export const INITIAL_USER_PROFILE: UserProfileData = {
  fullName: "Maria Rodriguez",
  jobTitle: "Senior Hair Stylist",
  salonName: "Maxima Studio",
  email: "maria.rodriguez@maximastudio.com",
  phone: "+39 345 678 9012",
  address: "Via Independenza 24, 40121 Bologna (BO), Italy",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

export const INITIAL_ACTIVE_SESSIONS: ActiveSessionData[] = [
  {
    id: "sess_1",
    device: "iPhone 15 Pro • iOS 17",
    iconName: "phone-portrait-outline",
    location: "Bologna, Italy",
    ip: "192.168.1.42",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "sess_2",
    device: "Salon Front Desk iPad • Safari",
    iconName: "tablet-portrait-outline",
    location: "Bologna, Italy",
    ip: "172.56.21.90",
    lastActive: "Yesterday",
    isCurrent: false,
  },
];

export const INITIAL_NOTIFICATION_PREFS: NotificationPreference[] = [
  {
    id: "new_appointment",
    title: "New Appointments",
    description: "When a client books an appointment with you",
    iconName: "calendar-outline",
    enabled: true,
  },
  {
    id: "appointment_changes",
    title: "Changes & Cancellations",
    description: "When an appointment is rescheduled or cancelled",
    iconName: "swap-horizontal-outline",
    enabled: true,
  },
  {
    id: "shift_updates",
    title: "Shift Updates",
    description: "New, swapped or updated shifts in your schedule",
    iconName: "time-outline",
    enabled: true,
  },
  {
    id: "remuneration",
    title: "Remuneration",
    description: "Payslips, commissions and bonus updates",
    iconName: "wallet-outline",
    enabled: true,
  },
  {
    id: "social",
    title: "Social Activity",
    description: "Comments and reactions on your posts",
    iconName: "chatbubble-ellipses-outline",
    enabled: false,
  },
  {
    id: "email_digest",
    title: "Email Summary",
    description: "Weekly summary of your bookings and performance",
    iconName: "mail-outline",
    enabled: false,
  },
];
