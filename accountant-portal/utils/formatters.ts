/**
 * Standard formatting utilities for the Accountant Portal.
 * Eliminates ad-hoc duplicated formatters across pages and components.
 */

/**
 * Formats a monetary amount into standard Euro currency format (e.g., "€ 1,250.00" or "€ 12.50").
 */
export function formatCurrency(
  amount: number,
  options?: {
    decimals?: number;
    showSymbol?: boolean;
    spaceAfterSymbol?: boolean;
    useGrouping?: boolean;
  }
): string {
  const decimals = options?.decimals ?? 2;
  const showSymbol = options?.showSymbol ?? true;
  const spaceAfterSymbol = options?.spaceAfterSymbol ?? true;

  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? `€${spaceAfterSymbol ? " " : ""}0.00` : "0.00";
  }

  const formatted = amount.toFixed(decimals);
  if (!showSymbol) return formatted;
  return `€${spaceAfterSymbol ? " " : ""}${formatted}`;
}

/**
 * Formats file size in bytes to human-readable strings (e.g., "1.5 MB", "500 KB").
 */
export function formatFileSize(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 B";
  if (!bytes || isNaN(bytes)) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i < 0) return "0 B";
  if (i >= sizes.length) return `${(bytes / Math.pow(k, sizes.length - 1)).toFixed(decimals)} ${sizes[sizes.length - 1]}`;

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Formats a number as a percentage string (e.g., "76%", "12.5%").
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === null || value === undefined) return "0%";
  return `${value.toFixed(decimals)}%`;
}

const italianMonthMap: Record<string, string> = {
  "01": "Gennaio",
  "1": "Gennaio",
  jan: "Gennaio",
  january: "Gennaio",
  gen: "Gennaio",
  gennaio: "Gennaio",
  "02": "Febbraio",
  "2": "Febbraio",
  feb: "Febbraio",
  february: "Febbraio",
  febbraio: "Febbraio",
  "03": "Marzo",
  "3": "Marzo",
  mar: "Marzo",
  march: "Marzo",
  marzo: "Marzo",
  "04": "Aprile",
  "4": "Aprile",
  apr: "Aprile",
  april: "Aprile",
  aprile: "Aprile",
  "05": "Maggio",
  "5": "Maggio",
  may: "Maggio",
  maggio: "Maggio",
  "06": "Giugno",
  "6": "Giugno",
  jun: "Giugno",
  june: "Giugno",
  giugno: "Giugno",
  "07": "Luglio",
  "7": "Luglio",
  jul: "Luglio",
  july: "Luglio",
  luglio: "Luglio",
  "08": "Agosto",
  "8": "Agosto",
  aug: "Agosto",
  august: "Agosto",
  agosto: "Agosto",
  "09": "Settembre",
  "9": "Settembre",
  sep: "Settembre",
  september: "Settembre",
  settembre: "Settembre",
  "10": "Ottobre",
  oct: "Ottobre",
  october: "Ottobre",
  ottobre: "Ottobre",
  "11": "Novembre",
  nov: "Novembre",
  november: "Novembre",
  novembre: "Novembre",
  "12": "Dicembre",
  dec: "Dicembre",
  december: "Dicembre",
  dicembre: "Dicembre",
};

/**
 * Formats a period string (e.g. "05/2025", "2025-05", "May 2025") to Italian ("Maggio 2025").
 */
export function formatPeriodToItalian(period: string): string {
  if (!period) return "Agosto 2026";

  const cleanPeriod = period.trim();

  // Handle "MM/YYYY" or "M/YYYY"
  if (cleanPeriod.includes("/")) {
    const parts = cleanPeriod.split("/");
    if (parts.length === 2) {
      const m = parts[0].trim().toLowerCase();
      const y = parts[1].trim();
      const monthName = italianMonthMap[m] || parts[0];
      return `${monthName} ${y}`;
    }
  }

  // Handle "YYYY-MM" or "MM-YYYY"
  if (cleanPeriod.includes("-")) {
    const parts = cleanPeriod.split("-");
    if (parts.length === 2) {
      if (parts[0].length === 4) {
        const m = parts[1].trim().toLowerCase();
        const monthName = italianMonthMap[m] || parts[1];
        return `${monthName} ${parts[0].trim()}`;
      } else {
        const m = parts[0].trim().toLowerCase();
        const monthName = italianMonthMap[m] || parts[0];
        return `${monthName} ${parts[1].trim()}`;
      }
    }
  }

  // Handle "July 2025" or "Luglio 2025"
  const spaceParts = cleanPeriod.split(/\s+/);
  if (spaceParts.length === 2) {
    const m = spaceParts[0].toLowerCase();
    const y = spaceParts[1];
    const monthName = italianMonthMap[m] || spaceParts[0];
    return `${monthName} ${y}`;
  }

  return cleanPeriod;
}

/**
 * Standard badge styling for payment methods.
 */
export function getPaymentMethodBadgeClass(method: string): string {
  switch (method) {
    case "Cash":
      return "bg-emerald-50 text-emerald-600 border border-emerald-100/50";
    case "Card Terminal":
      return "bg-cyan-50 text-cyan-600 border border-cyan-100/50";
    case "Gif Card":
    case "Gift Card":
      return "bg-indigo-50 text-indigo-600 border border-indigo-100/50";
    case "Online Payment":
      return "bg-amber-50 text-amber-600 border border-amber-100/50";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-100";
  }
}

/**
 * Standard badge styling for tax status badges.
 */
export function getTaxStatusBadgeClass(status: string): string {
  switch (status) {
    case "Approved":
      return "bg-[#e5fcf1] text-[#34d399]";
    case "Declined":
      return "bg-rose-50 text-rose-400";
    case "Pending":
      return "bg-amber-50 text-amber-400";
    case "Cancelled":
    default:
      return "bg-slate-100 text-slate-500";
  }
}
