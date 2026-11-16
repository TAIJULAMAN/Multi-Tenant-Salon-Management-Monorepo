"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Download,
  Plus,
  MoreVertical,
  RefreshCcw,
  Printer,
  Search,
} from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import PaymentsModals from "@/components/financial/payments/PaymentsModals";
import PaymentsFilterBar from "@/components/financial/payments/PaymentsFilterBar";
import { PaymentRecord as Payment } from "@/components/financial/types";
import { MOCK_PAYMENTS } from "@/components/financial/data";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCancelReceiptModalOpen, setIsCancelReceiptModalOpen] =
    useState(false);
  const [isPrintReceiptModalOpen, setIsPrintReceiptModalOpen] = useState(false);
  const [isServiceReceiptOpen, setIsServiceReceiptOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const handleAddPayment = (data: any) => {
    setPayments([data, ...payments]);
  };

  const handleEditPayment = (data: any) => {
    setPayments(payments.map((p) => (p.id === data.id ? data : p)));
  };

  const handleDeletePayment = () => {
    if (activePayment) {
      setPayments(payments.filter((p) => p.id !== activePayment.id));
      setActivePayment(null);
    }
    setIsDeleteModalOpen(false);
  };

  const [activeMethod, setActiveMethod] = useState("All");
  const [activePaymentStatus, setActivePaymentStatus] = useState("All");
  const [activeReceiptStatus, setActiveReceiptStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredPayments = payments.filter((payment) => {
    const matchesMethod =
      activeMethod === "All" ||
      payment.method === activeMethod ||
      (activeMethod === "Online P." && payment.method === "Online Payment");
    const matchesPaymentStatus =
      activePaymentStatus === "All" || payment.status === activePaymentStatus;
    const matchesReceiptStatus =
      activeReceiptStatus === "All" ||
      payment.receiptStatus === activeReceiptStatus ||
      (activeReceiptStatus === "Half Completed" &&
        payment.receiptStatus === "Half Printed");
    const matchesSearch =
      payment.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.teamMember.name.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesMethod &&
      matchesPaymentStatus &&
      matchesReceiptStatus &&
      matchesSearch
    );
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const hasActiveFilters =
    searchQuery !== "" ||
    activeMethod !== "All" ||
    activePaymentStatus !== "All" ||
    activeReceiptStatus !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveMethod("All");
    setActivePaymentStatus("All");
    setActiveReceiptStatus("All");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeMethod,
    activePaymentStatus,
    activeReceiptStatus,
    itemsPerPage,
    searchQuery,
  ]);

  const getMethodStyle = (method: Payment["method"]) => {
    switch (method) {
      case "Cash":
        return "bg-[#DCFCE7] text-[#16A34A]";
      case "Card Terminal":
        return "bg-[#CCFBF1] text-[#0D9488]";
      case "Gift Card":
        return "bg-[#E0E7FF] text-[#635BFF]"; // Light blue/purple
      case "Online Payment":
        return "bg-[#FEF3C7] text-[#D97706]";
    }
  };

  const getStatusStyle = (status: Payment["status"]) => {
    switch (status) {
      case "Fully Paid":
        return "bg-[#22C55E] text-white";
      case "Half Paid":
        return "bg-[#FBBF24] text-white";
      case "Not Paid":
        return "bg-[#F43F5E] text-white";
    }
  };

  const getReceiptStatusStyle = (status: Payment["receiptStatus"]) => {
    switch (status) {
      case "Completed":
        return "border border-[#22C55E] text-[#22C55E] bg-white";
      case "Half Printed":
        return "border border-[#FBBF24] text-[#FBBF24] bg-white";
      case "Not Issued":
        return "border border-[#F43F5E] text-[#F43F5E] bg-white";
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Filters Box (Expense Management style) */}
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
        {/* Row 1: Title and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1E293B] font-manrope">
              Payments
            </h1>
            <p className="text-[12px] text-[#64748B] mt-1">
              Manage client payment transactions, automations, and receipts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() =>
                router.push("/dashboard/financial/payments/automations")
              }
              className="bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              Set Automations
            </button>
            <button
              onClick={() =>
                router.push("/dashboard/financial/payments/import")
              }
              className="bg-white border border-[#635BFF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors whitespace-nowrap hover:bg-[#F1F5F9]"
            >
              Import Receipts
            </button>
            <button className="bg-[#E0E7FF] hover:bg-[#c7d2fe] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors whitespace-nowrap">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>

        <PaymentsFilterBar
          activeMethod={activeMethod}
          setActiveMethod={setActiveMethod}
          activePaymentStatus={activePaymentStatus}
          setActivePaymentStatus={setActivePaymentStatus}
          activeReceiptStatus={activeReceiptStatus}
          setActiveReceiptStatus={setActiveReceiptStatus}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Search Bar Row on Top of Table */}
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by client name, email, or receipt ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  ID
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Payment Date
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Client
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Team Member
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Method
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Status
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap font-manrope">
                  Receipt Issue
                </th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] text-center whitespace-nowrap font-manrope">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedPayments.map((payment, i) => (
                <tr
                  key={payment.id + i}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <span className="text-[#635BFF] font-medium text-[13px]">
                      {payment.id}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <span className="text-[#475569] font-medium text-[13px] whitespace-nowrap">
                      {payment.date}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div className="font-bold text-[#1E293B] text-[13px] whitespace-nowrap">
                      {payment.client.name}
                    </div>
                    <div className="text-[#94A3B8] text-[11px] font-medium mt-0.5 whitespace-nowrap">
                      {payment.client.email}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div className="font-bold text-[#1E293B] text-[13px] whitespace-nowrap">
                      {payment.teamMember.name}
                    </div>
                    <div className="text-[#94A3B8] text-[11px] font-medium mt-0.5 whitespace-nowrap">
                      {payment.teamMember.email}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap ${getMethodStyle(payment.method)}`}
                      >
                        {payment.method === "Gift Card"
                          ? "Gif Card"
                          : payment.method}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${getStatusStyle(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${getReceiptStatusStyle(payment.receiptStatus)}`}
                      >
                        {payment.receiptStatus}
                      </span>
                      {payment.receiptStatus === "Not Issued" && (
                        <button className="bg-[#C4B5FD] hover:bg-[#A78BFA] text-white px-3 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap">
                          Issue Receipt
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center relative">
                    <button
                      onClick={() =>
                        setOpenActionMenuId(
                          openActionMenuId === payment.id + i
                            ? null
                            : payment.id + i,
                        )
                      }
                      className="text-[#1E293B] hover:bg-[#F1F5F9] p-1.5 rounded-lg transition-colors inline-flex items-center justify-center"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openActionMenuId === payment.id + i && (
                      <div className="absolute right-10 top-10 bg-white border border-[#E2E8F0] shadow-lg rounded-lg py-2 w-44 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <Link
                          href={`/dashboard/financial/payments/${payment.id}`}
                          onClick={(e) => {
                            setOpenActionMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3"
                        >
                          <Eye className="w-4 h-4 text-[#635BFF]" />
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            setActivePayment(payment);
                            setIsRefundModalOpen(true);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3"
                        >
                          <RefreshCcw className="w-4 h-4 text-[#FBBF24]" />
                          Refund
                        </button>
                        <button
                          onClick={() => {
                            setActivePayment(payment);
                            setIsPrintReceiptModalOpen(true);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center gap-3"
                        >
                          <Printer className="w-4 h-4 text-[#64748B]" />
                          Print Receipt
                        </button>
                      </div>
                    )}
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
          itemName="payments"
          onPageChange={setCurrentPage}
        />
      </div>

      <PaymentsModals
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isRefundModalOpen={isRefundModalOpen}
        setIsRefundModalOpen={setIsRefundModalOpen}
        isCancelReceiptModalOpen={isCancelReceiptModalOpen}
        setIsCancelReceiptModalOpen={setIsCancelReceiptModalOpen}
        isPrintReceiptModalOpen={isPrintReceiptModalOpen}
        setIsPrintReceiptModalOpen={setIsPrintReceiptModalOpen}
        isServiceReceiptOpen={isServiceReceiptOpen}
        setIsServiceReceiptOpen={setIsServiceReceiptOpen}
        activePayment={activePayment}
        onAddPayment={handleAddPayment}
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
      />
    </div>
  );
}
