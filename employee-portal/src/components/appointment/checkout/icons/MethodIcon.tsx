"use client";

import React from "react";
import { PaymentMethodId } from "../types";
import CashIcon from "./CashIcon";
import CardIcon from "./CardIcon";
import OnlineIcon from "./OnlineIcon";
import GiftIcon from "./GiftIcon";

export interface MethodIconProps {
  id: PaymentMethodId;
  white?: boolean;
}

export default function MethodIcon({ id, white }: MethodIconProps) {
  switch (id) {
    case "cash":
      return <CashIcon white={white} />;
    case "card":
      return <CardIcon white={white} />;
    case "online":
      return <OnlineIcon white={white} />;
    case "gift":
      return <GiftIcon white={white} />;
    default:
      return null;
  }
}
export { MethodIcon };
