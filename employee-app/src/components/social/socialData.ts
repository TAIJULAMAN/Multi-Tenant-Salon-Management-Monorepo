// Mock data for the employee Social Media section (Analytics + Media library).
// Mirrors Figma "Milestone 4 - Employee" › Social Media frames.

export type SocialPlatform = "instagram" | "facebook" | "messenger" | "tiktok" | "x";

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle?: string;
  status: "Connected" | "Not Connected";
  iconName: string;
  brandColor: string;
}

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "soc_ig",
    platform: "instagram",
    name: "Instagram",
    handle: "Maria Rodriguez",
    status: "Connected",
    iconName: "logo-instagram",
    brandColor: "#E4405F",
  },
  {
    id: "soc_fb",
    platform: "facebook",
    name: "Facebook",
    handle: "Maria Rodriguez",
    status: "Connected",
    iconName: "logo-facebook",
    brandColor: "#1877F2",
  },
  {
    id: "soc_ms",
    platform: "messenger",
    name: "Messenger",
    handle: "Maria Rodriguez",
    status: "Connected",
    iconName: "chatbubbles-outline",
    brandColor: "#0084FF",
  },
  {
    id: "soc_tiktok",
    platform: "tiktok",
    name: "TikTok",
    status: "Not Connected",
    iconName: "musical-notes",
    brandColor: "#000000",
  },
  {
    id: "soc_x",
    platform: "x",
    name: "X",
    status: "Not Connected",
    iconName: "logo-twitter",
    brandColor: "#000000",
  },
];

/** Platforms that have an analytics dashboard in the design. */
export const ANALYTICS_PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "messenger"];

/** Period dropdown (1:14772). */
export const PERIOD_OPTIONS = [
  "Last 7 days",
  "Last 28 days",
  "Last 90 days",
  "This Week",
  "This Month",
  "This Year",
  "Last Week",
  "Last Month",
  "Custom Range",
];

/** Tabs per platform (Instagram: 1:9231 / 1:11200 / 1:13271 / 1:13864, Facebook: 1:10126 / 1:11492, Messenger 1:10935 has none). */
export const PLATFORM_TABS: Record<string, string[]> = {
  instagram: ["Account", "Posts", "Reels", "Story"],
  facebook: ["Account", "Posts"],
  messenger: [],
};

// Chart palette straight from the Figma charts.
export const CHART = {
  purple: "#635BFF",
  pink: "#FF6692",
  yellow: "#FFD648",
  teal: "#16CDC7",
  cyan: "#46CAEB",
  green: "#36C76C",
  dark: "#29343D",
} as const;

// ─── KPI tiles ───────────────────────────────────────────────────────────────

export interface KpiItem {
  label: string;
  value: string;
  delta: string;
  /** Figma shows a green "up" chip for a few tiles and a pink "down" chip for the rest. */
  up?: boolean;
}

export const INSTAGRAM_KPIS: KpiItem[] = [
  { label: "Followers (Total)", value: "200", delta: "+9%" },
  { label: "Accounts Reached in Period", value: "345", delta: "+9%" },
  { label: "Profile Views", value: "3.345", delta: "+9%" },
  { label: "Website Button Taps", value: "10k", delta: "+9%" },
  { label: "Email Button Taps", value: "10k", delta: "+9%" },
  { label: "Call Button Taps", value: "345", delta: "+9%" },
  { label: "Text Button Taps", value: "3.345", delta: "+9%" },
  { label: "Get Directions Taps", value: "10k", delta: "+9%" },
];

export const FACEBOOK_KPIS: KpiItem[] = [
  { label: "People Engaged", value: "12.543", delta: "+9%" },
  { label: "Total Page Views", value: "45.632", delta: "+9%" },
  { label: "Total Consumptions", value: "8.924", delta: "+9%" },
  { label: "Unique Consumptions", value: "6.431", delta: "+12.5%", up: true },
  { label: "Total Check-ins", value: "324", delta: "+9%" },
  { label: "Logged-in Page Views", value: "32.145", delta: "+9%" },
  { label: "External Referrals", value: "5.432", delta: "+9%" },
  { label: "Total Post Reactions", value: "15k", delta: "+9%" },
  { label: "Total Stories", value: "324", delta: "+9%" },
  { label: "Storytellers", value: "500", delta: "+9%" },
  { label: "Total CTA Clicks (logged-in)", value: "5.432", delta: "+9%" },
  { label: "Total Video View Time", value: "200h", delta: "+9%" },
];

