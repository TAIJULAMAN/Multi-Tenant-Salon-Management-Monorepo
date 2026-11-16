import { Briefcase, Tag, Receipt, Users, UserMinus, Award, Calendar, Globe, TrendingUp, Repeat } from "lucide-react";
import { Row1Card, Row2Card, ClientRow } from "./types";

export const row1CardsData: Row1Card[] = [
  {
    id: "total-revenue",
    value: "€41.706,65",
    title: "Total Revenue",
    change: "+15.7% from last month",
    icon: Briefcase,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/30 to-[#fff]",
  },
  {
    id: "avg-ticket",
    value: "€142.83",
    title: "Avg Ticket",
    change: "+1.4% from last month",
    icon: Tag,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/30 to-[#fff]",
  },
  {
    id: "receipts",
    value: "292",
    title: "Receipts",
    change: "+14.1% from last month",
    icon: Receipt,
    iconBg: "bg-[#F97316]/10",
    iconColor: "text-[#F97316]",
    cardStyle: "bg-gradient-to-b from-[#F97316]/30 to-[#fff]",
  },
];

export const row2CardsData: Row2Card[] = [
  {
    id: "new-clients",
    type: "sparkline" as const,
    value: "1",
    title: "New Clients",
    change: "-94.1% from last month",
    icon: Users,
    iconBg: "bg-[#3CD896]/10",
    iconColor: "text-[#3CD896]",
    cardStyle: "bg-gradient-to-b from-[#3CD896]/30 to-[#fff]",
  },
  {
    id: "inactive-clients",
    type: "inactive" as const,
    valueLeft: "65",
    labelLeft: "TOTAL INACTIVE",
    valueRight: "€69.896",
    labelRight: "POTENTIAL LOSS",
    title: "Inactive Clients",
    change: "Risk of potential loss",
    icon: UserMinus,
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/15 to-[#fff]",
  },
  {
    id: "top-staff-revenue",
    type: "staff" as const,
    valueLeft: "€10613.10",
    labelLeft: "HIGHEST INCOME",
    nameLeft: "Alessandra Conti",
    valueRight: "€6309.85",
    labelRight: "LOWEST INCOME",
    nameRight: "Marco Bianchi",
    title: "Top Staff Revenue",
    change: "Staff overall performance",
    icon: Award,
    iconBg: "bg-[#8B5CF6]/10",
    iconColor: "text-[#8B5CF6]",
    cardStyle: "bg-gradient-to-b from-[#8B5CF6]/15 to-[#fff]",
  },
];

export const revenueOverTimeBase = [
  1200, 1600, 2500, 1300, 2300, 1400, 2300, 800, 1500, 900,
  1400, 900, 2300, 2400, 1800, 1500, 2200, 1100, 2000, 1600,
  2100, 1400, 2400, 1900, 2500, 1300, 1700, 1100, 2300, 2200
];

export const clientSegmentsBase = {
  new: [2, 1, 1, 1, 0.5],
  reactivated: [8, 4, 2, 3, 2],
  returning: [50, 55, 48, 45, 24]
};

export const staffRevenueBase = {
  labels: ["Alessandra Conti", "Valentina Ricci", "Francesca Romano", "Luca Marino", "Marco Bianchi"],
  data: [10613, 9800, 8900, 8300, 6309]
};

export const ticketDistributionBase = [36, 74, 62, 65, 58, 7];

export const paymentMethodsBase = [9200, 9600, 13500, 9800];

// Inactive Clients Data
export const inactiveCards = [
  {
    id: "inactive-count",
    value: "65",
    title: "Inactive Clients",
    subtitle: "Total Count",
    badge: "+5%",
    themeColor: "#635BFF"
  },
  {
    id: "lost-revenue",
    value: "€37.393",
    title: "Lost Revenue",
    subtitle: "Est. Annual Value",
    badge: "Est. Loss",
    themeColor: "#FF5656"
  },
  {
    id: "avg-ticket",
    value: "€143.82",
    title: "Avg Ticket",
    subtitle: "Of Inactive Clients",
    badge: "Per Visit",
    themeColor: "#14B8A6"
  },
  {
    id: "days-since-visit",
    value: "176",
    title: "Days Since Visit",
    subtitle: "Average",
    badge: "Aging",
    themeColor: "#F97316"
  }
];

export const inactiveChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Current Year",
      data: [12, 10, 15, 18, 25, 30, 42, 55, 80, 110, 220, 290],
      backgroundColor: "#635BFF",
      borderRadius: 4
    },
    {
      label: "Previous Year",
      data: [10, 8, 12, 14, 20, 22, 35, 45, 60, 90, 180, 240],
      backgroundColor: "#E2E8F0",
      borderRadius: 4
    }
  ]
};

