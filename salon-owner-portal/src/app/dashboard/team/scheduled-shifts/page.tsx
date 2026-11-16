"use client";

import React, { useState, useRef, useEffect } from "react";
import WeeklyShiftsTable from "@/components/team/WeeklyShiftsTable";
import WeekNavigator from "@/components/team/WeekNavigator";
import ScheduledShiftsHeader from "@/components/team/scheduled-shifts/ScheduledShiftsHeader";
import ScheduledShiftsModals from "@/components/team/scheduled-shifts/ScheduledShiftsModals";
import { initialSchedules, initialClosedPeriods } from "@/components/team/data";
import { MemberSchedule, ClosedPeriod, OverriddenSlot } from "@/components/team/types";

export default function ScheduledShiftsPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date(2024, 7, 11),
  ); // Aug 11, 2024

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const [activeShiftMenu, setActiveShiftMenu] = useState<{
    memberId: string;
    dayIndex: number;
  } | null>(null);
  const shiftMenuRef = useRef<HTMLDivElement>(null);

  const [schedules, setSchedules] =
    useState<MemberSchedule[]>(initialSchedules);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [isBlockedTimeModalOpen, setIsBlockedTimeModalOpen] = useState(false);
  const [isClosedPeriodModalOpen, setIsClosedPeriodModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active shift logic
  const [activeShiftForEdit, setActiveShiftForEdit] = useState<{
    memberId: string;
    dayIndex: number;
    time: string;
  } | null>(null);

  // Closed period logic
  const [closedPeriods, setClosedPeriods] =
    useState<ClosedPeriod[]>(initialClosedPeriods);
  const [overriddenClosedSlots, setOverriddenClosedSlots] = useState<
    OverriddenSlot[]
  >([]);
  const [activeClosedSlotMenu, setActiveClosedSlotMenu] = useState<{
    memberId: string;
    dateString: string;
    periodId: string;
  } | null>(null);

  const handleSaveClosedPeriod = (
    startDate: string,
    endDate: string,
    reason: string,
  ) => {
    const newPeriod = {
      id: Date.now().toString(),
      startDate,
      endDate,
      reason,
    };
    setClosedPeriods((prev) => [...prev, newPeriod]);
  };

  const handleSaveEdit = (startTime: string, endTime: string) => {
    if (activeShiftForEdit) {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id === activeShiftForEdit.memberId) {
            const newShifts = [...s.shifts];
            newShifts[activeShiftForEdit.dayIndex] = {
              time: `${startTime} - ${endTime}`,
            };
            return { ...s, shifts: newShifts };
          }
          return s;
        }),
      );
    }
  };

  const handleConfirmDelete = () => {
    if (activeShiftForEdit) {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id === activeShiftForEdit.memberId) {
            const newShifts = [...s.shifts];
            newShifts[activeShiftForEdit.dayIndex] = null;
            return { ...s, shifts: newShifts };
          }
          return s;
        }),
      );
      setIsDeleteModalOpen(false);
      setActiveShiftForEdit(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shiftMenuRef.current &&
        !shiftMenuRef.current.contains(event.target as Node)
      ) {
        setActiveShiftMenu(null);
        setActiveClosedSlotMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShiftClick = (
    e: React.MouseEvent,
    memberId: string,
    dayIndex: number,
  ) => {
    e.stopPropagation();
    setActiveClosedSlotMenu(null);
    if (
      activeShiftMenu?.memberId === memberId &&
      activeShiftMenu?.dayIndex === dayIndex
    ) {
      setActiveShiftMenu(null);
    } else {
      setActiveShiftMenu({ memberId, dayIndex });
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <ScheduledShiftsHeader
        onExportClick={() => setIsExportModalOpen(true)}
        onAddShift={() => setIsAddShiftModalOpen(true)}
        onAddTimeOff={() => setIsTimeOffModalOpen(true)}
        onAddBlockedTime={() => setIsBlockedTimeModalOpen(true)}
        onAddClosedPeriod={() => setIsClosedPeriodModalOpen(true)}
      />

      <WeekNavigator
        currentWeekStart={currentWeekStart}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
      />

      <WeeklyShiftsTable
        currentWeekStart={currentWeekStart}
        schedules={schedules}
        closedPeriods={closedPeriods}
        overriddenClosedSlots={overriddenClosedSlots}
        activeShiftMenu={activeShiftMenu}
        activeClosedSlotMenu={activeClosedSlotMenu}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onShiftClick={handleShiftClick}
        onClosedSlotClick={(e, memberId, dateString, periodId) => {
          e.stopPropagation();
          setActiveShiftMenu(null);
          setActiveClosedSlotMenu(
            activeClosedSlotMenu?.memberId === memberId &&
              activeClosedSlotMenu?.dateString === dateString
              ? null
              : { memberId, dateString, periodId },
          );
        }}
        onEditShift={(memberId, dayIndex, time) => {
          setActiveShiftForEdit({ memberId, dayIndex, time });
          setIsEditModalOpen(true);
          setActiveShiftMenu(null);
        }}
        onDeleteShift={(memberId, dayIndex, time) => {
          setActiveShiftForEdit({ memberId, dayIndex, time });
          setIsDeleteModalOpen(true);
          setActiveShiftMenu(null);
        }}
        onReactivateSlot={(memberId, dateString) => {
          setOverriddenClosedSlots((prev) => [
            ...prev,
            { memberId, dateString },
          ]);
          setActiveClosedSlotMenu(null);
        }}
        onReopenPeriod={(periodId) => {
          setClosedPeriods((prev) => prev.filter((p) => p.id !== periodId));
          setActiveClosedSlotMenu(null);
        }}
        onPageChange={setCurrentPage}
        shiftMenuRef={shiftMenuRef}
      />

      <ScheduledShiftsModals
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onSaveEdit={handleSaveEdit}
        activeShiftForEdit={activeShiftForEdit}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        isTimeOffModalOpen={isTimeOffModalOpen}
        onCloseTimeOffModal={() => setIsTimeOffModalOpen(false)}
        isBlockedTimeModalOpen={isBlockedTimeModalOpen}
        onCloseBlockedTimeModal={() => setIsBlockedTimeModalOpen(false)}
        isClosedPeriodModalOpen={isClosedPeriodModalOpen}
        onCloseClosedPeriodModal={() => setIsClosedPeriodModalOpen(false)}
        onSaveClosedPeriod={handleSaveClosedPeriod}
        isAddShiftModalOpen={isAddShiftModalOpen}
        onCloseAddShiftModal={() => setIsAddShiftModalOpen(false)}
        isExportModalOpen={isExportModalOpen}
        onCloseExportModal={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
