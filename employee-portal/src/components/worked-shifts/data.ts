import { WorkedShift } from "./types";

export const MONTHS = [
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

export const YEARS = ["2023", "2024", "2025", "2026"];

export const INITIAL_SHIFTS: WorkedShift[] = [
  {
    id: "1",
    date: "Dec 01, 2024",
    dayOfWeek: "Sunday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
    month: "December",
    year: "2024",
    rawDate: "2024-12-01",
  },
  {
    id: "2",
    date: "Dec 01, 2024",
    dayOfWeek: "Monday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
    month: "December",
    year: "2024",
    rawDate: "2024-12-02",
  },
  {
    id: "3",
    date: "Dec 01, 2024",
    dayOfWeek: "Tuesday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
    month: "December",
    year: "2024",
    rawDate: "2024-12-03",
  },
];
