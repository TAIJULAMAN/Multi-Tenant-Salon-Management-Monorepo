"use client";

import React from "react";
import { IconProps } from "../types";

export default function GiftIcon({ white = false }: IconProps) {
  const c = white ? "#fff" : "#635BFF";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect
        x="4"
        y="14"
        width="24"
        height="14"
        rx="2"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M2 10h28v4H2z" stroke={c} strokeWidth="2" />
      <path
        d="M16 10V28M16 10c0-3-2-6-4-6s-3 2-3 3 1 3 7 3zM16 10c0-3 2-6 4-6s3 2 3 3-1 3-7 3z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export { GiftIcon };
