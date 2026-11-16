"use client";

import React, { useState } from "react";
import SearchMemberModal from "./SearchMemberModal";
import CalendarView from "./Calendarview";
import AppointmentViewHeaderCard from "./AppointmentViewHeaderCard";
import AppointmentTableCard from "./AppointmentTableCard";
import { allAppointments, recentMembers, Status } from "./data";

export default function AppoinmentTableviewContent() {
  const [activeView, setActiveView] = useState<"calendar" | "table">("calendar");
  const [activePeriod, setActivePeriod] = useState<"Month" | "Week" | "Day">("Month");
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  const filtered = allAppointments.filter(
    (a) => activeStatus === "All" || a.status === activeStatus,
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleChevronClick = (globalIndex: number) => {
    setExpandedRow((prev) => (prev === globalIndex ? null : globalIndex));
  };

  const handleStatusChange = (status: Status | "All") => {
    setActiveStatus(status);
    setCurrentPage(1);
    setExpandedRow(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-manrope space-y-4">
      {searchOpen && (
        <SearchMemberModal
          recentMembers={recentMembers}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {/* Header Card */}
      <AppointmentViewHeaderCard
        activeView={activeView}
        setActiveView={setActiveView}
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />

      {/* Calendar View */}
      {activeView === "calendar" && <CalendarView />}

      {/* Table Card */}
      {activeView === "table" && (
        <AppointmentTableCard
          selectedTeamMembers={selectedTeamMembers}
          setSelectedTeamMembers={setSelectedTeamMembers}
          onOpenSearch={() => setSearchOpen(true)}
          activePeriod={activePeriod}
          setActivePeriod={setActivePeriod}
          paginated={paginated}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          expandedRow={expandedRow}
          onToggleRow={handleChevronClick}
        />
      )}
    </div>
  );
}
