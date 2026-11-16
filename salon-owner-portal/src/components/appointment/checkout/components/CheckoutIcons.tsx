import React from "react";
import { IconProps, PaymentMethodId } from "../types";

export function CashIcon({ white = false }: IconProps) {
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

export function CardIcon({ white = false }: IconProps) {
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

export function OnlineIcon({ white = false }: IconProps) {
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

export function GiftIcon({ white = false }: IconProps) {
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

export function MethodIcon({
  id,
  white,
}: {
  id: PaymentMethodId;
  white?: boolean;
}) {
  switch (id) {
    case "cash":
      return <CashIcon white={white} />;
    case "card":
      return <CardIcon white={white} />;
    case "online":
      return <OnlineIcon white={white} />;
    case "gift":
      return <GiftIcon white={white} />;
  }
}

export function ReceiptIllustration() {
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

export function TerminalIllustration() {
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <rect
        x="12"
        y="4"
        width="56"
        height="88"
        rx="8"
        fill="#F4F6FA"
        stroke="#E0E6EB"
        strokeWidth="2"
      />
      <rect
        x="20"
        y="12"
        width="40"
        height="28"
        rx="4"
        fill="#635BFF"
        opacity=".15"
      />
      <circle cx="40" cy="26" r="6" fill="#635BFF" opacity=".5" />
      <rect x="20" y="48" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="36" y="48" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="52" y="48" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="20" y="58" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="36" y="58" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="52" y="58" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="20" y="68" width="8" height="6" rx="1.5" fill="#CBD5E1" />
      <rect x="36" y="68" width="8" height="6" rx="1.5" fill="#635BFF" />
      <rect x="52" y="68" width="8" height="6" rx="1.5" fill="#CBD5E1" />
    </svg>
  );
}
