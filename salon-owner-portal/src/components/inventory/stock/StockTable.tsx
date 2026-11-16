"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/CustomPagination";
import { Badge } from "@/components/ui/Badge";
import { StockMovement } from "@/components/inventory/types";

interface StockTableProps {
  stocks: StockMovement[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (stock: StockMovement) => void;
  onDelete: (stock: StockMovement) => void;
}

const StockActionMenu = ({
  stock,
  onView,
  onEdit,
  onDelete,
}: {
  stock: StockMovement;
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
        className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors flex items-center justify-center"
      >
        <MoreVertical className="w-5 h-5 text-[#64748B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border border-[#E2E8F0] z-50 overflow-hidden py-1">
          <button
            onClick={() => {
              setIsOpen(false);
              onView();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <Eye className="w-4 h-4 text-[#635BFF]" />
            View Details
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <Edit2 className="w-4 h-4 text-[#38BDF8]" />
            Edit
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#FB7185]" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default function StockTable({
  stocks,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: StockTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Date
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Type
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                SKU
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Product Name
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Quantity
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
                Price
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="text-[#1E293B] font-semibold text-[13px] whitespace-nowrap">
                    {stock.date}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    {stock.type === "In" ? (
                      <>
                        <ArrowDown className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span className="text-[#1E293B] font-medium text-[13px]">
                          In
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowUp className="w-3.5 h-3.5 text-[#F43F5E]" />
                        <span className="text-[#1E293B] font-medium text-[13px]">
                          Out
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="text-[#64748B] font-semibold text-[13px] whitespace-nowrap">
                    {stock.sku}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                    <span className="text-[#1E293B] font-bold text-[13px] whitespace-nowrap">
                      {stock.productName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="text-[#64748B] font-semibold text-[13px]">
                    {stock.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <Badge
                    variant={stock.status === "In Stock" ? "success" : "danger"}
                    size="sm"
                  >
                    {stock.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="text-[#1E293B] font-medium text-[13px] whitespace-nowrap">
                    € {stock.price}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <StockActionMenu
                    stock={stock}
                    onView={() =>
                      router.push(`/dashboard/inventory/stock/${stock.id}`)
                    }
                    onEdit={() => onEdit(stock)}
                    onDelete={() => onDelete(stock)}
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
        itemName="stock records"
        onPageChange={onPageChange}
      />
    </div>
  );
}
