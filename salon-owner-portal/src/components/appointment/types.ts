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

export interface ImportedAppointment {
  id: string;
  startAt: string;
  endAt: string;
  clientRef: string;
  serviceRef: string;
  staffRef: string;
  status: string;
  note: string;
}


export interface ReviewServiceRow {
  id: string;
  name: string;
  date: string;
  price: number;
  startTime: string;
  duration: string;
  employee: string;
  employeeAvatar: string;
}

export interface CalendarSettingsPanelProps {
  startHour: number;
  endHour: number;
  slotDuration: number;
  slotHeight: number;
  onStartHourChange: (h: number) => void;
  onEndHourChange: (h: number) => void;
  onSlotDurationChange: (min: number) => void;
  onSlotHeightChange: (px: number) => void;
}

export interface TipOption {
  label: string;
  pct: number;
  amount: string | null;
}


export interface GiftCardDetail {
  dateOfIssue: string;
  dateOfExpiration: string;
  amount: string;
  usageLimit: string;
  eligibleServices: string[];
  receiverName: string;
  gifterName: string;
  personalMessage: string;
}

export interface ModalClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  notes: string;
  giftCards: number;
  giftCardDetails: GiftCardDetail | null;
}

export interface ModalService {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface ClientNoteItem {
  id: string;
  text: string;
  date: string;
  author?: string;
}

export interface BookingOrderItem {
  serviceId: string;
  employeeId: string;
  startTime?: string;
  endTime?: string;
}
