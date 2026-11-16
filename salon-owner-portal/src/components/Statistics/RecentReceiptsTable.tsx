"use client";

import React, { useState } from "react";
import Pagination from "@/components/customComponent/Pagination";

export interface ReceiptRow {
  id: string;
  date: string;
  client: string;
  subtotal: string;
  discount: string;
  total: string;
  payment: string;
}

const allReceipts: ReceiptRow[] = [
  { id: "1", date: "12 Sep 2026", client: "Chiara Gentile", subtotal: "€305.00", discount: "€0.00", total: "€305.00", payment: "Satispay" },
  { id: "2", date: "12 Sep 2026", client: "Federica Mancini", subtotal: "€240.00", discount: "€0.00", total: "€240.00", payment: "Bancomat" },
  { id: "3", date: "12 Sep 2026", client: "Beatrice Rinaldi", subtotal: "€260.00", discount: "€0.00", total: "€260.00", payment: "Bancomat" },
  { id: "4", date: "12 Sep 2026", client: "Giulia Gentile", subtotal: "€120.00", discount: "€0.00", total: "€120.00", payment: "Carta" },
  { id: "5", date: "12 Sep 2026", client: "Silvio Mariani", subtotal: "€320.00", discount: "€0.00", total: "€320.00", payment: "Bancomat" },
  { id: "6", date: "12 Sep 2026", client: "Greta Leone", subtotal: "€115.00", discount: "€0.00", total: "€115.00", payment: "Bancomat" },
  { id: "7", date: "12 Sep 2026", client: "Giorgia Caruso", subtotal: "€45.00", discount: "€0.00", total: "€45.00", payment: "Contanti" },
  { id: "8", date: "12 Sep 2026", client: "Valeria Gentile", subtotal: "€170.00", discount: "€0.00", total: "€170.00", payment: "Contanti" },
  { id: "9", date: "12 Sep 2026", client: "Elisa Moretti", subtotal: "€105.00", discount: "€0.00", total: "€105.00", payment: "Carta" },
  { id: "10", date: "11 Sep 2026", client: "Emma Esposito", subtotal: "€50.00", discount: "€0.00", total: "€50.00", payment: "Contanti" },
  { id: "11", date: "11 Sep 2026", client: "Marco Rossi", subtotal: "€195.00", discount: "€0.00", total: "€195.00", payment: "Satispay" },
  { id: "12", date: "11 Sep 2026", client: "Alessia Colombo", subtotal: "€220.00", discount: "€0.00", total: "€220.00", payment: "Bancomat" },
  { id: "13", date: "10 Sep 2026", client: "Luca Ferrari", subtotal: "€140.00", discount: "€0.00", total: "€140.00", payment: "Carta" },
  { id: "14", date: "10 Sep 2026", client: "Martina De Luca", subtotal: "€85.00", discount: "€0.00", total: "€85.00", payment: "Contanti" },
  { id: "15", date: "10 Sep 2026", client: "Davide Marini", subtotal: "€310.00", discount: "€0.00", total: "€310.00", payment: "Bancomat" },
  { id: "16", date: "09 Sep 2026", client: "Elena Greco", subtotal: "€160.00", discount: "€0.00", total: "€160.00", payment: "Carta" },
  { id: "17", date: "09 Sep 2026", client: "Simone Conti", subtotal: "€95.00", discount: "€0.00", total: "€95.00", payment: "Contanti" },
  { id: "18", date: "08 Sep 2026", client: "Sara Barbieri", subtotal: "€275.00", discount: "€0.00", total: "€275.00", payment: "Satispay" },
  { id: "19", date: "08 Sep 2026", client: "Andrea Fontana", subtotal: "€130.00", discount: "€0.00", total: "€130.00", payment: "Bancomat" },
  { id: "20", date: "07 Sep 2026", client: "Claudia Santoro", subtotal: "€190.00", discount: "€0.00", total: "€190.00", payment: "Carta" },
];

export function RecentReceiptsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = allReceipts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedReceipts = allReceipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden w-full">
      <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#1E293B]">Recent Receipts</h3>
        <button className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[18%]">
                Date
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[24%]">
                Client
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">
                Subtotal
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[14%]">
                Discount
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">
                Total
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope w-[14%]">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedReceipts.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group"
              >
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {row.date}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <div className="text-[13px] font-bold text-[#1E293B]">{row.client}</div>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {row.subtotal}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {row.discount}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-bold text-emerald-600">
                  {row.total}
                </td>
                <td className="px-6 py-4 text-[13px] font-semibold text-[#64748B]">
                  {row.payment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsName="receipts"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
