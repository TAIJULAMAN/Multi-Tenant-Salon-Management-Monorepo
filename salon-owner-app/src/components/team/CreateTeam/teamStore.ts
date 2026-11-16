export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "Manager" | "Staff" | "Accountant";
  status: "Active" | "Pending" | "Inactive";
  contractType?: "Full Time" | "Part Time" | "Stage" | "Vat collaboration";
  avatarUrl: string;
  isSuspended?: boolean;
  employmentStatus?: string;
}

export let mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    email: "maria@beautywellness.com",
    phone: "+39 345 678 9123",
    role: "Manager",
    status: "Active",
    contractType: "Full Time",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "2",
    name: "Leslie Alexander",
    email: "leslie@beautywellness.com",
    phone: "+39 348 912 3456",
    role: "Staff",
    status: "Active",
    contractType: "Part Time",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "3",
    name: "Robert Fox",
    email: "robert@beautywellness.com",
    phone: "+39 340 555 7890",
    role: "Staff",
    status: "Active",
    contractType: "Full Time",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "4",
    name: "Emma Watson",
    email: "emma@beautywellness.com",
    phone: "+39 333 444 5555",
    role: "Accountant",
    status: "Active",
    contractType: "Stage",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "5",
    name: "Oliver Twist",
    email: "oliver@beautywellness.com",
    phone: "+39 349 888 1234",
    role: "Staff",
    status: "Pending",
    contractType: "Vat collaboration",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "6",
    name: "Sophia Loren",
    email: "sophia@beautywellness.com",
    phone: "+39 338 777 6655",
    role: "Staff",
    status: "Inactive",
    contractType: "Full Time",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
  },
];

const listeners = new Set<() => void>();

export const teamStore = {
  getMembers() {
    return mockTeamMembers;
  },
  addMember(member: Omit<TeamMember, "id">) {
    const newMember: TeamMember = {
      ...member,
      id: String(mockTeamMembers.length + 1),
    };
    mockTeamMembers = [...mockTeamMembers, newMember];
    listeners.forEach((l) => l());
    return newMember;
  },
  toggleSuspend(id: string) {
    mockTeamMembers = mockTeamMembers.map((m) =>
      m.id === id
        ? {
            ...m,
            status: m.status === "Inactive" ? "Active" : "Inactive",
            isSuspended: !m.isSuspended,
          }
        : m
    );
    listeners.forEach((l) => l());
  },
  deleteMember(id: string) {
    mockTeamMembers = mockTeamMembers.filter((m) => m.id !== id);
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