export const MESSENGER_KPIS: KpiItem[] = [
  { label: "Messages Sent", value: "1.762", delta: "+9%" },
  { label: "Messages Received", value: "1.564", delta: "+9%" },
  { label: "Delivery Rate", value: "94.8%", delta: "+9%" },
  { label: "Users Who Interacted", value: "342", delta: "+12.5%", up: true },
  { label: "New Conversations Started", value: "314", delta: "+9%" },
  { label: "Avg Response Time", value: "11.5 min", delta: "+1 min" },
  { label: "Responsiveness Score", value: "87/100", delta: "+9%" },
  { label: "Open Threads", value: "128", delta: "+5" },
  { label: "Blocks Received", value: "12", delta: "+9" },
  { label: "User Reports", value: "5", delta: "+5" },
];

// ─── Charts ──────────────────────────────────────────────────────────────────

export const AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
export const GENDER_SERIES = [
  { label: "Man (50%)", color: CHART.purple, values: [70, 70, 70, 70, 70, 70] },
  { label: "Woman (30%)", color: CHART.pink, values: [54, 54, 54, 54, 54, 54] },
  { label: "Unspecified (20%)", color: CHART.yellow, values: [33, 33, 33, 33, 33, 33] },
];

export const AUDIENCE_BREAKDOWN: Record<string, { label: string; pct: number }[]> = {
  City: [
    { label: "Rome", pct: 20 },
    { label: "Milan", pct: 20 },
    { label: "Naples", pct: 20 },
    { label: "Turin", pct: 20 },
    { label: "Florence", pct: 20 },
  ],
  Country: [
    { label: "Italy", pct: 20 },
    { label: "Germany", pct: 20 },
    { label: "France", pct: 20 },
    { label: "Spain", pct: 20 },
    { label: "Portugal", pct: 20 },
  ],
  Locale: [
    { label: "it_IT", pct: 20 },
    { label: "en_US", pct: 20 },
    { label: "en_GB", pct: 20 },
    { label: "de_DE", pct: 20 },
    { label: "fr_FR", pct: 20 },
  ],
};
export const AUDIENCE_OPTIONS = ["City", "Country", "Locale"];
export const CTA_BY_COUNTRY = AUDIENCE_BREAKDOWN.Country;

export interface TrackBarDatum {
  label: string;
  value: number;
  /** First tooltip row (defaults to the label). */
  tooltipTitle?: string;
}

/** Followers Active by Hour/Day – tooltip "6h / Total 100" (1:9231). */
export const FOLLOWERS_ACTIVE: TrackBarDatum[] = [
  { label: "Sunday", value: 70, tooltipTitle: "21h" },
  { label: "Monday", value: 85, tooltipTitle: "18h" },
  { label: "Tuesday", value: 100, tooltipTitle: "9h" },
  { label: "Wednesday", value: 100, tooltipTitle: "12h" },
  { label: "Thursday", value: 100, tooltipTitle: "6h" },
  { label: "Friday", value: 104, tooltipTitle: "18h" },
  { label: "Saturday", value: 140, tooltipTitle: "15h" },
];
export const FOLLOWERS_ACTIVE_MAX = 330;
export const HOUR_TICKS = ["21h", "18h", "15h", "12h", "9h", "6h", "3h", "0h"];

export type ReactionKey = "Like" | "Love" | "Wow" | "Haha" | "Sad/Sorry" | "Angry";
export const REACTION_KEYS: ReactionKey[] = ["Like", "Love", "Wow", "Haha", "Sad/Sorry", "Angry"];
export const REACTIONS: TrackBarDatum[] = REACTION_KEYS.map((label) => ({ label, value: 100 }));
export const CTA_BY_SITE: TrackBarDatum[] = [1, 2, 3, 4, 5, 6].map((n) => ({ label: `Site ${n}`, value: 100 }));
export const HUNDREDS_MAX = 470;
export const HUNDRED_TICKS = ["800", "700", "600", "500", "400", "300", "200", "100"];

export interface Slice {
  label: string;
  value: number;
  color: string;
}

// Legend order (Photo, Link, Video, View More, Type 5, Type 6); ring order follows the PNG.
export const CONSUMPTION_LEGEND: Slice[] = [
  { label: "Photo", value: 20, color: CHART.yellow },
  { label: "Link", value: 17, color: CHART.cyan },
  { label: "Video", value: 25, color: CHART.teal },
  { label: "View More", value: 13, color: CHART.purple },
  { label: "Type 5", value: 8, color: CHART.pink },
  { label: "Type 6", value: 17, color: CHART.green },
];
const byLabel = (l: string) => CONSUMPTION_LEGEND.find((s) => s.label === l)!;
/** Clockwise, starting just right of 12 o'clock. */
export const CONSUMPTION_RING: Slice[] = ["Type 5", "View More", "Video", "Photo", "Type 6", "Link"].map(byLabel);

export const STORIES_BY_TYPE: Slice[] = [
  { label: "Shares", value: 36, color: CHART.purple },
  { label: "Comments", value: 12, color: CHART.yellow },
  { label: "Mentions", value: 12, color: CHART.teal },
  { label: "Category", value: 12, color: CHART.pink },
  { label: "Category 5", value: 12, color: CHART.green },
  { label: "Category 6", value: 16, color: CHART.dark },
];

