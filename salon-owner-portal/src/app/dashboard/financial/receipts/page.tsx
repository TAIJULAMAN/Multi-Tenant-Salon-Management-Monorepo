"use client";

import React, { useState, useEffect } from "react";
import { ReceiptRecord } from "@/components/financial/types";
import { MOCK_RECEIPTS } from "@/components/financial/data";
import { ReceiptsFilterBar } from "@/components/financial/receipts/ReceiptsFilterBar";
import { ReceiptsTable } from "@/components/financial/receipts/ReceiptsTable";
import { ReceiptsModals } from "@/components/financial/receipts/ReceiptsModals";

export default function ReceiptsPage() {
  const [payments, setPayments] = useState<ReceiptRecord[]>(MOCK_RECEIPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMethod, setActiveMethod] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal and Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<ReceiptRecord | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeMethod, searchQuery, dateRange]);

  const handleAddPayment = (data: any) => {
    setPayments((prev) => [data, ...prev]);
  };

  const handleEditPayment = (data: any) => {
    setPayments((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    setIsEditModalOpen(false);
  };

  const handleDeletePayment = () => {
    if (activePayment) {
      setPayments((prev) =>
        prev.map((p) => (p.id === activePayment.id ? { ...p, status: "Canceled" } : p))
      );
      setActivePayment(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      activeMethod === "All" ||
      payment.method === activeMethod ||
      (activeMethod === "Online P." && payment.method === "Online Payment");

    return matchesSearch && matchesMethod;
  });

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Filters */}
      <ReceiptsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeMethod={activeMethod}
        onMethodChange={setActiveMethod}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onAddReceipt={() => setIsAddModalOpen(true)}
      />

      {/* Main Table Container */}
      <ReceiptsTable
        receipts={paginatedPayments}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        openActionMenuId={openActionMenuId}
        onToggleActionMenu={setOpenActionMenuId}
        onViewReceipt={(receipt) => {
          setActivePayment(receipt);
          setIsViewModalOpen(true);
        }}
        onEditReceipt={(receipt) => {
          setActivePayment(receipt);
          setIsEditModalOpen(true);
        }}
        onCancelReceipt={(receipt) => {
          setActivePayment(receipt);
          setIsDeleteModalOpen(true);
        }}
        onDownloadReceipt={(receipt) => {
          alert(`Downloading receipt ${receipt.id}...`);
        }}
        onPrintReceipt={(receipt) => {
          window.print();
        }}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <ReceiptsModals
        isAddOpen={isAddModalOpen}
        onCloseAdd={() => setIsAddModalOpen(false)}
        onSaveAdd={handleAddPayment}
        isViewOpen={isViewModalOpen}
        onCloseView={() => setIsViewModalOpen(false)}
        isEditOpen={isEditModalOpen}
        onCloseEdit={() => setIsEditModalOpen(false)}
        onSaveEdit={handleEditPayment}
        isDeleteOpen={isDeleteModalOpen}
        onCloseDelete={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeletePayment}
        activePayment={activePayment}
      />
    </div>
  );
}
