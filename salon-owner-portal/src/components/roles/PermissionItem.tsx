"use client";

import React from "react";
import { PermissionItemProps } from "./types";
import CustomSwitch from "@/components/customComponent/CustomSwitch";

export default function PermissionItem({
  title,
  subtitle,
  checked,
  onChange,
}: PermissionItemProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[13px] font-bold text-[#1E293B] leading-snug">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5 leading-snug">
            {subtitle}
          </div>
        )}
      </div>
      <CustomSwitch
        checked={checked}
        onChange={onChange}
        activeColor="bg-[#635BFF]"
      />
    </div>
  );
}
