export type ServiceRecord = {
  id: string;
  name: string;
  category: string;
  categoryStyle: {
    bg: string;
    text: string;
    border: string;
  };
  duration: string;
  postBreak: string;
  price: string;
  vat: string;
  description?: string;
  onlineBooking?: boolean;
  assignedMembers?: number[];
  iconName?: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  description?: string;
  categoryStyle: {
    bg: string;
    text: string;
    border: string;
  };
  relatedServices: number;
};

export type BundleRecord = {
  id: string;
  name: string;
  category: string;
  categoryStyle: {
    bg: string;
    text: string;
    border: string;
  };
  relatedServices: number;
  duration: string;
  price: string;
  priceType: string;
  scheduleType: string;
  description?: string;
  onlineBooking?: boolean;
  services?: { id: string; name: string; duration: string; price: string }[];
  members?: { id: string; name: string; avatar: string }[];
};

export type MemberItem = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

export const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  "Category 1": { bg: "#EEF2FF", text: "#635BFF", border: "#C7D2FE" },
  "Category 2": { bg: "#CCFBF1", text: "#0D9488", border: "#99F6E4" },
  "Category 3": { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  "Category 4": { bg: "#FEF9C3", text: "#CA8A04", border: "#FEF08A" },
  "Category 5": { bg: "#FCE7F3", text: "#DB2777", border: "#FBCFE8" },
  "Category 6": { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
};

export const serviceIconList = [
  { id: "cut", name: "cut-outline", label: "Haircut" },
  { id: "cloud", name: "cloud-outline", label: "Blowdry" },
  { id: "brush", name: "brush-outline", label: "Styling" },
  { id: "eye", name: "eye-outline", label: "Brows" },
  { id: "water", name: "water-outline", label: "Wash" },
  { id: "sparkles", name: "sparkles-outline", label: "Beauty" },
  { id: "happy", name: "happy-outline", label: "Facial" },
  { id: "beaker", name: "beaker-outline", label: "Bath" },
  { id: "color-palette", name: "color-palette-outline", label: "Color" },
  { id: "color-wand", name: "color-wand-outline", label: "Touchup" },
  { id: "star", name: "star-outline", label: "Premium" },
  { id: "heart", name: "heart-outline", label: "Care" },
  { id: "medkit", name: "medkit-outline", label: "Treatment" },
  { id: "ribbon", name: "ribbon-outline", label: "Bridal" },
  { id: "flame", name: "flame-outline", label: "Waxing" },
  { id: "flash", name: "flash-outline", label: "Therapy" },
];

export const mockMembers: MemberItem[] = [
  { id: 1, name: "Maria Rodriguez", role: "Master Stylist", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Leslie Alexander", role: "Senior Colorist", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Guy Hawkins", role: "Nail Artist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { id: 4, name: "Eleanor Pena", role: "Esthetician", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
];

export const initialServices: ServiceRecord[] = [
  {
    id: "1",
    name: "Classic Haircut",
    category: "Category 1",
    categoryStyle: categoryColorMap["Category 1"],
    duration: "45 min",
    postBreak: "15 min",
    price: "€ 35",
    vat: "€ 7",
    description: "Professional haircut tailored to your style with complimentary wash and consultation.",
    onlineBooking: true,
    assignedMembers: [1, 2, 4],
    iconName: "cut-outline",
  },
  {
    id: "2",
    name: "Beard Trim & Shape",
    category: "Category 2",
    categoryStyle: categoryColorMap["Category 2"],
    duration: "20 min",
    postBreak: "5 min",
    price: "€ 15",
    vat: "€ 3",
    description: "Hot towel finish, line up and beard oil treatment for a crisp edge.",
    onlineBooking: true,
    assignedMembers: [1, 3],
    iconName: "cut-outline",
  },
  {
    id: "3",
    name: "Hair Coloring",
    category: "Category 3",
    categoryStyle: categoryColorMap["Category 3"],
    duration: "90 min",
    postBreak: "30 min",
    price: "€ 80",
    vat: "€ 16",
    description: "Full coverage organic dye treatment with shine enhancement glaze.",
    onlineBooking: true,
    assignedMembers: [2, 4],
    iconName: "color-wand-outline",
  },
  {
    id: "4",
    name: "Wash & Blow Dry",
    category: "Category 4",
    categoryStyle: categoryColorMap["Category 4"],
    duration: "30 min",
    postBreak: "10 min",
    price: "€ 25",
    vat: "€ 5",
    description: "Deep cleansing scalp massage followed by customized thermal blowout.",
    onlineBooking: true,
    assignedMembers: [1, 2, 3, 4],
    iconName: "water-outline",
  },
  {
    id: "5",
    name: "Balayage Highlights",
    category: "Category 5",
    categoryStyle: categoryColorMap["Category 5"],
    duration: "120 min",
    postBreak: "30 min",
    price: "€ 150",
    vat: "€ 30",
    description: "Hand-painted dimensional highlights for a soft, natural sun-kissed look.",
    onlineBooking: true,
    assignedMembers: [2],
    iconName: "sparkles-outline",
  },
  {
    id: "6",
    name: "Ombre Hair Color",
    category: "Category 6",
    categoryStyle: categoryColorMap["Category 6"],
    duration: "110 min",
    postBreak: "30 min",
    price: "€ 130",
    vat: "€ 26",
    description: "Seamless color graduation from root depth to luminous ends.",
    onlineBooking: false,
    assignedMembers: [2, 4],
    iconName: "color-wand-outline",
  },
  {
    id: "7",
    name: "Luxury Keratin Treatment",
    category: "Category 5",
    categoryStyle: categoryColorMap["Category 5"],
    duration: "120 min",
    postBreak: "30 min",
    price: "€ 180",
    vat: "€ 36",
    description: "Intense smoothing and frizz elimination lasting up to 4 months.",
    onlineBooking: true,
    assignedMembers: [1, 2],
    iconName: "flash-outline",
  },
  {
    id: "8",
    name: "Gel Manicure & Polish",
    category: "Category 4",
    categoryStyle: categoryColorMap["Category 4"],
    duration: "45 min",
    postBreak: "15 min",
    price: "€ 35",
    vat: "€ 7",
    description: "Cuticle care, nail shaping, long-lasting LED gel polish and hand massage.",
    onlineBooking: true,
    assignedMembers: [3],
    iconName: "hand-left-outline",
  },
];

export const initialCategories: CategoryRecord[] = [
  { id: "1", name: "Category 1", description: "Standard hair cut and quick trims", categoryStyle: categoryColorMap["Category 1"], relatedServices: 3 },
  { id: "2", name: "Category 2", description: "Beard grooming and barber services", categoryStyle: categoryColorMap["Category 2"], relatedServices: 2 },
  { id: "3", name: "Category 3", description: "Full hair coloring and toning", categoryStyle: categoryColorMap["Category 3"], relatedServices: 2 },
  { id: "4", name: "Category 4", description: "Washing, blow drying & basic nails", categoryStyle: categoryColorMap["Category 4"], relatedServices: 3 },
  { id: "5", name: "Category 5", description: "Specialty balayage & chemical treatments", categoryStyle: categoryColorMap["Category 5"], relatedServices: 2 },
  { id: "6", name: "Category 6", description: "Ombre and advanced extension work", categoryStyle: categoryColorMap["Category 6"], relatedServices: 1 },
];

export const initialBundles: BundleRecord[] = [
  {
    id: "1",
    name: "Complete Glam Makeover",
    category: "Category 1",
    categoryStyle: categoryColorMap["Category 1"],
    relatedServices: 3,
    duration: "120 min",
    price: "€ 180",
    priceType: "Fixed",
    scheduleType: "Booked in sequence",
    description: "Includes haircut, full coloring, and revitalizing scalp wash & blowout.",
    onlineBooking: true,
    services: [
      { id: "1", name: "Classic Haircut", duration: "45 min", price: "€ 35" },
      { id: "3", name: "Hair Coloring", duration: "90 min", price: "€ 80" },
      { id: "4", name: "Wash & Blow Dry", duration: "30 min", price: "€ 25" },
    ],
    members: [
      { id: "1", name: "Maria Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
      { id: "2", name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
    ],
  },
  {
    id: "2",
    name: "Gentleman's Executive Spa",
    category: "Category 2",
    categoryStyle: categoryColorMap["Category 2"],
    relatedServices: 2,
    duration: "65 min",
    price: "€ 50",
    priceType: "Fixed",
    scheduleType: "Booked in sequence",
    description: "Master haircut, hot towel beard trim, and invigorating head massage.",
    onlineBooking: true,
    services: [
      { id: "1", name: "Classic Haircut", duration: "45 min", price: "€ 35" },
      { id: "2", name: "Beard Trim & Shape", duration: "20 min", price: "€ 15" },
    ],
    members: [
      { id: "1", name: "Maria Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
      { id: "3", name: "Guy Hawkins", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    ],
  },
  {
    id: "3",
    name: "Bridal Luxury Suite",
    category: "Category 5",
    categoryStyle: categoryColorMap["Category 5"],
    relatedServices: 4,
    duration: "210 min",
    price: "€ 290",
    priceType: "Fixed",
    scheduleType: "Booked in sequence",
    description: "Trial styling, bridal updo, balayage gloss, and full luxury gel manicure.",
    onlineBooking: true,
    services: [
      { id: "5", name: "Balayage Highlights", duration: "120 min", price: "€ 150" },
      { id: "8", name: "Gel Manicure & Polish", duration: "45 min", price: "€ 35" },
      { id: "4", name: "Wash & Blow Dry", duration: "30 min", price: "€ 25" },
    ],
    members: [
      { id: "2", name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
      { id: "4", name: "Eleanor Pena", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
    ],
  },
];

export const serviceStatCardsData = [
  {
    id: 1,
    title: "Most Popular Service",
    value: "Classic Haircut",
    change: "342 bookings this month",
    iconName: "star-outline" as const,
    iconColor: "#8B5CF6",
    iconBg: "#EDE9FE",
  },
  {
    id: 2,
    title: "Most Profitable Service",
    value: "Balayage",
    change: "68% profit margin",
    iconName: "cash-outline" as const,
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    id: 3,
    title: "Average Duration",
    value: "42 mins",
    change: "-3 mins vs planned",
    iconName: "time-outline" as const,
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
];
