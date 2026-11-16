"use client";

import React from "react";
import { ViewRoleBasicDetailsProps } from "./types";

export default function ViewRoleBasicDetails({
  name,
  description,
}: ViewRoleBasicDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
      <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">Basic Details</h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="text-[12px] font-medium text-[#94A3B8]">Name</div>
          <div className="text-[14px] font-bold text-[#1E293B]">{name}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[12px] font-medium text-[#94A3B8]">Description</div>
          <div className="text-[14px] font-medium text-[#1E293B] leading-relaxed max-w-7xl">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
