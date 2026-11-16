import React from "react";
import Badge, { BadgeVariant } from "@/components/ui/Badge";
import { Status } from "@/@types/salon-owner/Statu.type";

const statusToVariant: Record<string, BadgeVariant> = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Completed: "info",
  "In Progress": "purple",
  Paid: "success",
  "Fully Paid": "success",
  "Half Paid": "warning",
  "Not Paid": "danger",
  Issued: "info",
  Draft: "neutral",
  Active: "success",
  Inactive: "neutral",
  Used: "neutral",
  "No-Used": "success",
  "In Stock": "success",
  "Out of Stock": "danger",
};

export default function StatusBadge({
  status,
  statusStyles,
  dot = true,
}: {
  status: Status | string;
  statusStyles?: Record<string, string>;
  dot?: boolean;
}) {
  const variant = statusToVariant[status] || "neutral";

  return (
    <Badge variant={variant} size="sm" dot={dot}>
      {status}
    </Badge>
  );
}