export const inactiveClientsList: ClientRow[] = [
  { name: "Alessia Russo", lastVisit: "27 Aug 2025 (363d ago)", visits: 4, totalSpent: 590.0, avgTicket: 147.5, tags: ["Mogano"], city: "Milano", region: "Lombardia" },
  { name: "Greta Moretti", lastVisit: "27 Apr 2026 (120d ago)", visits: 2, totalSpent: 224.4, avgTicket: 112.2, tags: ["Biondo", "Corti"], city: "Bologna", region: "Emilia-Romagna" },
  { name: "Serena Barbieri", lastVisit: "18 Apr 2026 (129d ago)", visits: 8, totalSpent: 1145.05, avgTicket: 143.13, tags: [], city: "Verona", region: "Veneto" },
  { name: "Giulia Rinaldi", lastVisit: "17 Apr 2025 (495d ago)", visits: 4, totalSpent: 761.4, avgTicket: 190.35, tags: ["Lunghi"], city: "Padova", region: "Veneto" },
  { name: "Silvia Martinelli", lastVisit: "19 May 2026 (98d ago)", visits: 9, totalSpent: 1469.0, avgTicket: 163.22, tags: ["Nero"], city: "Palermo", region: "Sicilia" },
  { name: "Cristina Rinaldi", lastVisit: "27 Oct 2025 (302d ago)", visits: 6, totalSpent: 509.4, avgTicket: 84.9, tags: ["Medi"], city: "Firenze", region: "Toscana" },
  { name: "Alice Barbieri", lastVisit: "01 Apr 2026 (146d ago)", visits: 6, totalSpent: 1258.3, avgTicket: 209.72, tags: ["Biondo Platino"], city: "Perugia", region: "Umbria" },
  { name: "Vittoria Caruso", lastVisit: "10 May 2026 (107d ago)", visits: 6, totalSpent: 520.25, avgTicket: 86.71, tags: ["Biondo", "Prima Volta"], city: "Bologna", region: "Emilia-Romagna" },
  { name: "Giovanna Lombardi", lastVisit: "06 Apr 2026 (141d ago)", visits: 6, totalSpent: 745.0, avgTicket: 124.17, tags: ["Mogano", "VIP"], city: "Verona", region: "Veneto" },
  { name: "Elisa Martini", lastVisit: "14 Apr 2026 (133d ago)", visits: 5, totalSpent: 959.75, avgTicket: 191.95, tags: ["Nero", "Lunghi", "Fedele"], city: "Firenze", region: "Toscana" }
];

// New Clients Data
export const newCards = [
  {
    id: "new-count",
    value: "1",
    title: "New Clients",
    subtitle: "Total Count",
    badge: "0%",
    themeColor: "#3CD896"
  },
  {
    id: "acquisition-rev",
    value: "€1636",
    title: "Acquisition Rev",
    subtitle: "From New Clients",
    badge: "+12%",
    themeColor: "#8B5CF6"
  },
  {
    id: "avg-ticket",
    value: "€1635.90",
    title: "Avg Ticket",
    subtitle: "New Clients",
    badge: "Initial",
    themeColor: "#14B8A6"
  },
  {
    id: "top-source",
    value: "Instagram",
    title: "Top Source",
    subtitle: "Most Common Channel",
    badge: "34%",
    themeColor: "#F97316"
  }
];

export const newChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "New Clients",
      data: [45, 52, 49, 60, 58, 65, 70, 82, 90, 105, 110, 125],
      backgroundColor: "#635BFF",
      borderRadius: 4
    }
  ]
};

export const newClientsList: ClientRow[] = [
  { name: "Elisabetta Rinaldi", lastVisit: "23 Aug 2026 (2d ago)", visits: 1, totalSpent: 1635.9, avgTicket: 148.72, tags: ["Nero"], city: "Roma", region: "Lazio" },
  { name: "Martina Ferri", lastVisit: "22 Aug 2026 (3d ago)", visits: 1, totalSpent: 120.0, avgTicket: 120.0, tags: ["Biondo", "Taglio"], city: "Firenze", region: "Toscana" },
  { name: "Sofia Gatti", lastVisit: "20 Aug 2026 (5d ago)", visits: 1, totalSpent: 85.0, avgTicket: 85.0, tags: ["Pieghe"], city: "Milano", region: "Lombardia" },
  { name: "Chiara Pellegrini", lastVisit: "18 Aug 2026 (7d ago)", visits: 1, totalSpent: 210.0, avgTicket: 210.0, tags: ["Mogano"], city: "Torino", region: "Piemonte" },
  { name: "Francesca Serra", lastVisit: "15 Aug 2026 (10d ago)", visits: 1, totalSpent: 95.0, avgTicket: 95.0, tags: ["Prima Volta"], city: "Napoli", region: "Campania" },
  { name: "Elena Giuliani", lastVisit: "12 Aug 2026 (13d ago)", visits: 1, totalSpent: 180.0, avgTicket: 180.0, tags: ["Balayage"], city: "Bologna", region: "Emilia-Romagna" }
];


// Returning Clients Data
export const returningCards = [
  {
    id: "returning-count",
    value: "74",
    title: "Returning Clients",
    subtitle: "Active & Loyal",
    badge: "25%",
    themeColor: "#14B8A6"
  },
  {
    id: "retention-revenue",
    value: "€99.254",
    title: "Retention Revenue",
    subtitle: "From Returning",
    badge: "High",
    themeColor: "#635BFF"
  },
  {
    id: "visit-frequency",
    value: "9.6",
    title: "Visit Frequency",
    subtitle: "Avg Visits/Client",
    badge: "+0.2",
    themeColor: "#F97316"
  },
  {
    id: "time-to-return",
    value: "45",
    title: "Time to Return",
    subtitle: "Avg Days",
    badge: "-2d",
    themeColor: "#FF5656"
  }
];

export const returningChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Visits",
      data: [180, 210, 195, 220, 240, 230, 250, 270, 290, 310, 320, 350],
      backgroundColor: "#14B8A6",
      borderRadius: 4
    }
  ]
};

