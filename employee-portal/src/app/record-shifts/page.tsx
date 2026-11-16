"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import RecordShiftModal from "@/components/record-shifts/RecordShiftModal";
import ShiftTimerCard from "@/components/record-shifts/ShiftTimerCard";
import LatestRecordingsCard from "@/components/record-shifts/LatestRecordingsCard";
import { useShifts, RecordingRecord } from "@/context/ShiftsContext";
import { WorkedShift } from "@/components/worked-shifts/types";
import { MONTHS } from "@/components/worked-shifts/data";

export default function RecordShiftsPage() {
  const {
    addWorkedShift,
    latestRecordings,
    addRecording,
    isTimerRunning,
    timerSeconds,
    currentRound,
    startTimer,
    endShift,
  } = useShifts();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [todayString, setTodayString] = useState<string>(
    "Tuesday, October 20, 2026",
  );

  // Format today's date safely on client
  useEffect(() => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    setTodayString(
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
    );
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle End of Shift from the Timer
  const handleEndShift = () => {
    const result = endShift();
    if (result) {
      showToast(
        `Round ${currentRound} ended (${result.recording.duration}) and saved to Worked Shifts!`,
      );
    }
  };

  // Handle manual shift record ("I forgot to start the shift")
  const handleSaveManualShift = (newShiftData: {
    scheduleType: string;
    date: string;
    startTime: string;
    endTime: string;
    breakDuration: string;
    notes?: string;
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

    // Calculate hours worked (factoring in break)
    const [startH, startM] = newShiftData.startTime.split(":").map(Number);
    const [endH, endM] = newShiftData.endTime.split(":").map(Number);
    let totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    if (totalMinutes <= 0) totalMinutes += 24 * 60;

    let breakMinutes = 0;
    if (newShiftData.breakDuration === "15m") breakMinutes = 15;
    else if (newShiftData.breakDuration === "30m") breakMinutes = 30;
    else if (newShiftData.breakDuration === "45m") breakMinutes = 45;
    else if (newShiftData.breakDuration === "1h") breakMinutes = 60;
    else if (newShiftData.breakDuration === "1h 30m") breakMinutes = 90;

    const workedMinutes = Math.max(15, totalMinutes - breakMinutes);
    const calcHours = (workedMinutes / 60).toFixed(1).replace(/\.0$/, "");
    const hoursStr = `${calcHours}h`;
    const newId = String(Date.now());

    // 1. Add to Worked Shifts section in context
    const newWorkedShift: WorkedShift = {
      id: newId,
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
    addWorkedShift(newWorkedShift);

    // 2. Add to Latest Recordings
    const newRecording: RecordingRecord = {
      id: newId,
      roundName: newShiftData.scheduleType,
      date: formattedDate,
      timeIn: newShiftData.startTime,
      timeOut: newShiftData.endTime,
      duration: hoursStr,
      rawDate: newShiftData.date,
      status: "Completed",
      notes: newShiftData.notes,
    };
    addRecording(newRecording);

    showToast("Shift manually recorded and saved to Worked Shifts!");
  };

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#10B981] text-white px-5 py-3 rounded-xl shadow-lg shadow-[#10B981]/25 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header: Inserting Hours & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#1E293B] tracking-tight">
            Inserting Hours
          </h1>
          <p className="text-sm text-[#64748B] font-medium mt-0.5">
            Hi Ivy, record your turn
          </p>
        </div>

        <div className="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold text-[#64748B] shadow-sm">
          <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{todayString}</span>
        </div>
      </div>

      {/* 2-Column Cards Layout matching the screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Timer Card */}
        <ShiftTimerCard
          roundNumber={currentRound}
          timerSeconds={timerSeconds}
          isRunning={isTimerRunning}
          onStartShift={startTimer}
          onEndShift={handleEndShift}
          onForgotStart={() => setIsRecordModalOpen(true)}
        />

        {/* Right: Latest Recordings Card */}
        <LatestRecordingsCard recordings={latestRecordings} />
      </div>

      {/* Manual Shift Entry Modal ("I FORGOT TO START THE SHIFT") */}
      <RecordShiftModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveManualShift}
      />
    </div>
  );
}
