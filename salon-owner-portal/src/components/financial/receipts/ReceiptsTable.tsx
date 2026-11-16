"use client";

import React from "react";
import { MoreVertical, Eye, Edit2, Ban, Download, Printer } from "lucide-react";
import { ReceiptRecord } from "@/components/financial/types";
import { Badge } from "@/components/ui/Badge";
import Pagination from "@/components/saloonOwner/common/CustomPagination";

interface ReceiptsTableProps {
  receipts: ReceiptRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  openActionMenuId: string | null;
  onToggleActionMenu: (id: string | null) => void;
  onViewReceipt: (receipt: ReceiptRecord) => void;
  onEditReceipt: (receipt: ReceiptRecord) => void;
  onCancelReceipt: (receipt: ReceiptRecord) => void;
  onDownloadReceipt: (receipt: ReceiptRecord) => void;
  onPrintReceipt: (receipt: ReceiptRecord) => void;
  onPageChange: (page: number) => void;
}

export const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  receipts,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  openActionMenuId,
  onToggleActionMenu,
  onViewReceipt,
  onEditReceipt,
  onCancelReceipt,
  onDownloadReceipt,
  onPrintReceipt,
  onPageChange,
}) => {
  const getStatusVariant = (status: ReceiptRecord["status"]) => {
    switch (status) {
      case "Issued":
        return "success" as const;
      case "Draft":
        return "warning" as const;
      case "Canceled":
        return "danger" as const;
      default:
        return "neutral" as const;
    }
  };

  const getMethodStyle = (method: string) => {
    switch (method.trim()) {
      case "Cash":
        return "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30";
      case "Card Terminal":
        return "bg-[#CCFBF1] text-[#0D9488] border border-[#0D9488]/30";
      case "Gift Card":
        return "bg-[#F3E8FF] text-[#9333EA] border border-[#9333EA]/30";
      case "Online Payment":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30";
      default:
        return "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">ID</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Date</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Client</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Amount</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Method</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">Status</th>
              <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {receipts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#94A3B8] text-[13px]">
                  No receipts found matching your criteria.
                </td>
              </tr>
            ) : (
              receipts.map((payment, i) => {
                const uniqueMenuId = `${payment.id}-${i}`;
                const isMenuOpen = openActionMenuId === uniqueMenuId;

                return (
                  <tr key={uniqueMenuId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <span className="text-[#635BFF] font-medium text-[13px]">{payment.id}</span>
                    </td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <span className="text-[#475569] font-medium text-[13px]">{payment.date}</span>
                    </td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <div className="font-bold text-[#1E293B] text-[13px]">{payment.clientName}</div>
                      <div className="text-[#94A3B8] text-[11px] font-medium mt-0.5">{payment.clientEmail}</div>
                    </td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <span className="text-[#475569] font-medium text-[13px]">
                        € {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(payment.method) ? payment.method : payment.method.split(",")).map(
                          (m: string, idx: number) => {
                            const method = m.trim();
                            return (
                              <span
                                key={`${payment.id}-${method}-${idx}`}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getMethodStyle(method)}`}
                              >
                                {method}
                              </span>
                            );
                          }
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <Badge variant={getStatusVariant(payment.status)} size="sm" dot>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center relative">
                      <button
                        onClick={() => onToggleActionMenu(isMenuOpen ? null : uniqueMenuId)}
                        className="text-[#1E293B] hover:bg-[#F1F5F9] p-1.5 rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {isMenuOpen && (
                        <div
                          className={`absolute right-10 ${
                            i >= 3 ? "bottom-10" : "top-10"
                          } bg-white border border-[#E2E8F0] shadow-lg rounded-lg py-2 w-44 z-50 animate-in fade-in zoom-in-95 duration-200`}
                        >
                          <button
                            onClick={() => {
                              onViewReceipt(payment);
                              onToggleActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4 text-[#635BFF]" />
                            <span>View Receipt</span>
                          </button>
                          <button
                            onClick={() => {
                              onEditReceipt(payment);
                              onToggleActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4 text-[#0EA5E9]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              onCancelReceipt(payment);
                              onToggleActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4 text-[#EF4444]" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={() => {
                              onDownloadReceipt(payment);
                              onToggleActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2"
                          >
                            <Download className="w-4 h-4 text-[#635BFF]" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => {
                              onPrintReceipt(payment);
                              onToggleActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2"
                          >
                            <Printer className="w-4 h-4 text-[#94A3B8]" />
                            <span>Print Receipt</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        itemName="receipts"
        onPageChange={onPageChange}
      />
    </div>
  );
};

