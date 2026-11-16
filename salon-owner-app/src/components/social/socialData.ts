export interface SocialAccount {
  id: string;
  platform: "facebook" | "instagram" | "x" | "tiktok";
  name: string;
  handle?: string;
  status: "Connected" | "Not Connected";
  iconName: string;
  brandColor: string;
  followers?: string;
  lastSync?: string;
  autoShareBookings?: boolean;
}

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "soc_fb",
    platform: "facebook",
    name: "Facebook",
    status: "Not Connected",
    iconName: "logo-facebook",
    brandColor: "#1877F2",
  },
  {
    id: "soc_ig",
    platform: "instagram",
    name: "Instagram",
    handle: "@glampro.studio",
    status: "Connected",
    iconName: "logo-instagram",
    brandColor: "#E4405F",
    followers: "12.4K",
    lastSync: "10 mins ago",
    autoShareBookings: true,
  },
  {
    id: "soc_x",
    platform: "x",
    name: "X",
    status: "Not Connected",
    iconName: "logo-twitter",
    brandColor: "#000000",
  },
  {
    id: "soc_tiktok",
    platform: "tiktok",
    name: "TikTok",
    handle: "@glampro_beauty",
    status: "Connected",
    iconName: "musical-notes",
    brandColor: "#000000",
    followers: "28.9K",
    lastSync: "1 hour ago",
    autoShareBookings: false,
  },
];
