"use client";

import React from "react";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomTextarea from "@/components/customComponent/CustomTextarea";
import { RoleBasicDetailsProps } from "./types";

export default function RoleBasicDetails({
  roleName,
  description,
  onChange,
}: RoleBasicDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-6">
      <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">Basic Details</h2>

      <div className="w-full space-y-5">
        <CustomInput
          label="Role Name *"
          required
          placeholder="Enter role name"
          value={roleName}
          onChange={(val) => onChange("roleName", val)}
        />

        <CustomTextarea
          label="Description"
          sublabel="(Optional)"
          placeholder="Enter a description"
          value={description}
          onChange={(val) => onChange("description", val)}
          rows={4}
        />
      </div>
    </div>
  );
}
