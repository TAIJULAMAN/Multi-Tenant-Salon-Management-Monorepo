import React from "react";
import { Appointment } from "./data";

export interface AppointmentTableViewProps {
  setSearchOpen: (val: boolean) => void;
  activePeriod: "Month" | "Week" | "Day";
  setActivePeriod: (val: "Month" | "Week" | "Day") => void;
  paginated: Appointment[];
  currentPage: number;
  itemsPerPage: number;
  expandedRow: number | null;
  handleChevronClick: (index: number) => void;
  filtered: Appointment[];
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  dateLabel: string;
  handleNavigate: (dir: number) => void;
  selectedSearchMember?: { name: string; phone: string; clientAvatar: string } | null;
  onClearSearch?: () => void;
  selectedTeamMembers: string[];
  setSelectedTeamMembers: (members: string[]) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}
