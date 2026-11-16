"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { receiptAppointmentsData } from "./data";
import { NewReceiptModalProps } from "./types";

export default function NewReceiptModal({ isOpen, onClose }: NewReceiptModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const handleCreateIndependent = () => {
    onClose();
    router.push("/checkout");
  };

  const handleSelectAppointment = (apt: (typeof receiptAppointmentsData)[0]) => {
    onClose();
    const params = new URLSearchParams({
      appointmentId: String(apt.id),
      clientName: apt.name,
      clientAvatar: apt.avatar,
      serviceName: apt.service,
      servicePrice: apt.estimatedPrice.replace(/[^0-9.]/g, ""),
      teamMember: apt.teamMember,
      time: apt.time,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const filteredAppointments = receiptAppointmentsData.filter((apt) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      apt.name.toLowerCase().includes(query) ||
      apt.service.toLowerCase().includes(query) ||
      apt.teamMember.toLowerCase().includes(query) ||
      apt.time.toLowerCase().includes(query)
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Receipt" maxWidth="max-w-[560px]">
      <p className="text-[13px] text-[#94A3B8] font-medium mb-6 mt-[-10px]">Select an appointment or create an independent receipt</p>

      {/* Independent Receipt Button */}
        <div
          onClick={handleCreateIndependent}
          className="bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-[16px] p-4 flex items-center justify-between cursor-pointer transition-colors mb-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center text-[#635BFF]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#1E293B]">Create independent Receipt</div>
              <div className="text-[12px] text-[#94A3B8] font-medium">Not linked to any appointment</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635BFF] group-hover:translate-x-1 transition-transform" />
        </div>

        <h3 className="text-[13px] font-bold text-[#1E293B] mb-4">Or select specific appointment</h3>

        {/* Search Bar */}
        <CustomSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search an appointment"
          className="mb-4"
        />

        {/* Appointments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[300px]">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => handleSelectAppointment(apt)}
                className="border border-[#E2E8F0] hover:border-[#635BFF] rounded-[16px] p-4 flex items-center justify-between cursor-pointer transition-colors bg-white group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#E2E8F0]">
                    <img src={apt.avatar} alt={apt.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1E293B] mb-0.5">{apt.name} • {apt.time}</div>
                    <div className="text-[11px] text-[#94A3B8] font-medium leading-tight">Service: {apt.service}</div>
                    <div className="text-[11px] text-[#94A3B8] font-medium leading-tight">Team Member: {apt.teamMember}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-[#94A3B8] font-medium uppercase">Estimated</div>
                    <div className="text-[14px] font-bold text-[#635BFF]">{apt.estimatedPrice}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#635BFF] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-[#94A3B8]">
              No appointments found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
    </Modal>
  );
}
