import { SocialPost, AnalyticsMetric, AnalyticsPostRow } from "./types";

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "p1",
    title: "Post Title",
    date: "2025-10-27",
    startTime: "12:30",
    endTime: "13:30",
    platforms: ["instagram", "facebook"]
  },
  {
    id: "p2",
    title: "Weekend Promo",
    date: "2025-10-31",
    startTime: "09:00",
    endTime: "10:00",
    platforms: ["instagram"]
  },
  {
    id: "p3",
    title: "New Stylist Announce",
    date: "2025-09-02", 
    startTime: "12:30",
    endTime: "13:00",
    platforms: ["instagram", "facebook"]
  }
];

export const MOCK_ANALYTICS_METRICS: AnalyticsMetric[] = [
  { title: "Followers (Total)", value: "200", change: "+9%", trend: "up", chartData: [30, 40, 20, 80, 50, 40] },
  { title: "Accounts Reached in Period", value: "345", change: "+9%", trend: "up", chartData: [40, 30, 80, 50, 60, 40] },
  { title: "Profile Views", value: "3.345", change: "+9%", trend: "up", chartData: [30, 50, 40, 90, 60, 40] },
  { title: "Website Button Taps", value: "10k", change: "+9%", trend: "up", chartData: [20, 60, 30, 100, 50, 60] },
  { title: "Email Button Taps", value: "10k", change: "+9%", trend: "up", chartData: [50, 40, 30, 80, 40, 50] },
  { title: "Call Button Taps", value: "345", change: "+9%", trend: "up", chartData: [30, 40, 50, 90, 40, 60] },
  { title: "Text Button Taps", value: "3.345", change: "+9%", trend: "up", chartData: [40, 30, 60, 80, 50, 70] },
  { title: "Get Directions Taps", value: "10k", change: "+9%", trend: "up", chartData: [30, 50, 40, 100, 60, 50] },
];

export const MOCK_AUDIENCE_GENDER_AGE = [
  { ageGroup: '18-24', man: 70, woman: 58, unspecified: 42 },
  { ageGroup: '25-34', man: 70, woman: 58, unspecified: 42 },
  { ageGroup: '35-44', man: 70, woman: 58, unspecified: 42 },
  { ageGroup: '45-54', man: 70, woman: 58, unspecified: 42 },
  { ageGroup: '55-64', man: 70, woman: 58, unspecified: 42 },
  { ageGroup: '65+', man: 70, woman: 58, unspecified: 42 },
];

export const MOCK_AUDIENCE_CITY = [
  { city: 'Rome', percentage: 20 },
  { city: 'Milan', percentage: 20 },
  { city: 'Naples', percentage: 20 },
  { city: 'Turin', percentage: 20 },
  { city: 'Florence', percentage: 20 },
];

export const MOCK_FOLLOWERS_ACTIVE = [
  { day: 'Sunday', value: 30 },
  { day: 'Monday', value: 35 },
  { day: 'Tuesday', value: 40 },
  { day: 'Wednesday', value: 35 },
  { day: 'Thursday', value: 35 },
  { day: 'Friday', value: 35 },
  { day: 'Saturday', value: 45 },
];

export const MOCK_ANALYTICS_POSTS: AnalyticsPostRow[] = Array.from({ length: 15 }).map((_, i) => {
  const types: ('Link' | 'Photo' | 'Gif' | 'Carousel' | 'Video')[] = ['Link', 'Photo', 'Gif', 'Carousel', 'Video'];
  return {
    id: `post-${i}`,
    thumbnail: 'https://via.placeholder.com/40',
    title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: 'Wed, 12 Oct at 11:01',
    type: types[i % types.length],
    views: '2.3k',
    accountsReached: '1.3k',
    totalInteractions: '1.3k',
    likes: '1k',
    comments: '300',
    saves: '500',
    shares: '1.3k',
    videoViews: i % 5 === 4 ? '2.3k' : '-',
    watchTime: i % 5 === 4 ? '20 seconds' : '-',
    engagementCarousel: i % 5 === 3 ? '2k' : '-',
    reachCarousel: i % 5 === 3 ? '2k' : '-',
    swipesForward: i % 5 === 3 ? '500' : '500', // screenshot shows 500 across the board mostly
    swipesBackward: '1.3k',
  };
});

export const MOCK_REELS: AnalyticsPostRow[] = Array.from({ length: 15 }).map((_, i) => {
  return {
    id: `reel-${i}`,
    thumbnail: "/holographic_sphere.png",
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    date: "Wed, 12 Oct at 11:01",
    type: "Video",
    views: i % 2 === 0 ? "1.5k" : "1.3k",
    accountsReached: i % 2 === 0 ? "1.5k" : "1.3k",
    totalInteractions: i % 2 === 0 ? "1.5k" : "1.3k",
    likes: i % 2 === 0 ? "1.5k" : "1.3k",
    comments: i % 2 === 0 ? "1.3k" : "1.8k",
    saves: i % 3 === 0 ? "1.5k" : "1.3k",
    shares: "1.3k",
    videoViews: i % 2 === 0 ? "1.5k" : "1.3k",
    watchTime: "20 seconds", // Average watch time
    engagementCarousel: "-",
    reachCarousel: "-",
    swipesForward: "-",
    swipesBackward: "1.3k", // Total watch time or swaps backward
  };
});

export const MOCK_STORIES: AnalyticsPostRow[] = Array.from({ length: 15 }).map(
  (_, i) => {
    return {
      id: `story-${i}`,
      thumbnail: "/holographic_sphere.png",
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      date: "Wed, 12 Oct at 11:01",
      type: "Photo",
      views: "1.3k",
      accountsReached: "1.3k",
      totalInteractions: "1.3k",
      likes: "1.3k",
      comments: "1.3k",
      saves: "1.3k",
      shares: "1.3k",
      videoViews: "-",
      watchTime: "-",
      engagementCarousel: "-",
      reachCarousel: "-",
      swipesForward: "-",
      swipesBackward: "-",
    };
  },
);
