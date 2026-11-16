"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import Pagination from "@/components/customComponent/Pagination";

interface SaleItem {
  id: string;
  date: string;
  client: string;
  product: string;
  qty: number;
  amount: string;
}

const salesHistory: SaleItem[] = [
  { id: "1", date: "9/12/2026", client: "Aurora Martini", product: "Olaplex Shampoo 28", qty: 1, amount: "+€28.03" },
  { id: "2", date: "9/12/2026", client: "Roberta Longo", product: "L'Oreal Shampoo 32", qty: 3, amount: "+€201.96" },
  { id: "3", date: "9/12/2026", client: "Valentina Bruno", product: "Kerastase Shampoo 1", qty: 2, amount: "+€110.06" },
  { id: "4", date: "9/11/2026", client: "Elisabetta Lombardi", product: "Kerastase Styling 37", qty: 2, amount: "+€54.20" },
  { id: "5", date: "9/10/2026", client: "Serena Bruno", product: "Kevin Murphy Tools 21", qty: 1, amount: "+€22.07" },
  { id: "6", date: "9/10/2026", client: "Serena Marino", product: "Kevin Murphy Treatment 6", qty: 1, amount: "+€67.89" },
  { id: "7", date: "9/9/2026", client: "Valentina Russo", product: "Davines Shampoo 18", qty: 2, amount: "+€135.00" },
  { id: "8", date: "9/8/2026", client: "Sara Russo", product: "Olaplex Tools 44", qty: 1, amount: "+€42.51" },
  { id: "9", date: "9/8/2026", client: "Sofia Rossi", product: "Olaplex Shampoo 23", qty: 2, amount: "+€129.30" },
  { id: "10", date: "9/8/2026", client: "Camilla Caruso", product: "Olaplex Shampoo 28", qty: 1, amount: "+€28.83" },
  { id: "11", date: "9/7/2026", client: "Giulia Gentile", product: "Davines Conditioner 4", qty: 1, amount: "+€33.74" },
  { id: "12", date: "9/7/2026", client: "Chiara Gentile", product: "Kerastase Shampoo 1", qty: 2, amount: "+€110.06" },
  { id: "13", date: "9/6/2026", client: "Federica Mancini", product: "Kevin Murphy Shampoo 2", qty: 1, amount: "+€42.63" },
  { id: "14", date: "9/6/2026", client: "Beatrice Rinaldi", product: "L'Oreal Color 7", qty: 2, amount: "+€154.12" },
  { id: "15", date: "9/5/2026", client: "Silvio Mariani", product: "GHD Tools 16", qty: 1, amount: "+€149.00" },
];

export function RecentSalesHistoryCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = salesHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedSales = salesHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="p-4 sm:p-6 border-b border-[#F1F5F9]">
          <h3 className="text-sm font-bold text-[#1E293B]">Recent Sales History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Date
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Client
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Product
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Qty
                </th>
                <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] font-manrope">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-5 py-3 border-r border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                    {row.date}
                  </td>
                  <td className="px-5 py-3 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                      <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{row.client}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 border-r border-[#E2E8F0] text-xs font-medium text-[#64748B]">
                    {row.product}
                  </td>
                  <td className="px-5 py-3 border-r border-[#E2E8F0] text-xs font-bold text-[#1E293B]">
                    {row.qty}
                  </td>
                  <td className="px-5 py-3 text-xs font-bold text-emerald-600">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsName="sales"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
