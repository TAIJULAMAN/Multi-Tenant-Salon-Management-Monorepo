import React from "react";

export type Shift = {
  time: string;
};

export type MemberSchedule = {
  id: string;
  name: string;
  hours: string;
  avatarBg: string;
  avatarUrl: string;
  shifts: (Shift | null)[];
};

export type ClosedPeriod = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type OverriddenSlot = {
  memberId: string;
  dateString: string;
};

export interface WeeklyShiftsTableProps {
  currentWeekStart: Date;
  schedules: MemberSchedule[];
  closedPeriods: ClosedPeriod[];
  overriddenClosedSlots: OverriddenSlot[];
  activeShiftMenu: { memberId: string; dayIndex: number } | null;
  activeClosedSlotMenu: { memberId: string; dateString: string; periodId: string } | null;
  currentPage: number;
  itemsPerPage: number;
  onShiftClick: (e: React.MouseEvent, memberId: string, dayIndex: number) => void;
  onClosedSlotClick: (e: React.MouseEvent, memberId: string, dateString: string, periodId: string) => void;
  onEditShift: (memberId: string, dayIndex: number, time: string) => void;
  onDeleteShift: (memberId: string, dayIndex: number, time: string) => void;
  onReactivateSlot: (memberId: string, dateString: string) => void;
  onReopenPeriod: (periodId: string) => void;
  onPageChange: (page: number) => void;
  shiftMenuRef: React.RefObject<HTMLDivElement | null>;
}

export interface ShiftModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}
