"use client";

import React, { useState } from "react";
import { ClientRow, HighSpendersTableProps } from "./types";
import Pagination from "@/components/customComponent/Pagination";

export default function HighSpendersTable({ filteredSpenders }: HighSpendersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = filteredSpenders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedClients = filteredSpenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#1E293B]">High Spenders List</h3>
        <button className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[20%]">Name</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">Last Visit</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[10%]">Visits</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">Total Spent</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">Avg Ticket</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">Tags</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[10%]">City</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope w-[10%]">Region</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => {
              return (
                <tr key={index} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-[#EEF2FF]">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(client.name)}&backgroundColor=eef2ff`}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1E293B]">{client.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[13px] font-semibold text-[#64748B]">{client.lastVisit}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[13px] font-semibold text-[#64748B]">{client.visits}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[13px] font-semibold text-[#64748B]">€{client.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[13px] font-semibold text-[#64748B]">€{client.avgTicket.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <div className="flex flex-wrap gap-1.5">
                      {client.tags.length > 0 ? (
                        client.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-[#EEF2FF] text-[#635BFF] text-[10px] font-bold px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#94A3B8]">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[13px] font-semibold text-[#64748B]">{client.city}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-semibold text-[#64748B]">{client.region}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsName="clients"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
