export interface UserProfileData {
  fullName: string;
  storeName: string;
  email: string;
  phone: string;
  storeAddress: string;
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

export const INITIAL_USER_PROFILE: UserProfileData = {
  fullName: "Mathew Anderson",
  storeName: "Maxima Studio",
  email: "info@modernize.com",
  phone: "(219) 555-0114",
  storeAddress: "3891 Ranchview Dr. Richardson, California 62639",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mathew&backgroundColor=ffdfbf",
};

export const INITIAL_ACTIVE_SESSIONS: ActiveSessionData[] = [
  {
    id: "sess_1",
    device: "iPhone 15 Pro • iOS 17",
    iconName: "phone-portrait-outline",
    location: "Los Angeles, CA, USA",
    ip: "192.168.1.42",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "sess_2",
    device: "MacBook Pro 16\" • Chrome",
    iconName: "laptop-outline",
    location: "San Jose, CA, USA",
    ip: "172.56.21.90",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_3",
    device: "Windows PC • Edge Browser",
    iconName: "desktop-outline",
    location: "Dallas, TX, USA",
    ip: "108.204.15.112",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];
