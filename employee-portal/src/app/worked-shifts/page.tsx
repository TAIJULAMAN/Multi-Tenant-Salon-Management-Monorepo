"use client";

import React, { useState, useMemo } from "react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import AddShiftModal from "@/components/team/AddShiftModal";
import { WorkedShift } from "@/components/worked-shifts/types";
import { MONTHS, YEARS } from "@/components/worked-shifts/data";
import { useShifts } from "@/context/ShiftsContext";
import WorkedShiftsFilterBar from "@/components/worked-shifts/WorkedShiftsFilterBar";
import WorkedShiftsStatCards from "@/components/worked-shifts/WorkedShiftsStatCards";
import WorkedShiftsTable from "@/components/worked-shifts/WorkedShiftsTable";

export default function WorkedShiftsPage() {
  const { workedShifts, addWorkedShift } = useShifts();
  const [selectedMonth, setSelectedMonth] = useState<string>("December");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [customRange, setCustomRange] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filtered shifts based on Period (Month & Year) or Custom Date Range
  const filteredShifts = useMemo(() => {
    return workedShifts.filter((shift) => {
      if (dateRange.start && dateRange.end) {
        const itemTime = new Date(shift.rawDate).setHours(0, 0, 0, 0);
        const startTime = new Date(dateRange.start).setHours(0, 0, 0, 0);
        const endTime = new Date(dateRange.end).setHours(23, 59, 59, 999);
        return itemTime >= startTime && itemTime <= endTime;
      }

      const matchMonth =
        selectedMonth === "All Months" || shift.month === selectedMonth;
      const matchYear =
        selectedYear === "All Years" || shift.year === selectedYear;
      return matchMonth && matchYear;
    });
  }, [workedShifts, selectedMonth, selectedYear, dateRange]);

  // Handle adding a new shift
  const handleSaveShift = (newShiftData: {
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const d = new Date(newShiftData.date);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = MONTHS;

    const shortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayOfWeek = dayNames[d.getDay()] || "Custom";
    const month = monthNames[d.getMonth()] || "December";
    const year = String(d.getFullYear());
    const dayNum = String(d.getDate()).padStart(2, "0");
    const formattedDate = `${shortMonths[d.getMonth()]} ${dayNum}, ${year}`;

    // Calculate hours worked
    const [startH, startM] = newShiftData.startTime.split(":").map(Number);
    const [endH, endM] = newShiftData.endTime.split(":").map(Number);
    let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (totalMinutes <= 0) totalMinutes += 24 * 60;
    const calcHours = Math.max(1, Math.round(totalMinutes / 60));
    const hoursStr = `${calcHours}h`;

    const newShift: WorkedShift = {
      id: String(Date.now()),
      date: formattedDate,
      dayOfWeek,
      shiftsCount: 1,
      timeIn: newShiftData.startTime,
      timeOut: newShiftData.endTime,
      hoursWorked: hoursStr,
      dailyTotal: hoursStr,
      month,
      year,
      rawDate: newShiftData.date,
    };

    addWorkedShift(newShift);
    setSelectedMonth(month);
    setSelectedYear(year);
    setCustomRange("");
    setDateRange({ start: null, end: null });
  };

  const hasShifts = filteredShifts.length > 0;

  // Stats calculation
  const totalHoursDisplay = hasShifts ? `${filteredShifts.length * 8}h` : "0h";
  const daysWorkedDisplay = hasShifts ? filteredShifts.length : 0;
  const avgHourPerDayDisplay = hasShifts ? "8h" : "0h";
  const totalShiftsDisplay = filteredShifts.length;

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      <WorkedShiftsFilterBar
        selectedMonth={selectedMonth}
        onMonthChange={(m) => {
          setSelectedMonth(m);
          setCustomRange("");
          setDateRange({ start: null, end: null });
        }}
        selectedYear={selectedYear}
        onYearChange={(y) => {
          setSelectedYear(y);
          setCustomRange("");
          setDateRange({ start: null, end: null });
        }}
        customRange={customRange}
        onCustomRangeChange={(rangeStr, start, end) => {
          setCustomRange(rangeStr);
          setDateRange({ start, end });
        }}
        onClearCustomRange={() => {
          setCustomRange("");
          setDateRange({ start: null, end: null });
        }}
        onExportClick={() => setIsExportOpen(true)}
        onAddShiftClick={() => setIsAddModalOpen(true)}
      />
      {hasShifts && (
        <WorkedShiftsStatCards
          totalHoursDisplay={totalHoursDisplay}
          daysWorkedDisplay={daysWorkedDisplay}
          avgHoursDisplay={avgHourPerDayDisplay}
        />
      )}
      <WorkedShiftsTable
        shifts={filteredShifts}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        daysWorkedDisplay={daysWorkedDisplay}
        totalShiftsDisplay={totalShiftsDisplay}
        totalHoursDisplay={totalHoursDisplay}
      />
      <AddShiftModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveShift}
      />
      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Worked Shifts"
      />
    </div>
  );
}
