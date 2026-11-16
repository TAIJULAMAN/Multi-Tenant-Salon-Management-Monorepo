import React from "react";
import { reorderLowStockAlertsList as alerts } from "./data";

export function ReorderLowStockAlerts() {

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#1E293B]">Reorder & Low Stock Alerts</h3>
        <button className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
          Order History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Product Name</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Category</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">In Stock</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Min Threshold</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Status</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope">Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((row, idx) => (
              <tr key={idx} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-4 border-r border-[#E2E8F0] font-bold text-[#1E293B] text-[13px]">{row.name}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#64748B] text-[13px]">{row.category}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] font-bold text-[#1E293B] text-[13px]">{row.qty}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#94A3B8] text-[13px]">{row.min}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      row.status === "Critical"
                        ? "bg-rose-50 text-rose-600"
                        : row.status === "Out of Stock"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs font-bold text-[#635BFF] bg-[#EEF2FF] hover:bg-[#635BFF] hover:text-white px-3 py-1.5 rounded-md transition-colors">
                    Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
