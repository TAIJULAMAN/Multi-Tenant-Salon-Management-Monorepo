"use client";
import React, { useState } from "react";
import { allAppointments, recentMembers, Status } from "@/components/appointment/data";
import CalendarView from "@/components/appointment/Calendarview";
import AppointmentTableView from "@/components/appointment/AppointmentTableView";
import SearchMemberModal from "@/components/appointment/SearchMemberModal";
import AppointmentHeader from "@/components/appointment/AppointmentHeader";

export default function AppointmentPage() {
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const [activeView, setActiveView] = useState<"calendar" | "table">(
    "calendar",
  );
  const [activePeriod, setActivePeriod] = useState<"Month" | "Week" | "Day">(
    "Day",
  );
  const [currentDate, setCurrentDate] = useState(
    new Date("2025-08-05T00:00:00"),
  );
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchMember, setSelectedSearchMember] = useState<{ name: string, phone: string, clientAvatar: string } | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  const handleNavigate = (dir: number) => {
    const d = new Date(currentDate);
    if (activePeriod === "Day") d.setDate(d.getDate() + dir);
    else if (activePeriod === "Week") d.setDate(d.getDate() + 7 * dir);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const dateLabel = (() => {
    if (activePeriod === "Day") {
      return currentDate
        .toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "2-digit",
        })
        .replace(",", "");
    }
    if (activePeriod === "Week") {
      const s = new Date(currentDate);
      s.setDate(s.getDate() - s.getDay());
      const e = new Date(s);
      e.setDate(e.getDate() + 6);
      return `${s.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  })();

  const filtered = allAppointments.filter((a) => {
    if (activeStatus !== "All" && a.status !== activeStatus) return false;
    if (selectedSearchMember && a.clientName !== selectedSearchMember.name) return false;

    if (selectedTeamMembers.length > 0 && !selectedTeamMembers.includes("all")) {
      if (!selectedTeamMembers.includes(a.clientName)) return false;
    }

    const datePart = a.scheduledDate.split("(")[0].trim();
    const apptDate = new Date(datePart);

    if (activePeriod === "Day") {
      return (
        apptDate.getFullYear() === currentDate.getFullYear() &&
        apptDate.getMonth() === currentDate.getMonth() &&
        apptDate.getDate() === currentDate.getDate()
      );
    } else if (activePeriod === "Week") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return apptDate >= start && apptDate <= end;
    } else {
      return (
        apptDate.getFullYear() === currentDate.getFullYear() &&
        apptDate.getMonth() === currentDate.getMonth()
      );
    }
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleChevronClick = (globalIndex: number) => {
    setExpandedRow((prev) => (prev === globalIndex ? null : globalIndex));
  };


  return (
    <>
      <div className="min-h-screen bg-[#F4F6FA] font-manrope space-y-4">
        {searchOpen && (
          <SearchMemberModal
            recentMembers={recentMembers}
            onClose={() => setSearchOpen(false)}
            onSelect={(member) => {
              setSelectedSearchMember(member);
              setCurrentPage(1);
            }}
          />
        )}

        <AppointmentHeader
          activeView={activeView}
          setActiveView={setActiveView}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          setCurrentPage={setCurrentPage}
          setExpandedRow={setExpandedRow}
        />

        {/* Calendar View */}
        {activeView === "calendar" && <CalendarView />}

        {/* Table Card */}
        {activeView === "table" && (
          <AppointmentTableView
            setSearchOpen={setSearchOpen}
            activePeriod={activePeriod}
            setActivePeriod={setActivePeriod}
            paginated={paginated}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            expandedRow={expandedRow}
            handleChevronClick={handleChevronClick}
            filtered={filtered}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            dateLabel={dateLabel}
            handleNavigate={handleNavigate}
            selectedSearchMember={selectedSearchMember}
            onClearSearch={() => {
              setSelectedSearchMember(null);
              setCurrentPage(1);
            }}
            selectedTeamMembers={selectedTeamMembers}
            setSelectedTeamMembers={setSelectedTeamMembers}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        )}
      </div>
    </>)
}