export const returningClientsList: ClientRow[] = [
  { name: "Elisabetta Ferrara", lastVisit: "13 Aug 2026 (12d ago)", visits: 14, totalSpent: 1936.4, avgTicket: 138.31, tags: ["Corti", "VIP"], city: "Genova", region: "Liguria" },
  { name: "Silvia Romano", lastVisit: "07 Aug 2026 (18d ago)", visits: 6, totalSpent: 1143.15, avgTicket: 190.53, tags: ["Medi", "VIP"], city: "Perugia", region: "Umbria" },
  { name: "Ginevra Vitale", lastVisit: "11 Aug 2026 (14d ago)", visits: 8, totalSpent: 594.4, avgTicket: 74.3, tags: ["Rosso"], city: "Perugia", region: "Umbria" },
  { name: "Beatrice Bianchi", lastVisit: "11 Aug 2026 (14d ago)", visits: 7, totalSpent: 1005.0, avgTicket: 143.57, tags: ["VIP"], city: "Padova", region: "Veneto" },
  { name: "Ginevra Lombardi", lastVisit: "07 Aug 2026 (18d ago)", visits: 13, totalSpent: 1834.9, avgTicket: 141.15, tags: ["Nero"], city: "Milano", region: "Lombardia" },
  { name: "Giovanna Gentile", lastVisit: "22 Aug 2026 (3d ago)", visits: 10, totalSpent: 1695.25, avgTicket: 169.53, tags: ["Mogano", "Prima Volta"], city: "Milano", region: "Lombardia" },
  { name: "Simona Ricci", lastVisit: "10 Aug 2026 (15d ago)", visits: 7, totalSpent: 450.0, avgTicket: 64.29, tags: ["Medi"], city: "Milano", region: "Lombardia" },
  { name: "Cristina Gallo", lastVisit: "30 Jul 2026 (26d ago)", visits: 15, totalSpent: 1775.0, avgTicket: 118.33, tags: [], city: "Bologna", region: "Emilia-Romagna" },
  { name: "Elena Rossi", lastVisit: "21 Aug 2026 (4d ago)", visits: 8, totalSpent: 937.0, avgTicket: 117.13, tags: ["Mogano", "Corti", "Fedele"], city: "Roma", region: "Lazio" },
  { name: "Greta Martinelli", lastVisit: "24 Aug 2026 (1d ago)", visits: 15, totalSpent: 2035.6, avgTicket: 135.71, tags: [], city: "Genova", region: "Liguria" }
];

// High Spenders Data
export const highSpendersCards = [
  {
    id: "clients-in-range",
    value: "300",
    title: "Clients in Range",
    subtitle: "Total Count",
    badge: "Range",
    themeColor: "#635BFF"
  },
  {
    id: "total-revenue",
    value: "€378.716",
    title: "Total Revenue",
    subtitle: "Selected Range",
    badge: "Combined",
    themeColor: "#14B8A6"
  },
  {
    id: "avg-per-client",
    value: "€1262.39",
    title: "Avg per Client",
    subtitle: "Revenue / Client",
    badge: "Average",
    themeColor: "#8B5CF6"
  },
  {
    id: "top-spender",
    value: "Roberta",
    title: "Top Spender",
    subtitle: "Highest Value",
    badge: "Roberta",
    themeColor: "#FF5656"
  }
];

export const highSpendersList: ClientRow[] = [
  { name: "Roberta Ferrara", lastVisit: "24 Jul 2026 (32d ago)", visits: 16, totalSpent: 2686.45, avgTicket: 167.9, tags: ["Biondo", "Occasionale"], city: "Ancona", region: "Marche" },
  { name: "Federica Greco", lastVisit: "18 Aug 2026 (7d ago)", visits: 15, totalSpent: 2640.2, avgTicket: 176.01, tags: [], city: "Perugia", region: "Umbria" },
  { name: "Camilla Leone", lastVisit: "18 Aug 2026 (7d ago)", visits: 15, totalSpent: 2513.05, avgTicket: 167.54, tags: ["Rosso"], city: "Perugia", region: "Umbria" },
  { name: "Paola Lombardi", lastVisit: "28 Jul 2026 (28d ago)", visits: 17, totalSpent: 2486.2, avgTicket: 146.25, tags: ["Rosso", "Lunghi"], city: "Genova", region: "Liguria" },
  { name: "Simona Conti", lastVisit: "07 Apr 2026 (140d ago)", visits: 14, totalSpent: 2483.2, avgTicket: 177.37, tags: [], city: "Perugia", region: "Umbria" },
  { name: "Anna Vitale", lastVisit: "21 Aug 2026 (4d ago)", visits: 16, totalSpent: 2438.0, avgTicket: 152.38, tags: ["VIP"], city: "Firenze", region: "Toscana" },
  { name: "Alice Leone", lastVisit: "27 Jul 2026 (29d ago)", visits: 16, totalSpent: 2434.55, avgTicket: 152.16, tags: ["Biondo Platino", "Lunghi"], city: "Milano", region: "Lombardia" },
  { name: "Paola Lombardo", lastVisit: "06 Aug 2026 (19d ago)", visits: 17, totalSpent: 2419.3, avgTicket: 142.31, tags: ["Medi", "Royal"], city: "Perugia", region: "Umbria" },
  { name: "Valentina Mariani", lastVisit: "13 Aug 2026 (12d ago)", visits: 14, totalSpent: 2174.7, avgTicket: 155.34, tags: ["Royal"], city: "Firenze", region: "Toscana" },
  { name: "Giorgia Giordano", lastVisit: "25 Aug 2026 (0d ago)", visits: 14, totalSpent: 2174.0, avgTicket: 155.29, tags: ["Lunghi", "Occasionale"], city: "Milano", region: "Lombardia" }
];

// Tag Segmentation Data
export const tagSegmentationCards = [
  {
    id: "tagged-count",
    value: "179",
    title: "Clients with Tags",
    subtitle: "Total Count",
    badge: "Tags",
    themeColor: "#8B5CF6"
  },
  {
    id: "total-revenue",
    value: "€226.771",
    title: "Total Revenue",
    subtitle: "Segment Value",
    badge: "Lifetime",
    themeColor: "#14B8A6"
  },
  {
    id: "avg-per-client",
    value: "€1266.88",
    title: "Avg per Client",
    subtitle: "Revenue / Client",
    badge: "Average",
    themeColor: "#635BFF"
  },
  {
    id: "share-percentage",
    value: "59.7%",
    title: "Share of Total",
    subtitle: "% of All Clients",
    badge: "Share",
    themeColor: "#FF5656"
  }
];

