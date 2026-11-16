"use client";

import React from "react";
import { User, Plus } from "lucide-react";
import { CheckoutClient } from "../types";

interface CheckoutClientCardProps {
  client: CheckoutClient | null;
  onOpenSearch: () => void;
  onClear: () => void;
}

export default function CheckoutClientCard({
  client,
  onOpenSearch,
  onClear,
}: CheckoutClientCardProps) {
  if (!client) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[#E0E6EB] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F4F6FA] flex items-center justify-center text-[#64748B]">
            <User size={20} />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#1E293B]">
              No Client Selected
            </div>
            <div className="text-[12px] text-[#64748B]">
              Assign a client to this checkout
            </div>
          </div>
        </div>
        <button
          onClick={onOpenSearch}
          className="px-4 py-2 rounded-xl bg-[#635BFF] text-white text-[13px] font-semibold flex items-center gap-1.5 hover:bg-[#5248e5] transition-colors"
        >
          <Plus size={16} /> Select Client
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E0E6EB] shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <img
          src={client.avatar}
          alt={client.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#EEF2FF]"
        />
        <div>
          <div className="text-[15px] font-bold text-[#1E293B]">
            {client.name}
          </div>
          <div className="text-[12px] text-[#64748B]">
            {client.phone || client.email || "Registered Client"}
          </div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="text-[12px] font-semibold text-[#64748B] hover:text-[#DC2626] transition-colors"
      >
        Change Client
      </button>
    </div>
  );
}
