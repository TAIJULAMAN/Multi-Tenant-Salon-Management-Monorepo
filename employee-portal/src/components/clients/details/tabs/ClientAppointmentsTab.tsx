"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDateRangePickerWithPresets from "@/components/customComponent/CustomDateRangePickerWithPresets";
import Modal from "@/components/customComponent/Modal";
import { Client } from "@/components/clients/types";

interface AppointmentItem {
  id: number;
  dateLine1: string;
  dateLine2: string;
  title: string;
  details: string;
  price: string;
  priceStatus: string;
  status: string;
  statusColor: string;
}

interface ClientAppointmentsTabProps {
  client: Client;
}

export default function ClientAppointmentsTab({ client }: ClientAppointmentsTabProps) {
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(0);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  // Amount Spent Range State
  const maxPossibleSpent = 500;
  const [minSpent, setMinSpent] = useState(0);
  const [maxSpent, setMaxSpent] = useState(250);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxSpent - 10);
    setMinSpent(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minSpent + 10);
    setMaxSpent(value);
  };

  const mockAppointments: AppointmentItem[] = [
    {
      id: 1,
      dateLine1: "Oct",
      dateLine2: "15",
      title: "Haircut & Beard Trim",
      details: "Angelica • 45 min",
      price: "€ 45",
      priceStatus: "Paid with Card",
      status: "Completed",
      statusColor: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30",
    },
    {
      id: 2,
      dateLine1: "Nov",
      dateLine2: "02",
      title: "Hair Coloring & Styling",
      details: "Marco • 1h 30 min",
      price: "€ 120",
      priceStatus: "Pending",
      status: "Confirmed",
      statusColor: "bg-[#EEF2FF] text-[#635BFF] border-[#635BFF]/30",
    },
    {
      id: 3,
      dateLine1: "Nov",
      dateLine2: "20",
      title: "Luxury Scalp Treatment",
      details: "Sarah • 1h",
      price: "€ 85",
      priceStatus: "Cash",
      status: "Completed",
      statusColor: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30",
    },
    {
      id: 4,
      dateLine1: "Dec",
      dateLine2: "05",
      title: "Special Event Blowout",
      details: "Angelica • 40 min",
      price: "€ 55",
      priceStatus: "Cancelled",
      status: "Canceled",
      statusColor: "bg-[#FFE4E6] text-[#F43F5E] border-[#F43F5E]/30",
    },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Completed", value: "Completed" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Canceled", value: "Canceled" },
    { label: "No-show", value: "No-show" },
  ];

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (selectedStatusFilter !== "All" && apt.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-[1.35rem] font-bold text-[#1E293B] font-manrope">Appointments</h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Amount Spent Functional Slider */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-[14px] font-medium text-[#64748B] whitespace-nowrap mb-1 sm:mb-2.5">Amount Spent</span>
            <div className="flex flex-col w-full sm:w-[170px]">
              {/* Slider Track */}
              <div className="px-2 mb-3 relative">
                <div className="relative h-[7px] bg-[#E0E7FF] rounded-full w-full">
                  <div
                    className="absolute h-full bg-[#635BFF] rounded-full"
                    style={{ left: `${(minSpent / maxPossibleSpent) * 100}%`, right: `${100 - (maxSpent / maxPossibleSpent) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPossibleSpent}
                  value={minSpent}
                  onChange={handleMinChange}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[7px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#635BFF] z-10"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPossibleSpent}
                  value={maxSpent}
                  onChange={handleMaxChange}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[7px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#635BFF] z-20"
                />
              </div>
              {/* Inputs */}
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  value={minSpent}
                  onChange={handleMinChange}
                  className="bg-white border border-[#E2E8F0] rounded-[8px] px-2 py-1.5 text-[14px] font-medium text-[#94A3B8] w-20 text-center outline-none focus:border-[#635BFF] transition-colors"
                />
                <span className="text-[#1E293B] font-medium">-</span>
                <input
                  type="number"
                  value={maxSpent}
                  onChange={handleMaxChange}
                  className="bg-white border border-[#E2E8F0] rounded-[8px] px-2 py-1.5 text-[14px] font-medium text-[#94A3B8] w-20 text-center outline-none focus:border-[#635BFF] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Date Filter with presets & calendar */}
          <div className="relative w-full sm:w-auto">
            <CustomDateRangePickerWithPresets
              value={selectedDateFilter}
              onChange={setSelectedDateFilter}
              presets={["Last 7 days", "Last 14 days", "Last Month", "Last 3 Months", "Last Year"]}
              align="right"
            />
          </div>

          {/* Status Dropdown using CustomSelect */}
          <div className="w-full sm:w-[150px]">
            <CustomSelect
              options={statusOptions}
              value={selectedStatusFilter}
              onChange={setSelectedStatusFilter}
              placeholder="Filter Status"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((apt, index) => {
          const isExpanded = expandedAppointment === index;
          return (
            <div key={apt.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all duration-300">
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setExpandedAppointment(isExpanded ? null : index)}
                    className="p-1 text-[#94A3B8] hover:text-[#635BFF] transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <div className="bg-[#635BFF] text-white rounded-xl p-2 text-center w-14 h-14 flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[10px] font-bold uppercase leading-tight">{apt.dateLine1}</span>
                    <span className="text-[13px] font-bold leading-tight">{apt.dateLine2}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[14px] font-bold text-[#1E293B]">{apt.title}</h4>
                      <span className={`${apt.statusColor} text-[10px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center`}>{apt.status}</span>
                    </div>
                    <div className="text-[11px] font-medium text-[#64748B] flex items-center gap-1">
                      {apt.details} •
                      <button onClick={() => setIsServicesModalOpen(true)} className="text-[#635BFF] hover:underline font-bold cursor-pointer">List of Services</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#F1F5F9] pt-4 sm:pt-0 mt-4 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[15px] font-bold text-[#1E293B]">{apt.price}</div>
                    <div className="text-[11px] text-[#94A3B8] font-medium">{apt.priceStatus}</div>
                  </div>
                  {["Completed", "Canceled", "No-show"].includes(apt.status) ? (
                    <button
                      disabled
                      className="bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed px-4 py-2 rounded-lg text-[12px] font-bold transition-colors select-none"
                      title={`Appointment is ${apt.status}`}
                    >
                      Checkout
                    </button>
                  ) : (
                    <Link
                      href={`/checkout?clientName=${encodeURIComponent(client.name)}&serviceName=${encodeURIComponent(apt.title)}&servicePrice=170`}
                      className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg text-[12px] font-bold transition-colors shadow-sm inline-block"
                    >
                      Checkout
                    </Link>
                  )}
                </div>
              </div>

              {/* Expanded Booking Order UI */}
              {isExpanded && (
                <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] p-6 pb-10 animate-in slide-in-from-top-2 duration-300 rounded-b-2xl">
                  <h5 className="text-[13px] font-semibold text-[#334155] text-center mb-8">Booking Order</h5>

                  <div className="flex items-start justify-center max-w-sm mx-auto relative">
                    {/* Connecting Line */}
                    <div className="absolute top-[14px] left-[16.66%] right-[16.66%] h-[1.5px] bg-[#E2E8F0] z-0"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-lg bg-[#FFFBEB] text-[#FBBF24] flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        1
                      </div>
                      <div className="bg-[#FFFBEB] text-[#FBBF24] text-[11px] font-bold px-3 py-1 rounded-lg mb-3">Overdue</div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">12:00-12:05</div>
                      <div className="text-[12px] font-bold text-[#334155]">Shampoo</div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">Angelica</div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-lg bg-[#94A3B8] text-white flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        2
                      </div>
                      <div className="bg-[#F1F5F9] text-[#475569] text-[11px] font-bold px-3.5 py-1 rounded-lg mb-3">To Do</div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">12:00-12:05</div>
                      <div className="text-[12px] font-bold text-[#334155]">Shampoo</div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">Angelica</div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-lg bg-[#94A3B8] text-white flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        3
                      </div>
                      <div className="bg-[#F1F5F9] text-[#475569] text-[11px] font-bold px-3.5 py-1 rounded-lg mb-3">To Do</div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">12:00-12:05</div>
                      <div className="text-[12px] font-bold text-[#334155]">Shampoo</div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">Angelica</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* List of Services Modal */}
      <Modal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        title="List of Services"
        maxWidth="max-w-[500px]"
      >
        <div className="space-y-4">
          {[
            { title: "Shampoo", staff: "Angelica", time: "12:00-12:05", price: "€ 170" },
            { title: "Haircut", staff: "Angelica", time: "12:05-12:50", price: "€ 170" },
            { title: "Blow Dry", staff: "Angelica", time: "12:50-13:05", price: "€ 170" }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
              <div>
                <div className="text-[14px] font-bold text-[#1E293B] mb-0.5">{service.title}</div>
                <div className="text-[12px] font-medium text-[#94A3B8]">{service.time} • {service.staff}</div>
              </div>
              <div className="text-[14px] font-bold text-[#1E293B]">{service.price}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
