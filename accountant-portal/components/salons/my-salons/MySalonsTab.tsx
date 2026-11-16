"use client";

import React, { useState } from "react";
import CustomAddButton from "@/components/customComponent/CustomAddButton";
import SalonsFilters from "./SalonsFilters";
import SalonsTable from "./SalonsTable";
import Pagination from "@/components/customComponent/Pagination";
import { salonsData } from "../data";
import type { SalonInfo } from "../types";
import InviteSalonSuccessModal from "@/components/modal/SuccessModal";
import InviteSalonModal from "@/components/modal/invite-salon-modal/InviteSalonModal";
import ViewSalonModal from "@/components/modal/view-salon-modal/ViewSalonModal";

export default function MySalonsTab() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<SalonInfo | null>(null);

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSourceChange = (val: string) => {
    setSourceFilter(val);
    setCurrentPage(1);
  };

  const handlePaymentChange = (val: string) => {
    setPaymentFilter(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const filteredSalons = salonsData.filter((salon) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Connected" && salon.paymentStatus === "In order") ||
      (statusFilter === "Pending" && salon.paymentStatus === "Late") ||
      salon.badge.toLowerCase() === statusFilter.toLowerCase();

    const matchesSource =
      sourceFilter === "All" ||
      (sourceFilter === "Invited by Me" && salon.referral !== "-") ||
      (sourceFilter === "Others" && salon.referral === "-");

    const matchesPayment =
      paymentFilter === "All Payments" ||
      (paymentFilter === "Paid" && salon.paymentStatus === "In order") ||
      (paymentFilter === "Pending" && salon.paymentStatus !== "In order") ||
      (paymentFilter === "Overdue" && salon.paymentStatus !== "In order") ||
      salon.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      salon.name.toLowerCase().includes(searchLower) ||
      salon.ownerName.toLowerCase().includes(searchLower) ||
      salon.city.toLowerCase().includes(searchLower) ||
      salon.email.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSource && matchesPayment && matchesSearch;
  });

  const itemsPerPage = 5;
  const totalItems = filteredSalons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSalons = filteredSalons.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-slate-800">My Salons</h2>
            <CustomAddButton
              label="Invite New Salon"
              onClick={() => setIsInviteModalOpen(true)}
            />
          </div>

          <SalonsFilters
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            sourceFilter={sourceFilter}
            setSourceFilter={handleSourceChange}
            paymentFilter={paymentFilter}
            setPaymentFilter={handlePaymentChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />

          <SalonsTable
            salons={paginatedSalons}
            onView={(salon) => {
              setSelectedSalon(salon);
              setIsViewModalOpen(true);
            }}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            itemsName="items"
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <InviteSalonModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          setIsInviteModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />

      <InviteSalonSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="The invitation was sent successfully."
      />

      <ViewSalonModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        salon={selectedSalon}
      />
    </>
  );
}
