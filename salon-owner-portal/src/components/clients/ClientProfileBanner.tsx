"use client";

import React, { useState } from "react";
import {
  Calendar,
  CreditCard,
  Clock,
  ChevronDown,
  Edit2,
  CalendarPlus,
  Send,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ClientProfileBannerProps {
  clientId: string;
  clientName?: string;
  onEditClient: () => void;
  onBookAppointment: () => void;
  onSendMessage: () => void;
  onExportData: () => void;
}

export const ClientProfileBanner: React.FC<ClientProfileBannerProps> = ({
  clientName = "Maria Rodriguez",
  onEditClient,
  onBookAppointment,
  onSendMessage,
  onExportData,
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Banner Cover */}
      <div
        className="h-36 md:h-44 w-full bg-cover bg-center relative bg-[#E0E7FF]"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2000&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#FCE7F3] shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=MariaRodriguez"
              alt={clientName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-[22px] font-bold text-[#1E293B]">
                {clientName}
              </h1>
              <Badge variant="success" size="sm" dot>
                Active Client
              </Badge>
            </div>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              maria.rodriguez@email.com • +39 345 678 9123 • Bologna, Italy
            </p>
          </div>
        </div>

        {/* Stats and Action Dropdown */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#94A3B8] uppercase">
                <Calendar className="w-3.5 h-3.5" />
                Visits
              </div>
              <div className="text-[18px] font-bold text-[#1E293B]">12</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#94A3B8] uppercase">
                <CreditCard className="w-3.5 h-3.5" />
                Total Spent
              </div>
              <div className="text-[18px] font-bold text-[#10B981]">
                € 1,420
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#94A3B8] uppercase">
                <Clock className="w-3.5 h-3.5" />
                Last Visit
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">
                14/02/2025
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors shadow-sm shadow-[#635BFF]/20"
            >
              <span>Actions</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-[#E2E8F0] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsActionsOpen(false);
                    onEditClient();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#635BFF] rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => {
                    setIsActionsOpen(false);
                    onBookAppointment();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#635BFF] rounded-lg transition-colors"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => {
                    setIsActionsOpen(false);
                    onSendMessage();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#635BFF] rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <button
                  onClick={() => {
                    setIsActionsOpen(false);
                    onExportData();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#635BFF] rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
