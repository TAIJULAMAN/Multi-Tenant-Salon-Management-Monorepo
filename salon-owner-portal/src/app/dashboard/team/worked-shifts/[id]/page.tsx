"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AddWorkedShiftModal from "@/components/team/AddWorkedShiftModal";
import EditWorkedShiftModal from "@/components/team/EditWorkedShiftModal";
import DeleteShiftModal from "@/components/team/DeleteShiftModal";
import WorkedShiftsProfileStats from "@/components/team/worked-shifts/WorkedShiftsProfileStats";
import DailyShiftsTableBlock from "@/components/team/worked-shifts/DailyShiftsTableBlock";
import { initialDailyShifts } from "@/components/team/data";
import { DailyShiftRecord } from "@/components/team/types";

export default function WorkedShiftsDetailsPage() {
  const [shifts, setShifts] = useState<DailyShiftRecord[]>(initialDailyShifts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeShiftForEdit, setActiveShiftForEdit] = useState<DailyShiftRecord | null>(null);

  const [filterMonth, setFilterMonth] = useState("December");
  const [filterYear, setFilterYear] = useState("2024");
  const [filterRange, setFilterRange] = useState("");

  const filteredShifts = shifts.filter((shift) => {
    if (filterRange) {
      return shift.date.toLowerCase().includes(filterRange.toLowerCase());
    }
    let monthMatch = true;
    if (filterMonth !== "All") {
      const shortMonth = filterMonth.substring(0, 3);
      monthMatch = shift.date.startsWith(shortMonth);
    }
    let yearMatch = true;
    if (filterYear !== "All") {
      yearMatch = shift.date.endsWith(filterYear);
    }
    return monthMatch && yearMatch;
  });

  const handleAddShift = (date: string, timeIn: string, timeOut: string) => {
    const newShift: DailyShiftRecord = {
      id: shifts.length > 0 ? Math.max(...shifts.map((s) => s.id)) + 1 : 1,
      date: date || "Dec 01, 2024",
      day: "Custom",
      shifts: 1,
      timeIn: timeIn || "09:00",
      timeOut: timeOut || "18:00",
      hours: "8h",
      total: "8h",
    };
    setShifts((prev) => [...prev, newShift]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (date: string, startTime: string, endTime: string) => {
    if (activeShiftForEdit) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === activeShiftForEdit.id
            ? { ...s, date: date || s.date, timeIn: startTime, timeOut: endTime }
            : s,
        ),
      );
      setIsEditModalOpen(false);
      setActiveShiftForEdit(null);
    }
  };

  const handleConfirmDelete = () => {
    if (activeShiftForEdit) {
      setShifts((prev) => prev.filter((s) => s.id !== activeShiftForEdit.id));
      setIsDeleteModalOpen(false);
      setActiveShiftForEdit(null);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Breadcrumb/Nav */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex justify-between items-center">
        <Link
          href="/dashboard/team/worked-shifts"
          className="flex items-center gap-2 text-[#1E293B] hover:text-[#635BFF] transition-colors font-bold text-[14px]"
        >
          <ChevronLeft className="w-4 h-4" />
          View Details
        </Link>
      </div>

      {/* Profile & Stats Block */}
      <WorkedShiftsProfileStats />

      {/* Daily Shifts Table Block */}
      <DailyShiftsTableBlock
        shifts={filteredShifts}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
        filterRange={filterRange}
        setFilterRange={setFilterRange}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onEditShift={(shift) => {
          setActiveShiftForEdit(shift);
          setIsEditModalOpen(true);
        }}
        onDeleteShift={(shift) => {
          setActiveShiftForEdit(shift);
          setIsDeleteModalOpen(true);
        }}
      />

      <AddWorkedShiftModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddShift}
      />

      <EditWorkedShiftModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={
          activeShiftForEdit
            ? {
                date: activeShiftForEdit.date,
                timeIn: activeShiftForEdit.timeIn,
                timeOut: activeShiftForEdit.timeOut,
              }
            : undefined
        }
      />

      <DeleteShiftModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
