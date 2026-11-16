import { Signer, Waiver, Client } from "./types";

export const initialSigners: Signer[] = [
    {
        id: "1",
        type: "Pre-signed",
        category: "Owner",
        name: "",
        isDrawing: true,
        signature: null,
    },
    {
        id: "2",
        type: "Pre-signed",
        category: "Owner",
        name: "sdsdsd",
        isDrawing: false,
        signature: null,
    },
    {
        id: "3",
        type: "Recipient",
        category: "Owner",
        name: "",
        isDrawing: false,
        signature: null,
    },
    {
        id: "4",
        type: "Recipient",
        category: "Owner",
        name: "",
        isDrawing: false,
        signature: null,
    }
];

export const mockClients: Client[] = [
  { id: "1", name: "Maria Rodriguez", email: "maria@beautywellness.com", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Sarah Jenkins", email: "sarah@beautywellness.com", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Michael Chang", email: "michael@beautywellness.com", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Emily Davis", email: "emily@beautywellness.com", avatar: "https://i.pravatar.cc/150?u=4" },
];

export const mockEmployees = [
  { id: "emp-1", name: "Shah Aman", role: "Master Stylist" },
  { id: "emp-2", name: "Hasan Siam", role: "Senior Barber" },
  { id: "emp-3", name: "Hridoy Khan", role: "Esthetician" },
  { id: "emp-4", name: "Hridoy Alam", role: "Color Specialist" },
];

const mockDates = [
  "Nov 04, 2026",
  "Nov 02, 2026",
  "Oct 28, 2026",
  "Oct 22, 2026",
  "Oct 15, 2026",
  "Oct 08, 2026",
  "Sep 25, 2026",
  "Sep 12, 2026",
];

export const MOCK_WAIVERS: Waiver[] = [
  ...Array.from({ length: 8 }).map((_, i) => {
    const isEmployee = i % 2 === 1;
    const person = isEmployee
      ? mockEmployees[i % mockEmployees.length].name
      : mockClients[i % mockClients.length].name;
    const date = mockDates[i % mockDates.length];
    return {
      id: `template-${i + 1}`,
      name: `Waiver Template ${i + 1}`,
      signers: 2,
      signedCount: `${(i * 13) % 50 + 5} times`,
      lastUpdate: date,
      type: "template" as const,
      targetRole: (isEmployee ? "Employee" : "Client") as "Employee" | "Client",
      personName: person,
      createdDate: date,
    };
  }),
  ...Array.from({ length: 12 }).map((_, i) => {
    const isEmployee = i % 3 === 0;
    const person = isEmployee
      ? mockEmployees[i % mockEmployees.length].name
      : mockClients[i % mockClients.length].name;
    const date = mockDates[i % mockDates.length];
    return {
      id: `signed-${i + 1}`,
      name: `Signed Waiver ${i + 1}`,
      signers: 1,
      signedCount: "1 time",
      lastUpdate: date,
      type: "signed" as const,
      targetRole: (isEmployee ? "Employee" : "Client") as "Employee" | "Client",
      signedBy: person,
      personName: person,
      dateSigned: date,
    };
  })
];

export const mockWaivers = MOCK_WAIVERS;
