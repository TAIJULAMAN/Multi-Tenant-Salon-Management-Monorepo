"use client";

import React, { useState, useMemo } from "react";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { CustomSelect } from "@/components/common/CustomSelect";
import Pagination from "@/components/customComponent/Pagination";

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  type: "Both" | "Pro Only" | "Retail";
  cost: string;
  retail: string;
  stock: number;
  status: "In Stock" | "Low Stock";
}

const initialProducts: InventoryProduct[] = [
  { id: "1", name: "Kerastase Shampoo 1", category: "Shampoo", type: "Both", cost: "€28.27", retail: "€55.03", stock: 37, status: "In Stock" },
  { id: "2", name: "Kevin Murphy Shampoo 2", category: "Shampoo", type: "Both", cost: "€24.88", retail: "€42.63", stock: 33, status: "In Stock" },
  { id: "3", name: "Davines Treatment 3", category: "Treatment", type: "Pro Only", cost: "€16.84", retail: "€30.85", stock: 37, status: "In Stock" },
  { id: "4", name: "Davines Conditioner 4", category: "Conditioner", type: "Retail", cost: "€14.25", retail: "€33.74", stock: 7, status: "Low Stock" },
  { id: "5", name: "L'Oreal Tools 5", category: "Tools", type: "Pro Only", cost: "€46.20", retail: "€79.95", stock: 44, status: "In Stock" },
  { id: "6", name: "Kevin Murphy Treatment 6", category: "Treatment", type: "Both", cost: "€34.76", retail: "€67.89", stock: 34, status: "In Stock" },
  { id: "7", name: "L'Oreal Color 7", category: "Color", type: "Retail", cost: "€40.34", retail: "€77.06", stock: 28, status: "In Stock" },
  { id: "8", name: "L'Oreal Styling 8", category: "Styling", type: "Retail", cost: "€16.17", retail: "€36.58", stock: 49, status: "In Stock" },
  { id: "9", name: "Kerastase Tools 9", category: "Tools", type: "Both", cost: "€28.18", retail: "€53.90", stock: 44, status: "In Stock" },
  { id: "10", name: "L'Oreal Shampoo 10", category: "Shampoo", type: "Pro Only", cost: "€10.65", retail: "€17.99", stock: 37, status: "In Stock" },
  // Additional items to populate 50 results
  { id: "11", name: "Olaplex Shampoo 11", category: "Shampoo", type: "Retail", cost: "€22.50", retail: "€41.00", stock: 25, status: "In Stock" },
  { id: "12", name: "Redken Color 12", category: "Color", type: "Pro Only", cost: "€18.00", retail: "€35.00", stock: 6, status: "Low Stock" },
  { id: "13", name: "Moroccanoil Treatment 13", category: "Treatment", type: "Both", cost: "€31.00", retail: "€58.00", stock: 19, status: "In Stock" },
  { id: "14", name: "Aveda Conditioner 14", category: "Conditioner", type: "Retail", cost: "€19.50", retail: "€38.00", stock: 5, status: "Low Stock" },
  { id: "15", name: "Wella Color 15", category: "Color", type: "Pro Only", cost: "€15.20", retail: "€29.90", stock: 40, status: "In Stock" },
  { id: "16", name: "GHD Tools 16", category: "Tools", type: "Retail", cost: "€89.00", retail: "€149.00", stock: 12, status: "In Stock" },
  { id: "17", name: "Kerastase Styling 17", category: "Styling", type: "Both", cost: "€21.00", retail: "€39.50", stock: 31, status: "In Stock" },
  { id: "18", name: "Davines Shampoo 18", category: "Shampoo", type: "Retail", cost: "€20.00", retail: "€38.00", stock: 22, status: "In Stock" },
  { id: "19", name: "Kevin Murphy Conditioner 19", category: "Conditioner", type: "Both", cost: "€23.00", retail: "€44.00", stock: 4, status: "Low Stock" },
  { id: "20", name: "Olaplex Treatment 20", category: "Treatment", type: "Pro Only", cost: "€29.00", retail: "€55.00", stock: 18, status: "In Stock" },
  { id: "21", name: "L'Oreal Tools 21", category: "Tools", type: "Pro Only", cost: "€39.00", retail: "€69.00", stock: 15, status: "In Stock" },
  { id: "22", name: "Redken Styling 22", category: "Styling", type: "Retail", cost: "€17.50", retail: "€34.00", stock: 28, status: "In Stock" },
  { id: "23", name: "Kerastase Conditioner 23", category: "Conditioner", type: "Both", cost: "€26.00", retail: "€49.00", stock: 20, status: "In Stock" },
  { id: "24", name: "Davines Color 24", category: "Color", type: "Pro Only", cost: "€16.80", retail: "€32.00", stock: 35, status: "In Stock" },
  { id: "25", name: "Kevin Murphy Tools 25", category: "Tools", type: "Both", cost: "€42.00", retail: "€75.00", stock: 14, status: "In Stock" },
  { id: "26", name: "Moroccanoil Shampoo 26", category: "Shampoo", type: "Retail", cost: "€21.50", retail: "€40.00", stock: 17, status: "In Stock" },
  { id: "27", name: "Aveda Treatment 27", category: "Treatment", type: "Pro Only", cost: "€27.00", retail: "€51.00", stock: 22, status: "In Stock" },
  { id: "28", name: "L'Oreal Conditioner 28", category: "Conditioner", type: "Both", cost: "€18.00", retail: "€34.50", stock: 29, status: "In Stock" },
  { id: "29", name: "Wella Styling 29", category: "Styling", type: "Retail", cost: "€14.50", retail: "€28.00", stock: 33, status: "In Stock" },
  { id: "30", name: "Kerastase Color 30", category: "Color", type: "Pro Only", cost: "€22.00", retail: "€42.00", stock: 26, status: "In Stock" },
  { id: "31", name: "Davines Tools 31", category: "Tools", type: "Both", cost: "€38.00", retail: "€66.00", stock: 8, status: "Low Stock" },
  { id: "32", name: "Kevin Murphy Styling 32", category: "Styling", type: "Retail", cost: "€19.00", retail: "€37.00", stock: 24, status: "In Stock" },
  { id: "33", name: "Olaplex Conditioner 33", category: "Conditioner", type: "Both", cost: "€24.00", retail: "€45.00", stock: 16, status: "In Stock" },
  { id: "34", name: "Redken Shampoo 34", category: "Shampoo", type: "Pro Only", cost: "€16.00", retail: "€30.00", stock: 38, status: "In Stock" },
  { id: "35", name: "L'Oreal Treatment 35", category: "Treatment", type: "Retail", cost: "€25.00", retail: "€48.00", stock: 21, status: "In Stock" },
  { id: "36", name: "Aveda Tools 36", category: "Tools", type: "Both", cost: "€45.00", retail: "€79.00", stock: 11, status: "In Stock" },
  { id: "37", name: "Moroccanoil Color 37", category: "Color", type: "Pro Only", cost: "€20.00", retail: "€38.00", stock: 30, status: "In Stock" },
  { id: "38", name: "Kerastase Shampoo 38", category: "Shampoo", type: "Both", cost: "€27.00", retail: "€52.00", stock: 19, status: "In Stock" },
  { id: "39", name: "Wella Conditioner 39", category: "Conditioner", type: "Retail", cost: "€15.50", retail: "€30.00", stock: 27, status: "In Stock" },
  { id: "40", name: "Davines Styling 40", category: "Styling", type: "Both", cost: "€18.50", retail: "€35.00", stock: 25, status: "In Stock" },
  { id: "41", name: "Kevin Murphy Color 41", category: "Color", type: "Pro Only", cost: "€21.00", retail: "€40.00", stock: 15, status: "In Stock" },
  { id: "42", name: "L'Oreal Tools 42", category: "Tools", type: "Retail", cost: "€50.00", retail: "€88.00", stock: 9, status: "Low Stock" },
  { id: "43", name: "Olaplex Treatment 43", category: "Treatment", type: "Both", cost: "€32.00", retail: "€60.00", stock: 14, status: "In Stock" },
  { id: "44", name: "Redken Conditioner 44", category: "Conditioner", type: "Pro Only", cost: "€17.00", retail: "€33.00", stock: 23, status: "In Stock" },
  { id: "45", name: "Aveda Styling 45", category: "Styling", type: "Retail", cost: "€20.50", retail: "€39.00", stock: 18, status: "In Stock" },
  { id: "46", name: "Kerastase Tools 46", category: "Tools", type: "Both", cost: "€35.00", retail: "€62.00", stock: 13, status: "In Stock" },
  { id: "47", name: "Moroccanoil Shampoo 47", category: "Shampoo", type: "Retail", cost: "€23.00", retail: "€43.00", stock: 16, status: "In Stock" },
  { id: "48", name: "Davines Treatment 48", category: "Treatment", type: "Pro Only", cost: "€28.00", retail: "€53.00", stock: 17, status: "In Stock" },
  { id: "49", name: "Wella Color 49", category: "Color", type: "Both", cost: "€19.00", retail: "€36.00", stock: 22, status: "In Stock" },
  { id: "50", name: "L'Oreal Styling 50", category: "Styling", type: "Retail", cost: "€16.00", retail: "€31.00", stock: 32, status: "In Stock" },
];

