"use client";

import React, { useState, useMemo } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSearch from "@/components/customComponent/CustomSearch";
import Pagination from "@/components/customComponent/Pagination";

interface MovementItem {
  id: string;
  date: string;
  type: "Restock" | "Usage";
  product: string;
  qty: number;
  unitCost: string;
  totalValue: string;
}

const allMovements: MovementItem[] = [
  { id: "1", date: "9/12/2026", type: "Restock", product: "Olaplex Shampoo 15", qty: 16, unitCost: "€31.98", totalValue: "€511.68" },
  { id: "2", date: "9/12/2026", type: "Usage", product: "Davines Tools 42", qty: 3, unitCost: "-", totalValue: "€181.35" },
  { id: "3", date: "9/11/2026", type: "Restock", product: "Redken Color 33", qty: 27, unitCost: "€6.15", totalValue: "€166.05" },
  { id: "4", date: "9/11/2026", type: "Restock", product: "Kerastase Styling 37", qty: 32, unitCost: "€11.50", totalValue: "€368.00" },
  { id: "5", date: "9/10/2026", type: "Restock", product: "L'Oreal Color 7", qty: 43, unitCost: "€40.34", totalValue: "€1734.62" },
  { id: "6", date: "9/10/2026", type: "Usage", product: "Kevin Murphy Treatment 6", qty: 2, unitCost: "-", totalValue: "€69.52" },
  { id: "7", date: "9/09/2026", type: "Restock", product: "Aveda Conditioner 14", qty: 20, unitCost: "€19.50", totalValue: "€390.00" },
  { id: "8", date: "9/09/2026", type: "Usage", product: "Wella Color 15", qty: 4, unitCost: "-", totalValue: "€60.80" },
  { id: "9", date: "9/08/2026", type: "Restock", product: "Moroccanoil Treatment 13", qty: 15, unitCost: "€31.00", totalValue: "€465.00" },
  { id: "10", date: "9/08/2026", type: "Usage", product: "Kerastase Shampoo 1", qty: 5, unitCost: "-", totalValue: "€141.35" },
  { id: "11", date: "9/07/2026", type: "Restock", product: "Davines Shampoo 18", qty: 18, unitCost: "€20.00", totalValue: "€360.00" },
  { id: "12", date: "9/07/2026", type: "Usage", product: "Kevin Murphy Tools 25", qty: 1, unitCost: "-", totalValue: "€42.00" },
];

export function RecentMovementsLogCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [modalPage, setModalPage] = useState(1);
  const modalItemsPerPage = 6;

  const filteredModalMovements = useMemo(() => {
    return allMovements.filter((m) =>
      m.product.toLowerCase().includes(modalSearch.toLowerCase()) ||
      m.type.toLowerCase().includes(modalSearch.toLowerCase()) ||
      m.date.includes(modalSearch)
    );
  }, [modalSearch]);

  const modalTotalPages = Math.ceil(filteredModalMovements.length / modalItemsPerPage) || 1;
  const paginatedModalMovements = filteredModalMovements.slice(
    (modalPage - 1) * modalItemsPerPage,
    modalPage * modalItemsPerPage
  );

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#F1F5F9]">
          <h3 className="text-sm font-bold text-[#1E293B]">Recent Movements Log</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#635BFF] hover:bg-[#5249E6] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            View All (210)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Date
                </th>
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Type
                </th>
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Product
                </th>
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Qty
                </th>
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Unit Cost
                </th>
                <th className="px-5 py-4 text-[12px] font-bold text-[#1E293B] font-manrope">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody>
              {allMovements.slice(0, 5).map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-5 py-3.5 border-r border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 border-r border-[#E2E8F0]">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.type === "Restock"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 border-r border-[#E2E8F0] text-xs font-bold text-[#1E293B]">
                    {row.product}
                  </td>
                  <td className="px-5 py-3.5 border-r border-[#E2E8F0] text-xs font-bold text-[#1E293B]">
                    {row.qty}
                  </td>
                  <td className="px-5 py-3.5 border-r border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                    {row.unitCost}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-[#1E293B]">
                    {row.totalValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View All Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Stock Movements Log"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CustomSearch
              value={modalSearch}
              onChange={(val) => {
                setModalSearch(val);
                setModalPage(1);
              }}
              placeholder="Search movements by product or type..."
              className="w-full sm:w-80"
            />
          </div>

          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Date</th>
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Type</th>
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Product</th>
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Qty</th>
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Unit Cost</th>
                  <th className="px-4 py-3 text-[12px] font-bold text-[#1E293B]">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {paginatedModalMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                      No movements found.
                    </td>
                  </tr>
                ) : (
                  paginatedModalMovements.map((row) => (
                    <tr key={row.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 border-r border-[#E2E8F0] text-xs text-[#64748B]">{row.date}</td>
                      <td className="px-4 py-3 border-r border-[#E2E8F0]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.type === "Restock"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-[#E2E8F0] text-xs font-bold text-[#1E293B]">{row.product}</td>
                      <td className="px-4 py-3 border-r border-[#E2E8F0] text-xs font-bold text-[#1E293B]">{row.qty}</td>
                      <td className="px-4 py-3 border-r border-[#E2E8F0] text-xs text-[#64748B]">{row.unitCost}</td>
                      <td className="px-4 py-3 text-xs font-bold text-[#1E293B]">{row.totalValue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={modalPage}
            totalPages={modalTotalPages}
            totalItems={filteredModalMovements.length}
            itemsPerPage={modalItemsPerPage}
            itemsName="movements"
            onPageChange={setModalPage}
          />
        </div>
      </Modal>
    </div>
  );
}
