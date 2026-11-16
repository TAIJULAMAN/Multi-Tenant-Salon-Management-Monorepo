"use client";

import React from "react";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusBadgeProps {
  label?: string;
  status?: string;
  variant?: StatusVariant;
  withDot?: boolean;
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-[#D1FAE5]",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
    dot: "bg-[#F59E0B]",
  },
  danger: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  info: {
    bg: "bg-[#EEF2FF]",
    text: "text-[#635BFF]",
    dot: "bg-[#635BFF]",
  },
  neutral: {
    bg: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
    dot: "bg-[#94A3B8]",
  },
};

export function getStatusVariant(statusText: string): StatusVariant {
  const s = statusText.toLowerCase().trim();
  if (
    s.includes("active") ||
    s.includes("complete") ||
    s.includes("present") ||
    s.includes("goal") ||
    s.includes("above") ||
    s.includes("booked") ||
    s.includes("paid") ||
    s.includes("optimal") ||
    s.includes("success") ||
    s.includes("confirmed")
  ) {
    return "success";
  }
  if (
    s.includes("pending") ||
    s.includes("scheduled") ||
    s.includes("progress") ||
    s.includes("fragrance") ||
    s.includes("warning") ||
    s.includes("trial") ||
    s.includes("unpaid") ||
    s.includes("late")
  ) {
    return "warning";
  }
  if (
    s.includes("cancel") ||
    s.includes("inactive") ||
    s.includes("absent") ||
    s.includes("danger") ||
    s.includes("overdue") ||
    s.includes("reject") ||
    s.includes("critical")
  ) {
    return "danger";
  }
  if (s.includes("primary") || s.includes("new") || s.includes("regular") || s.includes("special") || s.includes("info")) {
    return "info";
  }
  return "neutral";
}

export default function StatusBadge({
  label,
  status,
  variant,
  withDot = false,
  className = "",
}: StatusBadgeProps) {
  const displayLabel = label || status || "";
  const resolvedVariant = variant || getStatusVariant(displayLabel);
  const style = variantStyles[resolvedVariant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide shrink-0 ${style.bg} ${style.text} ${className}`}
    >
      {withDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
      <span>{displayLabel}</span>
    </span>
  );
}
