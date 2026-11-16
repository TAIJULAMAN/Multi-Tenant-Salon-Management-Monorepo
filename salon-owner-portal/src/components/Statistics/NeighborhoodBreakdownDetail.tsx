import React from "react";
import { neighborhoodBreakdownRows as rows } from "./data";

export function NeighborhoodBreakdownDetail() {

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#1E293B]">Neighborhood Breakdown Detail</h3>
        <button className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
          View Map Metrics
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">District Name</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Total Clients</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Average Spend / Visit</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Booking Frequency</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope">Revenue Contribution %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-4 border-r border-[#E2E8F0] font-bold text-[#1E293B] text-[13px]">{row.name}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#64748B] text-[13px]">{row.clients}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-emerald-600 font-bold text-[13px]">{row.spend}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#94A3B8] text-[13px]">{row.freq}</td>
                <td className="px-6 py-4 text-[#1E293B] text-[13px]">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
