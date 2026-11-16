"use client";

import React, { useState } from "react";
import { highSpendersList } from "./data";
import CustomInput from "@/components/customComponent/CustomInput";
import HighSpendersCards from "./HighSpendersCards";
import HighSpendersTable from "./HighSpendersTable";

export default function HighSpendersTab() {
  const [minSpend, setMinSpend] = useState("0");
  const [maxSpend, setMaxSpend] = useState("Unlimited");

  const parsedMin = parseFloat(minSpend) || 0;
  const parsedMax = maxSpend === "Unlimited" || maxSpend === "" ? Infinity : (parseFloat(maxSpend) || Infinity);

  const filteredSpenders = highSpendersList.filter((client) => {
    return client.totalSpent >= parsedMin && client.totalSpent <= parsedMax;
  });

  return (
    <div className="space-y-6 text-left font-manrope">
      {/* Spending Range Filter */}
      <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
        <h3 className="text-sm font-bold text-[#1E293B] mb-4">Spending Range Filter</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 items-start">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Min Spending (€):
            </label>
            <div className="w-[120px]">
              <CustomInput
                value={minSpend}
                onChange={setMinSpend}
                placeholder="0"
                className="!py-[6px] !px-3 !text-xs !font-bold !h-[32px] text-center"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Max Spending (€):
            </label>
            <div className="w-[120px]">
              <CustomInput
                value={maxSpend}
                onChange={setMaxSpend}
                placeholder="Unlimited"
                className="!py-[6px] !px-3 !text-xs !font-bold !h-[32px] text-center"
              />
            </div>
          </div>
        </div>
      </div>

      <HighSpendersCards filteredSpenders={filteredSpenders} />
      <HighSpendersTable filteredSpenders={filteredSpenders} />
    </div>
  );
}