export const tagSegmentationList: ClientRow[] = [
  { name: "Elisabetta Ferrara", lastVisit: "13 Aug 2026 (12d ago)", visits: 14, totalSpent: 1936.4, avgTicket: 138.31, tags: ["Corti", "VIP"], city: "Genova", region: "Liguria" },
  { name: "Ludovica Caruso", lastVisit: "21 Aug 2026 (4d ago)", visits: 12, totalSpent: 1665.55, avgTicket: 138.8, tags: ["Castano", "Medi"], city: "Perugia", region: "Umbria" },
  { name: "Serena Romano", lastVisit: "19 Jul 2026 (37d ago)", visits: 8, totalSpent: 969.9, avgTicket: 121.24, tags: ["Corti"], city: "Milano", region: "Lombardia" },
  { name: "Greta Moretti", lastVisit: "27 Apr 2026 (120d ago)", visits: 2, totalSpent: 224.4, avgTicket: 112.2, tags: ["Biondo", "Corti"], city: "Bologna", region: "Emilia-Romagna" },
  { name: "Giulia Rinaldi", lastVisit: "17 Apr 2025 (495d ago)", visits: 4, totalSpent: 761.4, avgTicket: 190.35, tags: ["Lunghi"], city: "Padova", region: "Veneto" },
  { name: "Monica Esposito", lastVisit: "19 Jun 2026 (67d ago)", visits: 7, totalSpent: 739.6, avgTicket: 105.66, tags: ["Mogano", "Lunghi", "VIP"], city: "Perugia", region: "Umbria" },
  { name: "Laura Galli", lastVisit: "16 Jun 2026 (70d ago)", visits: 5, totalSpent: 669.6, avgTicket: 133.92, tags: ["Biondo"], city: "Catania", region: "Sicilia" },
  { name: "Alice Barbieri", lastVisit: "01 Apr 2026 (146d ago)", visits: 6, totalSpent: 1258.3, avgTicket: 209.72, tags: ["Biondo Platino"], city: "Perugia", region: "Umbria" },
  { name: "Vittoria Caruso", lastVisit: "10 May 2026 (107d ago)", visits: 6, totalSpent: 520.25, avgTicket: 86.71, tags: ["Biondo", "Prima Volta"], city: "Bologna", region: "Emilia-Romagna" },
  { name: "Elena Rinaldi", lastVisit: "02 Jun 2026 (84d ago)", visits: 11, totalSpent: 1660.6, avgTicket: 150.96, tags: ["Biondo Platino"], city: "Ancona", region: "Marche" }
];

export const allAvailableTags = [
  "Biondo", "Biondo Platino", "Castano", "Corti", "Fedele", "Lunghi",
  "Medi", "Mogano", "Nero", "Occasionale", "Prima Volta", "Rame", "Rosso", "Royal", "VIP"
];

// Helper to parse dates
export const parseTextDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  const partsDash = dateStr.split("-");
  if (partsDash.length === 3) {
    const year = parseInt(partsDash[0], 10);
    const month = parseInt(partsDash[1], 10) - 1;
    const day = parseInt(partsDash[2], 10);
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(dateStr);
};

// Helper to extract numeric days ago
export const getDaysAgo = (lastVisit: string): number => {
  const match = lastVisit.match(/(\d+)d ago/);
  return match ? parseInt(match[1], 10) : 0;
};

// Shared Filter function
export const filterInactiveClients = (
  list: ClientRow[],
  filterMode: string,
  days: string,
  periodStart: string,
  periodEnd: string
): ClientRow[] => {
  return list.filter((client) => {
    if (filterMode === "Days Since Last Visit") {
      const minDays = parseInt(days, 10) || 0;
      return getDaysAgo(client.lastVisit) >= minDays;
    } else {
      const start = parseTextDate(periodStart).getTime();
      const end = parseTextDate(periodEnd).getTime();
      const durationDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      return getDaysAgo(client.lastVisit) >= durationDays;
    }
  });
};

export const inactiveCardsConfig = [
  {
    id: "inactive-count",
    title: "Inactive Clients",
    icon: Users,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/15 to-white",
    change: "+5% from last period",
  },
  {
    id: "lost-revenue",
    title: "Lost Revenue",
    icon: UserMinus,
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/10 to-white",
    change: "Est. Potential Loss",
  },
  {
    id: "avg-ticket",
    title: "Avg Ticket",
    icon: Tag,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/15 to-white",
    change: "Per Visit",
  },
  {
    id: "days-since-visit",
    title: "Days Since Visit",
    icon: Calendar,
    iconBg: "bg-[#F97316]/10",
    iconColor: "text-[#F97316]",
    cardStyle: "bg-gradient-to-b from-[#F97316]/15 to-white",
    change: "Average Aging",
  },
];

export const newCardsConfig = [
  {
    id: "new-count",
    title: "New Clients",
    icon: Users,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/15 to-white",
    change: "+15% from last period",
  },
  {
    id: "acquisition-rev",
    title: "Acquisition Rev",
    icon: TrendingUp, // Wait, TrendingUp is not imported yet, let's make sure to import it!
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/10 to-white",
    change: "+12% from last month",
  },
  {
    id: "avg-ticket",
    title: "Avg Ticket",
    icon: Tag,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/15 to-white",
    change: "Initial Ticket Value",
  },
  {
    id: "top-source",
    title: "Top Source",
    icon: Globe,
    iconBg: "bg-[#F97316]/10",
    iconColor: "text-[#F97316]",
    cardStyle: "bg-gradient-to-b from-[#F97316]/15 to-white",
    change: "34% of acquisitions",
  },
];

