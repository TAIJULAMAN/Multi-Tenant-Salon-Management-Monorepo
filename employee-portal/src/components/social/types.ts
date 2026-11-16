export interface SocialPost {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm format, 24h
  endTime: string;
  platforms: ('instagram' | 'facebook' | 'twitter' | 'tiktok')[];
}

export interface AnalyticsMetric {
  title: string;
  value: string;
  change: string; // e.g., "+9%"
  trend: 'up' | 'down';
  chartData: number[]; // mini sparkline data
}

export interface AnalyticsPostRow {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  type: 'Link' | 'Photo' | 'Gif' | 'Carousel' | 'Video';
  views: string;
  accountsReached: string;
  totalInteractions: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  videoViews: string;
  watchTime: string;
  engagementCarousel: string;
  reachCarousel: string;
  swipesForward: string;
  swipesBackward: string;
}

export type AnalyticsTab = "Account" | "Posts" | "Reels" | "Story";

export interface AnalyticsTabProps {
  selectedAccount: string;
  dateRange: string;
}

export interface PostsControlsProps {
  postType: string;
  setPostType: (val: string) => void;
  search: string;
  setSearch: (val: string) => void;
  setCurrentPage: (val: number) => void;
}

export interface PostsTableProps {
  paginatedPosts: AnalyticsPostRow[];
  setSelectedPost: (post: AnalyticsPostRow) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
}

export interface ReelsControlsProps {
  search: string;
  setSearch: (val: string) => void;
  setCurrentPage: (val: number) => void;
}

export interface ReelsTableProps {
  paginatedReels: AnalyticsPostRow[];
  setSelectedReel: (reel: AnalyticsPostRow) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
}

export interface StoryControlsProps {
  search: string;
  setSearch: (val: string) => void;
  setCurrentPage: (val: number) => void;
}

export interface StoryTableProps {
  paginatedStories: AnalyticsPostRow[];
  setSelectedStory: (story: AnalyticsPostRow) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
}
