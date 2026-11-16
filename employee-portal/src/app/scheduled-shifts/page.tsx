"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import EditShiftModal from "@/components/team/EditShiftModal";
import DeleteShiftModal from "@/components/team/DeleteShiftModal";
import AddTimeOffModal from "@/components/team/AddTimeOffModal";
import AddBlockedTimeModal from "@/components/team/AddBlockedTimeModal";
import AddClosedPeriodModal from "@/components/team/AddClosedPeriodModal";
import AddShiftModal from "@/components/team/AddShiftModal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import Modal from "@/components/customComponent/Modal";
import WeeklyShiftsTable from "@/components/team/WeeklyShiftsTable";
import { MemberSchedule } from "@/components/team/types";
import { initialSchedules } from "@/components/team/data";
import WeekNavigator from "@/components/team/WeekNavigator";

export default function ScheduledShiftsPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2024, 7, 11)); // Aug 11, 2024

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

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [activeShiftMenu, setActiveShiftMenu] = useState<{ memberId: string; dayIndex: number } | null>(null);
  const shiftMenuRef = useRef<HTMLDivElement>(null);

  const [schedules, setSchedules] = useState<MemberSchedule[]>(initialSchedules);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [isBlockedTimeModalOpen, setIsBlockedTimeModalOpen] = useState(false);
  const [isClosedPeriodModalOpen, setIsClosedPeriodModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);

  // Active shift logic
  const [activeShiftForEdit, setActiveShiftForEdit] = useState<{ memberId: string; dayIndex: number; time: string } | null>(null);

  // Closed period logic
  const [closedPeriods, setClosedPeriods] = useState<{ id: string; startDate: string; endDate: string; reason: string }[]>([
    { id: "1", startDate: "2024-08-14", endDate: "2024-08-15", reason: "Team Retreat" },
  ]);
  const [overriddenClosedSlots, setOverriddenClosedSlots] = useState<{ memberId: string; dateString: string }[]>([]);
  const [activeClosedSlotMenu, setActiveClosedSlotMenu] = useState<{ memberId: string; dateString: string; periodId: string } | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("CSV");

  const handleSaveClosedPeriod = (startDate: string, endDate: string, reason: string) => {
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
            newShifts[activeShiftForEdit.dayIndex] = { time: `${startTime} - ${endTime}` };
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
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (shiftMenuRef.current && !shiftMenuRef.current.contains(event.target as Node)) {
        setActiveShiftMenu(null);
        setActiveClosedSlotMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShiftClick = (e: React.MouseEvent, memberId: string, dayIndex: number) => {
    e.stopPropagation();
    setActiveClosedSlotMenu(null);
    if (activeShiftMenu?.memberId === memberId && activeShiftMenu?.dayIndex === dayIndex) {
      setActiveShiftMenu(null);
    } else {
      setActiveShiftMenu({ memberId, dayIndex });
    }
  };

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[1.15rem] font-bold text-[#1E293B]">Scheduled Shifts</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full sm:w-auto justify-center bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <div className="relative w-full sm:w-auto" ref={addMenuRef}>
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
            >
              Add
              <ChevronDown className="w-4 h-4" />
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-48 bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-2 z-20">
                <button
                  onClick={() => {
                    setIsAddShiftModalOpen(true);
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
                >
                  Add Shift
                </button>
                <button
                  onClick={() => {
                    setIsTimeOffModalOpen(true);
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
                >
                  Add Time Off
                </button>
                <button
                  onClick={() => {
                    setIsBlockedTimeModalOpen(true);
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
                >
                  Add Blocked Time
                </button>
                <button
                  onClick={() => {
                    setIsClosedPeriodModalOpen(true);
                    setIsAddMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
                >
                  Business Closed Period
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
          setOverriddenClosedSlots((prev) => [...prev, { memberId, dateString }]);
          setActiveClosedSlotMenu(null);
        }}
        onReopenPeriod={(periodId) => {
          setClosedPeriods((prev) => prev.filter((p) => p.id !== periodId));
          setActiveClosedSlotMenu(null);
        }}
        onPageChange={setCurrentPage}
        shiftMenuRef={shiftMenuRef}
      />

      <EditShiftModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialTime={activeShiftForEdit?.time}
      />

      <DeleteShiftModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddTimeOffModal
        isOpen={isTimeOffModalOpen}
        onClose={() => setIsTimeOffModalOpen(false)}
      />

      <AddBlockedTimeModal
        isOpen={isBlockedTimeModalOpen}
        onClose={() => setIsBlockedTimeModalOpen(false)}
        onSave={() => {}}
      />

      <AddClosedPeriodModal
        isOpen={isClosedPeriodModalOpen}
        onClose={() => setIsClosedPeriodModalOpen(false)}
        onSave={handleSaveClosedPeriod}
      />

      <AddShiftModal
        isOpen={isAddShiftModalOpen}
        onClose={() => setIsAddShiftModalOpen(false)}
      />

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-5 pt-2">
          <div>
            <CustomSelect
              label="Format"
              value={exportFormat}
              onChange={setExportFormat}
              options={["CSV", "PDF", "Excel"]}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