export const returningCardsConfig = [
  {
    id: "returning-count",
    title: "Returning Clients",
    icon: Users,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/15 to-white",
    change: "Active & Loyal",
  },
  {
    id: "retention-revenue",
    title: "Retention Revenue",
    icon: TrendingUp,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/15 to-white",
    change: "High Value",
  },
  {
    id: "visit-frequency",
    title: "Visit Frequency",
    icon: Repeat,
    iconBg: "bg-[#F97316]/10",
    iconColor: "text-[#F97316]",
    cardStyle: "bg-gradient-to-b from-[#F97316]/15 to-white",
    change: "Avg Visits/Client",
  },
  {
    id: "time-to-return",
    title: "Time to Return",
    icon: Calendar,
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/10 to-white",
    change: "Avg Days",
  },
];

export const highSpendersCardsConfig = [
  {
    id: "clients-in-range",
    title: "Clients in Range",
    icon: Users,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/15 to-white",
    change: "Total Count",
  },
  {
    id: "total-revenue",
    title: "Total Revenue",
    icon: TrendingUp,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/15 to-white",
    change: "Selected Range",
  },
  {
    id: "avg-per-client",
    title: "Avg per Client",
    icon: Award,
    iconBg: "bg-[#8B5CF6]/10",
    iconColor: "text-[#8B5CF6]",
    cardStyle: "bg-gradient-to-b from-[#8B5CF6]/15 to-white",
    change: "Revenue / Client",
  },
  {
    id: "top-spender",
    title: "Top Spender",
    icon: Tag,
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/10 to-white",
    change: "Highest Value",
  },
];

export const tagSegmentationCardsConfig = [
  {
    id: "tagged-count",
    title: "Clients with Tags",
    icon: Users,
    iconBg: "bg-[#8B5CF6]/10",
    iconColor: "text-[#8B5CF6]",
    cardStyle: "bg-gradient-to-b from-[#8B5CF6]/15 to-white",
    change: "Total Count",
  },
  {
    id: "total-revenue",
    title: "Total Revenue",
    icon: TrendingUp,
    iconBg: "bg-[#14B8A6]/10",
    iconColor: "text-[#14B8A6]",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/15 to-white",
    change: "Segment Value",
  },
  {
    id: "avg-per-client",
    title: "Avg per Client",
    icon: Award,
    iconBg: "bg-[#635BFF]/10",
    iconColor: "text-[#635BFF]",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/15 to-white",
    change: "Revenue / Client",
  },
  {
    id: "share-percentage",
    title: "Share of Total",
    icon: Tag,
    iconBg: "bg-[#FF5656]/10",
    iconColor: "text-[#FF5656]",
    cardStyle: "bg-gradient-to-b from-[#FF5656]/10 to-white",
    change: "% of All Clients",
  },
];







export const dailyProductionData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Above Threshold",
      data: [1200, 2500, 800, 2800, 0, 2600, 2600],
      backgroundColor: "#2DD4BF",
      borderRadius: 20,
      barPercentage: 0.2,
    },
    {
      label: "Below Threshold",
      data: [-1800, -800, -1600, -1200, -1200, -1800, -1200],
      backgroundColor: "#F43F5E",
      borderRadius: 20,
      barPercentage: 0.2,
    },
  ],
};

export const dailyProductionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          return `  ${context.dataset.label}: € ${Math.abs(context.raw)}`;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      stacked: true,
      grid: { color: "#F1F5F9", drawBorder: false },
      ticks: {
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        stepSize: 1000,
        callback: (value: any) => {
          if (value === 0) return "0";
          return `€ ${Math.abs(value / 1000)}k`;
        },
      },
      border: { display: false },
    }
  }
};

const thresholdValue = 2000;
export const productionTrendsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Production",
      data: [1900, 2100, 2200, 1800, 1500, 1100, 1800, 2800, 2700, 2600, 2500, 2400],
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
      segment: {
        borderColor: (ctx: any) => {
          return ctx.p1.parsed.y >= thresholdValue ? "#22C55E" : "#F43F5E";
        },
      },
    },
  ],
};

export const productionTrendsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => `  € ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 0,
      max: 3000,
      ticks: {
        stepSize: 1000,
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        callback: (value: any) => {
          if (value === 0) return "0";
          return `€ ${value / 1000}k`;
        },
      },
      grid: { color: "#F8FAFC" },
      border: { display: false },
    }
  }
};

export const paymentsPerYearData = {
  labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
  datasets: [
    {
      label: "Payments",
      data: [1200, 1500, 1800, 1600, 3200, 3500],
      backgroundColor: "#635BFF",
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
      barPercentage: 0.6,
    },
    {
      label: "Background",
      data: [4500, 4500, 4500, 4500, 4500, 4500],
      backgroundColor: "#F8FAFC",
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
      grouped: false,
      barPercentage: 0.6,
      order: 2,
    },
  ],
};

export const paymentsPerYearOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      filter: (tooltipItem: any) => tooltipItem.datasetIndex === 0,
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => `  Total: € ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 0,
      max: 4500,
      ticks: {
        stepSize: 500,
        color: "#94A3B8",
        font: { family: "Manrope", size: 11 },
        callback: (value: any) => `€ ${value}`,
      },
      grid: { display: false },
      border: { display: false },
    }
  }
};
export const employeeProductionCards = [
  {
    id: "monthly-turnover",
    value: "€ 8,500",
    title: "Monthly Turnover",
    icon: "BriefcaseBusiness",
    bgClass: "bg-gradient-to-br from-[#F5F3FF] to-[#F5F3FF]/30",
    iconBgClass: "bg-[#635BFF]"
  },
  {
    id: "target-threshold",
    value: "€ 6,400",
    title: "Target Threshold",
    icon: "Target",
    bgClass: "bg-gradient-to-br from-[#FEFCE8] to-[#FEFCE8]/30",
    iconBgClass: "bg-[#FBBF24]"
  },
  {
    id: "performance",
    value: "133%",
    title: "Performance",
    icon: "Award",
    bgClass: "bg-gradient-to-br from-[#F0FDFA] to-[#F0FDFA]/30",
    iconBgClass: "bg-[#2DD4BF]",
    badge: "Goal Achieved"
  }
];

