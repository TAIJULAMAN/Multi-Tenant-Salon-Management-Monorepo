"use client";

import React from "react";

export const TopServicesList: React.FC = () => {
  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-[#1E293B] text-[14px] mb-6">Top 3 Services</h3>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {/* Top 1 */}
        <div className="flex items-center justify-between p-4 bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors rounded-[12px]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              1
            </div>
            <span className="font-bold text-sm text-[#1E293B]">Cut and Fold</span>
          </div>
          <span className="font-extrabold text-sm text-[#1E293B]">25</span>
        </div>

        {/* Top 2 */}
        <div className="flex items-center justify-between p-4 bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors rounded-[12px]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              2
            </div>
            <span className="font-bold text-sm text-[#1E293B]">Coloring</span>
          </div>
          <span className="font-extrabold text-sm text-[#1E293B]">18</span>
        </div>

        {/* Top 3 */}
        <div className="flex items-center justify-between p-4 bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors rounded-[12px]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              3
            </div>
            <span className="font-bold text-sm text-[#1E293B]">Styling</span>
          </div>
          <span className="font-extrabold text-sm text-[#1E293B]">12</span>
        </div>
      </div>
    </div>
  );
};
