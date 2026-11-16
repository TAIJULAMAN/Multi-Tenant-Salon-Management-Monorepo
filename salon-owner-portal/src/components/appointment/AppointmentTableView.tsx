import React from "react";
import Image from "next/image";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import RowActions from "./RowActions";
import ExpandedRowDetail from "./ExpandedRowDetail";
import StatusBadge from "./StatusBadge";
import { Appointment, statusStyles } from "./data";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import AppointmentTableToolbar from "./AppointmentTableToolbar";
import EditAppointmentModal from "./calander-view/EditAppointmentModal";
import DeleteAppointmentModal from "./DeleteAppointmentModal";
import { CalAppointment } from "@/@types/salon-owner/CalAppointment.type";
import { useState } from "react";

import { AppointmentTableViewProps } from "./types";

export default function AppointmentTableView({
  setSearchOpen,
  activePeriod,
  setActivePeriod,
  paginated,
  currentPage,
  itemsPerPage,
  expandedRow,
  handleChevronClick,
  filtered,
  totalPages,
  setCurrentPage,
  dateLabel,
  handleNavigate,
  selectedSearchMember,
  onClearSearch,
  selectedTeamMembers,
  setSelectedTeamMembers,
  currentDate,
  setCurrentDate,
}: AppointmentTableViewProps) {
  const [editingRow, setEditingRow] = useState<Appointment | null>(null);
  const [deleteRow, setDeleteRow] = useState<Appointment | null>(null);

  const getEditingAppts = (): CalAppointment[] | null => {
    if (!editingRow) return null;
    let date = new Date();
    let startTime = "12:00";
    let endTime = "13:00";
    const dateMatch = editingRow.scheduledDate.match(/^(.*?)\s*\((.*?)\s*-\s*(.*?)\)/);
    if (dateMatch) {
      date = new Date(dateMatch[1]);
      // The modal uses 24h format HH:mm. We need to convert from 12h to 24h.
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.trim().split(" ");
        let [h, m] = time.split(":");
        let hour = parseInt(h, 10);
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${m}`;
      };
      startTime = parseTime(dateMatch[2]);
      endTime = parseTime(dateMatch[3]);
    }

    return [{
      id: editingRow.id,
      date,
      startTime,
      endTime,
      clientName: editingRow.clientName,
      clientPhone: editingRow.clientPhone,
      clientEmail: "shah@example.com",
      service: editingRow.service,
      employeeId: "1",
      employeeName: "Shah Aman",
      status: editingRow.status,
      duration: "60m",
      price: editingRow.price,
    }];
  };

  const editingAppts = getEditingAppts();

  return (
    <div className="bg-white rounded-xl border border-[#EFF4FA] overflow-hidden p-5">
      <AppointmentTableToolbar
        setSearchOpen={setSearchOpen}
        selectedSearchMember={selectedSearchMember}
        onClearSearch={onClearSearch}
        dateLabel={dateLabel}
        handleNavigate={handleNavigate}
        activePeriod={activePeriod}
        setActivePeriod={setActivePeriod}
        selectedTeamMembers={selectedTeamMembers}
        setSelectedTeamMembers={setSelectedTeamMembers}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <div className="border border-[#E0E6EB] rounded-[12px] overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-[#F3F3FF] border-b border-[#E0E6EB]">
              {[
                "ID",
                "Client",
                "Service",
                "Scheduled Date",
                "Price",
                "Status",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-5 border-r border-[#E0E6EB] last:border-r-0 text-sm font-semibold font-manrope text-[#29343D] text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + i;
              const isExpanded = expandedRow === globalIndex;
              return (
                <React.Fragment key={globalIndex}>
                  <tr
                    className={`border-b border-[#E0E6EB] transition-colors ${isExpanded ? "bg-[#F7F7FF]" : "hover:bg-[#FAFBFF]"
                      } ${isExpanded ? "" : "last:border-b-0"}`}
                  >
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <span className="text-sm font-semibold font-manrope text-[#635BFF]">
                        {row.id}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <div className="flex items-center gap-3">
                        {row?.clientAvatar ? (
                          <Image
                            src={row?.clientAvatar}
                            alt={row.clientName}
                            width={36}
                            height={36}
                            className="rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-[36px] h-[36px] rounded-xl bg-[#EEEEFF] flex items-center justify-center">
                            <span className="text-[#635BFF] font-semibold">
                              {row.clientName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold font-manrope text-[#29343D]">
                            {row.clientName}
                          </p>
                          <p className="text-xs font-manrope text-[#98A4AE]">
                            {row.clientPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <span className="text-sm font-manrope text-[#29343D]">
                        {row.service}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <span className="text-sm font-manrope text-[#526B7A] whitespace-nowrap">
                        {row.scheduledDate}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <span className="text-sm font-manrope text-[#29343D]">
                        {row.price}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-[#E0E6EB]">
                      <StatusBadge
                        status={row.status}
                        statusStyles={statusStyles}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-center">
                        <RowActions onEdit={() => setEditingRow(row)} onDelete={() => setDeleteRow(row)} />
                        <button
                          onClick={() => handleChevronClick(globalIndex)}
                          className="p-1.5 hover:bg-[#F4F6FA] rounded-lg cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-[#635BFF]" />
                          ) : (
                            <ChevronDown size={16} className="text-[#635BFF]" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && <ExpandedRowDetail row={row} />}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {editingAppts && (
        <EditAppointmentModal
          memberId={editingAppts[0].employeeId}
          startTime={editingAppts[0].startTime}
          endTime={editingAppts[0].endTime}
          date={editingAppts[0].date}
          teamMembers={[
            { id: "1", name: "Shah Aman", avatar: "/avatar/icon1.png" },
            { id: "2", name: "Hasan Siam", avatar: "/avatar/icon2.png" },
            { id: "3", name: "Hridoy Khan", avatar: "/avatar/icon3.png" },
          ]}
          editingAppts={editingAppts}
          onClose={() => setEditingRow(null)}
          onUpdate={(appts) => {
            setEditingRow(null);
          }}
        />
      )}

      {deleteRow && (
        <DeleteAppointmentModal
          onClose={() => setDeleteRow(null)}
          onConfirm={() => {
            setDeleteRow(null);
          }}
        />
      )}
    </div>
  );
}
