"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Check, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EditAppointmentModal from "@/components/appointment/calander-view/EditAppointmentModal";
import ClientProfileConfirmModal from "./ClientProfileConfirmModal";
import { AgendaAppointmentsProps } from "./types";

export default function AgendaAppointments({
  appointments: initialAppointments,
}: AgendaAppointmentsProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openDateDropdown, setOpenDateDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Sep 16, 2025");
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);

  // Status dropdown state
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);

  // Propic modal confirmation
  const [confirmClient, setConfirmClient] = useState<{
    id: string;
    name: string;
    phone?: string;
    photo?: string;
  } | null>(null);

  const handleEditClick = (appointmentId: string) => {
    setEditingAppointmentId(appointmentId);
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: newStatus } : app))
    );
    setStatusDropdownId(null);
  };

  const dateOptions = [
    "Sep 16, 2025",
    "Sep 17, 2025",
    "Sep 18, 2025",
    "Sep 19, 2025",
  ];

  const statusOptions = ["Booked", "Confirmed", "Cancelled"];

  const getStatusBadgeStyle = (status: string) => {
    if (status === "Confirmed")
      return "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20 hover:bg-[#bbf7d0]";
    if (status === "Cancelled")
      return "bg-[#FFE4E6] text-[#F43F5E] border border-[#F43F5E]/20 hover:bg-[#fecdd3]";
    return "bg-[#DDDBFF] text-[#635BFF] border border-[#635BFF]/20 hover:bg-[#c7d2fe]";
  };

  const currentEditingAppt = appointments.find((a) => a.id === editingAppointmentId);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-sm w-full font-manrope">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3.5">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#1E293B]">
            Agenda - Appointments
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDateDropdown(!openDateDropdown)}
              className="px-3 sm:px-4 py-2 flex items-center gap-2 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{selectedDate}</span>
              <ChevronDown width={14} height={14} className="text-gray-400" />
            </button>

            {openDateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setOpenDateDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1 animate-in fade-in duration-150">
                  {dateOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item);
                        setOpenDateDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 text-[#1E293B] font-medium transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link
            href="/dashboard/appointment"
            className="px-3.5 sm:px-4 py-2 rounded-xl border border-[#635BFF] text-[#635BFF] text-xs sm:text-sm font-bold hover:bg-[#EEF2FF] transition-colors cursor-pointer inline-flex items-center justify-center whitespace-nowrap"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Symmetric Table Box */}
      <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
        {/* Table Header - Symmetrical across the entire width */}
        <div className="hidden sm:grid sm:grid-cols-12 items-center bg-[#F8FAFC] px-4 sm:px-6 py-3.5 text-[#64748B] text-xs font-bold border-b border-gray-200">
          <span className="col-span-4 md:col-span-5">Client</span>
          <span className="col-span-3 md:col-span-3">Time</span>
          <span className="col-span-3 md:col-span-2">Status</span>
          <span className="col-span-2 md:col-span-2 text-right">Actions</span>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
          {appointments.map((appointment) => {
            const isOpen = openId === appointment.id;
            const isStatusOpen = statusDropdownId === appointment.id;

            return (
              <div
                key={appointment.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Mobile View (< sm): Compact intuitive card */}
                <div className="sm:hidden p-3.5 flex flex-col gap-3">
                  {/* Top Line: Avatar + Client Name + Time badge */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmClient({
                            id: appointment.clientId || appointment.id,
                            name: appointment.name,
                            phone: appointment.phone,
                            photo: appointment.photo,
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-[#635BFF] transition-all shrink-0 overflow-hidden"
                        title="View client details"
                      >
                        <Image
                          src={appointment.photo || ""}
                          alt={appointment.name}
                          width={44}
                          height={44}
                          className="object-cover w-full h-full"
                        />
                      </button>

                      <div className="min-w-0">
                        <p className="font-bold text-[#1E293B] text-xs sm:text-sm truncate">
                          {appointment.name}
                        </p>
                        <p className="text-[#94A3B8] text-[11px] font-medium truncate">
                          {appointment.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg shrink-0">
                      <Clock size={12} className="text-[#94A3B8]" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {/* Bottom Line: Status on Left, Actions on Right */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 relative">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setStatusDropdownId(isStatusOpen ? null : appointment.id)
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs whitespace-nowrap ${getStatusBadgeStyle(
                          appointment.status
                        )}`}
                      >
                        <span>{appointment.status}</span>
                        <ChevronDown size={12} />
                      </button>

                      {isStatusOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setStatusDropdownId(null)}
                          />
                          <div className="absolute left-0 mt-1 w-36 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1 animate-in fade-in duration-150">
                            {statusOptions.map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(appointment.id, st)
                                }
                                className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                                  appointment.status === st
                                    ? "text-[#635BFF]"
                                    : "text-[#475569]"
                                }`}
                              >
                                <span>{st}</span>
                                {appointment.status === st && <Check size={12} />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(appointment.id)}
                        className="bg-[#EFF4FA] hover:bg-[#e0eaf5] p-2 rounded-lg cursor-pointer transition-colors text-[#46CAEB]"
                        title="Edit appointment"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : appointment.id)}
                        className="text-[#635BFF] p-1.5 cursor-pointer hover:bg-[#EEF2FF] rounded-lg transition-colors"
                        title="Toggle details"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tablet / Desktop View (>= sm): Symmetrical, balanced 4-column layout */}
                <div className="hidden sm:grid sm:grid-cols-12 sm:items-center px-4 sm:px-6 py-4 gap-2">
                  {/* Client Info */}
                  <div className="col-span-4 md:col-span-5 flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmClient({
                          id: appointment.clientId || appointment.id,
                          name: appointment.name,
                          phone: appointment.phone,
                          photo: appointment.photo,
                        })
                      }
                      className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-pink-100 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-[#635BFF] transition-all shrink-0 overflow-hidden"
                      title="View client details"
                    >
                      <Image
                        src={appointment.photo || ""}
                        alt={appointment.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </button>

                    <div className="min-w-0">
                      <p className="font-bold text-[#1E293B] text-xs sm:text-sm truncate">
                        {appointment.name}
                      </p>
                      <p className="text-[#94A3B8] text-[11px] font-medium truncate">
                        {appointment.phone}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="col-span-3 md:col-span-3 text-[#64748B] text-xs sm:text-sm font-semibold truncate">
                    <span>{appointment.time}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 md:col-span-2 flex items-center relative">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setStatusDropdownId(isStatusOpen ? null : appointment.id)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs whitespace-nowrap ${getStatusBadgeStyle(
                          appointment.status
                        )}`}
                      >
                        <span>{appointment.status}</span>
                        <ChevronDown size={12} />
                      </button>

                      {isStatusOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setStatusDropdownId(null)}
                          />
                          <div className="absolute left-0 mt-1 w-36 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1 animate-in fade-in duration-150">
                            {statusOptions.map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(appointment.id, st)
                                }
                                className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                                  appointment.status === st
                                    ? "text-[#635BFF]"
                                    : "text-[#475569]"
                                }`}
                              >
                                <span>{st}</span>
                                {appointment.status === st && <Check size={12} />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions (Pushed to far right edge) */}
                  <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClick(appointment.id)}
                      className="bg-[#EFF4FA] hover:bg-[#e0eaf5] p-2 rounded-lg cursor-pointer transition-colors text-[#46CAEB]"
                      title="Edit appointment"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : appointment.id)}
                      className="text-[#635BFF] p-1.5 cursor-pointer hover:bg-[#EEF2FF] rounded-lg transition-colors"
                      title="Toggle details"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Section */}
                {isOpen && (
                  <div className="px-4 sm:px-8 pb-5 pt-3 bg-slate-50/70 border-t border-gray-100">
                    <h3 className="text-center text-[#1E293B] font-bold mb-4 text-xs sm:text-sm">
                      Booking Order
                    </h3>
                    <div className="w-full overflow-x-auto pb-1">
                      <div className="relative flex justify-between items-start min-w-[240px] max-w-[340px] mx-auto">
                        <div className="absolute top-4 left-[16.67%] right-[16.67%] h-[2px] bg-[#CBD5E1]" />
                        {[1, 2, 3].map((step) => {
                          const isActive = step === 1;
                          return (
                            <div
                              key={step}
                              className="relative z-10 flex flex-col items-center w-1/3"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  isActive
                                    ? "bg-[#FFF9E5] text-[#D97706] border border-[#FDE68A]"
                                    : "bg-gray-300 text-white"
                                }`}
                              >
                                {step}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Propic confirmation modal */}
      <ClientProfileConfirmModal
        isOpen={Boolean(confirmClient)}
        onClose={() => setConfirmClient(null)}
        client={confirmClient}
      />

      {/* Edit modal */}
      {editingAppointmentId && (
        <EditAppointmentModal
          memberId="1"
          startTime={currentEditingAppt?.time || "12:00"}
          endTime="12:45"
          date={new Date(selectedDate)}
          teamMembers={[{ id: "1", name: "Default Team Member", avatar: "" }]}
          editingAppts={[]}
          onClose={() => setEditingAppointmentId(null)}
          onUpdate={(data) => {
            console.log("Updated Appointment", data);
            setEditingAppointmentId(null);
          }}
        />
      )}
    </div>
  );
}