export const employeeRemunerationCards = [
  {
    id: "last-payslip",
    value: "€ 1,700",
    title: "Last Payslip",
    subtitle: "Gross: € 4,300.00\nNovember 20, 2024",
    icon: "Wallet",
    bgClass: "bg-gradient-to-br from-[#F5F3FF] to-[#F5F3FF]/30",
    iconBgClass: "bg-[#635BFF]"
  },
  {
    id: "average-salary",
    value: "€ 2,200",
    title: "Average Salary",
    subtitle: "Last 12 months",
    icon: "DollarSign",
    bgClass: "bg-gradient-to-br from-[#F0FDFA] to-[#F0FDFA]/30",
    iconBgClass: "bg-[#2DD4BF]"
  },
  {
    id: "accumulated-tfr",
    value: "€ 5,500",
    title: "Accumulated TFR",
    icon: "Database",
    bgClass: "bg-gradient-to-br from-[#FEFCE8] to-[#FEFCE8]/30",
    iconBgClass: "bg-[#FBBF24]"
  }
];
export const employeePerformanceMetrics = {
  targetThreshold: "€ 1,700",
  monthlySalary: "€ 3,200",
  thresholdCalculation: "€ 1,700",
  performanceStatus: "Goal Achieved",
  statusColor: "bg-[#CCFBF1] text-[#0D9488]"
};

export const employeeOperationStatics = {
  completedAppointments: "38",
  revenueAppointment: "€ 223.68",
  workingDays: "3",
  performanceStatus: "€ 2,633.33"
};

// ==========================================
// PERFORMANCE DASHBOARD DATA
// ==========================================

export const performanceStatCards = [
  {
    id: 4,
    title: "Appointments Completed",
    value: "45",
    change: "Last 30-days",
    icon: "Wallet",
    iconColor: "text-[#635BFF]",
    iconBgColor: "bg-[#EEF2FF]",
    iconShadowColor: "",
    cardStyle: "bg-gradient-to-b from-[#635BFF]/[30%] to-[#FFFFFF]",
  },
  {
    id: 5,
    title: "Appointments Book Now",
    value: "52",
    change: "Last 30-days",
    icon: "Calendar",
    iconColor: "text-[#14B8A6]",
    iconBgColor: "bg-[#CCFBF1]",
    iconShadowColor: "",
    cardStyle: "bg-gradient-to-b from-[#14B8A6]/[30%] to-[#FFFFFF]",
  },
  {
    id: 6,
    title: "Average Ticket",
    value: "€ 100",
    change: "Average spend",
    icon: "Tag",
    iconColor: "text-[#22C55E]",
    iconBgColor: "bg-[#DCFCE7]",
    iconShadowColor: "",
    cardStyle: "bg-gradient-to-b from-[#22C55E]/[30%] to-[#FFFFFF]",
  },
];

export const SERVICE_REVENUE_PAGE_1 = [
  { name: "Haircut", value: 1700 },
  { name: "Haircut", value: 1800 },
  { name: "Haircut", value: 2000 },
  { name: "Haircut", value: 2000 },
  { name: "Haircut", value: 2000 },
  { name: "Haircut", value: 2100 },
  { name: "Haircut", value: 2400 },
];

export const SERVICE_REVENUE_PAGE_2 = [
  { name: "Coloring", value: 2800 },
  { name: "Styling", value: 2200 },
  { name: "Nail Care", value: 1900 },
  { name: "Facial", value: 2600 },
  { name: "Waxing", value: 1500 },
  { name: "Massage", value: 2300 },
  { name: "Makeup", value: 1800 },
];

export const performanceCategoryData = {
  labels: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6", "Category 7"],
  datasets: [
    {
      data: [2500, 2000, 1500, 1500, 1000, 800, 700],
      backgroundColor: [
        "#635BFF", // Category 1 (Purple)
        "#06B6D4", // Category 2 (Cyan)
        "#FBBF24", // Category 3 (Yellow)
        "#2DD4BF", // Category 4 (Teal)
        "#EC4899", // Category 5 (Pink)
        "#10B981", // Category 6 (Green)
        "#1E293B", // Category 7 (Slate)
      ],
      borderWidth: 0,
      cutout: "75%",
    },
  ],
};

export const performanceCategoryOptions = {
  rotation: 270,
  circumference: 180,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 10,
      boxPadding: 4,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

export const performanceLineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Salaries",
      data: [1400, 1650, 1750, 1950, 1900, 1850, 1800, 1850, 1900, 2050, 2000, 1900],
      borderColor: "#14B8A6",
      backgroundColor: "rgba(20, 184, 166, 0.05)",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      label: "Costs",
      data: [3200, 3100, 2450, 2400, 2100, 1500, 1450, 1500, 1400, 1300, 1350, 1300],
      borderColor: "#635BFF",
      backgroundColor: "rgba(99, 91, 255, 0.05)",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
  ],
};