const categories = ["All Categories", "Shampoo", "Treatment", "Conditioner", "Tools", "Color", "Styling"];

export function FullProductInventoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden p-4 sm:p-6 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h3 className="text-sm font-bold text-[#1E293B]">Full Product Inventory</h3>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <CustomSearch
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="w-full sm:w-72"
          />

          <CustomSelect
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
            options={categories}
            className="w-full sm:w-44"
            buttonClassName="!w-full !bg-white !border-[#E2E8F0] !text-[#1E293B] !text-xs !font-semibold !px-3.5 !py-2 !rounded-lg justify-between"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-[#F1F5F9] text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase">
              <th className="pb-4 font-bold">PRODUCT NAME</th>
              <th className="pb-4 font-bold">CATEGORY</th>
              <th className="pb-4 font-bold">TYPE</th>
              <th className="pb-4 font-bold">COST</th>
              <th className="pb-4 font-bold">RETAIL</th>
              <th className="pb-4 font-bold">STOCK</th>
              <th className="pb-4 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8FAFC]">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((row) => (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 text-[13px] font-bold text-[#1E293B]">{row.name}</td>
                  <td className="py-4">
                    <span className="text-xs font-semibold text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4">
                    {row.type === "Pro Only" ? (
                      <span className="bg-[#EEF2FF] text-[#635BFF] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                        Pro Only
                      </span>
                    ) : row.type === "Retail" ? (
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                        Retail
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#64748B]">Both</span>
                    )}
                  </td>
                  <td className="py-4 text-[13px] font-medium text-[#64748B]">{row.cost}</td>
                  <td className="py-4 text-[13px] font-bold text-[#1E293B]">{row.retail}</td>
                  <td className="py-4 text-[13px] font-bold text-[#1E293B]">{row.stock}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.status === "In Stock"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/80"
                        : "bg-rose-50 text-rose-600 border border-rose-200/80"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="w-full mt-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsName="products"
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