export const STORYTELLERS_BY_TYPE: Slice[] = [
  { label: "Category 1", value: 36, color: CHART.purple },
  { label: "Category 2", value: 12, color: CHART.yellow },
  { label: "Category 3", value: 12, color: CHART.teal },
  { label: "Category 4", value: 12, color: CHART.pink },
  { label: "Category 5", value: 12, color: CHART.green },
  { label: "Category 6", value: 16, color: CHART.dark },
];

export const VIEWS_BY_TYPE: Slice[] = [
  { label: "Organic Views", value: 72, color: CHART.purple },
  { label: "Paid Views", value: 28, color: CHART.teal },
];

/** Watch Time (green area line, 1:10126). */
export const WATCH_TIME = [
  { label: "3s", tooltip: "3 seconds", value: 50 },
  { label: "10s", tooltip: "10 seconds", value: 40 },
  { label: "30s", tooltip: "30 seconds", value: 40 },
  { label: "95% complete", tooltip: "95% complete", value: 125 },
];
/** Shape points (x in 0..1, y value) so the curve follows the Figma wave. */
export const WATCH_TIME_CURVE: [number, number][] = [
  [0, 48],
  [0.12, 53],
  [0.28, 37],
  [0.43, 62],
  [0.55, 58],
  [0.64, 55],
  [0.72, 75],
  [0.8, 128],
  [0.9, 125],
  [1, 116],
];
export const WATCH_TIME_TICKS = [140, 105, 70, 35, 0];

// ─── Posts tables ────────────────────────────────────────────────────────────

export type PostType = "Link" | "Photo" | "Gif" | "Carousel" | "Video";
export const POST_TYPE_OPTIONS = ["All Post Types", "Link", "Photo", "Gif", "Carousel", "Video"];

export interface SocialPost {
  id: string;
  caption: string;
  date: string;
  type: PostType;
  image: string;
  metrics: Record<string, string>;
}

export interface MetricColumn {
  key: string;
  label: string;
  hint?: string;
  reaction?: ReactionKey;
  /** Column width in the table (px). */
  width?: number;
}

const col = (label: string, extra?: Partial<MetricColumn>): MetricColumn => ({
  key: label,
  label,
  ...extra,
});

export const IG_POST_COLUMNS: MetricColumn[] = [
  col("Views", { width: 103 }),
  col("Accounts reached", { width: 170 }),
  col("Total interactions", { hint: "(likes + comments + saves + shares where available)", width: 200 }),
  col("Likes", { width: 110 }),
  col("Comments", { width: 114 }),
  col("Saves", { width: 103 }),
  col("Shares", { width: 103 }),
  col("Vídeo Views", { width: 120 }),
  col("Total watch time", { width: 156 }),
  col("Engagement on a carousel", { width: 151 }),
  col("Reach of carousel", { width: 151 }),
  col("Swipes forward (carousel)", { width: 151 }),
  col("Swipes backward (carousel)", { width: 138 }),
];

export const IG_REEL_COLUMNS: MetricColumn[] = [
  col("Views", { width: 103 }),
  col("Accounts reached", { width: 170 }),
  col("Likes", { width: 103 }),
  col("Comments", { width: 114 }),
  col("Saves", { width: 103 }),
  col("Shares", { width: 141 }),
  col("Total interactions", { width: 166 }),
  col("Average watch time", { width: 181 }),
  col("Total watch time", { width: 156 }),
];

export const IG_STORY_COLUMNS: MetricColumn[] = [
  col("Accounts reached", { width: 170 }),
  col("Impressions", { width: 123 }),
  col("Forward Taps", { width: 130 }),
  col("Back Taps", { width: 105 }),
  col("Replies", { width: 103 }),
  col("Exits", { width: 116 }),
];

export const FB_POST_COLUMNS: MetricColumn[] = [
  col("People Engaged", { width: 153 }),
  col("Total post consumptions", { width: 140 }),
  col("Unique post consumptions", { width: 140 }),
  col("Stories about the post", { width: 137 }),
  col("Likes", { reaction: "Like", width: 102 }),
  col("Love", { reaction: "Love", width: 102 }),
  col("Wow", { reaction: "Wow", width: 102 }),
  col("Haha", { reaction: "Haha", width: 102 }),
  col("Sad/Sorry", { reaction: "Sad/Sorry", width: 102 }),
  col("Angry", { reaction: "Angry", width: 102 }),
  col("All reactions by type", { width: 125 }),
  col("Video views on post (3s)", { width: 125 }),
  col("10-second views", { width: 125 }),
  col("30-second complete views", { width: 125 }),
  col("95% complete views", { width: 125 }),
  col("Average watch time", { width: 125 }),
];

