"use client";

import React from "react";
import CustomSelect from "../customComponent/CustomSelect";
import IAppoinUser from "./IAppoinUser";
import { recentMembers } from "./data";

export interface TeamMemberItem {
  id?: string;
  name: string;
  avatar?: string | null;
  clientAvatar?: string | null;
}

export interface TeamDropdownProps {
  selected?: string[];
  selectedIds?: string[];
  onChange: (selected: string[]) => void;
  singleSelect?: boolean;
  teamMembers?: TeamMemberItem[];
  className?: string;
  buttonClassName?: string;
}

export const DEFAULT_TEAM_MEMBERS: TeamMemberItem[] = [
  { id: "1", name: "Shah Aman", avatar: "/avatar/icon1.png" },
  { id: "2", name: "Hasan Siam", avatar: "/avatar/icon2.png" },
  { id: "3", name: "Hridoy Khan", avatar: "/avatar/icon3.png" },
  { id: "4", name: "Hridoy Alam", avatar: "/avatar/icon1.png" },
];

export default function TeamDropdown({
  selected,
  selectedIds,
  onChange,
  singleSelect = false,
  teamMembers,
  className = "",
  buttonClassName = "",
}: TeamDropdownProps) {
  // Support both prop names for seamless compatibility
  const activeSelected = selected || selectedIds || [];

  // Use provided teamMembers or fallback to default team members from design
  const rawMembers: TeamMemberItem[] =
    teamMembers || DEFAULT_TEAM_MEMBERS;

  const allMemberValues = rawMembers.map((m) => m.id || m.name);

  // Build options with icons and "All Team"
  const options = [
    {
      label: "All Team",
      value: "all",
      icon: (
        <div className="w-6 h-6 bg-[#EEEEFF] rounded-[6px] flex items-center justify-center shrink-0">
          <IAppoinUser />
        </div>
      ),
    },
    ...rawMembers.map((m) => ({
      label: m.name,
      value: m.id || m.name,
      icon: m.avatar || m.clientAvatar || null,
    })),
  ];

  const isAllSelected =
    activeSelected.includes("all") ||
    activeSelected.length === 0 ||
    (allMemberValues.length > 0 &&
      allMemberValues.every((val) => activeSelected.includes(val)));

  const selectValue = singleSelect
    ? activeSelected[0] || "all"
    : isAllSelected
    ? ["all", ...allMemberValues]
    : activeSelected;

  const handleChange = (newVal: any) => {
    if (singleSelect) {
      const single = typeof newVal === "string" ? newVal : newVal?.[0];
      if (single === "all" || !single) {
        onChange(allMemberValues);
      } else {
        onChange([single]);
      }
    } else {
      if (Array.isArray(newVal)) {
        if (newVal.includes("all")) {
          onChange(["all", ...allMemberValues]);
        } else {
          onChange(newVal.filter((id: string) => id !== "all"));
        }
      } else {
        if (newVal === "all") {
          onChange(["all", ...allMemberValues]);
        } else {
          onChange([newVal]);
        }
      }
    }
  };

  return (
    <CustomSelect
      value={selectValue}
      onChange={handleChange}
      options={options}
      multiple={!singleSelect}
      className={className}
      buttonClassName={
        buttonClassName ||
        "h-10 flex items-center justify-between gap-2 border border-[#E0E6EB] rounded-[8px] px-3 py-2 cursor-pointer hover:border-[#635BFF] transition-colors bg-white text-sm font-manrope font-medium text-[#29343D]"
      }
    />
  );
}
