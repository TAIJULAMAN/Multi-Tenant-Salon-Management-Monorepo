"use client";

import React from "react";
import { IconProps } from "../types";

export default function CashIcon({ white = false }: IconProps) {
  const c = white ? "#fff" : "#635BFF";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect
        x="2"
        y="8"
        width="28"
        height="18"
        rx="3"
        stroke={c}
        strokeWidth="2"
      />
      <circle cx="16" cy="17" r="4" stroke={c} strokeWidth="2" />
      <path
        d="M6 12h2M24 12h2M6 22h2M24 22h2"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export { CashIcon };
