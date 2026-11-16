// Mock data + helpers for the employee's own Scheduled Shifts, Time Off and Worked Shifts.

export const ME = {
  name: "Maria Rodriguez",
  role: "Hair Stylist",
  email: "mariarodriguez@gmail.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
};

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
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAYS_SHORT = WEEKDAYS.map((d) => d.slice(0, 3));

/* ------------------------------------------------------------------ */
/* Date / time helpers                                                */
/* ------------------------------------------------------------------ */

export const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> "YYYY-MM-DD" */
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "YYYY-MM-DD" -> Date (local) */
export const fromISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map((p) => parseInt(p, 10));
  return new Date(y, m - 1, d);
};

/** "MM/DD/YYYY" (DatePickerInput format) -> Date | null. Invalid dates such as 02/30 return null. */
export const parseMDY = (val?: string): Date | null => {
  if (!val) return null;
  const parts = val.split("/");
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map((p) => parseInt(p, 10));
  if ([m, d, y].some((n) => isNaN(n))) return null;
  const date = new Date(y, m - 1, d);
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
};

export const toMDY = (d: Date) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;

export const addDays = (d: Date, days: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

/** Inclusive number of days between two dates. */
export const daysBetween = (a: Date, b: Date) =>
  Math.round((fromISO(toISO(b)).getTime() - fromISO(toISO(a)).getTime()) / 86400000) + 1;

/** "Dec 01, 2024" */
export const formatShortDate = (d: Date) => `${MONTHS_SHORT[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;

/** "Mon, 11 Aug" */
export const formatDayHeader = (d: Date) => `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;

/** "August 11 – August 17" */
export const formatWeekRange = (monday: Date) => {
  const sunday = addDays(monday, 6);
  return `${MONTHS[monday.getMonth()]} ${monday.getDate()} – ${MONTHS[sunday.getMonth()]} ${sunday.getDate()}`;
};

/** "00:00", "00:30", … "23:30" – options of the "Select time" dropdowns. */
export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);

export const isValidTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t.trim());

/** "09:30" -> 570 */
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map((p) => parseInt(p, 10));
  return (h || 0) * 60 + (m || 0);
};

