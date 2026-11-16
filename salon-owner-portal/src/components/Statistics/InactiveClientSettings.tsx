"use client";

import React from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";

import { InactiveClientSettingsProps } from "./types";

export default function InactiveClientSettings({
  filterMode,
  setFilterMode,
  days,
  setDays,
  periodStart,
  setPeriodStart,
  periodEnd,
  setPeriodEnd,
}: InactiveClientSettingsProps) {
  const formatToMockDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return dateStr;
      const monthIdx = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parts[2];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
        return `${day} ${months[monthIdx]} ${year}`;
      }
      return dateStr;
    }
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day} ${months[monthIdx]} ${year}`;
    }
    return dateStr;
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
      <h3 className="text-sm font-bold text-[#1E293B] mb-4">Inactive Client Settings</h3>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
            Filter Mode:
          </label>
          <CustomSelect
            value={filterMode}
            onChange={setFilterMode}
            options={["Days Since Last Visit", "Visits Frequency"]}
            buttonClassName="w-[180px] !bg-white !border-[#E2E8F0] !text-[#1E293B] !text-xs !font-bold !px-3 !py-[7px] !rounded-lg"
          />
        </div>

        {filterMode === "Days Since Last Visit" ? (
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Inactive for (days):
            </label>
            <div className="w-[80px]">
              <CustomInput
                value={days}
                onChange={setDays}
                placeholder="90"
                className="!py-[6px] !px-3 !text-xs !font-bold !h-[32px] text-center"
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                Period Start:
              </label>
              <div className="w-[160px]">
                <CustomDatePicker
                  value={periodStart}
                  onChange={setPeriodStart}
                  className="!py-[6.5px] !px-3 !text-xs !font-bold !h-[32px]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                Period End:
              </label>
              <div className="w-[160px]">
                <CustomDatePicker
                  value={periodEnd}
                  onChange={setPeriodEnd}
                  className="!py-[6.5px] !px-3 !text-xs !font-bold !h-[32px]"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <p className="text-[11px] text-[#94A3B8] font-medium mt-3">
        {filterMode === "Days Since Last Visit"
          ? `Showing clients who haven't visited in ${days}+ days`
          : `Showing clients who didn't visit between ${formatToMockDate(periodStart)} and ${formatToMockDate(periodEnd)}`}
      </p>
    </div>
  );
}
