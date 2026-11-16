"use client";

import React from "react";
import { IconProps } from "../types";

export default function CardIcon({ white = false }: IconProps) {
  const c = white ? "#fff" : "#635BFF";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect
        x="2"
        y="7"
        width="28"
        height="18"
        rx="3"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M2 13h28" stroke={c} strokeWidth="2" />
      <rect x="6" y="18" width="6" height="3" rx="1" fill={c} />
    </svg>
  );
}
export { CardIcon };
