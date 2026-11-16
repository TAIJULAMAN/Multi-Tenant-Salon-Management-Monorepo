import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  onPageChange?: (page: number) => void;
}

export default function CustomPagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  itemName = "items",
  onPageChange,
}: PaginationProps) {

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const range = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        range.push("ellipsis-1");
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPages - 1) {
        range.push("ellipsis-2");
      }

      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E8F0] bg-white rounded-b-lg">
      <div className="text-[13px] text-[#64748B] text-center sm:text-left">
        Showing <span className="font-bold text-[#1E293B]">{startItem}</span> to <span className="font-bold text-[#1E293B]">{endItem}</span> of <span className="font-bold text-[#1E293B]">{totalItems}</span> {itemName}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center gap-1 h-[32px] px-2 sm:px-3 border border-[#E2E8F0] rounded-lg text-[13px] font-medium transition-colors text-[#64748B] hover:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {getPageNumbers().map((page, idx) => {
          if (typeof page === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-[32px] h-[32px] flex items-center justify-center text-[13px] text-[#94A3B8] select-none"
              >
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange && onPageChange(page)}
              className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors border cursor-pointer ${currentPage === page
                ? "bg-[#635BFF] text-white border-[#635BFF]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center justify-center gap-1 h-[32px] px-2 sm:px-3 border border-[#E2E8F0] rounded-lg text-[13px] font-medium transition-colors text-[#64748B] hover:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
