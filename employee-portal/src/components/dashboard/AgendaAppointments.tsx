"use client";

import { useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EditAppointmentModal from "@/components/appointment/calander-view/EditAppointmentModal";

import { AgendaAppointmentsProps } from "./types";

export default function AgendaAppointments({
  appointments,
}: AgendaAppointmentsProps) {
  const [openId, setOpenId] = useState<string | null>("1");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Sep 15, 2026");
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);

  const handleEditClick = (appointmentId: string) => {
    setEditingAppointmentId(appointmentId);
  };

  const options = [
    "Sep 15, 2026",
    "Sep 16, 2026",
    "Sep 17, 2026",
    "Sep 18, 2026",
  ];
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#E2E8F0] w-full font-manrope">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#1E293B]">
            Agenda - Appointments
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="px-3 py-1.5 flex items-center gap-2 rounded-lg border border-[#E2E8F0] text-[#1E293B] text-[12px] font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {selected}
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E2E8F0] rounded-xl shadow-md z-20 py-1">
                {options.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelected(item);
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-medium text-[#1E293B] hover:bg-gray-50 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div> */}

          <Link
            href="/appointment"
            className="px-4 py-1.5 rounded-lg border border-[#635BFF] text-[#635BFF] text-[12px] font-bold hover:bg-[#EEF2FF] transition-colors cursor-pointer"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-3 bg-[#F8F9FE] rounded-t-xl px-6 py-3 text-[#1E293B] text-xs font-bold border border-[#E2E8F0] border-b-0">
        <span>Client</span>
        <span>Client</span>
        <span className="text-right sm:text-left">Status</span>
      </div>

      {/* Scrollable Body */}
      <div className="max-h-[500px] overflow-y-auto bg-white sm:rounded-b-xl border border-[#E2E8F0]">
        {appointments.map((appointment) => {
          const isOpen = openId === appointment.id;

          return (
            <div
              key={appointment.id}
              className="border-t border-[#E2E8F0] first:border-t-0"
            >
              {/* Main Row */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-0 sm:items-center px-4 sm:px-6 py-4">
                {/* Client */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/clients/${appointment.clientId || appointment.id}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity overflow-hidden shrink-0">
                      <Image
                        src={appointment.photo || "/avatar/icon1.png"}
                        alt={appointment.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div>
                    <p className="font-bold text-[#1E293B] text-xs">
                      {appointment.name}
                    </p>
                    <p className="text-[#94A3B8] text-[11px] font-medium mt-0.5">
                      {appointment.phone}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="text-[#64748B] text-xs font-medium flex items-center justify-between sm:block">
                  <span className="sm:hidden font-medium text-gray-700">
                    Time
                  </span>
                  <span>{appointment.time}</span>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#635BFF] text-xs font-bold">
                      {appointment.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button
                      onClick={() => handleEditClick(appointment.id)}
                      className="bg-[#F8FAFC] border border-[#E2E8F0] p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <Pencil size={14} className="text-[#635BFF]" />
                    </button>

                    <button
                      onClick={() => setOpenId(isOpen ? null : appointment.id)}
                      className="text-[#635BFF] p-1 cursor-pointer"
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

              {/* Expanded Section */}
              {isOpen && (
                <div className="px-4 sm:px-8 pb-6 pt-2 bg-[#FAFBFD] border-t border-[#F1F5F9]">
                  <h3 className="text-center text-[#1E293B] font-bold mb-4 text-xs">
                    Booking Order
                  </h3>
                  <div className="w-full overflow-x-auto pb-2">
                    <div className="relative flex justify-between items-start min-w-[320px] max-w-md mx-auto">
                      {/* Connector Line */}
                      <div className="absolute top-4 left-[16.67%] right-[16.67%] h-[2px] bg-[#E2E8F0]" />
                      {[1, 2, 3].map((step) => {
                        const isOverdue = step === 1;
                        return (
                          <div
                            key={step}
                            className="relative z-10 flex flex-col items-center w-1/3"
                          >
                            {/* Circle */}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[#E2E8F0] text-[#64748B]">
                              {step}
                            </div>

                            {/* Status Badge */}
                            <span
                              className={`mt-2 text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                                isOverdue
                                  ? "bg-[#FEF3C7] text-[#D97706]"
                                  : "bg-[#EEF2FF] text-[#635BFF]"
                              }`}
                            >
                              {isOverdue ? "Overdue" : "To Do"}
                            </span>

                            {/* Details */}
                            <div className="mt-2 text-center">
                              <p className="text-[10px] text-[#94A3B8]">
                                {step === 3 ? "12:06-12:35" : "12:00-12:05"}
                              </p>
                              <p className="text-xs text-[#1E293B] font-bold mt-0.5">
                                Shampoo
                              </p>
                              <p className="text-[10px] text-[#94A3B8]">
                                Angelica
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-center mt-3">
                    <button className="px-4 py-2 bg-[#EEF2FF] text-[#635BFF] border border-[#635BFF]/30 hover:bg-[#E0E7FF] rounded-lg text-xs font-bold transition-colors cursor-pointer">
                      Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingAppointmentId && (
        <EditAppointmentModal
          memberId="1" // Default/mock for Agenda
          startTime="12:00"
          endTime="12:15"
          date={new Date(selected)}
          teamMembers={[{ id: "1", name: "Default Team Member", avatar: "" }]}
          editingAppts={[]} // Needs to be adapted based on what EditAppointmentModal expects or we pass a mock empty array to allow them to re-enter details
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