export const performanceLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context: any) => `  ${context.dataset.label}: € ${context.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#94A3B8",
        font: {
          family: "Manrope",
          size: 11,
        },
      },
    },
    y: {
      min: 1000,
      max: 3500,
      ticks: {
        stepSize: 500,
        color: "#94A3B8",
        font: {
          family: "Manrope",
          size: 11,
        },
        callback: (value: any) => "€ " + value.toLocaleString(),
      },
      grid: {
        color: "#F8FAFC",
      },
    },
  },
};

export const weeklyAppointmentsData = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  datasets: [
    {
      label: "Appoiments",
      data: [45, 40, 65, 55, 120, 130, 115],
      borderColor: "#22C55E",
      backgroundColor: "rgba(34, 197, 94, 0.05)",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
  ],
};

export const weeklyAppointmentsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#22C55E",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      callbacks: {
        label: (context: any) => `  ${context.dataset.label}: ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 0,
      max: 140,
      ticks: { stepSize: 35, color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      grid: { color: "#F8FAFC" },
      border: { display: false },
    },
  },
};

export const averageTicketData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Average Ticket",
      data: [70, 55, 80, 58, 28, 28, 28, 28, 28, 28, 28, 28],
      backgroundColor: "#635BFF",
      borderRadius: 20,
      barPercentage: 0.3,
    },
  ],
};

export const averageTicketOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#1E293B",
      bodyColor: "#475569",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      border: { display: false },
    },
    y: {
      min: 20,
      max: 80,
      ticks: { stepSize: 20, color: "#94A3B8", font: { family: "Manrope", size: 11 } },
      grid: { color: "#F8FAFC" },
      border: { display: false },
    },
  },
};

export const reportsList = [
  {
    id: "REP-2026-08-25",
    name: "Monthly Financial Performance Summary",
    type: "Financial",
    date: "Aug 25, 2026 09:00 AM",
    format: "PDF",
    size: "2.4 MB",
    status: "Ready",
  },
  {
    id: "REP-2026-08-24",
    name: "Inventory Valuation and Stock Alert Status",
    type: "Inventory",
    date: "Aug 24, 2026 06:15 PM",
    format: "XLSX",
    size: "1.1 MB",
    status: "Ready",
  },
  {
    id: "REP-2026-08-23",
    name: "Staff Performance & worked shifts breakdown",
    type: "Staff",
    date: "Aug 23, 2026 11:30 AM",
    format: "PDF",
    size: "3.7 MB",
    status: "Ready",
  },
  {
    id: "REP-2026-08-20",
    name: "Geography Customer distribution map export",
    type: "Geography",
    date: "Aug 20, 2026 04:45 PM",
    format: "CSV",
    size: "820 KB",
    status: "Expired",
  },
  {
    id: "REP-2026-08-15",
    name: "Annual Business Forecast Report",
    type: "Financial",
    date: "Aug 15, 2026 10:00 AM",
    format: "PDF",
    size: "4.8 MB",
    status: "Ready",
  },
];

export const geographyRevenueDataMap: Record<string, any> = {
  "2026": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ data: [42, 18, 22, 11, 7], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656", "#94A3B8"], borderWidth: 0 }]
  },
  "2025": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ data: [38, 20, 20, 12, 10], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656", "#94A3B8"], borderWidth: 0 }]
  },
  "2024": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ data: [35, 25, 15, 15, 10], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656", "#94A3B8"], borderWidth: 0 }]
  }
};

