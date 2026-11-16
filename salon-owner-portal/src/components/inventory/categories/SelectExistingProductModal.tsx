"use client";

import React, { useState } from "react";
import { X, Search, Check, Package } from "lucide-react";
import { MOCK_PRODUCTS } from "@/components/inventory/data";
import { InventoryProduct } from "@/components/inventory/types";

interface SelectExistingProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedIds: string[]) => void;
  categoryName?: string;
}

export default function SelectExistingProductModal({
  isOpen,
  onClose,
  onSelect,
  categoryName = "Category",
}: SelectExistingProductModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  if (!isOpen) return null;

  const filtered: InventoryProduct[] = MOCK_PRODUCTS.filter((p: InventoryProduct) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
    setSelected([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-[#E2E8F0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1E293B] font-manrope">
              Add Existing Products
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Select inventory items to add to {categoryName}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search existing products..."
            className="w-full text-[13px] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#635BFF]"
          />
        </div>

        {/* Product List */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-6 divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No products found matching your search.
            </div>
          ) : (
            filtered.map((prod: InventoryProduct) => {
              const isChecked = selected.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => toggleSelect(prod.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isChecked ? "bg-[#EEF2FF]/60" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      <Package size={20} className="text-[#635BFF]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1E293B] leading-tight">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                        Stock: {prod.stockAmount} · Price: € {prod.price}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-[#635BFF] border-[#635BFF] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#524be0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-xl shadow-lg shadow-[#635BFF]/20 transition-colors"
          >
            Add Selected ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
