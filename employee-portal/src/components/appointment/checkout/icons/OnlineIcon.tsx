"use client";

import React from "react";
import { IconProps } from "../types";

export default function OnlineIcon({ white = false }: IconProps) {
  const c = white ? "#fff" : "#635BFF";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="2" />
      <path
        d="M16 3c-4 5-4 21 0 26M16 3c4 5 4 21 0 26M3 16h26"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export { OnlineIcon };
