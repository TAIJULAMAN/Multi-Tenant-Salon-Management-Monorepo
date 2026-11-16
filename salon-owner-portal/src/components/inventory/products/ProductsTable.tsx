"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/CustomPagination";
import { Badge } from "@/components/ui/Badge";
import { InventoryProduct } from "@/components/inventory/types";

interface ProductsTableProps {
  products: InventoryProduct[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (product: InventoryProduct) => void;
  onDelete: (product: InventoryProduct) => void;
}

const ProductActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] border border-[#E2E8F0] z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onView();
              }}
              className="w-full px-4 py-2 text-left text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4 text-[#635BFF]" />
              View Details
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              className="w-full px-4 py-2 text-left text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-[#38BDF8]" />
              Edit
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="w-full px-4 py-2 text-left text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[#F43F5E]" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductsTable({
  products,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const router = useRouter();

  const getPriorityVariant = (priority: InventoryProduct["priority"]) => {
    switch (priority) {
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="block w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                Product Name
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                Category
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                Stock Amount
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                Priority
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                Status
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] font-manrope">
                Purchase Price{" "}
                <span className="text-[11px] font-medium text-[#64748B]">
                  (VAT excluded)
                </span>
              </th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] text-center whitespace-nowrap font-manrope">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                    <span className="text-[#1E293B] font-bold text-[13px] whitespace-nowrap">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <span className="text-[#475569] font-medium text-[13px] whitespace-nowrap">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <span className="text-[#475569] font-medium text-[13px]">
                    {product.stockAmount}
                  </span>
                </td>
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <Badge
                    variant={getPriorityVariant(product.priority)}
                    size="sm"
                  >
                    {product.priority}
                  </Badge>
                </td>
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <Badge
                    variant={
                      product.status === "In Stock" ? "success" : "danger"
                    }
                    size="sm"
                  >
                    {product.status}
                  </Badge>
                </td>
                <td className="py-4 px-6 border-r border-[#E2E8F0]">
                  <span className="text-[#1E293B] font-medium text-[13px] whitespace-nowrap">
                    € {product.price}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <ProductActionMenu
                    onView={() =>
                      router.push(`/dashboard/inventory/products/${product.id}`)
                    }
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="products"
        onPageChange={onPageChange}
      />
    </div>
  );
}
