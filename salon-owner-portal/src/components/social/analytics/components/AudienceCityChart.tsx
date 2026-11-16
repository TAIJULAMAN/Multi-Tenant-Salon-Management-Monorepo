"use client";

import React, { useState } from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { MOCK_AUDIENCE_CITY } from "../../data";

export function AudienceCityChart() {
  const [audienceFilter, setAudienceFilter] = useState("City");

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Audience by City</h3>
        <div className="w-28">
          <CustomSelect
            value={audienceFilter}
            onChange={setAudienceFilter}
            options={["City", "Country", "Locale"]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 justify-center">
        {MOCK_AUDIENCE_CITY.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-24 text-[12px] text-[#94A3B8] font-medium">{item.city}</div>
            <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#635BFF] rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="w-10 text-right text-[14px] font-bold text-[#1E293B]">
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
