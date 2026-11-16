"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Pagination from "@/components/customComponent/Pagination";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import WaiverTabs from "@/components/waivers/WaiverTabs";
import WaiversTable from "@/components/waivers/WaiversTable";
import { WaiverFilterBar } from "@/components/waivers/WaiverFilterBar";
import EditWaiverModal from "@/components/waivers/EditWaiverModal";
import DeleteWaiverModal from "@/components/waivers/DeleteWaiverModal";
import SignNowSendToModal from "@/components/waivers/SignNowSendToModal";
import AssignWaiverModal from "@/components/waivers/AssignWaiverModal";
import { mockWaivers } from "@/components/waivers/data";
import { WaiverItem } from "@/components/waivers/types";

export default function WaiversPage() {
  const [activeTab, setActiveTab] = useState("Waiver Templates");
  const [waivers, setWaivers] = useState<WaiverItem[]>(mockWaivers);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Client" | "Employee">("All");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [dateFilter, setDateFilter] = useState("All Dates");

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSignNowOpen, setIsSignNowOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isAssignEmployeeOpen, setIsAssignEmployeeOpen] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<WaiverItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setSelectedPerson("");
    setDateFilter("All Dates");
    setCurrentPage(1);
  };

  // Filter based on activeTab, search, person, and date
  const filteredWaivers = waivers.filter((w) => {
    if (activeTab === "Waiver Templates" && w.type !== "template") return false;
    if (activeTab === "Waiver Signed" && w.type !== "signed") return false;

    if (search) {
      const q = search.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchPerson =
        w.personName?.toLowerCase().includes(q) ||
        w.signedBy?.toLowerCase().includes(q);
      if (!matchName && !matchPerson) return false;
    }

    if (roleFilter !== "All" && w.targetRole && w.targetRole !== roleFilter) {
      return false;
    }

    if (selectedPerson) {
      if (w.personName !== selectedPerson && w.signedBy !== selectedPerson) {
        return false;
      }
    }

    if (dateFilter !== "All Dates") {
      const waiverDate = w.dateSigned || w.lastUpdate || w.createdDate || "";
      if (dateFilter === "Today") {
        if (!waiverDate.includes("Nov 04") && !waiverDate.includes("Today") && !waiverDate.includes("1h")) {
          return false;
        }
      } else if (dateFilter === "Last 7 Days") {
        if (!waiverDate.includes("Nov") && !waiverDate.includes("Oct 31") && !waiverDate.includes("Oct 30")) {
          return false;
        }
      } else if (dateFilter === "November 2026") {
        if (!waiverDate.includes("Nov")) return false;
      } else if (dateFilter === "October 2026") {
        if (!waiverDate.includes("Oct")) return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredWaivers.length / itemsPerPage) || 1;
  const paginatedWaivers = filteredWaivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleOpenEdit = (waiver: WaiverItem) => {
    setSelectedWaiver(waiver);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (waiver: WaiverItem) => {
    setSelectedWaiver(waiver);
    setIsDeleteOpen(true);
  };

  const handleOpenSignNow = (waiver: WaiverItem) => {
    setSelectedWaiver(waiver);
    setIsSignNowOpen(true);
  };

  const handleOpenAssign = (waiver: WaiverItem) => {
    setSelectedWaiver(waiver);
    setIsAssignOpen(true);
  };

  const handleOpenAssignEmployee = (waiver: WaiverItem) => {
    setSelectedWaiver(waiver);
    setIsAssignEmployeeOpen(true);
  };

  const handleEditWaiver = (updatedWaiver: WaiverItem) => {
    setWaivers(waivers.map((w) => (w.id === updatedWaiver.id ? updatedWaiver : w)));
  };

  const handleDeleteWaiver = () => {
    if (selectedWaiver) {
      setWaivers(waivers.filter((w) => w.id !== selectedWaiver.id));
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <CustomPageHeader
        title="Waivers"
        action={
          <Link
            href="/dashboard/waivers/add"
            className="bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Waiver
          </Link>
        }
      />

      <WaiverTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        tabs={["Waiver Templates", "Waiver Signed"]}
      />

      {/* Filter Bar for both Waiver Templates and Waiver Signed */}
      <WaiverFilterBar
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        setRoleFilter={(val) => {
          setRoleFilter(val);
          setCurrentPage(1);
        }}
        selectedPerson={selectedPerson}
        setSelectedPerson={(val) => {
          setSelectedPerson(val);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        setDateFilter={(val) => {
          setDateFilter(val);
          setCurrentPage(1);
        }}
        onClear={handleClearFilters}
      />

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-visible">
        <WaiversTable
          activeTab={activeTab}
          paginatedWaivers={paginatedWaivers}
          openMenuId={openMenuId}
          toggleMenu={toggleMenu}
          setOpenMenuId={setOpenMenuId}
          handleOpenEdit={handleOpenEdit}
          handleOpenSignNow={handleOpenSignNow}
          handleOpenAssign={handleOpenAssign}
          handleOpenAssignEmployee={handleOpenAssignEmployee}
          handleOpenDelete={handleOpenDelete}
        />

        {filteredWaivers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredWaivers.length}
            itemsPerPage={itemsPerPage}
            itemsName="waivers"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <EditWaiverModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        waiver={selectedWaiver}
        onSave={handleEditWaiver}
      />
      <DeleteWaiverModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        waiver={selectedWaiver}
        onConfirm={handleDeleteWaiver}
      />
      <SignNowSendToModal
        isOpen={isSignNowOpen}
        onClose={() => setIsSignNowOpen(false)}
        waiver={selectedWaiver}
      />
      <AssignWaiverModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        waiver={selectedWaiver}
        assignType="clients"
      />
      <AssignWaiverModal
        isOpen={isAssignEmployeeOpen}
        onClose={() => setIsAssignEmployeeOpen(false)}
        waiver={selectedWaiver}
        assignType="employees"
      />
    </div>
  );
}