export const customerDensityDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ label: "Customer Count", data: [320, 185, 210, 140, 95], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  },
  "Last Month": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ label: "Customer Count", data: [290, 165, 190, 120, 85], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  },
  "This Year": {
    labels: ["Downtown", "Northside", "West End", "South Hills", "Suburbia"],
    datasets: [{ label: "Customer Count", data: [3500, 2100, 2300, 1500, 1100], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  }
};

export const staffHoursDataMap: Record<string, any> = {
  "This Week": {
    labels: ["Emma W.", "Liam A.", "Sophia M.", "Olivia T.", "Jackson D."],
    datasets: [{ label: "Hours Worked This Week", data: [38, 42, 35, 40, 30], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  },
  "Last Week": {
    labels: ["Emma W.", "Liam A.", "Sophia M.", "Olivia T.", "Jackson D."],
    datasets: [{ label: "Hours Worked Last Week", data: [40, 40, 38, 42, 35], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  },
  "This Month": {
    labels: ["Emma W.", "Liam A.", "Sophia M.", "Olivia T.", "Jackson D."],
    datasets: [{ label: "Hours Worked This Month", data: [160, 168, 150, 165, 130], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 20 }]
  }
};

export const stylistReviewDataMap: Record<string, any> = {
  "This Month": {
    labels: ["5 Stars", "4 Stars", "3 Stars", "Under 3 Stars"],
    datasets: [{ data: [75, 18, 5, 2], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "Last Month": {
    labels: ["5 Stars", "4 Stars", "3 Stars", "Under 3 Stars"],
    datasets: [{ data: [70, 20, 7, 3], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "This Year": {
    labels: ["5 Stars", "4 Stars", "3 Stars", "Under 3 Stars"],
    datasets: [{ data: [80, 15, 4, 1], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  }
};

export const stockLevelDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Shampoos", "Conditioners", "Styling Gels", "Hair Colors", "Tools"],
    datasets: [{ label: "Items Count", data: [120, 85, 95, 140, 45], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 18 }]
  },
  "Last Month": {
    labels: ["Shampoos", "Conditioners", "Styling Gels", "Hair Colors", "Tools"],
    datasets: [{ label: "Items Count", data: [100, 90, 80, 150, 40], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 18 }]
  },
  "This Year": {
    labels: ["Shampoos", "Conditioners", "Styling Gels", "Hair Colors", "Tools"],
    datasets: [{ label: "Items Count", data: [1400, 950, 1100, 1600, 500], backgroundColor: "#635BFF", borderRadius: 4, barThickness: 18 }]
  }
};

export const topProductSalesDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Hydrating Shampoo", "Argan Hair Oil", "Matte Pomade", "Keratin Spray"],
    datasets: [{ data: [35, 28, 22, 15], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "Last Month": {
    labels: ["Hydrating Shampoo", "Argan Hair Oil", "Matte Pomade", "Keratin Spray"],
    datasets: [{ data: [38, 25, 20, 17], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "This Year": {
    labels: ["Hydrating Shampoo", "Argan Hair Oil", "Matte Pomade", "Keratin Spray"],
    datasets: [{ data: [40, 26, 18, 16], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  }
};

export const revenueTrendDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Revenue", data: [12500, 15800, 14200, 18900], fill: true, backgroundColor: "rgba(99, 91, 255, 0.1)", borderColor: "#635BFF", borderWidth: 3, tension: 0.4, pointBackgroundColor: "#635BFF", pointHoverRadius: 7 }]
  },
  "Last Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Revenue", data: [11000, 14000, 13500, 17500], fill: true, backgroundColor: "rgba(99, 91, 255, 0.1)", borderColor: "#635BFF", borderWidth: 3, tension: 0.4, pointBackgroundColor: "#635BFF", pointHoverRadius: 7 }]
  },
  "This Year": {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [{ label: "Revenue", data: [150000, 165000, 180000, 200000], fill: true, backgroundColor: "rgba(99, 91, 255, 0.1)", borderColor: "#635BFF", borderWidth: 3, tension: 0.4, pointBackgroundColor: "#635BFF", pointHoverRadius: 7 }]
  }
};

export const revenueByCategoryDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Hair Services", "Beauty & Spa", "Nail Care", "Product Sales"],
    datasets: [{ data: [45, 25, 18, 12], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "Last Month": {
    labels: ["Hair Services", "Beauty & Spa", "Nail Care", "Product Sales"],
    datasets: [{ data: [40, 30, 20, 10], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  },
  "This Year": {
    labels: ["Hair Services", "Beauty & Spa", "Nail Care", "Product Sales"],
    datasets: [{ data: [50, 20, 15, 15], backgroundColor: ["#635BFF", "#3CD896", "#FFAB2D", "#FF5656"], borderWidth: 0 }]
  }
};

export const revenueByPaymentMethodDataMap: Record<string, any> = {
  "This Month": {
    labels: ["Credit Card", "Cash", "Gift Card", "Apple Pay"],
    datasets: [{ label: "Transactions Value", data: [35000, 12000, 5000, 9400], backgroundColor: "#635BFF", borderRadius: 6, barThickness: 20 }]
  },
  "Last Month": {
    labels: ["Credit Card", "Cash", "Gift Card", "Apple Pay"],
    datasets: [{ label: "Transactions Value", data: [32000, 14000, 4500, 8000], backgroundColor: "#635BFF", borderRadius: 6, barThickness: 20 }]
  },
  "This Year": {
    labels: ["Credit Card", "Cash", "Gift Card", "Apple Pay"],
    datasets: [{ label: "Transactions Value", data: [420000, 150000, 60000, 110000], backgroundColor: "#635BFF", borderRadius: 6, barThickness: 20 }]
  }
};

export const mostLoyalCustomersList = [
  { id: 1, name: "Sofa Biachi", lastVisit: "November 27, 2024", appointments: 25, spent: "€ 1,700" },
  { id: 2, name: "Guy Hawkins", lastVisit: "October 04, 2024", appointments: 24, spent: "€ 1,500" },
  { id: 3, name: "Cameron Williamson", lastVisit: "December 20, 2024", appointments: 20, spent: "€ 1,200" }
];

export const neighborhoodBreakdownRows = [
  { name: "Downtown Core", clients: 320, spend: "$95.00", freq: "Once / 3 wks", pct: "42%" },
  { name: "Northside & Waterfront", clients: 185, spend: "$78.50", freq: "Once / 4 wks", pct: "18%" },
  { name: "West End Heights", clients: 210, spend: "$110.00", freq: "Once / 3.5 wks", pct: "22%" },
  { name: "South Hills Residential", clients: 140, spend: "$82.00", freq: "Once / 5 wks", pct: "11%" },
  { name: "Suburbia Metro", clients: 95, spend: "$65.00", freq: "Once / 6 wks", pct: "7%" }
];

export const recentHighValueBookingsList = [
  { name: "Sophia Martinez", service: "Full Balayage & Cut", amount: "$350", date: "Aug 24, 2026" },
  { name: "Liam Anderson", service: "Keratin Treatment", amount: "$280", date: "Aug 23, 2026" },
  { name: "Emma Watson", service: "Bridal Styling Makeup", amount: "$450", date: "Aug 22, 2026" },
  { name: "Olivia Taylor", service: "Hair Extension Install", amount: "$600", date: "Aug 22, 2026" }
];

export const reorderLowStockAlertsList = [
  { name: "Professional Argan Oil 250ml", category: "Hair Oil", qty: 2, min: 10, status: "Critical" },
  { name: "Matte Wax Hold Strong 100g", category: "Styling Gel", qty: 4, min: 15, status: "Low Stock" },
  { name: "Sulfate-Free Volume Shampoo", category: "Shampoo", qty: 5, min: 12, status: "Low Stock" },
  { name: "Moisturizing Hair Balm", category: "Conditioner", qty: 0, min: 8, status: "Out of Stock" }
];

export const staffUtilizationList = [
  { name: "Emma Watson", role: "Senior Stylist", bookings: 48, revenue: "$4,800", rate: "88%" },
  { name: "Liam Anderson", role: "Master Barber", bookings: 42, revenue: "$3,600", rate: "84%" },
  { name: "Sophia Martinez", role: "Nail Artist", bookings: 35, revenue: "$2,800", rate: "80%" },
  { name: "Olivia Taylor", role: "Color Specialist", bookings: 40, revenue: "$4,200", rate: "86%" },
  { name: "Jackson Davis", role: "Junior Stylist", bookings: 22, revenue: "$1,500", rate: "72%" }
];