/** 510 -> "8h 30m", 480 -> "8h" */
export const formatDuration = (mins: number) => {
  const safe = Math.max(0, Math.round(mins));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  if (m === 0) return `${h}h`;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const segmentMinutes = (start: string, end: string) =>
  isValidTime(start) && isValidTime(end) ? Math.max(0, toMinutes(end) - toMinutes(start)) : 0;

/* ------------------------------------------------------------------ */
/* Scheduled shifts                                                   */
/* ------------------------------------------------------------------ */

export type ScheduleEntryKind = "shift" | "time_off" | "blocked" | "closed";

export interface ScheduleEntry {
  id: string;
  kind: ScheduleEntryKind;
  start?: string; // HH:MM
  end?: string; // HH:MM
  label?: string; // e.g. "Annual leave", "Training"
}

/** Map of ISO date -> entries for that day. */
export type ScheduleMap = Record<string, ScheduleEntry[]>;

/** The week shown by default in the design: Mon 11 Aug – Sun 17 Aug (2025). */
export const DEFAULT_WEEK_START = new Date(2025, 7, 11);

/** Monday of the week that contains `d`. */
export const startOfWeek = (d: Date) => {
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  return fromISO(toISO(addDays(d, diff)));
};

let idCounter = 0;
export const makeId = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

const buildInitialSchedule = (): ScheduleMap => {
  const map: ScheduleMap = {};
  const first = addDays(DEFAULT_WEEK_START, -21);
  for (let i = 0; i < 7 * 8; i++) {
    const date = addDays(first, i);
    const iso = toISO(date);
    const dow = date.getDay();
    if (dow === 0) continue; // Sunday: day off
    if (dow === 6) {
      map[iso] = [{ id: `s-${iso}`, kind: "shift", start: "09:00", end: "14:00" }];
    } else if (dow === 3) {
      // Wednesdays: split shift
      map[iso] = [
        { id: `s-${iso}-a`, kind: "shift", start: "10:00", end: "14:00" },
        { id: `s-${iso}-b`, kind: "shift", start: "15:00", end: "19:00" },
      ];
    } else {
      map[iso] = [{ id: `s-${iso}`, kind: "shift", start: "10:00", end: "19:00" }];
    }
  }
  // A couple of non-shift examples in the default week
  map["2025-08-15"] = [{ id: "c-ferragosto", kind: "closed", label: "Ferragosto – Salon closed" }];
  map["2025-08-14"] = [
    ...(map["2025-08-14"] ?? []),
    { id: "b-training", kind: "blocked", start: "17:00", end: "19:00", label: "Training" },
  ];
  map["2025-08-22"] = [{ id: "t-annual", kind: "time_off", label: "Annual leave" }];
  return map;
};

export const INITIAL_SCHEDULE: ScheduleMap = buildInitialSchedule();

export const dayScheduledMinutes = (entries: ScheduleEntry[] = []) =>
  entries
    .filter((e) => e.kind === "shift" && e.start && e.end)
    .reduce((sum, e) => sum + segmentMinutes(e.start!, e.end!), 0);

/* ------------------------------------------------------------------ */
/* Time off                                                           */
/* ------------------------------------------------------------------ */

export const TIME_OFF_TYPES = [
  "Annual leave",
  "Sick leave",
  "Personal leave",
  "Maternity leave",
  "Paternity leave",
  "Bereavement leave",
  "Other",
];

export type RepeatFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";

export const REPEAT_FREQUENCIES: {
  id: RepeatFrequency;
  label: string;
  desc: string;
  /** Returns a reason string if the option is not available for the selected period length (days). */
  disabledReason?: (periodDays: number) => string | null;
}[] = [
  {
    id: "daily",
    label: "Daily",
    desc: "Repeat this day off every day",
    disabledReason: (days) => (days > 1 ? "Only available for single-day time off" : null),
  },
  {
    id: "weekly",
    label: "Weekly",
    desc: "Repeat this day off every week",
    disabledReason: (days) => (days > 7 ? "Only available for periods of 7 days or less" : null),
  },
  {
    id: "biweekly",
    label: "Every 2 weeks",
    desc: "Repeat this day off every 2 weeks",
    disabledReason: (days) => (days > 7 ? "Only available for periods of 7 days or less" : null),
  },
  { id: "monthly", label: "Monthly", desc: "Repeat this day off every month" },
  { id: "quarterly", label: "Quarterly", desc: "Repeat this day off every 3 months" },
  { id: "yearly", label: "Yearly", desc: "Repeat this day off every year" },
];

export interface TimeOffRequest {
  type: string;
  startDate: string; // MM/DD/YYYY
  endDate: string; // MM/DD/YYYY
  startTime?: string;
  endTime?: string;
  repeat: boolean;
  frequency?: RepeatFrequency;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Worked shifts                                                      */
/* ------------------------------------------------------------------ */

export const SCHEDULE_TYPES = ["Regular shift", "Overtime", "Extra shift", "Replacement"];

export interface WorkedShift {
  id: string;
  dateISO: string;
  scheduleType?: string;
  timeIn: string;
  timeOut: string;
  breakMinutes: number;
  note?: string;
}

export const workedMinutes = (s: WorkedShift) => Math.max(0, segmentMinutes(s.timeIn, s.timeOut) - s.breakMinutes);

const buildWorkedShifts = (): WorkedShift[] => {
  const list: WorkedShift[] = [];
  // December 2024: 21 worked days, 165h in total (18 x 8h + 3 x 7h) – matches the design.
  const shortDays = new Set([5, 12, 19]); // Thursdays
  let count = 0;
  for (let day = 1; day <= 31 && count < 21; day++) {
    const date = new Date(2024, 11, day);
    const dow = date.getDay();
    if (dow === 5 || dow === 6) continue; // Fri/Sat off in December for this stylist
    const short = shortDays.has(day);
    list.push({
      id: `w-${toISO(date)}`,
      dateISO: toISO(date),
      timeIn: "09:00",
      timeOut: short ? "17:00" : "18:00",
      breakMinutes: 60,
    });
    count++;
  }
  // November 2024: a lighter month
  for (let day = 4; day <= 29; day++) {
    const date = new Date(2024, 10, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6 || dow === 3) continue;
    list.push({
      id: `w-${toISO(date)}`,
      dateISO: toISO(date),
      timeIn: "10:00",
      timeOut: "19:00",
      breakMinutes: 60,
    });
  }
  return list;
};

export const INITIAL_WORKED_SHIFTS: WorkedShift[] = buildWorkedShifts();

export const WORKED_YEARS = ["2023", "2024", "2025"];
