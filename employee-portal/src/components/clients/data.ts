import { ClientData, AllergyColor, ClientNote, ClientMedia, ClientAllergy, ClientCommLog } from "./types";

const generateMockClients = (): ClientData[] => {
  const clients: ClientData[] = [];
  const colors: AllergyColor[] = ["yellow", "purple", "pink"];
  const bgs = ["bg-[#FCE7F3]", "bg-[#E2E8F0]", "bg-[#CCFBF1]", "bg-[#FEE2E2]", "bg-[#E0E7FF]"];

  for (let i = 1; i <= 25; i++) {
    clients.push({
      id: `client_${i}`,
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      telephone: "+39 345 678 9123",
      lastAppointment: "02/09/2025",
      allergy: {
        name: "Fragrances Allergie",
        color: colors[i % 3] as AllergyColor,
      },
      createdAt: "08/08/2024",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Maria${i}&backgroundColor=transparent`,
      avatarBg: bgs[i % 5],
    });
  }
  return clients;
};

export const dummyClientsData: ClientData[] = generateMockClients();

export const initialClientNotes: ClientNote[] = [
  {
    id: "1",
    title: "Client Consultation & Preferences",
    description: "Prefers organic ammonia-free hair dye. Sensitive scalp condition noted on temple areas.",
    attachmentsCount: 1,
    attachmentName: "scalp_consultation.pdf",
    date: "Aug 10, 2025",
  },
  {
    id: "2",
    title: "Allergy & Skin Test Record",
    description: "Patch test conducted for L'Oreal Inoa shade 6.1. No adverse reaction observed after 48h.",
    attachmentsCount: 1,
    attachmentName: "patch_test_results.pdf",
    date: "Aug 05, 2025",
  },
  {
    id: "3",
    title: "Styling & Finish Preferences",
    description: "Requested soft layered blowout with Dyson Supersonic. Avoid heavy silicon oils.",
    attachmentsCount: 0,
    date: "Jul 28, 2025",
  },
  {
    id: "4",
    title: "Product Recommendations",
    description: "Recommended Kerastase Nutritive shampoo and mask for home care routine.",
    attachmentsCount: 1,
    attachmentName: "recommended_products.pdf",
    date: "Jul 15, 2025",
  },
];

export const initialClientAllergies: ClientAllergy[] = [
  {
    id: "1",
    title: "Fragrances Allergie",
    description: "Mild reaction to synthetic scented hair perfumes. Redness may occur.",
    severity: "Medium",
  },
  {
    id: "2",
    title: "Ammonia Sensitivity",
    description: "Severe burning sensation on scalp if ammonia products are applied.",
    severity: "High",
  },
  {
    id: "3",
    title: "Latex Contact Allergy",
    description: "Use non-latex nitryl gloves during hair wash and color treatments.",
    severity: "Low",
  },
];

export const mockClientMedia: ClientMedia[] = [
  {
    id: "1",
    type: "Photo",
    fileName: "Haircut_Front.jpeg",
    date: "08/09/2025 5:06 PM",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "2",
    type: "Video",
    fileName: "Coloring_Process.mp4",
    date: "08/09/2025 5:15 PM",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "3",
    type: "Photo",
    fileName: "Haircut_Back.jpeg",
    date: "08/09/2025 5:30 PM",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
];

export const mockClientCommLogs: ClientCommLog[] = [
  {
    id: "1",
    channel: "WhatsApp",
    title: "Appointment Reminder: Tomorrow at 10:00 AM",
    employee: "Maria Rodriguez",
    date: "07/08/2025",
    time: "09:30",
    status: "Delivered",
    source: "Staff Member",
  },
  {
    id: "2",
    channel: "Email",
    title: "Receipt for Haircut & Styling Session #0025",
    employee: "System",
    date: "07/08/2025",
    time: "10:15",
    status: "Sent",
    source: "System",
  },
  {
    id: "3",
    channel: "SMS",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "System",
    date: "07/08/2025",
    time: "11:44",
    status: "Sent",
    source: "System",
  },
  {
    id: "4",
    channel: "WhatsApp",
    title: "Feedback Request on your recent visit",
    employee: "Angelica",
    date: "07/08/2025",
    time: "14:20",
    status: "Read",
    source: "Staff Member",
  },
  {
    id: "5",
    channel: "WhatsApp",
    title: "Color consultation confirmation",
    employee: "Sophia Ventura",
    date: "06/08/2025",
    time: "16:00",
    status: "Failed",
    source: "Staff Member",
  },
];