/** Metrics listed in the "View Post › Post Analytics" card (1:11844), in display order. */
export const FB_VIEW_POST_METRICS = [
  "People Engaged",
  "Total post consumptions",
  "Unique post consumptions",
  "Stories about the post",
  "All reactions by type",
  "Likes",
  "Love",
  "Wow",
  "Haha",
  "Sad/Sorry",
  "Angry",
];

const CAPTION = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
// Row order in 1:11200 / 1:11492: Link, Photo, Gif, Carousel, Gif, Video, Gif, Carousel, Gif (+1 to make 10).
const TYPES: PostType[] = ["Link", "Photo", "Gif", "Carousel", "Gif", "Video", "Gif", "Carousel", "Gif", "Photo"];
const POST_IMAGE =
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80";
const REEL_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

function igPostMetrics(type: PostType): Record<string, string> {
  const isVideo = type === "Video";
  const isCarousel = type === "Carousel";
  return {
    Views: "2,3k",
    "Accounts reached": "1,3k",
    "Total interactions": "1,3k",
    Likes: "1k",
    Comments: "300",
    Saves: "500",
    Shares: "1,3k",
    "Vídeo Views": isVideo ? "2,3k" : "-",
    "Total watch time": isVideo ? "20 seconds" : "-",
    "Engagement on a carousel": isCarousel ? "2k" : "-",
    "Reach of carousel": isCarousel ? "2k" : "-",
    "Swipes forward (carousel)": "500",
    "Swipes backward (carousel)": "1,3k",
  };
}

function fbPostMetrics(): Record<string, string> {
  return {
    "People Engaged": "2,3k",
    "Total post consumptions": "2,3k",
    "Unique post consumptions": "1,3k",
    "Stories about the post": "1,3k",
    Likes: "1k",
    Love: "1k",
    Wow: "1k",
    Haha: "1k",
    "Sad/Sorry": "1k",
    Angry: "1k",
    "All reactions by type": "1,3k",
    "Video views on post (3s)": "1,3k",
    "10-second views": "1,3k",
    "30-second complete views": "1,3k",
    "95% complete views": "1,3k",
    "Average watch time": "1,3k",
  };
}

function makePosts(prefix: string, image: string, metrics: (t: PostType) => Record<string, string>): SocialPost[] {
  return TYPES.map((type, i) => ({
    id: `${prefix}_${i + 1}`,
    caption: CAPTION,
    date: "Wed, 12 Oct at 11:01",
    type,
    image,
    metrics: metrics(type),
  }));
}

export const IG_POSTS = makePosts("igp", POST_IMAGE, igPostMetrics);
export const IG_REELS = makePosts("igr", REEL_IMAGE, () => ({
  Views: "1,3k",
  "Accounts reached": "1,3k",
  Likes: "1,3k",
  Comments: "1,3k",
  Saves: "1,3k",
  Shares: "1,3k",
  "Total interactions": "1,3k",
  "Average watch time": "20 seconds",
  "Total watch time": "1,3k",
}));
export const IG_STORIES = makePosts("igs", REEL_IMAGE, () => ({
  "Accounts reached": "1,3k",
  Impressions: "1,3k",
  "Forward Taps": "1,3k",
  "Back Taps": "1,3k",
  Replies: "1,3k",
  Exits: "1,3k",
}));
export const FB_POSTS = makePosts("fbp", POST_IMAGE, fbPostMetrics);

export const POST_AUTHOR = {
  name: "Roberto Marini",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  body: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.",
};

// ─── Media library (1:9652 / 1:9780 / 1:9907 / 1:10040) ─────────────────────

export type MediaKind = "Photo" | "Gif" | "Video";
/** 1:10040 shows the full set (with Gif); the other frames omit it. */
export const MEDIA_TYPE_FILTERS = ["All Type", "Photo", "Gif", "Video"];
export const MEDIA_USAGE_FILTERS = ["All Media", "Used", "Unused"];

export interface MediaItem {
  id: string;
  fileName: string;
  kind: MediaKind;
  uri: string;
  /** "Published" (used) vs "Not published" (unused). */
  used: boolean;
  uploadedBy: string;
  uploadedAt: string;
}

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "m1",
    fileName: "FileName.jpeg",
    kind: "Photo",
    uri: POST_IMAGE,
    used: true,
    uploadedBy: "Maria",
    uploadedAt: "Uploaded at 08/08/2025 5:06 PM",
  },
  {
    id: "m2",
    fileName: "FileName.jpeg",
    kind: "Video",
    uri: REEL_IMAGE,
    used: false,
    uploadedBy: "Maria",
    uploadedAt: "Uploaded at 08/08/2025 5:06 PM",
  },
];
