"use client";

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { SearchClientModalProps } from "./types";
import { clients as clientsData } from "./data";

export default function SearchClientModal({ isOpen, onClose, onSelectClient }: SearchClientModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredClients = clientsData.filter((client) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      client.name.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200 mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-[#1E293B]">Search a Client</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <CustomSearch
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            placeholder="Search"
          />
        </div>

        <h3 className="text-[12px] font-bold text-[#1E293B] mb-4">
          {searchTerm ? "Search Results" : "Recent research"}
        </h3>

        {/* Clients List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6 custom-scrollbar max-h-[300px]">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  onSelectClient(client);
                  onClose();
                }}
                className="border border-[#E2E8F0] hover:border-[#635BFF] rounded-[16px] p-3 flex items-center justify-between cursor-pointer transition-colors bg-white group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] overflow-hidden bg-[#E2E8F0]">
                    <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1E293B]">{client.name}</div>
                    <div className="text-[11px] text-[#94A3B8] font-medium">{client.phone}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#635BFF] group-hover:translate-x-1 transition-transform mr-2" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-[#94A3B8]">
              No clients found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm shadow-[#635BFF]/20">
            Add Client
          </button>
        </div>

      </div>
    </div>
  );
}
