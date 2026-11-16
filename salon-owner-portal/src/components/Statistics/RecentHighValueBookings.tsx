import React from "react";
import { recentHighValueBookingsList as bookings } from "./data";

export function RecentHighValueBookings() {

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden lg:col-span-2 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
          <h3 className="text-sm font-bold text-[#1E293B]">Recent High-Value Bookings</h3>
          <button className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Client</th>
                <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Service</th>
                <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Amount</th>
                <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-6 py-4 border-r border-[#E2E8F0] font-bold text-[#1E293B] text-[13px]">{row.name}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#64748B] text-[13px]">{row.service}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-emerald-600 font-bold text-[13px]">{row.amount}</td>
                  <td className="px-6 py-4 text-[#94A3B8] font-medium text-[13px]">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
