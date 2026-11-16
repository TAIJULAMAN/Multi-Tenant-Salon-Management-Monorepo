export function formatHour(h: number): string {
  if (h === 0) return "00:00";
  if (h < 10) return `0${h}:00`;
  return `${h}:00`;
}

