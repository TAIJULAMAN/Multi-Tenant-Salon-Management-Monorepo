"use client";

import React from "react";

export default function ReceiptIllustration() {
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <rect
        x="8"
        y="4"
        width="64"
        height="76"
        rx="5"
        fill="#F4F6FA"
        stroke="#E0E6EB"
        strokeWidth="2"
      />
      <path
        d="M8 80l9-9 9 9 9-9 9 9 9-9 9 9"
        stroke="#E0E6EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="18"
        y="18"
        width="36"
        height="5"
        rx="2.5"
        fill="#635BFF"
        opacity=".25"
      />
      <rect x="18" y="30" width="28" height="4" rx="2" fill="#C7C4FF" />
      <rect x="18" y="40" width="32" height="4" rx="2" fill="#C7C4FF" />
      <rect x="18" y="50" width="22" height="4" rx="2" fill="#C7C4FF" />
      <rect
        x="18"
        y="62"
        width="36"
        height="5"
        rx="2.5"
        fill="#635BFF"
        opacity=".45"
      />
    </svg>
  );
}
export { ReceiptIllustration };
