"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { WorkedShift } from "@/components/worked-shifts/types";
import { INITIAL_SHIFTS } from "@/components/worked-shifts/data";

export interface RecordingRecord {
  id: string;
  roundName: string;
  date: string;
  timeIn: string;
  timeOut: string;
  duration: string;
  rawDate: string;
  status: "Completed" | "Approved" | "Pending";
  notes?: string;
}

interface ShiftsContextType {
  workedShifts: WorkedShift[];
  addWorkedShift: (shift: WorkedShift) => void;
  deleteWorkedShift: (id: string) => void;
  latestRecordings: RecordingRecord[];
  addRecording: (recording: RecordingRecord) => void;
  // Timer states
  isTimerRunning: boolean;
  timerSeconds: number;
  currentRound: number;
  timerStartTime: number | null;
  startTimer: () => void;
  endShift: () => { recording: RecordingRecord; shift: WorkedShift } | null;
  resetTimer: () => void;
}

const ShiftsContext = createContext<ShiftsContextType | null>(null);

const STORAGE_KEY_SHIFTS = "harem_worked_shifts";
const STORAGE_KEY_RECORDINGS = "harem_latest_recordings";
const STORAGE_KEY_TIMER = "harem_timer_state";

export function ShiftsProvider({ children }: { children: React.ReactNode }) {
  const [workedShifts, setWorkedShifts] = useState<WorkedShift[]>(INITIAL_SHIFTS);
  const [latestRecordings, setLatestRecordings] = useState<RecordingRecord[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(68); // Default display 00:01:08 as in preview or 0
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);

  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    setIsHydrated(true);
    try {
      const savedShifts = localStorage.getItem(STORAGE_KEY_SHIFTS);
      if (savedShifts) {
        setWorkedShifts(JSON.parse(savedShifts));
      }

      const savedRecordings = localStorage.getItem(STORAGE_KEY_RECORDINGS);
      if (savedRecordings) {
        setLatestRecordings(JSON.parse(savedRecordings));
      }

      const savedTimer = localStorage.getItem(STORAGE_KEY_TIMER);
      if (savedTimer) {
        const parsed = JSON.parse(savedTimer);
        setIsTimerRunning(parsed.isTimerRunning || false);
        setCurrentRound(parsed.currentRound || 1);
        setTimerStartTime(parsed.timerStartTime || null);

        if (parsed.isTimerRunning && parsed.timerStartTime) {
          const elapsed = Math.floor((Date.now() - parsed.timerStartTime) / 1000);
          setTimerSeconds(elapsed);
        } else if (parsed.timerSeconds !== undefined) {
          setTimerSeconds(parsed.timerSeconds);
        }
      }
    } catch (e) {
      console.error("Failed to load shifts from localStorage", e);
    }
  }, []);

  // Save worked shifts when updated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(workedShifts));
    } catch (e) {
      console.error("Failed to save shifts to localStorage", e);
    }
  }, [workedShifts, isHydrated]);

  // Save latest recordings when updated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY_RECORDINGS,
        JSON.stringify(latestRecordings),
      );
    } catch (e) {
      console.error("Failed to save recordings to localStorage", e);
    }
  }, [latestRecordings, isHydrated]);

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Persist timer state
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY_TIMER,
        JSON.stringify({
          isTimerRunning,
          timerSeconds,
          currentRound,
          timerStartTime,
        }),
      );
    } catch (e) {
      console.error("Failed to save timer state", e);
    }
  }, [isTimerRunning, timerSeconds, currentRound, timerStartTime, isHydrated]);

  const addWorkedShift = useCallback((shift: WorkedShift) => {
    setWorkedShifts((prev) => [shift, ...prev]);
  }, []);

  const deleteWorkedShift = useCallback((id: string) => {
    setWorkedShifts((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addRecording = useCallback((rec: RecordingRecord) => {
    setLatestRecordings((prev) => [rec, ...prev]);
  }, []);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    const now = Date.now();
    setTimerStartTime(now);
  }, []);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
  }, []);

  const endShift = useCallback(() => {
    const now = new Date();
    const start = timerStartTime ? new Date(timerStartTime) : new Date(now.getTime() - timerSeconds * 1000);

    const formatTime = (d: Date) => {
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const timeIn = formatTime(start);
    const timeOut = formatTime(now);

    const monthNames = [
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
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const month = monthNames[now.getMonth()];
    const year = String(now.getFullYear());
    const dayOfWeek = dayNames[now.getDay()];
    const dayNum = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${shortMonths[now.getMonth()]} ${dayNum}, ${year}`;

    // Format duration
    const hrs = Math.floor(timerSeconds / 3600);
    const mins = Math.floor((timerSeconds % 3600) / 60);
    const secs = timerSeconds % 60;
    const durationHHMMSS = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    const calcHours = hrs > 0 ? `${hrs}h ${mins}m` : mins > 0 ? `${mins}m` : `${secs}s`;
    const hoursStr = hrs > 0 ? `${hrs}h` : "1h"; // for Worked Shifts table

    const roundName = `Round ${currentRound}`;
    const newId = String(Date.now());

    const recordingItem: RecordingRecord = {
      id: newId,
      roundName,
      date: formattedDate,
      timeIn,
      timeOut,
      duration: durationHHMMSS,
      rawDate: now.toISOString().split("T")[0],
      status: "Completed",
      notes: `Recorded with timer (${durationHHMMSS})`,
    };

    const workedShiftItem: WorkedShift = {
      id: newId,
      date: formattedDate,
      dayOfWeek,
      shiftsCount: 1,
      timeIn,
      timeOut,
      hoursWorked: calcHours,
      dailyTotal: calcHours,
      month,
      year,
      rawDate: now.toISOString().split("T")[0],
    };

    // Save to recordings and worked shifts
    setLatestRecordings((prev) => [recordingItem, ...prev]);
    setWorkedShifts((prev) => [workedShiftItem, ...prev]);

    // Update round and reset timer
    setCurrentRound((prev) => prev + 1);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);

    return { recording: recordingItem, shift: workedShiftItem };
  }, [timerSeconds, timerStartTime, currentRound]);

  return (
    <ShiftsContext.Provider
      value={{
        workedShifts,
        addWorkedShift,
        deleteWorkedShift,
        latestRecordings,
        addRecording,
        isTimerRunning,
        timerSeconds,
        currentRound,
        timerStartTime,
        startTimer,
        endShift,
        resetTimer,
      }}
    >
      {children}
    </ShiftsContext.Provider>
  );
}

export function useShifts() {
  const context = useContext(ShiftsContext);
  if (!context) {
    throw new Error("useShifts must be used within a ShiftsProvider");
  }
  return context;
}
